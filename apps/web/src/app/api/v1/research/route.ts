import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/app/api/_lib/with-auth";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
  answer?: string;
  query: string;
}

async function searchWithTavily(query: string, maxResults = 8): Promise<TavilyResponse> {
  if (!TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY not configured");
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      max_results: maxResults,
      include_answer: true,
      include_raw_content: false,
      search_depth: "advanced",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Tavily API error: ${err}`);
  }

  return res.json();
}

async function synthesizeReport(query: string, sources: TavilyResult[], tavilyAnswer?: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    // Fallback: return Tavily's own answer + formatted sources
    return tavilyAnswer || "No synthesis available without OpenRouter API key.";
  }

  const sourcesSummary = sources
    .slice(0, 6)
    .map((s, i) => `[${i + 1}] ${s.title}\n${s.content.slice(0, 300)}`)
    .join("\n\n");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: "You are a research analyst. Given a research query and web sources, write a clear, structured research report. Use markdown headings, bullet points, and cite sources as [1], [2], etc. Be concise but thorough. Focus on actionable insights relevant to freelancers and tech professionals in India.",
        },
        {
          role: "user",
          content: `Research query: "${query}"\n\nTavily AI answer: ${tavilyAnswer || "N/A"}\n\nSources:\n${sourcesSummary}\n\nWrite a structured research report with Key Findings, Analysis, and Recommendations sections.`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    return tavilyAnswer || "Failed to generate synthesis.";
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || tavilyAnswer || "No synthesis generated.";
}

async function handler(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return NextResponse.json({ error: "Query must be at least 3 characters" }, { status: 400 });
    }

    // Step 1: Search with Tavily
    const tavilyData = await searchWithTavily(query.trim());

    // Step 2: Synthesize a report using LLM
    const report = await synthesizeReport(query, tavilyData.results, tavilyData.answer);

    // Step 3: Return structured response
    return NextResponse.json({
      query: tavilyData.query,
      report,
      sources: tavilyData.results.map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.content.slice(0, 200),
        score: r.score,
        publishedDate: r.published_date || null,
      })),
      quickAnswer: tavilyData.answer || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, 10, 60_000);

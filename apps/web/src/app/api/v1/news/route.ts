import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/app/api/_lib/with-auth";

const NEWS_SOURCES = [
  { name: "Hacker News", url: "https://hacker-news.firebaseio.com/v0" },
];

interface HNStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  type: string;
}

async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "top";
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

  try {
    // Fetch story IDs based on category
    const endpoint = category === "new" ? "newstories" : category === "best" ? "beststories" : "topstories";
    const idsRes = await fetch(`${NEWS_SOURCES[0].url}/${endpoint}.json`, { next: { revalidate: 300 } });
    if (!idsRes.ok) throw new Error("Failed to fetch story IDs");

    const ids: number[] = await idsRes.json();
    const topIds = ids.slice(0, limit);

    // Fetch stories in parallel
    const stories = await Promise.all(
      topIds.map(async (id) => {
        const res = await fetch(`${NEWS_SOURCES[0].url}/item/${id}.json`, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        return res.json() as Promise<HNStory>;
      })
    );

    const articles = stories
      .filter((s): s is HNStory => s !== null && s.type === "story")
      .map((s) => ({
        id: String(s.id),
        title: s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        source: s.url ? new URL(s.url).hostname.replace("www.", "") : "news.ycombinator.com",
        author: s.by,
        score: s.score,
        comments: s.descendants || 0,
        publishedAt: new Date(s.time * 1000).toISOString(),
        hnUrl: `https://news.ycombinator.com/item?id=${s.id}`,
      }));

    return NextResponse.json({ articles, total: articles.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news", articles: [] },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler, 30, 60_000);

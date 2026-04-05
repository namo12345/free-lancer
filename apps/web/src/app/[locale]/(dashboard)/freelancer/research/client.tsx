"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Source {
  title: string;
  url: string;
  snippet: string;
  score: number;
  publishedDate: string | null;
}

interface ResearchResult {
  query: string;
  report: string;
  sources: Source[];
  quickAnswer: string | null;
}

const SUGGESTED_QUERIES = [
  "Latest AI trends for freelancers in 2026",
  "Best tech skills to learn for Indian job market",
  "How to price freelance web development in India",
  "Remote work tools and productivity tips",
  "AI tools that boost freelancer productivity",
  "React vs Next.js for freelance projects",
];

export function ResearchClient() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleResearch(searchQuery?: string) {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/v1/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Research failed");
      }

      const data = await res.json();
      setResult(data);
      if (!searchQuery) setQuery(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Research failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Deep Research</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered research agent that searches the web and synthesizes insights for you
        </p>
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); handleResearch(); }} className="flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to research? e.g., 'Latest AI trends for freelancers'"
          className="flex-1 text-base h-12"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !query.trim()} size="lg" className="h-12 px-6">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              Researching...
            </span>
          ) : "Research"}
        </Button>
      </form>

      {/* Suggested queries */}
      {!result && !loading && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">Suggested topics:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => { setQuery(sq); handleResearch(sq); }}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <span className="text-sm text-muted-foreground">Searching the web with Tavily AI...</span>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Quick Answer */}
          {result.quickAnswer && (
            <Card className="border-brand-200 bg-brand-50/50">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-700 mb-1">Quick Answer</p>
                    <p className="text-sm text-gray-800">{result.quickAnswer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Report */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Research Report</CardTitle>
                <Badge variant="secondary" className="text-xs">AI Generated</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {result.report}
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          {result.sources.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sources ({result.sources.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.sources.map((source, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-brand-600 hover:underline line-clamp-1"
                        >
                          {source.title}
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{source.snippet}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{new URL(source.url).hostname}</span>
                          {source.score > 0.8 && <Badge variant="success" className="text-xs">High relevance</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

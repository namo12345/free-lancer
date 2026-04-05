"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface SearchResult {
  id: string;
  displayName: string;
  headline?: string;
  city?: string;
  hourlyRate?: number;
  avgRating: number;
  completedGigs: number;
  skills: string[];
  matchScore: number;
  matchReason: string;
}

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch("/api/v1/ai/search/freelancers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), limit: 10 }),
      });

      if (!res.ok) {
        throw new Error("Search failed");
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setError("Search is currently unavailable. Please try again later.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try: "minimalist logo designer like Apple but with a Desi touch"'
          className="flex-1 text-base"
        />
        <Button type="submit" disabled={searching} size="lg">
          {searching ? "Searching..." : "AI Search"}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {results.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Found {results.length} matches for &ldquo;{query}&rdquo;
        </p>
      )}

      {searched && results.length === 0 && !searching && !error && (
        <p className="text-sm text-muted-foreground text-center py-8">No freelancers found matching your query. Try different keywords.</p>
      )}

      <div className="space-y-4">
        {results.map((r) => (
          <Link key={r.id} href={`/profiles/${r.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar fallback={r.displayName} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{r.displayName}</h3>
                        {r.headline && <p className="text-sm text-gray-500">{r.headline}</p>}
                        {r.city && <p className="text-xs text-gray-400 mt-0.5">{r.city}</p>}
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${r.matchScore >= 90 ? "text-green-600" : r.matchScore >= 80 ? "text-yellow-600" : "text-gray-600"}`}>
                          {r.matchScore}% match
                        </div>
                        {r.hourlyRate && <div className="text-sm text-gray-500">{formatCurrency(r.hourlyRate)}/hr</div>}
                      </div>
                    </div>

                    {r.matchReason && (
                      <div className="mt-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
                        <div className="text-xs font-medium text-brand-700 mb-1">Why this match</div>
                        <p className="text-sm text-brand-900">{r.matchReason}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        {r.avgRating > 0 && <span>{r.avgRating} rating</span>}
                        <span>{r.completedGigs} gigs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

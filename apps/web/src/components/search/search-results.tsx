"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

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

const mockResults: SearchResult[] = [
  {
    id: "1",
    displayName: "Priya Sharma",
    headline: "UI/UX Designer | Minimalist Aesthetic",
    city: "Bangalore",
    hourlyRate: 1200,
    avgRating: 4.9,
    completedGigs: 32,
    skills: ["Figma", "UI Design", "Brand Identity", "Adobe Illustrator"],
    matchScore: 95,
    matchReason: "Strong portfolio in minimalist logo design. Experience with D2C brands. Based in Bangalore with excellent reviews.",
  },
  {
    id: "2",
    displayName: "Amit Patel",
    headline: "Graphic Designer | Desi Touch Specialist",
    city: "Mumbai",
    hourlyRate: 900,
    avgRating: 4.7,
    completedGigs: 18,
    skills: ["Logo Design", "Adobe Illustrator", "Photoshop", "Brand Identity"],
    matchScore: 88,
    matchReason: "Specializes in blending modern minimalism with Indian design elements. Previous work includes D2C food brands.",
  },
  {
    id: "3",
    displayName: "Neha R",
    headline: "Brand Designer | Corporate + Startup",
    city: "Delhi",
    hourlyRate: 1500,
    avgRating: 4.6,
    completedGigs: 45,
    skills: ["Brand Identity", "Logo Design", "Figma", "Typography"],
    matchScore: 82,
    matchReason: "Extensive brand design experience. Higher price but consistently delivers premium quality.",
  },
];

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    // In production: call AI search endpoint
    setTimeout(() => {
      setResults(mockResults);
      setSearching(false);
    }, 800);
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

      {results.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Found {results.length} matches for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="space-y-4">
        {results.map((r) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar fallback={r.displayName} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{r.displayName}</h3>
                      <p className="text-sm text-gray-500">{r.headline}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.city}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${r.matchScore >= 90 ? "text-green-600" : r.matchScore >= 80 ? "text-yellow-600" : "text-gray-600"}`}>
                        {r.matchScore}% match
                      </div>
                      {r.hourlyRate && <div className="text-sm text-gray-500">{formatCurrency(r.hourlyRate)}/hr</div>}
                    </div>
                  </div>

                  {/* Why this match */}
                  <div className="mt-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
                    <div className="text-xs font-medium text-brand-700 mb-1">Why this match</div>
                    <p className="text-sm text-brand-900">{r.matchReason}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>⭐ {r.avgRating}</span>
                      <span>{r.completedGigs} gigs</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

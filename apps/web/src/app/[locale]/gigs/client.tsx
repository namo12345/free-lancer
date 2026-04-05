"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, truncate } from "@/lib/utils";
import { GigCategory } from "@hiresense/shared";

interface SerializedGig {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  budgetType: string;
  isRemote: boolean;
  city: string | null;
  skills: string[];
  bidCount: number;
  createdAt: string;
  poster: { displayName: string };
}

interface BrowseGigsClientProps {
  initialGigs: SerializedGig[];
}

export function BrowseGigsClient({ initialGigs }: BrowseGigsClientProps) {
  const t = useTranslations("gigs");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredGigs = initialGigs.filter((gig) => {
    const matchesSearch =
      !search ||
      gig.title.toLowerCase().includes(search.toLowerCase()) ||
      gig.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || gig.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted/50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t("browseGigs")}</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search gigs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="max-w-[200px]"
          >
            <option value="">All Categories</option>
            {Object.values(GigCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        {/* Gig Listings */}
        {filteredGigs.length > 0 ? (
          <div className="space-y-4">
            {filteredGigs.map((gig) => (
              <Link key={gig.id} href={`/gigs/${gig.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-foreground hover:text-brand-600">
                          {gig.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Posted by {gig.poster.displayName} ·{" "}
                          {formatDate(gig.createdAt)}
                          {gig.isRemote && " · Remote"}
                          {gig.city && ` · ${gig.city}`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {truncate(gig.description, 200)}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {gig.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-6 shrink-0">
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(gig.budgetMin)} -{" "}
                          {formatCurrency(gig.budgetMax)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {gig.budgetType === "hourly" ? "/hr" : "fixed"}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          {gig.bidCount} bids
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {search || category
              ? "No gigs found matching your criteria."
              : "No gigs available yet."}
          </div>
        )}
      </main>
    </div>
  );
}

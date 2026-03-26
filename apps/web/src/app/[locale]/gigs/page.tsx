"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, truncate } from "@/lib/utils";
import { GigCategory } from "@baseedwork/shared";

// Mock data - in production fetched from DB
const mockGigs = [
  {
    id: "1",
    title: "Build a React Dashboard for SaaS Analytics Platform",
    description: "Looking for an experienced React developer to build a modern analytics dashboard with charts, real-time data, and user management. Must be proficient in TypeScript, Tailwind CSS, and have experience with chart libraries.",
    category: "Web Development",
    budgetMin: 15000,
    budgetMax: 30000,
    budgetType: "fixed",
    isRemote: true,
    city: null,
    skills: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    bidCount: 8,
    createdAt: "2026-03-14T10:00:00Z",
    poster: { displayName: "TechCorp India" },
  },
  {
    id: "2",
    title: "Logo Design for D2C Food Brand",
    description: "Need a creative logo for a new direct-to-consumer food brand. The brand targets young health-conscious Indians. Minimalist, modern feel with Desi touch. Multiple concepts expected.",
    category: "Graphic Design",
    budgetMin: 5000,
    budgetMax: 12000,
    budgetType: "fixed",
    isRemote: true,
    city: null,
    skills: ["Logo Design", "Brand Identity", "Adobe Illustrator"],
    bidCount: 15,
    createdAt: "2026-03-13T14:00:00Z",
    poster: { displayName: "FreshBite Foods" },
  },
  {
    id: "3",
    title: "Python Backend Developer for AI Startup",
    description: "Join our startup to build FastAPI backend services for our AI product. Experience with LangChain, vector databases, and async Python required. Part-time, 20 hours/week.",
    category: "AI/ML",
    budgetMin: 800,
    budgetMax: 1500,
    budgetType: "hourly",
    isRemote: true,
    city: "Bangalore",
    skills: ["Python", "FastAPI", "LangChain", "PostgreSQL"],
    bidCount: 5,
    createdAt: "2026-03-12T09:00:00Z",
    poster: { displayName: "NeuralStack AI" },
  },
];

export default function BrowseGigsPage() {
  const t = useTranslations("gigs");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredGigs = mockGigs.filter((gig) => {
    const matchesSearch = !search || gig.title.toLowerCase().includes(search.toLowerCase()) || gig.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || gig.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-[200px]">
            <option value="">All Categories</option>
            {Object.values(GigCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        {/* Gig Listings */}
        <div className="space-y-4">
          {filteredGigs.map((gig) => (
            <Link key={gig.id} href={`/gigs/${gig.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 hover:text-brand-600">{gig.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted by {gig.poster.displayName} &middot; {formatDate(gig.createdAt)}
                        {gig.isRemote && " &middot; Remote"}
                        {gig.city && ` &middot; ${gig.city}`}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">{truncate(gig.description, 200)}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {gig.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-6 shrink-0">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(gig.budgetMin)} - {formatCurrency(gig.budgetMax)}
                      </div>
                      <div className="text-xs text-gray-500">{gig.budgetType === "hourly" ? "/hr" : "fixed"}</div>
                      <div className="text-sm text-gray-500 mt-2">{gig.bidCount} bids</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredGigs.length === 0 && (
          <div className="text-center py-12 text-gray-500">No gigs found matching your criteria.</div>
        )}
      </main>
    </div>
  );
}

"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";

const mockGigs = [
  { id: "1", title: "Build a React Dashboard", status: "OPEN", budgetMin: 15000, budgetMax: 30000, bidCount: 8, createdAt: "2026-03-14" },
  { id: "2", title: "Python Backend for Analytics", status: "IN_PROGRESS", budgetMin: 20000, budgetMax: 40000, bidCount: 5, createdAt: "2026-03-10" },
  { id: "3", title: "Landing Page Design", status: "COMPLETED", budgetMin: 5000, budgetMax: 10000, bidCount: 12, createdAt: "2026-02-28" },
];

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  OPEN: "warning",
  IN_PROGRESS: "default",
  COMPLETED: "success",
};

export default function EmployerGigsPage() {
  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Gigs</h1>
          <Link href="/employer/gigs/new"><Button>Post a Gig</Button></Link>
        </div>
        <div className="space-y-4">
          {mockGigs.map((gig) => (
            <Link key={gig.id} href={`/gigs/${gig.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{gig.title}</h3>
                    <p className="text-sm text-gray-500">Posted {formatDate(gig.createdAt)} &middot; {gig.bidCount} bids</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(gig.budgetMin)} - {formatCurrency(gig.budgetMax)}</div>
                    </div>
                    <Badge variant={statusColors[gig.status]}>{gig.status.replace("_", " ")}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

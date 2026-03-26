"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";

const mockBids = [
  { id: "1", gig: { id: "g1", title: "Build a React Dashboard" }, amount: 22000, deliveryDays: 14, status: "PENDING", matchScore: 92, createdAt: "2026-03-14" },
  { id: "2", gig: { id: "g2", title: "Logo Design for D2C Food Brand" }, amount: 8000, deliveryDays: 5, status: "ACCEPTED", matchScore: 87, createdAt: "2026-03-13" },
  { id: "3", gig: { id: "g3", title: "Mobile App UI Design" }, amount: 35000, deliveryDays: 21, status: "REJECTED", matchScore: 65, createdAt: "2026-03-10" },
];

const statusColors: Record<string, "default" | "success" | "destructive" | "warning"> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "destructive",
  WITHDRAWN: "secondary" as "default",
};

export default function FreelancerBidsPage() {
  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Bids</h1>
        <div className="space-y-4">
          {mockBids.map((bid) => (
            <Link key={bid.id} href={`/gigs/${bid.gig.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{bid.gig.title}</h3>
                    <p className="text-sm text-gray-500">Bid placed {formatDate(bid.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(bid.amount)}</div>
                      <div className="text-xs text-gray-500">{bid.deliveryDays} days</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Match: {bid.matchScore}%</div>
                      <Badge variant={statusColors[bid.status]}>{bid.status}</Badge>
                    </div>
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

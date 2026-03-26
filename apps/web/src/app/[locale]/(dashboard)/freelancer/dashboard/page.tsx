"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function FreelancerDashboardPage() {
  const stats = {
    totalEarnings: 350000,
    activeBids: 3,
    completedGigs: 24,
    avgRating: 4.8,
    pendingInvoices: 1,
  };

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalEarnings)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active Bids</p>
              <p className="text-2xl font-bold mt-1">{stats.activeBids}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Completed Gigs</p>
              <p className="text-2xl font-bold mt-1">{stats.completedGigs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold mt-1">{stats.avgRating} / 5</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Bid accepted for &quot;Build a React Dashboard&quot;</span>
                <span className="text-muted-foreground ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>New bid placed on &quot;Mobile App UI Design&quot;</span>
                <span className="text-muted-foreground ml-auto">1 day ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Invoice BW-2026-0001 sent</span>
                <span className="text-muted-foreground ml-auto">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

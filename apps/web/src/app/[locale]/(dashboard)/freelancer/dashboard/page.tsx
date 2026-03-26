"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/routing";

export default function FreelancerDashboardPage() {
  const stats = {
    totalEarnings: 350000,
    activeBids: 3,
    completedGigs: 24,
    avgRating: 4.8,
    pendingInvoices: 1,
    profileViews: 142,
  };

  const recentActivity = [
    { type: "accepted", text: 'Bid accepted for "Build a React Dashboard"', time: "2 hours ago", color: "bg-green-500" },
    { type: "bid", text: 'New bid placed on "Mobile App UI Design"', time: "1 day ago", color: "bg-blue-500" },
    { type: "invoice", text: "Invoice BW-2026-0001 sent", time: "2 days ago", color: "bg-yellow-500" },
    { type: "review", text: "Received a 5-star review from TechCorp India", time: "3 days ago", color: "bg-purple-500" },
    { type: "milestone", text: 'Milestone 2 approved for "API Integration"', time: "4 days ago", color: "bg-green-500" },
  ];

  const activeGigs = [
    { title: "Build a React Dashboard", client: "TechCorp India", budget: 22000, progress: 65, deadline: "15 Apr 2026" },
    { title: "API Integration Service", client: "StartupXYZ", budget: 15000, progress: 30, deadline: "22 Apr 2026" },
  ];

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
          </div>
          <Link href="/gigs" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
            Find Gigs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Bids</p>
                  <p className="text-2xl font-bold mt-1">{stats.activeBids}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Gigs</p>
                  <p className="text-2xl font-bold mt-1">{stats.completedGigs}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold mt-1">⭐ {stats.avgRating}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Gigs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Gigs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGigs.map((gig, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{gig.title}</p>
                    <p className="text-xs text-muted-foreground">{gig.client} · Due {gig.deadline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{formatCurrency(gig.budget)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${gig.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{gig.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm py-1.5">
                    <div className={`w-2 h-2 ${item.color} rounded-full shrink-0`} />
                    <span className="flex-1">{item.text}</span>
                    <span className="text-muted-foreground text-xs shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-lg">Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Profile Views</span>
                <Badge variant="secondary">{stats.profileViews} this month</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bid Success Rate</span>
                <Badge className="bg-green-100 text-green-700">67%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <Badge variant="secondary">2.4 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Invoice</span>
                <Badge className="bg-yellow-100 text-yellow-700">{stats.pendingInvoices}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

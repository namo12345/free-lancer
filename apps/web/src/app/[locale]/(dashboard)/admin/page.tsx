"use client";

import { StatsCard } from "@/components/analytics/stats-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { formatCurrency } from "@/lib/utils";

const gmvData = [
  { label: "Oct", value: 120000 },
  { label: "Nov", value: 185000 },
  { label: "Dec", value: 95000 },
  { label: "Jan", value: 245000 },
  { label: "Feb", value: 210000 },
  { label: "Mar", value: 310000 },
];

const userGrowthData = [
  { label: "Oct", value: 45 },
  { label: "Nov", value: 78 },
  { label: "Dec", value: 52 },
  { label: "Jan", value: 120 },
  { label: "Feb", value: 95 },
  { label: "Mar", value: 140 },
];

const recentActivity = [
  { type: "signup", text: "New freelancer: Rahul K (Bangalore)", time: "5 min ago" },
  { type: "gig", text: "New gig posted: 'Flutter Mobile App Development'", time: "12 min ago" },
  { type: "payment", text: "Invoice BW-2026-0089 marked as paid (₹22,000)", time: "1 hr ago" },
  { type: "dispute", text: "Dispute flagged on gig 'Logo Redesign'", time: "2 hrs ago" },
  { type: "signup", text: "New employer: StartupXYZ (Mumbai)", time: "3 hrs ago" },
];

const typeColors: Record<string, string> = {
  signup: "bg-green-500",
  gig: "bg-blue-500",
  payment: "bg-yellow-500",
  dispute: "bg-red-500",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ email: "admin@baseedwork.com", displayName: "Admin" }} />
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Users" value="2,847" change={18} />
          <StatsCard title="Freelancers" value="1,923" change={15} />
          <StatsCard title="Employers" value="924" change={22} />
          <StatsCard title="GMV (Gross)" value={formatCurrency(1165000)} change={25} />
          <StatsCard title="Active Disputes" value="3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>GMV (Monthly)</CardTitle></CardHeader>
            <CardContent>
              <BarChart data={gmvData} color="bg-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>New Users (Monthly)</CardTitle></CardHeader>
            <CardContent>
              <BarChart data={userGrowthData} color="bg-brand-500" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${typeColors[item.type]}`} />
                    <span className="flex-1">{item.text}</span>
                    <span className="text-muted-foreground text-xs">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Platform Health</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Time to First Bid</span>
                <Badge variant="success">4.2 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gig Completion Rate</span>
                <Badge variant="success">87%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dispute Rate</span>
                <Badge variant="warning">2.1%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Repeat Hire Rate</span>
                <Badge variant="success">34%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Platform Fee Revenue</span>
                <Badge>{formatCurrency(116500)}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/analytics/stats-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { SkillGapAnalysis } from "@/components/analytics/skill-gap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const earningsData = [
  { label: "Oct", value: 35000 },
  { label: "Nov", value: 42000 },
  { label: "Dec", value: 28000 },
  { label: "Jan", value: 55000 },
  { label: "Feb", value: 48000 },
  { label: "Mar", value: 62000 },
];

const bidSuccessData = [
  { label: "Oct", value: 40 },
  { label: "Nov", value: 55 },
  { label: "Dec", value: 35 },
  { label: "Jan", value: 60 },
  { label: "Feb", value: 50 },
  { label: "Mar", value: 65 },
];

export default function FreelancerAnalyticsPage() {
  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Earnings" value={formatCurrency(350000)} change={15} />
          <StatsCard title="Profile Views" value="247" change={8} />
          <StatsCard title="Bid Success Rate" value="62%" change={5} />
          <StatsCard title="Avg Response Time" value="2.5 hrs" change={-10} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Monthly Earnings</CardTitle></CardHeader>
            <CardContent>
              <BarChart data={earningsData} color="bg-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Bid Success Rate (%)</CardTitle></CardHeader>
            <CardContent>
              <BarChart data={bidSuccessData} maxValue={100} color="bg-brand-500" />
            </CardContent>
          </Card>
        </div>

        <SkillGapAnalysis />
      </main>
    </>
  );
}

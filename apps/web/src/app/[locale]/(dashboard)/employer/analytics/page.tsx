"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/analytics/stats-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const spendingData = [
  { label: "Oct", value: 25000 },
  { label: "Nov", value: 40000 },
  { label: "Dec", value: 18000 },
  { label: "Jan", value: 55000 },
  { label: "Feb", value: 35000 },
  { label: "Mar", value: 45000 },
];

const talentHeatmap = [
  { city: "Bangalore", developers: 1250, designers: 430, writers: 280, avgRate: 1200 },
  { city: "Mumbai", developers: 980, designers: 520, writers: 350, avgRate: 1100 },
  { city: "Delhi NCR", developers: 870, designers: 380, writers: 420, avgRate: 1000 },
  { city: "Hyderabad", developers: 720, designers: 210, writers: 150, avgRate: 900 },
  { city: "Pune", developers: 650, designers: 190, writers: 120, avgRate: 950 },
  { city: "Chennai", developers: 580, designers: 250, writers: 180, avgRate: 850 },
];

export default function EmployerAnalyticsPage() {
  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Spent" value={formatCurrency(218000)} change={12} />
          <StatsCard title="Active Gigs" value="3" />
          <StatsCard title="Avg Hire Time" value="4.2 days" change={-15} />
          <StatsCard title="Avg Satisfaction" value="4.7/5" change={3} />
        </div>

        <Card>
          <CardHeader><CardTitle>Monthly Spending</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={spendingData} color="bg-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Talent Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground">Available freelancers by city and skill</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">City</th>
                    <th className="text-center py-3 px-2 font-medium">Developers</th>
                    <th className="text-center py-3 px-2 font-medium">Designers</th>
                    <th className="text-center py-3 px-2 font-medium">Writers</th>
                    <th className="text-right py-3 px-2 font-medium">Avg Rate/hr</th>
                  </tr>
                </thead>
                <tbody>
                  {talentHeatmap.map((row) => (
                    <tr key={row.city} className="border-b last:border-0">
                      <td className="py-3 px-2 font-medium">{row.city}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={row.developers > 1000 ? "default" : "secondary"}>{row.developers}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={row.designers > 400 ? "default" : "secondary"}>{row.designers}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={row.writers > 300 ? "default" : "secondary"}>{row.writers}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right">{formatCurrency(row.avgRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

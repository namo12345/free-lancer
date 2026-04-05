import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/analytics/stats-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getEmployerDashboardData } from "@/server/actions/dashboard.actions";

export default async function EmployerAnalyticsPage() {
  const data = await getEmployerDashboardData();

  if (!data) {
    return (
      <>
        <Sidebar role="employer" />
        <main className="flex-1 p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Unable to load analytics</p>
            <p className="mt-1">Please sign in as an employer to view this page.</p>
          </div>
        </main>
      </>
    );
  }

  const { stats, monthlySpending, talentSnapshot } = data;

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Spent" value={formatCurrency(Number(stats.totalSpent))} />
          <StatsCard title="Open Gigs" value={stats.openGigs} />
          <StatsCard title="In Progress" value={stats.inProgressGigs} />
          <StatsCard title="Pending Bids" value={stats.pendingBids} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlySpending} color="bg-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Talent Snapshot</CardTitle>
            <p className="text-sm text-muted-foreground">
              Real freelancer availability by city and common skill mix
            </p>
          </CardHeader>
          <CardContent>
            {talentSnapshot.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No freelancer location data is available yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">City</th>
                      <th className="text-center py-3 px-2 font-medium">Freelancers</th>
                      <th className="text-right py-3 px-2 font-medium">Avg Rate/hr</th>
                      <th className="text-right py-3 px-2 font-medium">Top Skill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talentSnapshot.map((row) => (
                      <tr key={row.city} className="border-b last:border-0">
                        <td className="py-3 px-2 font-medium">{row.city}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant={row.freelancers > 10 ? "default" : "secondary"}>
                            {row.freelancers}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right">{formatCurrency(row.avgRate)}</td>
                        <td className="py-3 px-2 text-right">{row.topSkill}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

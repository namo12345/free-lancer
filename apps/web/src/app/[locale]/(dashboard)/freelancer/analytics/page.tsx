import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/analytics/stats-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { SkillGapAnalysis } from "@/components/analytics/skill-gap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getFreelancerDashboardData } from "@/server/actions/dashboard.actions";

export default async function FreelancerAnalyticsPage() {
  const data = await getFreelancerDashboardData();

  if (!data) {
    return (
      <>
        <Sidebar role="freelancer" />
        <main className="flex-1 p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Unable to load analytics</p>
            <p className="mt-1">Please sign in as a freelancer to view this page.</p>
          </div>
        </main>
      </>
    );
  }

  const { stats, monthlyEarnings, monthlyBidSuccess, skillGaps } = data;

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Earnings" value={formatCurrency(Number(stats.totalEarnings))} />
          <StatsCard title="Open Bids" value={stats.activeBids} />
          <StatsCard title="Completed Gigs" value={stats.completedGigs} />
          <StatsCard
            title="Avg Response Time"
            value={
              stats.responseTime > 0
                ? stats.responseTime < 60
                  ? `${stats.responseTime} min`
                  : `${Math.round(stats.responseTime / 60)} hrs`
                : "N/A"
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={monthlyEarnings} color="bg-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bid Success Rate (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={monthlyBidSuccess} maxValue={100} color="bg-brand-500" />
            </CardContent>
          </Card>
        </div>

        <SkillGapAnalysis gaps={skillGaps} />
      </main>
    </>
  );
}

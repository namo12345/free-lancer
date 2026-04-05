import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getEmployerDashboardData } from "@/server/actions/dashboard.actions";

export default async function EmployerDashboardPage() {
  const data = await getEmployerDashboardData();

  if (!data) {
    return (
      <>
        <Sidebar role="employer" />
        <main className="flex-1 p-6">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Unable to load dashboard</p>
            <p className="mt-1">Please sign in to view your dashboard.</p>
          </div>
        </main>
      </>
    );
  }

  const { stats, recentActivity, recentGigs } = data;

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/employer/gigs/new"><Button>Post a Gig</Button></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(Number(stats.totalSpent))}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Open Gigs</p>
              <p className="text-2xl font-bold mt-1">{stats.openGigs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-1">{stats.inProgressGigs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Pending Bids</p>
              <p className="text-2xl font-bold mt-1">{stats.pendingBids}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Recent Gigs</CardTitle></CardHeader>
            <CardContent>
              {recentGigs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No gigs posted yet.</p>
                  <p className="text-sm mt-1">Post a gig to start receiving bids from freelancers.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentGigs.map((gig) => (
                    <div key={gig.id} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium">{gig.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {gig.bidCount} bids · {formatDate(gig.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(gig.budgetMin)} - {formatCurrency(gig.budgetMax)}
                        </p>
                        <p className="text-xs text-muted-foreground">{gig.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent activity.</p>
                  <p className="text-sm mt-1">Post a gig to start receiving bids from freelancers.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item) => {
                    const colorMap: Record<string, string> = {
                      bid: "bg-green-500",
                      invoice: "bg-blue-500",
                      milestone: "bg-yellow-500",
                    };
                    return (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <div className={`w-2 h-2 ${colorMap[item.type] ?? "bg-gray-400"} rounded-full`} />
                        <span>{item.text}</span>
                        <span className="text-muted-foreground ml-auto">{formatDate(item.time)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

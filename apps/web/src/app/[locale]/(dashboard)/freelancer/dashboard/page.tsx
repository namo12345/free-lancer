import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getFreelancerDashboardData } from "@/server/actions/dashboard.actions";

export default async function FreelancerDashboardPage() {
  const data = await getFreelancerDashboardData();

  if (!data) {
    return (
      <>
        <Sidebar role="freelancer" />
        <main className="flex-1 p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Unable to load dashboard</p>
            <p className="mt-1">Please sign in to view your dashboard.</p>
          </div>
        </main>
      </>
    );
  }

  const { stats, activeGigs, recentBids } = data;

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-brand-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(Number(stats.totalEarnings))}</p>
                </div>
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-brand-400">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Bids</p>
                  <p className="text-2xl font-bold mt-1">{stats.activeBids}</p>
                </div>
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-brand-600">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Gigs</p>
                  <p className="text-2xl font-bold mt-1">{stats.completedGigs}</p>
                </div>
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-brand-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)}` : "N/A"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
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
            {activeGigs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No active gigs right now.</p>
                <Link href="/gigs" className="text-sm text-brand-600 hover:underline mt-1 inline-block">
                  Browse gigs to find work
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeGigs.map((gig) => {
                  const progress = gig.milestonesTotal > 0
                    ? Math.round((gig.milestonesCompleted / gig.milestonesTotal) * 100)
                    : 0;
                  return (
                    <Link key={gig.id} href={`/gigs/${gig.id}`}>
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{gig.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {gig.client}
                            {gig.deadline ? ` \u00B7 Due ${formatDate(gig.deadline)}` : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm">{formatCurrency(Number(gig.budget))}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-brand-600 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bids + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Recent Bids</CardTitle></CardHeader>
            <CardContent>
              {recentBids.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No bids placed yet.</p>
                  <Link href="/gigs" className="text-sm text-brand-600 hover:underline mt-1 inline-block">
                    Find gigs and start bidding
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBids.map((bid) => {
                    const colorMap: Record<string, string> = {
                      PENDING: "bg-brand-400",
                      ACCEPTED: "bg-brand-600",
                      REJECTED: "bg-destructive",
                      WITHDRAWN: "bg-muted-foreground",
                    };
                    return (
                      <div key={bid.id} className="flex items-center gap-3 text-sm py-1.5">
                                <div className={`w-2 h-2 ${colorMap[bid.status] ?? "bg-muted-foreground"} rounded-full shrink-0`} />
                        <span className="flex-1">
                          {bid.status === "ACCEPTED" ? "Bid accepted" : bid.status === "REJECTED" ? "Bid rejected" : "Bid placed"} for &quot;{bid.gigTitle}&quot; &middot; {formatCurrency(Number(bid.amount))}
                        </span>
                        <span className="text-muted-foreground text-xs shrink-0">{formatDate(bid.createdAt)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-lg">Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Invoices</span>
                <Badge variant={stats.pendingInvoices > 0 ? "warning" : "secondary"}>
                  {stats.pendingInvoices}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Bids</span>
                <Badge variant="secondary">{stats.activeBids}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed Gigs</span>
                <Badge variant="secondary">{stats.completedGigs}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating</span>
                <Badge variant="success">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

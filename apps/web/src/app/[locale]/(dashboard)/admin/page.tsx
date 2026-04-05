import { redirect } from "next/navigation";
import { StatsCard } from "@/components/analytics/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAdminDashboardData } from "@/server/actions/dashboard.actions";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getAdminDashboardData();

  if (!data) {
    redirect(`/${locale}`);
  }

  const stats = data.stats;
  const recentActivity = data.recentActivity;
  const recentUsers = data.recentUsers;

  return (
    <div className="flex-1">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Users" value={String(stats.totalUsers)} />
          <StatsCard title="Freelancers" value={String(stats.freelancerCount)} />
          <StatsCard title="Employers" value={String(stats.employerCount)} />
          <StatsCard title="GMV (Gross)" value={formatCurrency(Number(stats.gmv))} />
          <StatsCard title="Active Disputes" value={String(stats.activeDisputes)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="flex-1">{item.text}</span>
                      <span className="text-muted-foreground text-xs">{formatDate(item.time)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No users yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{user.email}</span>
                      </div>
                      <Badge variant={user.role === "FREELANCER" ? "default" : "secondary"}>{user.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

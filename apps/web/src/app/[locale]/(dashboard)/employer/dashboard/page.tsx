"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/routing";

export default function EmployerDashboardPage() {
  const stats = {
    totalSpent: 180000,
    activeGigs: 2,
    totalGigs: 8,
    pendingInvoices: 1,
  };

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
              <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalSpent)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active Gigs</p>
              <p className="text-2xl font-bold mt-1">{stats.activeGigs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Gigs</p>
              <p className="text-2xl font-bold mt-1">{stats.totalGigs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
              <p className="text-2xl font-bold mt-1">{stats.pendingInvoices}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>New bid received for &quot;Build a React Dashboard&quot;</span>
                <span className="text-muted-foreground ml-auto">1 hour ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Invoice BW-2026-0001 generated</span>
                <span className="text-muted-foreground ml-auto">3 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Milestone 1 submitted for &quot;Python Backend&quot;</span>
                <span className="text-muted-foreground ml-auto">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

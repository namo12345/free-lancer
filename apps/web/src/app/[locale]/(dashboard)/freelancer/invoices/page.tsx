"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

const mockInvoices = [
  {
    id: "inv1",
    invoiceNumber: "BW-2026-0001",
    gigTitle: "Build a React Dashboard",
    employerName: "TechCorp India",
    totalAmount: 24950,
    status: "SENT",
    dueDate: "2026-03-30",
  },
  {
    id: "inv2",
    invoiceNumber: "BW-2026-0002",
    gigTitle: "Logo Design for D2C Brand",
    employerName: "FreshBite Foods",
    totalAmount: 9080,
    status: "PAID",
    dueDate: "2026-03-20",
    paidAt: "2026-03-18",
  },
];

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  SENT: "warning",
  PAID: "success",
  CANCELLED: "secondary",
};

export default function FreelancerInvoicesPage() {
  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Invoices</h1>
        <div className="space-y-4">
          {mockInvoices.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{inv.invoiceNumber}</h3>
                    <Badge variant={statusColors[inv.status]}>{inv.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{inv.gigTitle}</p>
                  <p className="text-sm text-gray-500">From: {inv.employerName} &middot; Due: {formatDate(inv.dueDate)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">{formatCurrency(inv.totalAmount)}</div>
                  <Button variant="outline" size="sm">Download PDF</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

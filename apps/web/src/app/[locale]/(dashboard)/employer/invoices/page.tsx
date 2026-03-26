"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

const mockInvoices = [
  {
    id: "inv1",
    invoiceNumber: "BW-2026-0001",
    gigTitle: "Build a React Dashboard",
    freelancerName: "Rahul K",
    totalAmount: 24950,
    status: "SENT",
    dueDate: "2026-03-30",
    createdAt: "2026-03-15",
  },
  {
    id: "inv2",
    invoiceNumber: "BW-2026-0002",
    gigTitle: "Logo Design for D2C Brand",
    freelancerName: "Ananya S",
    totalAmount: 9080,
    status: "PAID",
    dueDate: "2026-03-20",
    createdAt: "2026-03-10",
    paidAt: "2026-03-18",
  },
];

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  SENT: "warning",
  PAID: "success",
  CANCELLED: "secondary",
};

export default function EmployerInvoicesPage() {
  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Invoices</h1>
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
                  <p className="text-sm text-gray-500">To: {inv.freelancerName} &middot; Due: {formatDate(inv.dueDate)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(inv.totalAmount)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download PDF</Button>
                    {inv.status === "SENT" && (
                      <Button size="sm" variant="default">Mark as Paid</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

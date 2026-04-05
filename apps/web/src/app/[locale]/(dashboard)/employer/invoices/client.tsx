"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { markInvoicePaid } from "@/server/actions/invoice.actions";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  gigTitle: string;
  freelancerName: string;
  totalAmount: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  SENT: "warning",
  PAID: "success",
  CANCELLED: "secondary",
};

function MarkPaidButton({
  invoiceId,
  onPaid,
}: {
  invoiceId: string;
  onPaid: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await markInvoicePaid(invoiceId);
      onPaid();
    } catch {
      alert("Failed to mark as paid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" disabled={loading} onClick={handleClick}>
      {loading ? "Processing..." : "Mark as Paid"}
    </Button>
  );
}

export function EmployerInvoicesClient({
  initialInvoices,
}: {
  initialInvoices: InvoiceData[];
}) {
  const [invoices, setInvoices] = useState(initialInvoices);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      {invoices.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No invoices yet</p>
          <p className="mt-1">Invoices are generated when you accept a bid.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                    <Badge variant={statusColors[invoice.status] ?? "default"}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{invoice.gigTitle}</p>
                  <p className="text-sm text-gray-500">
                    To: {invoice.freelancerName}
                    {invoice.dueDate ? ` · Due: ${formatDate(invoice.dueDate)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                    {invoice.status === "SENT" && (
                      <MarkPaidButton
                        invoiceId={invoice.id}
                        onPaid={() => {
                          setInvoices((prev) =>
                            prev.map((entry) =>
                              entry.id === invoice.id
                                ? {
                                    ...entry,
                                    status: "PAID",
                                    paidAt: new Date().toISOString(),
                                  }
                                : entry
                            )
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

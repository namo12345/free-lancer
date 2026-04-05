import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getMyInvoices } from "@/server/actions/dashboard.actions";

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  SENT: "warning",
  PAID: "success",
  CANCELLED: "secondary",
};

export default async function FreelancerInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: invoices, totalPages } = await getMyInvoices(page, 10);

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Invoices</h1>

        {invoices.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-medium">No invoices yet</p>
            <p className="mt-1">Invoices will appear here once a bid is accepted.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{inv.invoiceNumber}</h3>
                      <Badge variant={statusColors[inv.status] ?? "default"}>{inv.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{inv.gigTitle}</p>
                    <p className="text-sm text-gray-500">From: {inv.employerName}{inv.dueDate ? ` · Due: ${formatDate(inv.dueDate)}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold">{formatCurrency(inv.totalAmount)}</div>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Pagination currentPage={page} totalPages={totalPages} basePath="/freelancer/invoices" />
          </div>
        )}
      </main>
    </>
  );
}

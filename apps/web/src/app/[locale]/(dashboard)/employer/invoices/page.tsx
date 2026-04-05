import { Sidebar } from "@/components/layout/sidebar";
import { Pagination } from "@/components/ui/pagination";
import { getMyInvoices } from "@/server/actions/dashboard.actions";
import { EmployerInvoicesClient } from "./client";

export default async function EmployerInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: invoices, totalPages } = await getMyInvoices(page, 10);

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <EmployerInvoicesClient initialInvoices={invoices} />
        <Pagination currentPage={page} totalPages={totalPages} basePath="/employer/invoices" />
      </main>
    </>
  );
}

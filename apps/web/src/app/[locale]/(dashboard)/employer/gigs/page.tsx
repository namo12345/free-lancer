import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getMyGigs } from "@/server/actions/dashboard.actions";

const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
  DRAFT: "secondary",
  OPEN: "warning",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "secondary",
};

export default async function EmployerGigsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: gigs, totalPages } = await getMyGigs(page, 10);

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Gigs</h1>
          <Link href="/employer/gigs/new"><Button>Post a Gig</Button></Link>
        </div>

        {gigs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No gigs yet</p>
            <p className="mt-1">Post your first gig to get started.</p>
            <Link href="/employer/gigs/new">
              <Button className="mt-4">Post a Gig</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {gigs.map((gig) => (
              <Link key={gig.id} href={`/gigs/${gig.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{gig.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Posted {formatDate(gig.createdAt)} &middot; {gig.bidCount} bids
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(Number(gig.budgetMin))} - {formatCurrency(Number(gig.budgetMax))}
                        </div>
                      </div>
                      <Badge variant={statusColors[gig.status] ?? "default"}>
                        {gig.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Pagination currentPage={page} totalPages={totalPages} basePath="/employer/gigs" />
          </div>
        )}
      </main>
    </>
  );
}

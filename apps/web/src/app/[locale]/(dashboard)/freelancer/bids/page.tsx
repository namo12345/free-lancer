import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getMyBids } from "@/server/actions/dashboard.actions";

const statusColors: Record<string, "default" | "success" | "destructive" | "warning"> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "destructive",
  WITHDRAWN: "default",
};

export default async function FreelancerBidsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: bids, totalPages } = await getMyBids(page, 10);

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Bids</h1>

        {bids.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No bids yet</p>
            <p className="mt-1">Browse available gigs and place your first bid.</p>
            <Link href="/gigs" className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <Link key={bid.id} href={`/gigs/${bid.gig.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{bid.gig.title}</h3>
                      <p className="text-sm text-gray-500">Bid placed {formatDate(bid.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(Number(bid.amount))}</div>
                        <div className="text-xs text-gray-500">{bid.deliveryDays} days</div>
                      </div>
                      <div className="text-right">
                        {bid.matchScore > 0 && (
                          <div className="text-xs text-gray-500 mb-1">Match: {Math.round(bid.matchScore)}%</div>
                        )}
                        <Badge variant={statusColors[bid.status] ?? "default"}>{bid.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Pagination currentPage={page} totalPages={totalPages} basePath="/freelancer/bids" />
          </div>
        )}
      </main>
    </>
  );
}

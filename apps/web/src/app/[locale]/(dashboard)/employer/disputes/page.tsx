import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getEmployerDisputesData } from "@/server/actions/dashboard.actions";

const statusColors: Record<"OPEN" | "REVIEWED", "default" | "warning" | "secondary"> = {
  OPEN: "warning",
  REVIEWED: "secondary",
};

export default async function EmployerDisputesPage() {
  const data = await getEmployerDisputesData();
  const disputes = data?.disputes || [];

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Disputes</h1>
          <Button variant="outline" disabled>
            Raise a Dispute
          </Button>
        </div>

        {disputes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No disputes</p>
            <p className="text-sm">Flag a gig issue to start tracking disputes here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-semibold">{dispute.gigTitle}</h3>
                        <Badge variant={statusColors[dispute.status]}>{dispute.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Freelancer: {dispute.freelancerName} · Filed {formatDate(dispute.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {dispute.reason}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <div>Gig ID</div>
                      <div className="font-mono">{dispute.gigId || "n/a"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

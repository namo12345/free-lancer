"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const mockDisputes = [
  {
    id: "d1",
    gigTitle: "Build a React Dashboard",
    freelancerName: "Rahul K",
    reason: "Incomplete deliverables",
    description: "Final delivery was missing the dark mode feature that was part of the original scope.",
    status: "OPEN",
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "d2",
    gigTitle: "Logo Design for D2C Brand",
    freelancerName: "Priya M",
    reason: "Quality dispute",
    description: "Logo designs were low resolution and not suitable for print. Requested revisions were not addressed.",
    status: "IN_REVIEW",
    createdAt: "2026-03-15T14:00:00Z",
  },
  {
    id: "d3",
    gigTitle: "Python Backend API",
    freelancerName: "Vikram P",
    reason: "Missed deadline",
    description: "Project was delivered 10 days past the agreed deadline without prior communication.",
    status: "RESOLVED",
    createdAt: "2026-02-28T09:00:00Z",
    resolvedAt: "2026-03-10T11:00:00Z",
  },
];

const statusColors: Record<string, "default" | "warning" | "success" | "secondary"> = {
  OPEN: "warning",
  IN_REVIEW: "default",
  RESOLVED: "success",
  CLOSED: "secondary",
};

export default function EmployerDisputesPage() {
  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Disputes</h1>
          <Button variant="outline">Raise a Dispute</Button>
        </div>

        {mockDisputes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No disputes</p>
            <p className="text-sm">All your gigs are running smoothly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockDisputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{dispute.gigTitle}</h3>
                        <Badge variant={statusColors[dispute.status]}>
                          {dispute.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Freelancer: {dispute.freelancerName} &middot; Filed{" "}
                        {formatDate(dispute.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Reason:</span>{" "}
                        {dispute.reason}
                      </p>
                      <p className="text-sm text-gray-600">
                        {dispute.description}
                      </p>
                      {dispute.resolvedAt && (
                        <p className="text-xs text-green-600 mt-2">
                          Resolved on {formatDate(dispute.resolvedAt)}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 shrink-0">
                      {dispute.status !== "RESOLVED" &&
                        dispute.status !== "CLOSED" && (
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        )}
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

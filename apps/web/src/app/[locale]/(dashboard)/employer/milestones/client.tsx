"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveMilestone } from "@/server/actions/milestone.actions";

interface Deliverable {
  id: string;
  fileName: string;
  fileUrl: string;
  note: string | null;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  orderIndex: number;
  submittedAt: string | null;
  approvedAt: string | null;
  deliverables: Deliverable[];
}

interface GigWithMilestones {
  id: string;
  title: string;
  status: string;
  freelancerName: string;
  budget: number;
  milestones: Milestone[];
}

const statusColors: Record<string, "default" | "warning" | "success"> = {
  PENDING: "default",
  IN_PROGRESS: "warning",
  SUBMITTED: "warning",
  APPROVED: "success",
};

export function EmployerMilestonesClient({ gigs }: { gigs: GigWithMilestones[] }) {
  const router = useRouter();
  const [approving, setApproving] = useState<string | null>(null);

  async function handleApprove(milestoneId: string) {
    setApproving(milestoneId);
    try {
      const result = await approveMilestone(milestoneId);
      if (result.gigCompleted) {
        alert("All milestones approved! Gig marked as completed.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setApproving(null);
    }
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No milestones to manage</p>
        <p className="mt-1">Milestones will appear here once you have active gigs with accepted bids.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {gigs.map((gig) => {
        const completed = gig.milestones.filter((m) => m.status === "APPROVED").length;
        const submitted = gig.milestones.filter((m) => m.status === "SUBMITTED").length;
        const total = gig.milestones.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <Card key={gig.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{gig.title}</h2>
                  <p className="text-sm text-muted-foreground">Freelancer: {gig.freelancerName}</p>
                </div>
                <div className="text-right">
                  <Badge variant={gig.status === "COMPLETED" ? "success" : "warning"}>{gig.status}</Badge>
                  {submitted > 0 && (
                    <p className="text-sm text-amber-600 mt-1">{submitted} awaiting review</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Milestones */}
              <div className="space-y-4">
                {gig.milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className={`border rounded-lg p-4 ${ms.status === "SUBMITTED" ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">#{ms.orderIndex + 1}</span>
                        <h3 className="font-medium">{ms.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(ms.amount)}
                        </span>
                        <Badge variant={statusColors[ms.status] || "default"}>{ms.status}</Badge>
                      </div>
                    </div>

                    {ms.description && (
                      <p className="text-sm text-muted-foreground mb-3">{ms.description}</p>
                    )}

                    {ms.deliverables.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Deliverables submitted:</p>
                        {ms.deliverables.map((d) => (
                          <div key={d.id} className="text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{d.fileName}</span>
                            {d.note && <span className="text-muted-foreground">- {d.note}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {ms.status === "SUBMITTED" && (
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                        <p className="text-sm text-amber-700 dark:text-amber-400 flex-1">
                          Freelancer submitted this milestone for your review
                        </p>
                        <Button
                          size="sm"
                          disabled={approving === ms.id}
                          onClick={() => handleApprove(ms.id)}
                        >
                          {approving === ms.id ? "Approving..." : "Approve"}
                        </Button>
                      </div>
                    )}

                    {ms.submittedAt && ms.status !== "SUBMITTED" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(ms.submittedAt).toLocaleDateString()}
                      </p>
                    )}
                    {ms.approvedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Approved: {new Date(ms.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

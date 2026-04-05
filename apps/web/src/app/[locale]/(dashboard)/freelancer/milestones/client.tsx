"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { submitMilestone } from "@/server/actions/milestone.actions";

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
  employerName: string;
  budget: number;
  milestones: Milestone[];
}

const statusColors: Record<string, "default" | "warning" | "success"> = {
  PENDING: "default",
  IN_PROGRESS: "warning",
  SUBMITTED: "warning",
  APPROVED: "success",
};

export function FreelancerMilestonesClient({ gigs }: { gigs: GigWithMilestones[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});

  async function handleSubmit(milestoneId: string) {
    setSubmitting(milestoneId);
    try {
      await submitMilestone(milestoneId, note[milestoneId]);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(null);
    }
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No active milestones</p>
        <p className="mt-1">Milestones will appear here once you have an accepted bid on an active gig.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {gigs.map((gig) => {
        const completed = gig.milestones.filter((m) => m.status === "APPROVED").length;
        const total = gig.milestones.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <Card key={gig.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{gig.title}</h2>
                  <p className="text-sm text-muted-foreground">Client: {gig.employerName}</p>
                </div>
                <div className="text-right">
                  <Badge variant={gig.status === "COMPLETED" ? "success" : "warning"}>{gig.status}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">{pct}% complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Milestones list */}
              <div className="space-y-4">
                {gig.milestones.map((ms) => (
                  <div key={ms.id} className="border rounded-lg p-4">
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
                        <p className="text-xs font-medium text-muted-foreground mb-1">Deliverables:</p>
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

                    {(ms.status === "PENDING" || ms.status === "IN_PROGRESS") && (
                      <div className="flex items-center gap-3 mt-3">
                        <input
                          type="text"
                          placeholder="Add a note (optional)..."
                          className="flex-1 text-sm border rounded-md px-3 py-1.5 bg-background"
                          value={note[ms.id] || ""}
                          onChange={(e) => setNote((prev) => ({ ...prev, [ms.id]: e.target.value }))}
                        />
                        <Button
                          size="sm"
                          disabled={submitting === ms.id}
                          onClick={() => handleSubmit(ms.id)}
                        >
                          {submitting === ms.id ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    )}

                    {ms.submittedAt && (
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

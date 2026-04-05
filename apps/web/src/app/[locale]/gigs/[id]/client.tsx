"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { submitBid } from "@/server/actions/bid.actions";

interface GigData {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  budgetType: string;
  experienceLevel: string | null;
  duration: string | null;
  deadline: string | null;
  isRemote: boolean;
  city: string | null;
  skills: string[];
  bidCount: number;
  viewCount: number;
  createdAt: string;
  poster: {
    displayName: string;
    avgRating: number;
  };
  bids: {
    id: string;
    freelancerName: string;
    avgRating: number;
    completedGigs: number;
    amount: number;
    deliveryDays: number;
    matchScore: number;
    coverLetter: string;
  }[];
}

interface GigDetailClientProps {
  gig: GigData;
}

export function GigDetailClient({ gig }: GigDetailClientProps) {
  const t = useTranslations("gigs");
  const tb = useTranslations("bids");
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: "",
    deliveryDays: "",
    coverLetter: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  async function handleSubmitBid(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setBidError(null);

    try {
      await submitBid({
        gigId: gig.id,
        amount: Number(bidData.amount),
        deliveryDays: Number(bidData.deliveryDays),
        coverLetter: bidData.coverLetter,
      });
      setBidSuccess(true);
      setShowBidForm(false);
      setBidData({ amount: "", deliveryDays: "", coverLetter: "" });
    } catch (err) {
      setBidError(
        err instanceof Error ? err.message : "Failed to submit bid"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gig Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary">{gig.category}</Badge>
                  <span className="text-sm text-gray-500">
                    {gig.viewCount} views
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
                <p className="text-sm text-gray-500 mb-4">
                  Posted {formatDate(gig.createdAt)} ·{" "}
                  {gig.isRemote ? "Remote" : gig.city || gig.category} ·{" "}
                  {gig.experienceLevel || "Any level"}
                </p>

                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                  {gig.description}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {gig.skills.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Deadline */}
                {gig.deadline && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    <span className="font-medium">Deadline:</span>{" "}
                    {formatDate(gig.deadline)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("bids")} ({gig.bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gig.bids.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No bids yet. Be the first to bid!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {gig.bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            fallback={bid.freelancerName}
                            size="sm"
                          />
                          <div>
                            <div className="font-medium">
                              {bid.freelancerName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {bid.avgRating} rating · {bid.completedGigs}{" "}
                              gigs done
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatCurrency(bid.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {bid.deliveryDays} days
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              bid.matchScore >= 90
                                ? "success"
                                : bid.matchScore >= 80
                                  ? "warning"
                                  : "secondary"
                            }
                          >
                            {tb("matchScore")}: {bid.matchScore}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bid Success Message */}
            {bidSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                Your bid has been submitted successfully!
              </div>
            )}

            {/* Bid Error Message */}
            {bidError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {bidError}
              </div>
            )}

            {/* Bid Submission Form */}
            {!bidSuccess &&
              (!showBidForm ? (
                <Button size="lg" onClick={() => setShowBidForm(true)}>
                  {t("placeBid")}
                </Button>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{tb("submitBid")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{tb("amount")}</Label>
                          <Input
                            type="number"
                            value={bidData.amount}
                            onChange={(e) =>
                              setBidData({
                                ...bidData,
                                amount: e.target.value,
                              })
                            }
                            min="500"
                            placeholder="e.g. 20000"
                            required
                          />
                          <p className="text-xs text-gray-500">
                            Budget: {formatCurrency(gig.budgetMin)} -{" "}
                            {formatCurrency(gig.budgetMax)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>{tb("deliveryDays")}</Label>
                          <Input
                            type="number"
                            value={bidData.deliveryDays}
                            onChange={(e) =>
                              setBidData({
                                ...bidData,
                                deliveryDays: e.target.value,
                              })
                            }
                            min="1"
                            placeholder="e.g. 14"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{tb("coverLetter")}</Label>
                        <Textarea
                          value={bidData.coverLetter}
                          onChange={(e) =>
                            setBidData({
                              ...bidData,
                              coverLetter: e.target.value,
                            })
                          }
                          rows={5}
                          placeholder="Why are you the best fit for this gig? Mention relevant experience and your approach."
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Minimum 50 characters
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" disabled={submitting}>
                          {submitting ? "Submitting..." : tb("submitBid")}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowBidForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {formatCurrency(gig.budgetMin)} -{" "}
                  {formatCurrency(gig.budgetMax)}
                </div>
                <div className="text-sm text-gray-500">
                  {gig.budgetType === "hourly" ? "Per hour" : "Fixed price"}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {gig.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span>{gig.duration}</span>
                    </div>
                  )}
                  {gig.experienceLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span>{gig.experienceLevel}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proposals</span>
                    <span>{gig.bidCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span>
                      {gig.isRemote ? "Remote" : gig.city || "On-site"}
                    </span>
                  </div>
                  {gig.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deadline</span>
                      <span>{formatDate(gig.deadline)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Employer Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">About the Client</h3>
                <div className="flex items-center gap-3">
                  <Avatar fallback={gig.poster.displayName} size="sm" />
                  <div>
                    <div className="font-medium">
                      {gig.poster.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {gig.poster.avgRating > 0
                        ? `${gig.poster.avgRating} rating`
                        : "New client"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

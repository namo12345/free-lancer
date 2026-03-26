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

// TODO: Replace mock data with server actions:
// import { getGigById } from "@/server/actions/gig.actions";
// import { submitBid } from "@/server/actions/bid.actions";

const mockGig = {
  id: "1",
  title: "Build a React Dashboard for SaaS Analytics Platform",
  description:
    "Looking for an experienced React developer to build a modern analytics dashboard with charts, real-time data, and user management.\n\nRequirements:\n- Clean, responsive UI with Tailwind CSS\n- Interactive charts (line, bar, pie) with real-time updates\n- User authentication and role-based access\n- Dark mode support\n- TypeScript throughout\n\nNice to have:\n- Experience with shadcn/ui\n- Knowledge of WebSocket for live data",
  category: "Web Development",
  budgetMin: 15000,
  budgetMax: 30000,
  budgetType: "fixed",
  experienceLevel: "Intermediate",
  duration: "2-3 weeks",
  deadline: "2026-04-15T00:00:00Z",
  isRemote: true,
  city: null as string | null,
  skills: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
  bidCount: 8,
  viewCount: 45,
  createdAt: "2026-03-14T10:00:00Z",
  poster: { displayName: "TechCorp India", avgRating: 4.5, gigsPosted: 12 },
};

const mockBids = [
  {
    id: "b1",
    freelancer: { displayName: "Rahul K", avgRating: 4.9, completedGigs: 18 },
    amount: 22000,
    deliveryDays: 14,
    matchScore: 92,
    coverLetter: "I have 3+ years building React dashboards with real-time data.",
  },
  {
    id: "b2",
    freelancer: { displayName: "Ananya S", avgRating: 4.7, completedGigs: 12 },
    amount: 18000,
    deliveryDays: 10,
    matchScore: 87,
    coverLetter: "Experienced with shadcn/ui and Chart.js. Can deliver quickly.",
  },
  {
    id: "b3",
    freelancer: { displayName: "Vikram P", avgRating: 4.5, completedGigs: 8 },
    amount: 25000,
    deliveryDays: 7,
    matchScore: 78,
    coverLetter: "Full-stack developer with strong TypeScript skills.",
  },
];

export default function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = useTranslations("gigs");
  const tb = useTranslations("bids");
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: "",
    deliveryDays: "",
    coverLetter: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // TODO: In production, use params to fetch gig:
  // const { id } = await params;
  // const gig = await getGigById(id);

  async function handleSubmitBid(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Replace with actual server action
    // await submitBid({ gigId: mockGig.id, amount: Number(bidData.amount), deliveryDays: Number(bidData.deliveryDays), coverLetter: bidData.coverLetter });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setShowBidForm(false);
    setBidData({ amount: "", deliveryDays: "", coverLetter: "" });
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
                  <Badge variant="secondary">{mockGig.category}</Badge>
                  <span className="text-sm text-gray-500">
                    {mockGig.viewCount} views
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">{mockGig.title}</h1>
                <p className="text-sm text-gray-500 mb-4">
                  Posted {formatDate(mockGig.createdAt)} ·{" "}
                  {mockGig.isRemote ? "Remote" : mockGig.city || mockGig.category}{" "}
                  · {mockGig.experienceLevel}
                </p>

                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                  {mockGig.description}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {mockGig.skills.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Deadline */}
                {mockGig.deadline && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    <span className="font-medium">Deadline:</span>{" "}
                    {formatDate(mockGig.deadline)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("bids")} ({mockBids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={bid.freelancer.displayName}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium">
                            {bid.freelancer.displayName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {bid.freelancer.avgRating} rating ·{" "}
                            {bid.freelancer.completedGigs} gigs done
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
              </CardContent>
            </Card>

            {/* Bid Submission Form */}
            {!showBidForm ? (
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
                            setBidData({ ...bidData, amount: e.target.value })
                          }
                          min="500"
                          placeholder="e.g. 20000"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Budget: {formatCurrency(mockGig.budgetMin)} -{" "}
                          {formatCurrency(mockGig.budgetMax)}
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {formatCurrency(mockGig.budgetMin)} -{" "}
                  {formatCurrency(mockGig.budgetMax)}
                </div>
                <div className="text-sm text-gray-500">
                  {mockGig.budgetType === "hourly" ? "Per hour" : "Fixed price"}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span>{mockGig.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experience</span>
                    <span>{mockGig.experienceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proposals</span>
                    <span>{mockGig.bidCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span>{mockGig.isRemote ? "Remote" : mockGig.city || "On-site"}</span>
                  </div>
                  {mockGig.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deadline</span>
                      <span>{formatDate(mockGig.deadline)}</span>
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
                  <Avatar
                    fallback={mockGig.poster.displayName}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">
                      {mockGig.poster.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {mockGig.poster.avgRating} rating ·{" "}
                      {mockGig.poster.gigsPosted} gigs posted
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

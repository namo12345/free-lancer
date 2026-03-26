"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { ReviewList } from "@/components/reviews/review-list";
import { TrustScore } from "@/components/reviews/trust-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Replace with server actions:
// import { getReviewsForUser } from "@/server/actions/review.actions";

const mockReviews = [
  {
    id: "r1",
    authorName: "TechCorp India",
    authorAvatarUrl: undefined,
    gigTitle: "Build a React Dashboard",
    rating: 5,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 4,
    comment:
      "Excellent work on the dashboard. Delivered ahead of schedule with clean, well-documented code. Would definitely hire again.",
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "r2",
    authorName: "FreshBite Foods",
    authorAvatarUrl: undefined,
    gigTitle: "Logo Design for D2C Brand",
    rating: 4,
    communicationRating: 4,
    qualityRating: 5,
    timelinessRating: 4,
    comment:
      "Great design work. Provided multiple creative concepts and was very responsive to feedback. Minor delays but overall very satisfied.",
    createdAt: "2026-02-25T14:00:00Z",
  },
  {
    id: "r3",
    authorName: "NeuralStack AI",
    authorAvatarUrl: undefined,
    gigTitle: "Python Backend for AI Startup",
    rating: 5,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
    comment:
      "Outstanding backend developer. Built a robust FastAPI service with excellent test coverage. Highly recommended.",
    createdAt: "2026-02-10T09:00:00Z",
  },
];

const mockTrustData = {
  score: 88,
  completedGigs: 14,
  avgRating: 4.7,
  isVerified: true,
  responseTime: 45,
};

export default function FreelancerReviewsPage() {
  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Reviews & Trust Score</h1>

        {/* Trust Score */}
        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <TrustScore
              score={mockTrustData.score}
              completedGigs={mockTrustData.completedGigs}
              avgRating={mockTrustData.avgRating}
              isVerified={mockTrustData.isVerified}
              responseTime={mockTrustData.responseTime}
            />
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Client Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewList reviews={mockReviews} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

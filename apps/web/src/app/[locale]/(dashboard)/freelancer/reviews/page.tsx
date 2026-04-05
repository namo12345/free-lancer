import { Sidebar } from "@/components/layout/sidebar";
import { ReviewList } from "@/components/reviews/review-list";
import { TrustScore } from "@/components/reviews/trust-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyReviewsData } from "@/server/actions/dashboard.actions";

export default async function FreelancerReviewsPage() {
  const data = await getMyReviewsData();
  const reviews = data?.reviews || [];
  const trustScore = data?.trustScore || {
    score: 0,
    completedGigs: 0,
    avgRating: 0,
    isVerified: false,
    responseTime: 0,
  };

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Reviews & Trust Score</h1>

        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <TrustScore {...trustScore} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No reviews yet. Complete gigs to receive client reviews.
              </p>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

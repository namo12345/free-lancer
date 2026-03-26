"use client";

import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "./star-rating";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  gigTitle: string;
  rating: number;
  communicationRating?: number;
  qualityRating?: number;
  timelinessRating?: number;
  comment?: string;
  createdAt: string;
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
        <div>
          <StarRating value={Math.round(avgRating)} readonly size="md" />
          <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
        </div>
      </div>

      <div className="divide-y">
        {reviews.map((review) => (
          <div key={review.id} className="py-4">
            <div className="flex items-start gap-3">
              <Avatar fallback={review.authorName} src={review.authorAvatarUrl} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.authorName}</span>
                  <StarRating value={review.rating} readonly size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{review.gigTitle} &middot; {formatDate(review.createdAt)}</p>
                {review.comment && <p className="text-sm text-gray-700 mt-2">{review.comment}</p>}

                {(review.communicationRating || review.qualityRating || review.timelinessRating) && (
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    {review.communicationRating && <span>Communication: {review.communicationRating}/5</span>}
                    {review.qualityRating && <span>Quality: {review.qualityRating}/5</span>}
                    {review.timelinessRating && <span>Timeliness: {review.timelinessRating}/5</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

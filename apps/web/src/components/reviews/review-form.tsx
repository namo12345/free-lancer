"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";

interface ReviewFormProps {
  gigTitle: string;
  targetName: string;
  onSubmit: (review: {
    rating: number;
    communicationRating: number;
    qualityRating: number;
    timelinessRating: number;
    valueRating: number;
    comment: string;
  }) => Promise<void>;
}

export function ReviewForm({ gigTitle, targetName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    await onSubmit({ rating, communicationRating, qualityRating, timelinessRating, valueRating, comment });
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review {targetName}</CardTitle>
        <p className="text-sm text-muted-foreground">For: {gigTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Communication</Label>
              <StarRating value={communicationRating} onChange={setCommunicationRating} size="sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Quality</Label>
              <StarRating value={qualityRating} onChange={setQualityRating} size="sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Timeliness</Label>
              <StarRating value={timelinessRating} onChange={setTimelinessRating} size="sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Value for Money</Label>
              <StarRating value={valueRating} onChange={setValueRating} size="sm" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Share your experience working together..." />
          </div>

          <Button type="submit" disabled={submitting || rating === 0}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

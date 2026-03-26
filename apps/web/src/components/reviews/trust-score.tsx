"use client";

import { cn } from "@/lib/utils";

interface TrustScoreProps {
  score: number; // 0-100
  completedGigs: number;
  avgRating: number;
  isVerified: boolean;
  responseTime?: number; // minutes
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "New";
}

export function TrustScore({ score, completedGigs, avgRating, isVerified, responseTime }: TrustScoreProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      {/* Circular score */}
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-xl font-bold", getScoreColor(score))}>{score}</span>
          <span className="text-[10px] text-gray-500">{getScoreLabel(score)}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Rating:</span>
          <span className="font-medium">{avgRating}/5 ⭐</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Completed:</span>
          <span className="font-medium">{completedGigs} gigs</span>
        </div>
        {responseTime && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Response:</span>
            <span className="font-medium">{responseTime < 60 ? `${responseTime} min` : `${Math.round(responseTime / 60)} hrs`}</span>
          </div>
        )}
        {isVerified && (
          <div className="flex items-center gap-1 text-blue-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-xs font-medium">Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}

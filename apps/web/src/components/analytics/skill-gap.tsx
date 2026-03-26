"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillGap {
  skill: string;
  demandScore: number;
  jobMatchIncrease: number;
  difficulty: "easy" | "moderate" | "hard";
  reason: string;
}

const mockGaps: SkillGap[] = [
  { skill: "Next.js", demandScore: 89, jobMatchIncrease: 37, difficulty: "easy", reason: "73% of React jobs also require Next.js" },
  { skill: "Docker", demandScore: 76, jobMatchIncrease: 22, difficulty: "moderate", reason: "Growing requirement for deployment-aware developers" },
  { skill: "GraphQL", demandScore: 68, jobMatchIncrease: 18, difficulty: "moderate", reason: "API design skill that commands premium rates" },
];

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export function SkillGapAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Skill Gap Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">Skills that could increase your job matches</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockGaps.map((gap) => (
          <div key={gap.skill} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{gap.skill}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[gap.difficulty]}`}>
                  {gap.difficulty}
                </span>
              </div>
              <Badge variant="secondary">+{gap.jobMatchIncrease}% more matches</Badge>
            </div>
            <p className="text-sm text-gray-600">{gap.reason}</p>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Market demand:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${gap.demandScore}%` }} />
                </div>
                <span className="text-xs font-medium">{gap.demandScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";

interface SkillBadgeData {
  skillName: string;
  badgeType: string;
  score?: number;
}

const badgeConfig: Record<string, { label: string; color: string }> = {
  assessment: { label: "Assessed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  github_verified: { label: "GitHub Verified", color: "bg-gray-100 text-gray-800 border-gray-200" },
  portfolio_verified: { label: "Portfolio Verified", color: "bg-purple-100 text-purple-800 border-purple-200" },
  top_rated: { label: "Top Rated", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
};

export function SkillBadges({ badges }: { badges: SkillBadgeData[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Verified Skills</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => {
          const config = badgeConfig[badge.badgeType] || badgeConfig.assessment;
          return (
            <div key={idx} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.color}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>{badge.skillName}</span>
              {badge.score && <span className="text-[10px] opacity-70">({badge.score}%)</span>}
              <span className="text-[10px] opacity-60">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

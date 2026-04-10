"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateFreelancerDna } from "@/server/actions/dna.actions";

interface HardSkill {
  name: string;
  level: string;
  marketDemand: string;
}

interface WorkPatterns {
  preferredWorkStyle?: string;
  peakProductivityHours?: string;
  projectPreference?: string;
  [key: string]: string | undefined;
}

interface DnaData {
  id: string;
  hardSkills: HardSkill[] | unknown;
  softSkills: string[];
  workPatterns: WorkPatterns | unknown;
  qualityScore: number | null;
  aiSummary: string | null;
  lastAnalyzedAt: Date | string | null;
}

const DEMAND_COLOR: Record<string, string> = {
  high: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  low: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const LEVEL_ICON: Record<string, string> = {
  expert: "★★★★★",
  advanced: "★★★★☆",
  intermediate: "★★★☆☆",
  beginner: "★★☆☆☆",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

export function DnaClient({ initialDna }: { initialDna: DnaData | null }) {
  const router = useRouter();
  const [dna, setDna] = useState<DnaData | null>(initialDna);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await generateFreelancerDna();
        setDna(result as DnaData);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate DNA");
      }
    });
  }

  const hardSkills = (dna?.hardSkills as HardSkill[] | null) ?? [];
  const softSkills = dna?.softSkills ?? [];
  const workPatterns = (dna?.workPatterns as WorkPatterns | null) ?? {};
  const qualityScore = dna?.qualityScore ?? null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FreelancerDNA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered analysis of your skills, work style, and market positioning.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isPending}>
          {isPending ? "Analyzing..." : dna ? "Re-analyze" : "Generate DNA"}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!dna && !isPending && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <div className="text-5xl mb-4">🧬</div>
            <p className="text-lg font-medium">No DNA profile yet</p>
            <p className="text-sm mt-1 max-w-xs">
              Click &quot;Generate DNA&quot; to let AI analyze your profile and produce a detailed skills report.
            </p>
          </CardContent>
        </Card>
      )}

      {isPending && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <div className="text-5xl mb-4 animate-pulse">🧬</div>
            <p className="text-lg font-medium">Analyzing your profile...</p>
            <p className="text-sm mt-1">This may take a few seconds.</p>
          </CardContent>
        </Card>
      )}

      {dna && !isPending && (
        <>
          {/* Quality Score */}
          {qualityScore !== null && (
            <Card className="border-l-4 border-l-brand-500">
              <CardContent className="p-5 flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${scoreColor(qualityScore)}`}>
                    {qualityScore}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Quality Score</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">AI Summary</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dna.aiSummary || "No summary available."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hard Skills */}
          {hardSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hard Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hardSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <div>
                        <div className="font-medium text-sm">{skill.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {LEVEL_ICON[skill.level?.toLowerCase()] ?? "★★★☆☆"} {skill.level}
                        </div>
                      </div>
                      <Badge
                        className={`text-xs ${DEMAND_COLOR[skill.marketDemand?.toLowerCase()] ?? ""}`}
                        variant="outline"
                      >
                        {skill.marketDemand} demand
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Soft Skills & Work Patterns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {softSkills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Soft Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {softSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="capitalize">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {Object.keys(workPatterns).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Work Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(workPatterns).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-medium capitalize">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {dna.lastAnalyzedAt && (
            <p className="text-xs text-muted-foreground">
              Last analyzed: {new Date(dna.lastAnalyzedAt).toLocaleString("en-IN")}
            </p>
          )}
        </>
      )}
    </div>
  );
}

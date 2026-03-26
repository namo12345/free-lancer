"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const [selectedRole, setSelectedRole] = useState<"FREELANCER" | "EMPLOYER" | null>(null);
  const router = useRouter();

  function handleContinue() {
    if (!selectedRole) return;
    // In production: save role to DB, then redirect
    if (selectedRole === "FREELANCER") {
      router.push("/freelancer/profile");
    } else {
      router.push("/employer/profile");
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("roleQuestion")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={() => setSelectedRole("FREELANCER")}
          className={`w-full p-6 rounded-lg border-2 text-left transition-colors ${
            selectedRole === "FREELANCER"
              ? "border-brand-600 bg-brand-50"
              : "border-gray-200 hover:border-brand-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("freelancer")}</h3>
              <p className="text-sm text-gray-600">{t("freelancerDesc")}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedRole("EMPLOYER")}
          className={`w-full p-6 rounded-lg border-2 text-left transition-colors ${
            selectedRole === "EMPLOYER"
              ? "border-brand-600 bg-brand-50"
              : "border-gray-200 hover:border-brand-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("employer")}</h3>
              <p className="text-sm text-gray-600">{t("employerDesc")}</p>
            </div>
          </div>
        </button>

        <Button className="w-full mt-4" size="lg" disabled={!selectedRole} onClick={handleContinue}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}

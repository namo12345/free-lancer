"use client";

import { useEffect } from "react";

export default function OnboardingPage() {
  useEffect(() => {
    // Static auth doesn't need onboarding — redirect to dashboard
    const locale = window.location.pathname.split("/")[1] || "en";
    window.location.href = `/${locale}/freelancer/dashboard`;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
}

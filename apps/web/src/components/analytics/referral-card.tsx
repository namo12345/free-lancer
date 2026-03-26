"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReferralCardProps {
  referralCode: string;
  referralCount: number;
  creditsEarned: number;
}

export function ReferralCard({ referralCode, referralCount, creditsEarned }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://hiresense.com/signup?ref=${referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refer & Earn</CardTitle>
        <p className="text-sm text-muted-foreground">
          Invite freelancers and employers. Earn credits when they complete their first gig.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="text-xs" />
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-brand-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-brand-700">{referralCount}</div>
            <div className="text-xs text-brand-600">People Referred</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-700">₹{creditsEarned.toLocaleString()}</div>
            <div className="text-xs text-green-600">Credits Earned</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => {
            const text = `Join HireSense - India's AI-powered freelancing platform! Sign up with my link: ${referralLink}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
          }}>
            Share on WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join @HireSense - India's AI freelancing platform! ${referralLink}`)}`, "_blank");
          }}>
            Share on X
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

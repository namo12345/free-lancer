"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillSelector, type SkillOption } from "@/components/forms/skill-selector";
import { updateFreelancerProfile } from "@/server/actions/profile.actions";

interface FreelancerProfileState {
  displayName: string;
  headline: string;
  bio: string;
  hourlyRate: string;
  city: string;
  state: string;
  isRemote: boolean;
  githubUrl: string;
  behanceUrl: string;
  dribbbleUrl: string;
  linkedinUrl: string;
  upiId: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  selectedSkillIds: string[];
}

export function FreelancerProfileClient({
  initialProfile,
  initialSkills,
}: {
  initialProfile: FreelancerProfileState;
  initialSkills: SkillOption[];
}) {
  const t = useTranslations("profile");
  const [formData, setFormData] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField<K extends keyof FreelancerProfileState>(
    field: K,
    value: FreelancerProfileState[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateFreelancerProfile({
        displayName: formData.displayName.trim(),
        headline: formData.headline.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        isRemote: formData.isRemote,
        githubUrl: formData.githubUrl.trim(),
        behanceUrl: formData.behanceUrl.trim(),
        dribbbleUrl: formData.dribbbleUrl.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        skillIds: formData.selectedSkillIds,
        upiId: formData.upiId.trim() || undefined,
        bankAccountNumber: formData.bankAccountNumber.trim() || undefined,
        bankIfsc: formData.bankIfsc.trim() || undefined,
        bankName: formData.bankName.trim() || undefined,
      });
      setSuccess("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{t("editProfile")}</h1>
        <p className="text-sm text-muted-foreground">
          Keep this profile current so matching, portfolio sync, and invoices stay accurate.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t("headline")}</Label>
                <Input
                  value={formData.headline}
                  onChange={(e) => updateField("headline", e.target.value)}
                  placeholder="Full-Stack Developer | 5+ years"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("bio")}</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Tell employers about your experience..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>{t("hourlyRate")}</Label>
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => updateField("hourlyRate", e.target.value)}
                  placeholder="1500"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Bangalore"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="Karnataka"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm w-full">
                  <input
                    type="checkbox"
                    checked={formData.isRemote}
                    onChange={(e) => updateField("isRemote", e.target.checked)}
                  />
                  Remote-friendly
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <SkillSelector
              title={t("skills")}
              description="Select up to 15 skills from the full global catalog."
              skills={initialSkills}
              selectedIds={formData.selectedSkillIds}
              onChange={(selectedSkillIds) =>
                updateField("selectedSkillIds", selectedSkillIds)
              }
              maxSelected={15}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>External Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => updateField("githubUrl", e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => updateField("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label>Behance</Label>
                <Input
                  value={formData.behanceUrl}
                  onChange={(e) => updateField("behanceUrl", e.target.value)}
                  placeholder="https://behance.net/username"
                />
              </div>
              <div className="space-y-2">
                <Label>Dribbble</Label>
                <Input
                  value={formData.dribbbleUrl}
                  onChange={(e) => updateField("dribbbleUrl", e.target.value)}
                  placeholder="https://dribbble.com/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details (for Invoices)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <Input
                value={formData.upiId}
                onChange={(e) => updateField("upiId", e.target.value)}
                placeholder="yourname@upi"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => updateField("bankName", e.target.value)}
                  placeholder="HDFC Bank"
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.bankAccountNumber}
                  onChange={(e) =>
                    updateField("bankAccountNumber", e.target.value)
                  }
                  placeholder="XXXX123456"
                />
              </div>
              <div className="space-y-2">
                <Label>IFSC</Label>
                <Input
                  value={formData.bankIfsc}
                  onChange={(e) => updateField("bankIfsc", e.target.value)}
                  placeholder="HDFC0001234"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillSelector, type SkillOption } from "@/components/forms/skill-selector";
import { GigCategory, ExperienceLevel } from "@hiresense/shared";
import { createGig } from "@/server/actions/gig.actions";

interface PostGigState {
  title: string;
  description: string;
  category: string;
  budgetMin: string;
  budgetMax: string;
  budgetType: "fixed" | "hourly";
  deadline: string;
  duration: string;
  experienceLevel: string;
  isRemote: boolean;
  city: string;
  state: string;
  selectedSkillIds: string[];
}

export function PostGigClient({ skills }: { skills: SkillOption[] }) {
  const t = useTranslations("gigs");
  const router = useRouter();
  const [formData, setFormData] = useState<PostGigState>({
    title: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    budgetType: "fixed",
    deadline: "",
    duration: "",
    experienceLevel: "",
    isRemote: true,
    city: "",
    state: "",
    selectedSkillIds: [],
  });
  const [saving, setSaving] = useState<"publish" | "draft" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField<K extends keyof PostGigState>(
    field: K,
    value: PostGigState[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function submitGig(status: "OPEN" | "DRAFT") {
    setSaving(status === "OPEN" ? "publish" : "draft");
    setError(null);
    setSuccess(null);

    try {
      const result = await createGig({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budgetMin: Number(formData.budgetMin),
        budgetMax: Number(formData.budgetMax),
        budgetType: formData.budgetType,
        status,
        deadline: formData.deadline || undefined,
        duration: formData.duration || undefined,
        experienceLevel: (formData.experienceLevel || undefined) as
          | "Entry"
          | "Intermediate"
          | "Expert"
          | undefined,
        isRemote: formData.isRemote,
        city: formData.isRemote ? undefined : formData.city.trim() || undefined,
        state: formData.isRemote ? undefined : formData.state.trim() || undefined,
        subcategory: undefined,
        skillIds: formData.selectedSkillIds,
      });

      setSuccess(status === "OPEN" ? "Gig published." : "Draft saved.");
      if (status === "OPEN") {
        router.push(`/gigs/${result.gigId}`);
      } else {
        router.push("/employer/gigs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gig.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{t("postGig")}</h1>
        <p className="text-sm text-muted-foreground">
          Post a gig with the full skill catalog and save it as a draft or publish it immediately.
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitGig("OPEN");
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Gig Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("title")} *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Build a React dashboard for my SaaS app"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t("description")} *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the project in detail..."
                rows={6}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("category")} *</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {Object.values(GigCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("experienceLevel")}</Label>
                <Select
                  value={formData.experienceLevel}
                  onChange={(e) => updateField("experienceLevel", e.target.value)}
                >
                  <option value="">Any level</option>
                  {Object.values(ExperienceLevel).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <SkillSelector
              title={t("skills")}
              description="Select up to 10 skills from the global catalog."
              skills={skills}
              selectedIds={formData.selectedSkillIds}
              onChange={(selectedSkillIds) =>
                updateField("selectedSkillIds", selectedSkillIds)
              }
              maxSelected={10}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("budget")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="budgetType"
                  value="fixed"
                  checked={formData.budgetType === "fixed"}
                  onChange={() => updateField("budgetType", "fixed")}
                />
                <span className="text-sm">Fixed Price</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="budgetType"
                  value="hourly"
                  checked={formData.budgetType === "hourly"}
                  onChange={() => updateField("budgetType", "hourly")}
                />
                <span className="text-sm">Hourly Rate</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("budgetMin")}</Label>
                <Input
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => updateField("budgetMin", e.target.value)}
                  placeholder="5000"
                  min="500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t("budgetMax")}</Label>
                <Input
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => updateField("budgetMax", e.target.value)}
                  placeholder="25000"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("deadline")}</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={formData.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3+ months">3+ months</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isRemote}
                onChange={(e) => updateField("isRemote", e.target.checked)}
              />
              <span className="text-sm">
                {t("remote")} - Freelancer can work from anywhere
              </span>
            </label>
            {!formData.isRemote && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={saving !== null}>
            {saving === "publish" ? "Publishing..." : "Publish Gig"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={saving !== null}
            onClick={() => void submitGig("DRAFT")}
          >
            {saving === "draft" ? "Saving..." : "Save as Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}

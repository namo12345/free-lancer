"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GigCategory, ExperienceLevel } from "@hiresense/shared";

export default function PostGigPage() {
  const t = useTranslations("gigs");
  const [formData, setFormData] = useState({
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
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Figma", "UI Design", "Tailwind CSS", "PostgreSQL", "Docker", "AWS", "Flutter", "Django", "FastAPI", "Machine Learning", "SEO", "Copywriting", "Video Editing"];

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill].slice(0, 10)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Post gig:", { ...formData, skills: selectedSkills });
  }

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">{t("postGig")}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Gig Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("title")} *</Label>
                <Input value={formData.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Build a React dashboard for my SaaS app" required />
              </div>
              <div className="space-y-2">
                <Label>{t("description")} *</Label>
                <Textarea value={formData.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe the project in detail..." rows={6} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("category")} *</Label>
                  <Select value={formData.category} onChange={(e) => updateField("category", e.target.value)} required>
                    <option value="">Select category</option>
                    {Object.values(GigCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("experienceLevel")}</Label>
                  <Select value={formData.experienceLevel} onChange={(e) => updateField("experienceLevel", e.target.value)}>
                    <option value="">Any level</option>
                    {Object.values(ExperienceLevel).map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t("skills")} (max 10)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}>
                    <Badge variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer">{skill}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t("budget")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="budgetType" value="fixed" checked={formData.budgetType === "fixed"} onChange={(e) => updateField("budgetType", e.target.value)} />
                  <span className="text-sm">Fixed Price</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="budgetType" value="hourly" checked={formData.budgetType === "hourly"} onChange={(e) => updateField("budgetType", e.target.value)} />
                  <span className="text-sm">Hourly Rate</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("budgetMin")}</Label>
                  <Input type="number" value={formData.budgetMin} onChange={(e) => updateField("budgetMin", e.target.value)} placeholder="5000" min="500" required />
                </div>
                <div className="space-y-2">
                  <Label>{t("budgetMax")}</Label>
                  <Input type="number" value={formData.budgetMax} onChange={(e) => updateField("budgetMax", e.target.value)} placeholder="25000" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("deadline")}</Label>
                  <Input type="date" value={formData.deadline} onChange={(e) => updateField("deadline", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={formData.duration} onChange={(e) => updateField("duration", e.target.value)}>
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
            <CardHeader><CardTitle>Location</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isRemote} onChange={(e) => updateField("isRemote", e.target.checked)} />
                <span className="text-sm">{t("remote")} - Freelancer can work from anywhere</span>
              </label>
              {!formData.isRemote && (
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Bangalore" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg">Publish Gig</Button>
            <Button type="button" variant="outline" size="lg">Save as Draft</Button>
          </div>
        </form>
      </main>
    </>
  );
}

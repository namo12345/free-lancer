"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FreelancerProfilePage() {
  const t = useTranslations("profile");
  const [formData, setFormData] = useState({
    displayName: "",
    headline: "",
    bio: "",
    hourlyRate: "",
    city: "",
    state: "",
    githubUrl: "",
    behanceUrl: "",
    linkedinUrl: "",
    upiId: "",
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const availableSkills = [
    "React", "Next.js", "TypeScript", "Node.js", "Python", "Figma",
    "UI Design", "Tailwind CSS", "PostgreSQL", "Docker", "AWS",
    "Flutter", "React Native", "Django", "FastAPI", "Machine Learning",
  ];

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill].slice(0, 15)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: call server action to save profile
    console.log("Save profile:", { ...formData, skills: selectedSkills });
  }

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">{t("editProfile")}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name *</Label>
                  <Input value={formData.displayName} onChange={(e) => updateField("displayName", e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label>{t("headline")}</Label>
                  <Input value={formData.headline} onChange={(e) => updateField("headline", e.target.value)} placeholder="Full-Stack Developer | 5+ years" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("bio")}</Label>
                <Textarea value={formData.bio} onChange={(e) => updateField("bio", e.target.value)} placeholder="Tell employers about your experience..." rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("hourlyRate")}</Label>
                  <Input type="number" value={formData.hourlyRate} onChange={(e) => updateField("hourlyRate", e.target.value)} placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Bangalore" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={formData.state} onChange={(e) => updateField("state", e.target.value)} placeholder="Karnataka" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader><CardTitle>{t("skills")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Select up to 15 skills</p>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}>
                    <Badge variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer">
                      {skill}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader><CardTitle>External Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input value={formData.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} placeholder="https://github.com/username" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={formData.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="space-y-2">
                  <Label>Behance</Label>
                  <Input value={formData.behanceUrl} onChange={(e) => updateField("behanceUrl", e.target.value)} placeholder="https://behance.net/username" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader><CardTitle>Payment Details (for Invoices)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input value={formData.upiId} onChange={(e) => updateField("upiId", e.target.value)} placeholder="yourname@upi" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg">Save Profile</Button>
        </form>
      </main>
    </>
  );
}

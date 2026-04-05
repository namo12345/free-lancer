"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEmployerProfile } from "@/server/actions/profile.actions";

interface EmployerProfileState {
  displayName: string;
  companyName: string;
  bio: string;
  website: string;
  industry: string;
  city: string;
  state: string;
}

export function EmployerProfileClient({
  initialProfile,
}: {
  initialProfile: EmployerProfileState;
}) {
  const [formData, setFormData] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function updateField<K extends keyof EmployerProfileState>(
    field: K,
    value: EmployerProfileState[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateEmployerProfile({
        displayName: formData.displayName.trim(),
        companyName: formData.companyName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        website: formData.website.trim(),
        industry: formData.industry.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
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
        <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>
        <p className="text-sm text-muted-foreground">
          Keep your company details accurate so freelancers and invoices show the right identity.
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
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                  required
                  placeholder="Aman Sharma"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="Acme Studio Pvt Ltd"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>About</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                placeholder="Tell freelancers what your company does and what kind of talent you hire."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input
                  value={formData.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  placeholder="Technology"
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
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}

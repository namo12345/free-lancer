"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployerProfilePage() {
  const [formData, setFormData] = useState({
    displayName: "",
    companyName: "",
    bio: "",
    website: "",
    industry: "",
    city: "",
    state: "",
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Save employer profile:", formData);
  }

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name *</Label>
                  <Input value={formData.displayName} onChange={(e) => updateField("displayName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>About</Label>
                <Textarea value={formData.bio} onChange={(e) => updateField("bio", e.target.value)} rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} placeholder="Technology" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={formData.state} onChange={(e) => updateField("state", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={formData.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://yourcompany.com" />
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg">Save Profile</Button>
        </form>
      </main>
    </>
  );
}

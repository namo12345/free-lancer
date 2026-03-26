"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Replace with server actions:
// import { syncGitHubPortfolio, addPortfolioItem, getPortfolioItems } from "@/server/actions/portfolio.actions";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  projectUrl: string;
  source: string;
  metadata?: { stars: number; forks: number; language: string };
}

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: "p1",
    title: "react-analytics-dashboard",
    description: "A modern analytics dashboard built with React, TypeScript, and Recharts. Features real-time data updates and dark mode.",
    thumbnailUrl: undefined,
    projectUrl: "https://github.com/user/react-analytics-dashboard",
    source: "github",
    metadata: { stars: 45, forks: 12, language: "TypeScript" },
  },
  {
    id: "p2",
    title: "fastapi-ml-service",
    description: "Production-ready ML serving API with FastAPI, featuring model versioning and batch predictions.",
    thumbnailUrl: undefined,
    projectUrl: "https://github.com/user/fastapi-ml-service",
    source: "github",
    metadata: { stars: 23, forks: 5, language: "Python" },
  },
  {
    id: "p3",
    title: "E-Commerce Landing Page",
    description: "A responsive landing page designed for a D2C brand targeting young Indian consumers.",
    thumbnailUrl: undefined,
    projectUrl: "https://dribbble.com/shots/example",
    source: "manual",
  },
];

export default function FreelancerPortfolioPage() {
  const [items, setItems] = useState(mockPortfolioItems);
  const [syncing, setSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    thumbnailUrl: "",
  });
  const [addingItem, setAddingItem] = useState(false);

  async function handleSyncGitHub() {
    setSyncing(true);
    // TODO: Replace with actual server action
    // const newItems = await syncGitHubPortfolio();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncing(false);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    setAddingItem(true);
    // TODO: Replace with actual server action
    // await addPortfolioItem(formData);
    const newItem = {
      id: `p${Date.now()}`,
      title: formData.title,
      description: formData.description || "",
      thumbnailUrl: formData.thumbnailUrl || undefined,
      projectUrl: formData.projectUrl || "",
      source: "manual" as const,
    };
    setItems([...items, newItem]);
    setFormData({ title: "", description: "", projectUrl: "", thumbnailUrl: "" });
    setShowAddForm(false);
    setAddingItem(false);
  }

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSyncGitHub}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync GitHub"}
            </Button>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add Item"}
            </Button>
          </div>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add Portfolio Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Project name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Project URL</Label>
                    <Input
                      value={formData.projectUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, projectUrl: e.target.value })
                      }
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Describe what you built and the technologies used..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnailUrl: e.target.value })
                    }
                    placeholder="https://example.com/screenshot.png"
                  />
                </div>
                <Button type="submit" disabled={addingItem}>
                  {addingItem ? "Adding..." : "Add to Portfolio"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Grid */}
        {items.length > 0 ? (
          <PortfolioGrid items={items} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No portfolio items yet</p>
            <p className="text-sm">
              Sync your GitHub repos or add projects manually to showcase your
              work.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

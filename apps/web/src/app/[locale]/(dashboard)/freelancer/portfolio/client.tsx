"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  syncGitHubPortfolio,
  addPortfolioItem,
  deletePortfolioItem,
} from "@/server/actions/portfolio.actions";

interface PortfolioItemData {
  id: string;
  title: string;
  description?: string;
  projectUrl?: string;
  thumbnailUrl?: string;
  source: string;
  sourceId?: string;
  metadata?: { stars?: number; forks?: number; language?: string };
  createdAt: string;
}

interface PortfolioClientProps {
  initialItems: PortfolioItemData[];
  githubUsername: string;
}

export function PortfolioClient({
  initialItems,
  githubUsername,
}: PortfolioClientProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    thumbnailUrl: "",
  });

  const [isSyncing, startSyncTransition] = useTransition();
  const [isAdding, startAddTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleSyncGitHub() {
    if (!githubUsername) {
      alert(
        "No GitHub username found. Please add your GitHub URL in your profile settings first."
      );
      return;
    }

    startSyncTransition(async () => {
      try {
        const result = await syncGitHubPortfolio(githubUsername);
        router.refresh();
        alert(`Synced ${result.synced} repositories from GitHub.`);
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to sync GitHub repos."
        );
      }
    });
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();

    startAddTransition(async () => {
      try {
        await addPortfolioItem({
          title: formData.title,
          description: formData.description || undefined,
          projectUrl: formData.projectUrl || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
        });
        setFormData({ title: "", description: "", projectUrl: "", thumbnailUrl: "" });
        setShowAddForm(false);
        router.refresh();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to add portfolio item."
        );
      }
    });
  }

  async function handleDelete(itemId: string) {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    setDeletingId(itemId);
    try {
      await deletePortfolioItem(itemId);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete portfolio item."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSyncGitHub}
            disabled={isSyncing}
          >
            {isSyncing ? "Syncing..." : "Sync GitHub"}
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
              <Button type="submit" disabled={isAdding}>
                {isAdding ? "Adding..." : "Add to Portfolio"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Grid with Delete Buttons */}
      {initialItems.length > 0 ? (
        <div className="space-y-4">
          <PortfolioGrid items={initialItems} />

          {/* Delete controls rendered separately below the grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialItems.map((item) => (
              <div key={item.id} className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No portfolio items yet</p>
          <p className="text-sm">
            Sync your GitHub repos or add projects manually to showcase your work.
          </p>
        </div>
      )}
    </>
  );
}

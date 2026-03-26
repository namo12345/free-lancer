"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  projectUrl?: string;
  source: string;
  metadata?: { stars?: number; forks?: number; language?: string };
}

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const sourceIcons: Record<string, string> = {
    github: "GitHub",
    behance: "Behance",
    dribbble: "Dribbble",
    manual: "Custom",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <a key={item.id} href={item.projectUrl || "#"} target="_blank" rel="noopener noreferrer">
          <Card className="hover:shadow-md transition-shadow h-full">
            {item.thumbnailUrl && (
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            {!item.thumbnailUrl && (
              <div className="aspect-video bg-gradient-to-br from-brand-50 to-blue-50 rounded-t-lg flex items-center justify-center">
                <span className="text-4xl text-brand-300">
                  {item.source === "github" ? "{ }" : item.source === "behance" ? "Be" : "◆"}
                </span>
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <Badge variant="outline" className="text-xs shrink-0 ml-2">{sourceIcons[item.source] || item.source}</Badge>
              </div>
              {item.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              )}
              {item.metadata && item.source === "github" && (
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  {item.metadata.stars !== undefined && <span>⭐ {item.metadata.stars}</span>}
                  {item.metadata.forks !== undefined && <span>🍴 {item.metadata.forks}</span>}
                  {item.metadata.language && <span>{item.metadata.language}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface SkillOption {
  id: string;
  name: string;
  category: string;
}

interface SkillSelectorProps {
  skills: SkillOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  maxSelected?: number;
  title: string;
  description?: string;
}

export function SkillSelector({
  skills,
  selectedIds,
  onChange,
  maxSelected = 15,
  title,
  description,
}: SkillSelectorProps) {
  const [query, setQuery] = useState("");

  const filteredSkills = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? skills.filter((skill) => {
          return (
            skill.name.toLowerCase().includes(needle) ||
            skill.category.toLowerCase().includes(needle)
          );
        })
      : skills;
  }, [query, skills]);

  const groupedSkills = useMemo(() => {
    const groups = new Map<string, SkillOption[]>();
    filteredSkills.forEach((skill) => {
      const group = groups.get(skill.category) || [];
      group.push(skill);
      groups.set(skill.category, group);
    });
    return Array.from(groups.entries());
  }, [filteredSkills]);

  function toggleSkill(skillId: string) {
    const isSelected = selectedIds.includes(skillId);
    if (isSelected) {
      onChange(selectedIds.filter((id) => id !== skillId));
      return;
    }
    if (selectedIds.length >= maxSelected) return;
    onChange([...selectedIds, skillId]);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills, tools, categories..."
          className="max-w-md"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {selectedIds.length}/{maxSelected} selected
        </span>
      </div>

      {groupedSkills.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills match your search.</p>
      ) : (
        <div className="space-y-4">
          {groupedSkills.map(([category, categorySkills]) => (
            <div key={category} className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => {
                  const isSelected = selectedIds.includes(skill.id);
                  const isDisabled = !isSelected && selectedIds.length >= maxSelected;

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      disabled={isDisabled}
                      className="disabled:cursor-not-allowed"
                    >
                      <Badge
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          isDisabled ? "opacity-50" : ""
                        }`}
                      >
                        {skill.name}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { prisma } from "@hiresense/db";
import { Sidebar } from "@/components/layout/sidebar";
import { PostGigClient } from "./client";

export default async function PostGigPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 max-w-5xl">
        <PostGigClient
          skills={skills.map((skill) => ({
            id: skill.id,
            name: skill.name,
            category: skill.category,
          }))}
        />
      </main>
    </>
  );
}

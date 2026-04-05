import { Sidebar } from "@/components/layout/sidebar";
import { ResearchClient } from "./client";

export default function ResearchPage() {
  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <ResearchClient />
      </main>
    </>
  );
}

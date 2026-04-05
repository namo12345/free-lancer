import { Sidebar } from "@/components/layout/sidebar";
import { ResearchClient } from "../../freelancer/research/client";

export default function EmployerResearchPage() {
  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <ResearchClient />
      </main>
    </>
  );
}

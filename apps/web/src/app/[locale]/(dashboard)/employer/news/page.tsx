import { Sidebar } from "@/components/layout/sidebar";
import { TechNewsClient } from "../../freelancer/news/client";

export default function EmployerTechNewsPage() {
  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <TechNewsClient />
      </main>
    </>
  );
}

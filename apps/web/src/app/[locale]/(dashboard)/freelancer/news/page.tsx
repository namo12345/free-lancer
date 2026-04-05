import { Sidebar } from "@/components/layout/sidebar";
import { TechNewsClient } from "./client";

export default function TechNewsPage() {
  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <TechNewsClient />
      </main>
    </>
  );
}

import { Sidebar } from "@/components/layout/sidebar";
import { getFreelancerDna } from "@/server/actions/dna.actions";
import { DnaClient } from "./client";

export default async function FreelancerDnaPage() {
  const dna = await getFreelancerDna();

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <DnaClient initialDna={dna} />
      </main>
    </>
  );
}

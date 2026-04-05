import { Sidebar } from "@/components/layout/sidebar";
import { getFreelancerMilestones } from "@/server/actions/milestone.actions";
import { FreelancerMilestonesClient } from "./client";

export default async function FreelancerMilestonesPage() {
  const gigs = await getFreelancerMilestones();

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Milestones</h1>
        <FreelancerMilestonesClient gigs={gigs} />
      </main>
    </>
  );
}

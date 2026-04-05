import { Sidebar } from "@/components/layout/sidebar";
import { getEmployerMilestones } from "@/server/actions/milestone.actions";
import { EmployerMilestonesClient } from "./client";

export default async function EmployerMilestonesPage() {
  const gigs = await getEmployerMilestones();

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Milestone Management</h1>
        <EmployerMilestonesClient gigs={gigs} />
      </main>
    </>
  );
}

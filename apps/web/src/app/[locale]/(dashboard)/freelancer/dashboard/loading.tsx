import { Sidebar } from "@/components/layout/sidebar";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";

export default function Loading() {
  return (
    <>
      <Sidebar role="freelancer" />
      <DashboardSkeleton />
    </>
  );
}

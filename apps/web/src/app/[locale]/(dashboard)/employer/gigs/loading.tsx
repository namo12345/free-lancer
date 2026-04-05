import { Sidebar } from "@/components/layout/sidebar";
import { ListSkeleton } from "@/components/ui/dashboard-skeleton";

export default function Loading() {
  return (
    <>
      <Sidebar role="employer" />
      <ListSkeleton />
    </>
  );
}

import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const user = authUser
    ? {
        email: authUser.email || "",
        displayName: authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
        avatarUrl: authUser.user_metadata?.avatar_url,
      }
    : { email: "guest@hiresense.com", displayName: "Guest User" };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="flex">
        {children}
      </div>
    </div>
  );
}

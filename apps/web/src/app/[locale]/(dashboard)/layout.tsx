import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@hiresense/db";
import { getMyNotifications } from "@/server/actions/notification.actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const dbUser = authUser
    ? await prisma.user.findUnique({
        where: { supabaseId: authUser.id },
        select: { role: true },
      })
    : null;

  const notifications = authUser ? await getMyNotifications(8) : [];

  const user = authUser
    ? {
        email: authUser.email || "",
        displayName: authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
        avatarUrl: authUser.user_metadata?.avatar_url,
        role: dbUser?.role ?? null,
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} notifications={notifications} />
      <div className="flex">
        {children}
      </div>
    </div>
  );
}

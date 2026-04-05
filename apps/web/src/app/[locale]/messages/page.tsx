import { getConversationsForUser } from "@/server/actions/dashboard.actions";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@hiresense/db";
import { MessagesClient } from "./client";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const dbUser = user
    ? await prisma.user.findUnique({
        where: { supabaseId: user.id },
        select: { id: true },
      })
    : null;

  let conversations: Awaited<ReturnType<typeof getConversationsForUser>> = [];
  if (user) {
    try {
      conversations = await getConversationsForUser();
    } catch {
      conversations = [];
    }
  }

  return (
    <MessagesClient
      initialConversations={conversations}
      currentUserId={dbUser?.id || ""}
    />
  );
}

"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

async function getDbUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { id: true },
  });
}

export async function getMyNotifications(limit = 10) {
  const dbUser = await getDbUser();
  if (!dbUser) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  }));
}

export async function markNotificationRead(notificationId: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: dbUser.id },
    data: { isRead: true },
  });

  return { success: true };
}

export async function markAllNotificationsRead() {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId: dbUser.id, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}

"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  const conversations = await prisma.conversation.findMany({
    where: { participantIds: { has: dbUser.id } },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return conversations;
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, email: true, freelancerProfile: { select: { displayName: true, avatarUrl: true } }, employerProfile: { select: { displayName: true, avatarUrl: true } } } },
    },
  });

  return messages;
}

export async function sendMessage(conversationId: string, receiverId: string, content: string, attachmentUrl?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: dbUser.id,
      receiverId,
      content,
      attachmentUrl,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  return message;
}

export async function createConversation(otherUserId: string, gigId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  // Check if conversation already exists
  const existing = await prisma.conversation.findFirst({
    where: {
      participantIds: { hasEvery: [dbUser.id, otherUserId] },
      ...(gigId ? { gigId } : {}),
    },
  });
  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      participantIds: [dbUser.id, otherUserId],
      gigId,
    },
  });
}

export async function markMessagesRead(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  await prisma.message.updateMany({
    where: { conversationId, receiverId: dbUser.id, isRead: false },
    data: { isRead: true },
  });
}

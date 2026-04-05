"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

function serializeMessage(message: {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: Date;
}) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    receiverId: message.receiverId,
    content: message.content,
    attachmentUrl: message.attachmentUrl,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
  };
}

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

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participantIds: { has: dbUser.id },
    },
    select: { id: true },
  });
  if (!conversation) throw new Error("Conversation not found");

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return messages.map(serializeMessage);
}

export async function sendMessage(conversationId: string, receiverId: string, content: string, attachmentUrl?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      AND: [
        { participantIds: { has: dbUser.id } },
        { participantIds: { hasSome: [receiverId] } },
      ],
    },
    select: { id: true },
  });
  if (!conversation) throw new Error("Conversation not found");

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

  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: "message",
      title: "New message",
      body: content.slice(0, 120),
      data: { conversationId, senderId: dbUser.id },
    },
  });

  return serializeMessage(message);
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

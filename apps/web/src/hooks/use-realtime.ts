"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      if (prev.some((existing) => existing.id === message.id)) {
        return prev;
      }

      return [...prev, message];
    });
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on("broadcast", { event: "new_message" }, (payload: { payload: Message }) => {
        appendMessage(payload.payload);
      })
      .on("broadcast", { event: "typing" }, () => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appendMessage, conversationId]);

  const broadcastMessage = useCallback((message: Message) => {
    if (!channelRef.current) return;

    channelRef.current.send({
      type: "broadcast",
      event: "new_message",
      payload: message,
    });
  }, []);

  const sendTyping = useCallback(() => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: {},
    });
  }, []);

  return { messages, setMessages, appendMessage, isTyping, broadcastMessage, sendTyping };
}

export function useRealtimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string; type: string; createdAt: string }[]>([]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on("broadcast", { event: "notification" }, (payload: { payload: typeof notifications[0] }) => {
        setNotifications((prev) => [payload.payload, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, setNotifications };
}

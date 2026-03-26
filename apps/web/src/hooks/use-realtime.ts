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

  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload as Message]);
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
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string, senderId: string, receiverId: string) => {
      if (!conversationId || !channelRef.current) return;

      const message: Message = {
        id: crypto.randomUUID(),
        conversationId,
        senderId,
        receiverId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      channelRef.current.send({
        type: "broadcast",
        event: "new_message",
        payload: message,
      });

      setMessages((prev) => [...prev, message]);
      return message;
    },
    [conversationId]
  );

  const sendTyping = useCallback(() => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: {},
    });
  }, []);

  return { messages, setMessages, isTyping, sendMessage, sendTyping };
}

export function useRealtimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string; type: string; createdAt: string }[]>([]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on("broadcast", { event: "notification" }, (payload) => {
        setNotifications((prev) => [payload.payload as typeof notifications[0], ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, setNotifications };
}

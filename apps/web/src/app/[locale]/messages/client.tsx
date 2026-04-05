"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";

interface Conversation {
  id: string;
  otherUser: { id: string; displayName: string; avatarUrl?: string };
  gigTitle?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export function MessagesClient({
  initialConversations,
  currentUserId,
}: {
  initialConversations: Conversation[];
  currentUserId: string;
}) {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const activeConv = initialConversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    if (!activeConvId && initialConversations.length > 0) {
      setActiveConvId(initialConversations[0].id);
    }
  }, [activeConvId, initialConversations]);

  return (
    <div className="min-h-screen bg-muted/50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {initialConversations.length === 0 ? (
              <div className="border rounded-lg p-8 text-center text-muted-foreground bg-white">
                <p className="font-medium">No conversations yet</p>
                <p className="text-sm mt-1">Start a conversation by messaging a freelancer or employer from a gig page.</p>
              </div>
            ) : (
              <ConversationList
                conversations={initialConversations}
                activeId={activeConvId || undefined}
                onSelect={setActiveConvId}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            {activeConv ? (
              <ChatWindow
                conversationId={activeConv.id}
                currentUserId={currentUserId}
                otherUser={activeConv.otherUser}
              />
            ) : (
              <div className="flex items-center justify-center h-[600px] border rounded-lg bg-white text-muted-foreground">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

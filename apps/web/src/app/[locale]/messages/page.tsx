"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";

const mockConversations = [
  {
    id: "c1",
    otherUser: { id: "u2", displayName: "TechCorp India", avatarUrl: undefined },
    gigTitle: "Build a React Dashboard",
    lastMessage: "Sure, I can start next week",
    lastMessageAt: "2026-03-16T10:30:00Z",
    unreadCount: 2,
  },
  {
    id: "c2",
    otherUser: { id: "u3", displayName: "Ananya S", avatarUrl: undefined },
    gigTitle: "Logo Design for D2C Brand",
    lastMessage: "Here are the initial concepts",
    lastMessageAt: "2026-03-15T16:00:00Z",
    unreadCount: 0,
  },
];

export default function MessagesPage() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const currentUserId = "u1"; // From auth in production

  const activeConv = mockConversations.find((c) => c.id === activeConvId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ email: "user@example.com", displayName: "Demo User" }} />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ConversationList
              conversations={mockConversations}
              activeId={activeConvId || undefined}
              onSelect={setActiveConvId}
            />
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

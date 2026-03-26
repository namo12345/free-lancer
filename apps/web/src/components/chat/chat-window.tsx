"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useRealtimeMessages } from "@/hooks/use-realtime";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: { id: string; displayName: string; avatarUrl?: string };
}

export function ChatWindow({ conversationId, currentUserId, otherUser }: ChatWindowProps) {
  const { messages, isTyping, sendMessage, sendTyping } = useRealtimeMessages(conversationId);
  const [input, setInput] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleInputChange(value: string) {
    setInput(value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping();
    typingTimeoutRef.current = setTimeout(() => {}, 2000);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input.trim(), currentUserId, otherUser.id);
    setInput("");
    setAttachmentUrl(null);
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar fallback={otherUser.displayName} src={otherUser.avatarUrl} size="sm" />
        <div>
          <div className="font-semibold text-sm">{otherUser.displayName}</div>
          {isTyping && <div className="text-xs text-brand-600 animate-pulse">typing...</div>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-20">
            No messages yet. Say hello!
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                <p className="text-sm">{msg.content}</p>
                {msg.attachmentUrl && (
                  <a href={msg.attachmentUrl} target="_blank" rel="noopener" className="text-xs underline mt-1 block">
                    Attachment
                  </a>
                )}
                <div className={`text-xs mt-1 ${isMine ? "text-white/70" : "text-gray-400"}`}>
                  {formatTime(msg.createdAt)}
                  {isMine && msg.isRead && " ✓✓"}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => document.getElementById("chat-file")?.click()}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </Button>
        <input id="chat-file" type="file" className="hidden" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setAttachmentUrl(URL.createObjectURL(file));
        }} />
        <Input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!input.trim()}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </Button>
      </form>
    </div>
  );
}

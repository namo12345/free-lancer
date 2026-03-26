"use client";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  otherUser: { displayName: string; avatarUrl?: string };
  gigTitle?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  function timeAgo(dateStr?: string) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Messages</h2>
      </div>
      <div className="divide-y max-h-[550px] overflow-y-auto">
        {conversations.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">No conversations yet</div>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3",
              activeId === conv.id && "bg-brand-50"
            )}
          >
            <Avatar fallback={conv.otherUser.displayName} src={conv.otherUser.avatarUrl} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm truncate">{conv.otherUser.displayName}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(conv.lastMessageAt)}</span>
              </div>
              {conv.gigTitle && <div className="text-xs text-brand-600 truncate">{conv.gigTitle}</div>}
              {conv.lastMessage && <div className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</div>}
            </div>
            {conv.unreadCount > 0 && (
              <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conv.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

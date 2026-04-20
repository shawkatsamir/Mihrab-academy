import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Img } from "@/shared/ui/Image";

const messages = [
  {
    id: 1,
    sender: "Parent (Yusuf A.)",
    avatar: "https://i.pravatar.cc/150?u=p1",
    text: "Will Yusuf have homework for today?",
    time: "10m ago",
    unread: true,
  },
  {
    id: 2,
    sender: "Fatima M.",
    avatar: "https://i.pravatar.cc/150?u=t2",
    text: "I have uploaded the new Tajweed materials.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    sender: "Omar S.",
    avatar: "https://i.pravatar.cc/150?u=t1",
    text: "Can we reschedule tomorrow's session?",
    time: "3h ago",
    unread: false,
  },
  {
    id: 4,
    sender: "Parent (Aisha K.)",
    avatar: "https://i.pravatar.cc/150?u=p2",
    text: "Thank you for the detailed feedback!",
    time: "1d ago",
    unread: false,
  },
  {
    id: 5,
    sender: "Hassan R.",
    avatar: "https://i.pravatar.cc/150?u=t3",
    text: "Student Ibrahim is making great progress.",
    time: "2d ago",
    unread: false,
  },
];

export function MessagesPanel() {
  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="bg-admin-card rounded-xl border border-admin-border shadow-sm flex flex-col">
      <div className="p-5 border-b border-admin-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-admin-text-primary flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-admin-text-secondary" />
          Messages
        </h2>
        {unreadCount > 0 && (
          <span className="bg-admin-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {unreadCount} New
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-admin-border">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "p-4 hover:bg-admin-hover/50 transition-colors cursor-pointer",
              msg.unread && "bg-admin-primary-light/20",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Img
                  src={msg.avatar}
                  alt={msg.sender}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                {msg.unread && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-admin-primary border-2 border-admin-card rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={cn(
                      "text-sm truncate",
                      msg.unread
                        ? "font-semibold text-admin-text-primary"
                        : "font-medium text-admin-text-secondary",
                    )}
                  >
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-admin-text-muted shrink-0 ml-2">
                    {msg.time}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs truncate",
                    msg.unread
                      ? "text-admin-text-primary font-medium"
                      : "text-admin-text-muted",
                  )}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-admin-border text-center">
        <button className="text-sm font-medium text-admin-text-secondary hover:text-admin-primary transition-colors">
          View all messages
        </button>
      </div>
    </div>
  );
}

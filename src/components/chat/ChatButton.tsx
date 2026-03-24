import { MessageCircle } from "lucide-react";

type ChatButtonProps = {
  onClick: () => void;
  unreadCount?: number;
};

export default function ChatButton({
  onClick,
  unreadCount = 0,
}: ChatButtonProps) {
  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <button
      type="button"
      className="global-chat-button"
      onClick={onClick}
      aria-label="Open messages"
    >
      <MessageCircle size={22} strokeWidth={2.2} />

      {unreadCount > 0 ? (
        <span className="global-chat-button__badge">{displayCount}</span>
      ) : null}
    </button>
  );
}

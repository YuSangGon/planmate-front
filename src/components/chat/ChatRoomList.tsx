import type { ChatRoomItem } from "../../services/requestChatApi";

type ChatRoomListProps = {
  rooms: ChatRoomItem[];
  selectedRequestId: string | null;
  onSelectRoom: (requestId: string) => void;
};

export default function ChatRoomList({
  rooms,
  selectedRequestId,
  onSelectRoom,
}: ChatRoomListProps) {
  return (
    <div className="chat-room-list">
      {rooms.length === 0 ? (
        <p className="chat-room-list__empty">No conversations yet.</p>
      ) : (
        rooms.map((room) => (
          <button
            key={room.requestId}
            type="button"
            className={
              selectedRequestId === room.requestId
                ? "chat-room-list__item chat-room-list__item--active"
                : "chat-room-list__item"
            }
            onClick={() => onSelectRoom(room.requestId)}
          >
            <div className="chat-room-list__top">
              <strong>{room.otherParticipant?.name ?? "Unknown"}</strong>
              <span>{room.destination}</span>
            </div>

            <div className="chat-room-list__meta">
              <span>{room.requestStatus}</span>
            </div>

            <p className="chat-room-list__preview">
              {room.lastMessage?.content ?? "No messages yet."}
            </p>
          </button>
        ))
      )}
    </div>
  );
}

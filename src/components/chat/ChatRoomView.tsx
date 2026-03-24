import { useMemo, useState, useRef, useEffect } from "react";
import { getSocket } from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";
import type { RequestChatResponse } from "../../services/requestChatApi";

type ChatRoomViewProps = {
  chat: RequestChatResponse | null;
  onAppendMessage: (message: RequestChatResponse["messages"][number]) => void;
};

function formatDateDivider(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getDateKey(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMinuteKey(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}-${hour}-${minute}`;
}

export default function ChatRoomView({
  chat,
  onAppendMessage,
}: ChatRoomViewProps) {
  const { token, user } = useAuth();

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewMessageNotice, setShowNewMessageNotice] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevLastMessageIdRef = useRef<string | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowNewMessageNotice(false);
  };

  const isNearBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return true;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom < 80;
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chat) return;

    const handleIncomingMessage = (payload: {
      requestId: string;
      message: RequestChatResponse["messages"][number];
    }) => {
      if (payload.requestId !== chat.requestId) return;

      onAppendMessage(payload.message);
    };

    socket.on("chat:message", handleIncomingMessage);

    return () => {
      socket.off("chat:message", handleIncomingMessage);
    };
  }, [chat, onAppendMessage]);

  useEffect(() => {
    if (!chat) return;

    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) return;

    const prevLastMessageId = prevLastMessageIdRef.current;

    if (!prevLastMessageId) {
      prevLastMessageIdRef.current = lastMessage.id;
      window.setTimeout(() => scrollToBottom("auto"), 0);
      return;
    }

    if (prevLastMessageId === lastMessage.id) {
      return;
    }

    const mine = !!user && lastMessage.sender?.id === user.id;
    const nearBottom = isNearBottom();

    if (mine || nearBottom) {
      window.setTimeout(() => scrollToBottom("smooth"), 0);
    } else {
      setShowNewMessageNotice(true);
    }

    prevLastMessageIdRef.current = lastMessage.id;
  }, [chat?.messages, user]);

  const otherParticipant = useMemo(() => {
    if (!chat || !user) return null;

    if (chat.participants.traveller.id === user.id) {
      return chat.participants.planner;
    }

    return chat.participants.traveller;
  }, [chat, user]);

  const handleSend = async () => {
    if (!token || !chat || !chat.canSend || !input.trim()) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const socket = getSocket();
      if (!socket) return;

      socket.emit("chat:send", {
        requestId: chat.requestId,
        content: input.trim(),
        userId: user?.id,
      });

      setInput("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleScroll = () => {
    if (isNearBottom()) {
      setShowNewMessageNotice(false);
    }
  };

  if (!chat) {
    return (
      <div className="chat-room-view chat-room-view--empty">
        <p>Select a conversation.</p>
      </div>
    );
  }

  return (
    <div className="chat-room-view">
      <div className="request-chat-panel__header">
        <div>
          <strong>{otherParticipant?.name ?? "Chat"}</strong>
          <p>{`Request status: ${chat.requestStatus}`}</p>
        </div>
      </div>

      <div className="request-chat-panel__body">
        {errorMessage ? (
          <p className="request-chat-panel__error">{errorMessage}</p>
        ) : null}

        <div className="request-chat-messages">
          {chat.messages.map((message, index) => {
            const prevMessage = index > 0 ? chat.messages[index - 1] : null;
            const nextMessage =
              index < chat.messages.length - 1
                ? chat.messages[index + 1]
                : null;

            const isMine = !!user && message.sender?.id === user.id;

            const showDateDivider =
              !prevMessage ||
              getDateKey(prevMessage.createdAt) !==
                getDateKey(message.createdAt);

            const showTime =
              !nextMessage ||
              getMinuteKey(nextMessage.createdAt) !==
                getMinuteKey(message.createdAt);

            if (message.isSystem) {
              return (
                <div key={message.id}>
                  {showDateDivider ? (
                    <div className="request-chat-date-divider">
                      <span>{formatDateDivider(message.createdAt)}</span>
                    </div>
                  ) : null}

                  <div className="request-chat-message request-chat-message--system">
                    {message.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id}>
                {showDateDivider ? (
                  <div className="request-chat-date-divider">
                    <span>{formatDateDivider(message.createdAt)}</span>
                  </div>
                ) : null}

                <div
                  className={
                    isMine
                      ? "request-chat-message-row request-chat-message-row--mine"
                      : "request-chat-message-row request-chat-message-row--other"
                  }
                >
                  {showTime && isMine ? (
                    <span className="request-chat-message__time">
                      {formatTime(message.createdAt)}
                    </span>
                  ) : null}
                  <div
                    className={
                      isMine
                        ? "request-chat-message request-chat-message--mine"
                        : "request-chat-message request-chat-message--other"
                    }
                  >
                    {/* <span className="request-chat-message__sender">
                      {message.sender?.name}
                    </span> */}
                    <p>{message.content}</p>
                  </div>

                  {showTime && !isMine ? (
                    <span className="request-chat-message__time">
                      {formatTime(message.createdAt)}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {showNewMessageNotice ? (
          <button
            type="button"
            className="request-chat-new-message-notice"
            onClick={() => scrollToBottom("smooth")}
          >
            New message ↓
          </button>
        ) : null}
      </div>

      <div className="request-chat-panel__footer">
        {!chat.canSend ? (
          <div className="request-chat-panel__readonly">
            This chat is read-only because the request is completed or
            cancelled.
          </div>
        ) : (
          <>
            <textarea
              rows={3}
              placeholder="Write a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSend}
              disabled={isSending || !input.trim()}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

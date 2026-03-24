import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getMyChatRooms,
  getRequestMessages,
  type ChatRoomItem,
  type RequestChatResponse,
} from "../../services/requestChatApi";
import ChatRoomList from "./ChatRoomList";
import ChatRoomView from "./ChatRoomView";
import "../../styles/Chat.css";
import { connectSocket, getSocket } from "../../lib/socket";

type ChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  initialRequestId?: string;
};

export default function ChatPanel({
  isOpen,
  onClose,
  initialRequestId,
}: ChatPanelProps) {
  const { token } = useAuth();

  const [rooms, setRooms] = useState<ChatRoomItem[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    initialRequestId ?? null,
  );
  const [selectedChat, setSelectedChat] = useState<RequestChatResponse | null>(
    null,
  );
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen || !token) return;

    const socket = connectSocket(token);

    return () => {
      socket.off("chat:error");
      socket.off("chat:message");
    };
  }, [isOpen, token]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedRequestId) return;

    socket.emit("chat:join", { requestId: selectedRequestId });

    return () => {
      socket.emit("chat:leave", { requestId: selectedRequestId });
    };
  }, [selectedRequestId]);

  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchRooms = async () => {
      try {
        setIsLoadingRooms(true);
        const response = await getMyChatRooms(token);
        setRooms(response.data);

        if (!selectedRequestId && response.data.length > 0) {
          setSelectedRequestId(initialRequestId ?? response.data[0].requestId);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load chat rooms",
        );
      } finally {
        setIsLoadingRooms(false);
      }
    };

    void fetchRooms();
  }, [isOpen, token, initialRequestId, selectedRequestId]);

  useEffect(() => {
    if (!isOpen || !token || !selectedRequestId) return;

    const fetchChat = async () => {
      try {
        setIsLoadingChat(true);
        const response = await getRequestMessages(token, selectedRequestId);
        setSelectedChat(response.data);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load chat",
        );
      } finally {
        setIsLoadingChat(false);
      }
    };

    void fetchChat();
  }, [isOpen, token, selectedRequestId]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedRequestId(initialRequestId ?? null);
  }, [initialRequestId, isOpen]);

  if (!isOpen) return null;

  return (
    <aside className="chat-panel">
      <div className="chat-panel__header">
        <strong>Messages</strong>
        <button type="button" className="chat-panel__close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="chat-panel__content">
        <div className="chat-panel__sidebar">
          {isLoadingRooms ? (
            <p className="chat-panel__state">Loading conversations...</p>
          ) : (
            <ChatRoomList
              rooms={rooms}
              selectedRequestId={selectedRequestId}
              onSelectRoom={setSelectedRequestId}
            />
          )}
        </div>

        <div className="chat-panel__main">
          {isLoadingChat ? (
            <p className="chat-panel__state">Loading chat...</p>
          ) : (
            <ChatRoomView
              chat={selectedChat}
              onAppendMessage={(message) =>
                setSelectedChat((prev) =>
                  prev
                    ? { ...prev, messages: [...prev.messages, message] }
                    : prev,
                )
              }
            />
          )}
        </div>
      </div>

      {errorMessage ? (
        <p className="chat-panel__error">{errorMessage}</p>
      ) : null}
    </aside>
  );
}

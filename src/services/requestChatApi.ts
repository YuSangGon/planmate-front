import { apiRequest } from "./api";

export type ChatParticipant = {
  id: string;
  name: string;
  role: "planner" | "traveller";
  email?: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  isSystem: boolean;
  createdAt: string;
  sender: ChatParticipant | null;
};

export type RequestChatResponse = {
  roomId: string | null;
  requestId: string;
  requestStatus: string;
  canSend: boolean;
  participants: {
    traveller: ChatParticipant;
    planner: ChatParticipant | null;
  };
  messages: ChatMessage[];
};

export type ChatRoomItem = {
  roomId: string;
  requestId: string;
  requestStatus: string;
  destination: string;
  updatedAt: string;
  canSend: boolean;
  otherParticipant: ChatParticipant | null;
  lastMessage: {
    content: string;
    createdAt: string;
    isSystem: boolean;
  } | null;
};

export async function getMyChatRooms(token: string) {
  return apiRequest<ChatRoomItem[]>(`/requests/chatRooms`, {
    method: "GET",
    token,
  });
}

export async function getRequestMessages(token: string, requestId: string) {
  return apiRequest<RequestChatResponse>(`/requests/${requestId}/messages`, {
    method: "GET",
    token,
  });
}

export async function sendRequestMessages(
  token: string,
  requestId: string,
  input: { content: string },
) {
  return apiRequest<ChatMessage>(`/requests/${requestId}/messages`, {
    method: "POST",
    token,
    body: input,
  });
}

import { apiRequest } from "./api";

export type RequestItem = {
  id: string;
  travellerId: string;
  plannerId?: string | null;
  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  duration: string;
  budget: string;
  offerCost: number;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
  status:
    | "open"
    | "matched"
    | "in_progress"
    | "delivered"
    | "completed"
    | "cancelled"
    | "submitted"
    | "completed";
  createdAt: string;
  updatedAt: string;
};

export type RequestProposalItem = {
  id: string;
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  planner: {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
    role: string;
  };
};

type CreateRequestPayload = {
  destination: string;
  duration: string;
  budget: string;
  offerCost: number;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
};

type AcceptProposalResponse = {
  success: true;
  data: {
    acceptedProposal: RequestProposalItem;
    rejectedProposalIds: string[];
    request: {
      id: string;
      plannerId: string;
      status: RequestItem["status"];
    };
  };
};

export async function getMyRequests(token: string) {
  return apiRequest<{ success: true; data: RequestItem[] }>("/requests", {
    method: "GET",
    token,
  });
}

export async function createRequest(
  token: string,
  payload: CreateRequestPayload,
) {
  return apiRequest<{ success: true; data: RequestItem }>("/requests", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function getRequestProposals(token: string, requestId: string) {
  return apiRequest<{ success: true; data: RequestProposalItem[] }>(
    `/requests/${requestId}/proposals`,
    {
      method: "GET",
      token,
    },
  );
}

export async function acceptProposal(token: string, proposalId: string) {
  return apiRequest<AcceptProposalResponse>(`/proposals/${proposalId}/accept`, {
    method: "POST",
    token,
  });
}

export async function rejectProposal(token: string, proposalId: string) {
  return apiRequest<{ success: true; data: unknown }>(
    `/proposals/${proposalId}/reject`,
    {
      method: "POST",
      token,
    },
  );
}

export async function completeRequest(token: string, requestId: string) {
  return apiRequest<{ success: true; data: RequestItem }>(
    `/requests/${requestId}/complete`,
    {
      method: "POST",
      token,
    },
  );
}

import { apiRequest } from "./api";
// import { emitUserNotification } from "../lib/socket";

type ProposalItem = {
  id: string;
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  planner: {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
    role: string;
  };
};

export async function getRequestProposals(token: string, requestId: string) {
  return apiRequest<{
    success: true;
    data: ProposalItem[];
  }>(`/requests/${requestId}/proposals`, {
    method: "GET",
    token,
  });
}

export async function acceptProposal(token: string, proposalId: string) {
  return apiRequest(`/proposals/${proposalId}/accept`, {
    method: "POST",
    token,
  });
}

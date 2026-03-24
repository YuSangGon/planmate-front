import { apiRequest } from "./api";
// import { emitUserNotification } from "../lib/socket";

export async function getRequestProposals(token: string, requestId: string) {
  return apiRequest(`/requests/${requestId}/proposals`, {
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

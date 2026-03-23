import { apiRequest } from "./api";

export async function getBrowseRequests(token: string) {
  return apiRequest("/requests/open", {
    method: "GET",
    token,
  });
}

export async function getBrowseRequestDetail(token: string, requestId: string) {
  return apiRequest(`/requests/open/${requestId}`, {
    method: "GET",
    token,
  });
}

export async function createProposal(
  token: string,
  requestId: string,
  payload: {
    message: string;
    proposedPrice?: number;
    estimatedDays?: number;
  },
) {
  return apiRequest(`/proposals/requests/${requestId}`, {
    method: "POST",
    token,
    body: payload,
  });
}

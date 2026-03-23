import { apiRequest } from "./api";

export type PlannerSentProposalItem = {
  id: string;
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  request: {
    id: string;
    destination: string;
    duration: string;
    budget: string;
    offerCost: number;
    status: string;
    traveller: {
      id: string;
      name: string;
    };
  };
};

export type PlannerSentProposalDetail = {
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
  };
  request: {
    id: string;
    destination: string;
    duration: string;
    budget: string;
    offerCost: number;
    travelStyle: string;
    interests: string[];
    extraNotes?: string | null;
    status: string;
    traveller: {
      id: string;
      name: string;
      email: string;
      bio?: string | null;
    };
  };
};

export type PlannerReceivedProposalItem = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string | null;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  traveller: {
    id: string;
    name: string;
    email: string;
  };
};

export type PlannerReceivedProposalDetail = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string | null;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  traveller: {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
  };
  planner: {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
  };
};

export async function getPlannerSentProposals(token: string) {
  return apiRequest<{ success: true; data: PlannerSentProposalItem[] }>(
    "/planner-proposals/sent",
    { method: "GET", token },
  );
}

export async function getPlannerReceivedProposals(token: string) {
  return apiRequest<{ success: true; data: PlannerReceivedProposalItem[] }>(
    "/planner-proposals/received",
    { method: "GET", token },
  );
}

export async function getPlannerSentProposalDetail(
  token: string,
  proposalId: string,
) {
  return apiRequest<{ success: true; data: PlannerSentProposalDetail }>(
    `/planner-proposals/sent/${proposalId}`,
    { method: "GET", token },
  );
}

export async function updatePlannerSentProposal(
  token: string,
  proposalId: string,
  payload: {
    message: string;
    proposedPrice?: number;
    estimatedDays?: number;
  },
) {
  return apiRequest<{ success: true; data: PlannerSentProposalDetail }>(
    `/planner-proposals/sent/${proposalId}`,
    {
      method: "PATCH",
      token,
      body: payload,
    },
  );
}

export async function deletePlannerSentProposal(
  token: string,
  proposalId: string,
) {
  return apiRequest<{ success: true; data: { id: string } }>(
    `/planner-proposals/sent/${proposalId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export async function withdrawPlannerSentProposal(
  token: string,
  proposalId: string,
) {
  return apiRequest<{ success: true; data: unknown }>(
    `/planner-proposals/sent/${proposalId}/withdraw`,
    {
      method: "POST",
      token,
    },
  );
}

export async function getPlannerReceivedProposalDetail(
  token: string,
  proposalId: string,
) {
  return apiRequest<{ success: true; data: PlannerReceivedProposalDetail }>(
    `/planner-proposals/received/${proposalId}`,
    { method: "GET", token },
  );
}

export async function acceptPlannerReceivedProposal(
  token: string,
  proposalId: string,
) {
  return apiRequest<{ success: true; data: unknown }>(
    `/planner-proposals/received/${proposalId}/accept`,
    {
      method: "POST",
      token,
    },
  );
}

export async function rejectPlannerReceivedProposal(
  token: string,
  proposalId: string,
) {
  return apiRequest<{ success: true; data: unknown }>(
    `/planner-proposals/received/${proposalId}/reject`,
    {
      method: "POST",
      token,
    },
  );
}

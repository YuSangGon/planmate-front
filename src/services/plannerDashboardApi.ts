import { apiRequest } from "./api";

export type SentProposalItem = {
  id: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  createdAt: string;
  request: {
    id: string;
    destination: string;
    duration: string;
    budget: string;
    status: string;
    traveller: {
      id: string;
      name: string;
    };
  };
};

export type ReceivedDirectProposalItem = {
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

export type PlannerOwnPlanItem = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  visibility: "public" | "private";
  summary: string;
  tags: string[];
  createdAt: string;
  request?: {
    id: string;
    destination: string;
    status: string;
  } | null;
};

export type PlannerReviewItem = {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  traveller: {
    id: string;
    name: string;
  };
};

export async function getPlannerSentProposals(token: string) {
  return apiRequest<{ success: true; data: SentProposalItem[] }>(
    "/dashboard/planner/sent-proposals",
    {
      method: "GET",
      token,
    },
  );
}

export async function getPlannerReceivedDirectProposals(token: string) {
  return apiRequest<{ success: true; data: ReceivedDirectProposalItem[] }>(
    "/dashboard/planner/received-direct-proposals",
    {
      method: "GET",
      token,
    },
  );
}

export async function getPlannerOwnPlans(token: string) {
  return apiRequest<{ success: true; data: PlannerOwnPlanItem[] }>(
    "/dashboard/planner/plans",
    {
      method: "GET",
      token,
    },
  );
}

export async function getPlannerReceivedReviews(token: string) {
  return apiRequest<{ success: true; data: PlannerReviewItem[] }>(
    "/dashboard/planner/reviews",
    {
      method: "GET",
      token,
    },
  );
}

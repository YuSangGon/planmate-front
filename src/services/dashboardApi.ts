import { apiRequest } from "./api";

export type DashboardStats = {
  requestsCount: number;
  proposalsCount: number;
  myPlansCount: number;
  completedPlansCount: number;
};

export type DashboardPlannerReviewSummary = {
  reviewCount: number;
  rating: number;
  planQuality: number;
  communication: number;
  timeliness: number;
  personalisation: number;
  practicality: number;
  detailLevel: number;
  strengths: string;
};

export type DashboardRequestItem = {
  id: string;
  destination: string;
  status: string;
  duration: string;
  budget: string;
  createdAt: string;
};

export type DashboardProposalItem = {
  id: string;
  requestId: string;
  destination: string;
  travellerName: string;
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  status: string;
  createdAt: string;
};

export type DashboardPlanReviewItem = {
  id: string;
  overallRating: number;
  content: string;
  createdAt: string;
  traveller?: {
    id: string;
    name: string;
  };
};

export type DashboardPlanItem = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  visibility: string;
  summary: string;
  reviews: DashboardPlanReviewItem[];
};

type DashboardOverviewResponse = {
  success: true;
  data: {
    stats: DashboardStats;
    plannerReviewSummary: DashboardPlannerReviewSummary | null;
  };
};

type DashboardRequestsResponse = {
  success: true;
  data: DashboardRequestItem[];
};

type DashboardProposalsResponse = {
  success: true;
  data: DashboardProposalItem[];
};

type DashboardPlansResponse = {
  success: true;
  data: DashboardPlanItem[];
};

export async function getDashboardOverview(token: string) {
  return apiRequest<DashboardOverviewResponse>("/dashboard/overview", {
    method: "GET",
    token,
  });
}

export async function getDashboardRequests(token: string) {
  return apiRequest<DashboardRequestsResponse>("/dashboard/requests", {
    method: "GET",
    token,
  });
}

export async function getDashboardProposals(token: string) {
  return apiRequest<DashboardProposalsResponse>("/dashboard/proposals", {
    method: "GET",
    token,
  });
}

export async function getDashboardPlans(token: string) {
  return apiRequest<DashboardPlansResponse>("/dashboard/plans", {
    method: "GET",
    token,
  });
}

import { apiRequest } from "./api";

export type PlannerReviewSummary = {
  id: string;
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

export type PlannerListItem = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  rating: string;
  reviews: string;
  completedPlans: number;
  plannerReviewSummary: PlannerReviewSummary;
};

export type PlannerPlan = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  summary: string;
  tags: string[];
};

export type PlannerReview = {
  id: string;
  overallRating: number;
  planQuality: number;
  communication: number;
  timeliness: number;
  personalisation: number;
  practicality: number;
  detailLevel: number;
  content: string;
  createdAt: string;
  traveller?: {
    id: string;
    name: string;
  };
};

export type PlannerProfile = {
  id: string;
  name: string;
  description: string;
  completedPlans: number;
  strengths: string;
  plannerReviewSummary: PlannerReviewSummary;
  plannerPlans: PlannerPlan[];
  plannerReviews: PlannerReview[];
};

type PlannerListResponse = {
  success: true;
  data: PlannerListItem[];
};

type PlannerDetailResponse = {
  success: true;
  data: PlannerProfile;
};

type DirectProposalPayload = {
  title: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
};

export async function getPlannerList() {
  return apiRequest<PlannerListResponse>("/planners", {
    method: "GET",
  });
}

export async function getPlannerDetail(plannerId: string) {
  return apiRequest<PlannerDetailResponse>(`/planners/${plannerId}`, {
    method: "GET",
  });
}

export async function createPlannerDirectProposal(
  token: string,
  plannerId: string,
  payload: DirectProposalPayload,
) {
  return apiRequest(`/planners/${plannerId}/direct-proposals`, {
    method: "POST",
    token,
    body: payload,
  });
}

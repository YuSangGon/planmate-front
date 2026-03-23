import { apiRequest } from "./api";

export type PlannerListItem = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  rating: string;
  reviews: string;
  completedPlans: number;
};

export type PlannerProfilePlan = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  summary: string;
  tags: string[];
};

export type PlannerProfileReview = {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};

export type PlannerProfile = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  rating: string;
  reviews: string;
  completedPlans: number;
  responseRate: string;
  location: string;
  intro: string;
  strengths: string[];
  plannerPlans: PlannerProfilePlan[];
  plannerReviews: PlannerProfileReview[];
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

import { apiRequest } from "./api";

export type PlanItem = {
  id: string;
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  tags: string[];
  createdAt?: string;
  planner?: {
    id: string;
    name: string;
  };
};

export type PlanDetail = {
  id: string;
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  tags: string[];
  createdAt?: string;
  salePrice: number;
  planner: {
    id: string;
    name: string;
    bio?: string | null;
    specialty?: string | null;
  };
  request?: {
    id: string;
    destination: string;
    status: string;
  } | null;
  planReviewSummary?: {
    reviewCount: number;
    rating: number;
    planQuality: number;
    practicality: number;
    detailLevel: number;
    updatedAt: string;
  } | null;

  planReviews?: ReviewType[];
};

export type ReviewType = {
  id: string;
  user: {
    id: string;
    name: string;
  };
  overallRating: number;
  planQuality: number;
  practicality: number;
  detailLevel: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "submitted";
};

export type CreatePlanPayload = {
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  tags: string[];
};

export async function getPlans() {
  return apiRequest<{ success: true; data: PlanItem[] }>("/plans", {
    method: "GET",
  });
}

export async function getMyPlans(token: string) {
  return apiRequest<{ success: true; data: PlanItem[] }>("/plans/me", {
    method: "GET",
    token,
  });
}

export async function getPlanDetail(token: string, planId: string) {
  return apiRequest<{
    success: true;
    isGotPlan: boolean;
    data: PlanDetail;
    myReview: ReviewType;
  }>(`/plans/${planId}`, {
    method: "GET",
    token,
  });
}

export async function createPlan(token: string, payload: CreatePlanPayload) {
  return apiRequest<{ success: true; data: unknown }>("/plans", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function purchasePlan(
  token: string,
  planId: string,
  salePrice: number,
) {
  return apiRequest<{ success: true; data: unknown }>("/plans/purchase", {
    method: "POST",
    token,
    body: {
      planId: planId,
      salePrice: salePrice,
    },
  });
}

export async function updatePlan(
  token: string,
  planId: string,
  payload: CreatePlanPayload,
) {
  return apiRequest<{ success: true; data: unknown }>(`/plans/${planId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function deletePlan(token: string, planId: string) {
  return apiRequest<{ success: true; data: { id: string } }>(
    `/plans/${planId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

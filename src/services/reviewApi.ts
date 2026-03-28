import { apiRequest } from "./api";

export type PlannerReviewPayload = {
  requestId: string;
  overallRating: number;
  planQuality: number;
  communication: number;
  timeliness: number;
  personalisation: number;
  practicality: number;
  detailLevel: number;
  content: string;
};

export async function getPlannerReviewForRequest(
  token: string,
  requestId: string,
) {
  return apiRequest<{ success: true; data: PlannerReviewPayload }>(
    `/review/${requestId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function createPlannerReview(
  token: string,
  payload: PlannerReviewPayload,
) {
  return apiRequest(`/review/planner`, {
    method: "POST",
    token,
    body: payload,
  });
}

export async function editPlannerReview(
  token: string,
  payload: PlannerReviewPayload,
) {
  return apiRequest(`/review/planner`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

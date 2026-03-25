import { apiRequest } from "./api";

export type CreateReviewPayload = {
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

export async function createReview(
  token: string,
  payload: CreateReviewPayload,
) {
  return apiRequest(`/reviews`, {
    method: "POST",
    token,
    body: payload,
  });
}

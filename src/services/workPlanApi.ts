import { apiRequest } from "./api";

export type WorkPlanContent = {
  days: Array<{
    title: string;
    items: Array<{
      time?: string;
      title: string;
      note?: string;
    }>;
  }>;
};

export type WorkPlan = {
  id: string;
  requestId?: string | null;
  plannerId: string;
  travellerId?: string | null;
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  status: "draft" | "submitted" | "approved";
  tags: string[];
  content?: WorkPlanContent | null;
  planner?: {
    id: string;
    name: string;
    bio?: string | null;
    specialty?: string | null;
  };
};

export async function getPlannerWorkPlan(token: string, requestId: string) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/requests/${requestId}/work-plan`,
    {
      method: "GET",
      token,
    },
  );
}

export async function updatePlannerWorkPlan(
  token: string,
  requestId: string,
  payload: {
    title: string;
    summary: string;
    duration: string;
    tags: string[];
    content: WorkPlanContent;
  },
) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/requests/${requestId}/work-plan`,
    {
      method: "PATCH",
      token,
      body: payload,
    },
  );
}

export async function submitPlannerWorkPlan(token: string, requestId: string) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/requests/${requestId}/work-plan/submit`,
    {
      method: "POST",
      token,
    },
  );
}

export async function getTravellerPreviewPlan(
  token: string,
  requestId: string,
) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/requests/${requestId}/preview-plan`,
    {
      method: "GET",
      token,
    },
  );
}

export async function approveTravellerPreviewPlan(
  token: string,
  requestId: string,
) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/requests/${requestId}/preview-plan/approve`,
    {
      method: "POST",
      token,
    },
  );
}

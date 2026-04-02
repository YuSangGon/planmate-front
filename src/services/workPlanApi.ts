import { apiRequest } from "./api";

export type WorkPlanHotelOption = {
  name: string;
  location: string;
  priceRange: string;
  bookingLink?: string;
  summary: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
};

export type WorkPlanScheduleItem = {
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  description: string;
  fee: string;
  estimatedCost: string;
  transport: string;
  durationNote: string;
  tips: string;
};

export type WorkPlanDay = {
  title: string;
  dateLabel: string;
  summary: string;
  items: WorkPlanScheduleItem[];
};

export type WorkPlanContent = {
  preparation: {
    visaInfo: string;
    documents: string;
    transportToAirport: string;
    simWifi: string;
    moneyTips: string;
    packingTips: string;
    otherTips: string;
  };
  hotels: WorkPlanHotelOption[];
  days: WorkPlanDay[];
  extras: {
    localTransport: string;
    reservations: string;
    emergencyInfo: string;
    finalNotes: string;
  };
};

export type WorkPlan = {
  id: string;
  requestId: string;
  plannerId: string;
  status: "draft" | "submitted" | "approved";
  content: WorkPlanContent | null;
  planner?: {
    id: string;
    name: string;
    bio?: string | null;
  } | null;
};

export type WorkPlanPreviewSample = {
  dayTitle: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  description: string;
  fee: string;
  estimatedCost: string;
  transport: string;
  tips: string;
};

export type WorkPlanPreviewContent = {
  preparation: {
    visaInfo: string;
    documents: string;
    transportToAirport: string;
    simWifi: string;
    moneyTips: string;
    packingTips: string;
    otherTips: string;
  };
  hotels: {
    name: string;
    location: string;
    priceRange: string;
    summary: string;
    bookingLink: string;
    pros: string[];
    cons: string[];
    recommended: boolean;
  }[];
  days: WorkPlanDay[];
  extras: {
    localTransport: string;
    reservations: string;
    emergencyInfo: string;
    finalNotes: string;
  };
};

export type WorkPlanPreview = {
  id: string;
  requestId: string;
  status: "draft" | "submitted" | "approved";
  planner?: {
    id: string;
    name: string;
    bio?: string | null;
  } | null;
  previewContent: WorkPlanPreviewContent;
};

export type PlanPreview = {
  id: string;
  previewContent: WorkPlanPreviewContent;
};

export type Plan = {
  id: string;
  content: WorkPlanPreviewContent;
};

export type PlanInfo = {
  title: string;
  destination: string;
  summary: string;
  price: number;
  duration: string;
  visibility: "public" | "private";
  tags: string[];
};

export async function getPlannerWorkPlan(token: string, requestId: string) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/work-plan/${requestId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function editWorkPlan(
  token: string,
  planId: string,
  payload: {
    planInfo: PlanInfo;
    content: WorkPlanContent;
  },
) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/work-plan/edit/${planId}`,
    {
      method: "PATCH",
      token,
      body: payload,
    },
  );
}

export async function updatePlannerWorkPlan(
  token: string,
  requestId: string,
  payload: {
    content: WorkPlanContent;
  },
) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/work-plan/${requestId}`,
    {
      method: "PATCH",
      token,
      body: payload,
    },
  );
}

export async function createWorkPlan(token: string, data: PlanInfo) {
  return apiRequest<{ success: true; data: { id: string } }>(
    `/work-plan/create`,
    {
      method: "POST",
      token,
      body: data,
    },
  );
}

export async function getWorkPlanInfo(token: string, planId: string) {
  return apiRequest<{ success: true; data: PlanInfo }>(
    `/work-plan/create/${planId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function submitPlannerWorkPlan(token: string, requestId: string) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/work-plan/${requestId}/submit`,
    {
      method: "POST",
      token,
    },
  );
}

export async function completeWorkPlan(token: string, planId: string) {
  return apiRequest<{ success: true; data: WorkPlan }>(
    `/work-plan/complete/${planId}`,
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
  return apiRequest<{ success: true; data: WorkPlanPreview }>(
    `/work-plan/${requestId}/preview-plan`,
    {
      method: "GET",
      token,
    },
  );
}

export async function getPublicPlanPrieview(planId: string) {
  return apiRequest<{ success: true; data: PlanPreview }>(
    `/work-plan/preview-plan/${planId}`,
    {
      method: "GET",
    },
  );
}

export async function getPrivatePlanPrieview(requestId: string, token: string) {
  return apiRequest<{ success: true; data: PlanPreview }>(
    `/work-plan/preview-request-plan/${requestId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function getPublicPlan(planId: string, token: string) {
  return apiRequest<{ success: true; data: Plan }>(
    `/work-plan/detail/${planId}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function getPrivatePlan(requestId: string, token: string) {
  return apiRequest<{ success: true; data: Plan }>(
    `/work-plan/request-detail/${requestId}`,
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
    `/work-plan/${requestId}/preview-plan/approve`,
    {
      method: "POST",
      token,
    },
  );
}

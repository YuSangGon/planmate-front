import { apiRequest } from "./api";

// export type WorkPlanContent = {
//   days: Array<{
//     title: string;
//     items: Array<{
//       time?: string;
//       title: string;
//       note?: string;
//     }>;
//   }>;
// };

// export type WorkPlan = {
//   id: string;
//   requestId?: string | null;
//   plannerId: string;
//   travellerId?: string | null;
//   title: string;
//   destination: string;
//   summary: string;
//   price: number;
//   duration: string;
//   visibility: "public" | "private";
//   status: "draft" | "submitted" | "approved";
//   tags: string[];
//   content?: WorkPlanContent | null;
//   planner?: {
//     id: string;
//     name: string;
//     bio?: string | null;
//     specialty?: string | null;
//   };
// };

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
  overview: {
    destinationSummary: string;
    recommendedBudget: string;
    bestFor: string;
    notes: string;
  };
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
  title: string;
  summary: string;
  duration: string;
  destination: string;
  status: "draft" | "submitted" | "approved";
  tags: string[];
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
  overview: {
    destinationSummary: string;
  } | null;
  preparation: {
    visaInfo: string;
    transportToAirport: string;
  } | null;
  recommendedHotel: {
    name: string;
    location: string;
    priceRange: string;
    summary: string;
    pros: string[];
    cons: string[];
  } | null;
  randomSamples: WorkPlanPreviewSample[];
};

export type WorkPlanPreview = {
  id: string;
  requestId: string;
  title: string;
  summary: string;
  duration: string;
  destination: string;
  status: "draft" | "submitted" | "approved";
  planner?: {
    id: string;
    name: string;
    bio?: string | null;
  } | null;
  previewContent: WorkPlanPreviewContent | null;
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

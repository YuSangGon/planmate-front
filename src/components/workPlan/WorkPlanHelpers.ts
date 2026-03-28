import type { WorkPlanContent } from "../../services/workPlanApi";

export function createEmptyScheduleItem() {
  return {
    startTime: "",
    endTime: "",
    place: "",
    title: "",
    description: "",
    fee: "",
    estimatedCost: "",
    transport: "",
    durationNote: "",
    tips: "",
  };
}

export function createEmptyDay(dayNumber: number) {
  return {
    title: `Day ${dayNumber}`,
    dateLabel: "",
    summary: "",
    items: [],
  };
}

export function createEmptyHotelOption(recommended = false) {
  return {
    name: "",
    location: "",
    priceRange: "",
    bookingLink: "",
    summary: "",
    pros: [],
    cons: [],
    recommended,
  };
}

export function createEmptyContent(): WorkPlanContent {
  return {
    preparation: {
      visaInfo: "",
      documents: "",
      transportToAirport: "",
      simWifi: "",
      moneyTips: "",
      packingTips: "",
      otherTips: "",
    },
    hotels: [createEmptyHotelOption(true)],
    days: [createEmptyDay(1)],
    extras: {
      localTransport: "",
      reservations: "",
      emergencyInfo: "",
      finalNotes: "",
    },
  };
}

export function normalizeWorkPlanContent(
  raw?: Partial<WorkPlanContent> | null,
): WorkPlanContent {
  const base = createEmptyContent();

  return {
    preparation: {
      ...base.preparation,
      ...(raw?.preparation ?? {}),
    },
    hotels: raw?.hotels?.length
      ? raw.hotels.map((hotel, index) => ({
          ...createEmptyHotelOption(index === 0),
          ...hotel,
          pros: hotel.pros ?? [],
          cons: hotel.cons ?? [],
        }))
      : base.hotels,
    days: raw?.days?.length
      ? raw.days.map((day, dayIndex) => ({
          ...createEmptyDay(dayIndex + 1),
          ...day,
          items: day.items?.length
            ? day.items.map((item) => ({
                ...createEmptyScheduleItem(),
                ...item,
              }))
            : [createEmptyScheduleItem()],
        }))
      : base.days,
    extras: {
      ...base.extras,
      ...(raw?.extras ?? {}),
    },
  };
}

export function sortScheduleItems<
  T extends { startTime?: string; endTime?: string },
>(items: T[]) {
  return [...items].sort((a, b) => {
    const aKey = `${a.startTime ?? ""}-${a.endTime ?? ""}`;
    const bKey = `${b.startTime ?? ""}-${b.endTime ?? ""}`;
    return aKey.localeCompare(bKey);
  });
}

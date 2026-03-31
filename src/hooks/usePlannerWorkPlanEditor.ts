import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WorkPlanContent } from "../services/workPlanApi";
import {
  getPlannerWorkPlan,
  submitPlannerWorkPlan,
  updatePlannerWorkPlan,
  editWorkPlan,
  completeWorkPlan,
  type PlanInfo,
} from "../services/workPlanApi";
import {
  createEmptyContent,
  createEmptyDay,
  createEmptyHotelOption,
  createEmptyScheduleItem,
  normalizeWorkPlanContent,
  sortScheduleItems,
} from "../components/workPlan/workPlanHelpers";
import { useToast } from "../context/ToastContext";

type UsePlannerWorkPlanEditorParams = {
  token: string | null;
  requestId?: string;
  planId?: string;
};

export function usePlannerWorkPlanEditor({
  token,
  requestId,
  planId,
}: UsePlannerWorkPlanEditorParams) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [content, setContent] = useState<WorkPlanContent>(createEmptyContent());
  const [planInfo, setPlanInfo] = useState<PlanInfo>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [quickAddDrafts, setQuickAddDrafts] = useState<
    Record<number, ReturnType<typeof createEmptyScheduleItem>>
  >({});

  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [advancedDraft, setAdvancedDraft] = useState(createEmptyScheduleItem());

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token || !requestId || requestId === "planCreate") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlannerWorkPlan(token, requestId);
        const plan = response.data;
        setContent(normalizeWorkPlanContent(plan.content));
        setIsEdit(plan.status === "submitted");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load work plan",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlan();
  }, [token, requestId]);

  const getQuickAddDraft = (dayIndex: number) =>
    quickAddDrafts[dayIndex] ?? createEmptyScheduleItem();

  const updateQuickAddDraft = (
    dayIndex: number,
    field: keyof ReturnType<typeof createEmptyScheduleItem>,
    value: string,
  ) => {
    setQuickAddDrafts((prev) => ({
      ...prev,
      [dayIndex]: {
        ...(prev[dayIndex] ?? createEmptyScheduleItem()),
        [field]: value,
      },
    }));
  };

  const resetQuickAddDraft = (dayIndex: number) => {
    setQuickAddDrafts((prev) => ({
      ...prev,
      [dayIndex]: createEmptyScheduleItem(),
    }));
  };

  const handleQuickAddSchedule = (dayIndex: number) => {
    const draft = getQuickAddDraft(dayIndex);

    if (!draft.startTime || !draft.endTime || !draft.title.trim()) {
      setErrorMessage("Start time, end time, and activity title are required.");
      return;
    }

    setErrorMessage("");

    setContent((prev) => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: sortScheduleItems([...day.items, draft]),
            }
          : day,
      ),
    }));

    resetQuickAddDraft(dayIndex);
  };

  const openAdvancedEditor = (dayIndex: number, itemIndex: number) => {
    const item = content.days[dayIndex]?.items[itemIndex];
    if (!item) return;

    setEditingDayIndex(dayIndex);
    setEditingItemIndex(itemIndex);
    setAdvancedDraft({ ...createEmptyScheduleItem(), ...item });
  };

  const closeAdvancedEditor = () => {
    setEditingDayIndex(null);
    setEditingItemIndex(null);
    setAdvancedDraft(createEmptyScheduleItem());
  };

  const updateAdvancedDraft = (
    field: keyof ReturnType<typeof createEmptyScheduleItem>,
    value: string,
  ) => {
    setAdvancedDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveAdvancedEdit = () => {
    if (editingDayIndex === null || editingItemIndex === null) return;

    if (
      !advancedDraft.startTime ||
      !advancedDraft.endTime ||
      !advancedDraft.title.trim()
    ) {
      setErrorMessage("Start time, end time, and activity title are required.");
      return;
    }

    setErrorMessage("");

    setContent((prev) => ({
      ...prev,
      days: prev.days.map((day, dIndex) => {
        if (dIndex !== editingDayIndex) return day;

        const nextItems = day.items.map((item, iIndex) =>
          iIndex === editingItemIndex ? advancedDraft : item,
        );

        return {
          ...day,
          items: sortScheduleItems(nextItems),
        };
      }),
    }));

    closeAdvancedEditor();
  };

  const updatePreparationField = (
    field: keyof WorkPlanContent["preparation"],
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      preparation: {
        ...prev.preparation,
        [field]: value,
      },
    }));
  };

  const updateExtrasField = (
    field: keyof WorkPlanContent["extras"],
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        [field]: value,
      },
    }));
  };

  const addHotelOption = () => {
    setContent((prev) => ({
      ...prev,
      hotels: [...prev.hotels, createEmptyHotelOption(false)],
    }));
  };

  const removeHotelOption = (hotelIndex: number) => {
    setContent((prev) => {
      if (prev.hotels.length === 1) return prev;

      const nextHotels = prev.hotels.filter((_, index) => index !== hotelIndex);

      if (
        !nextHotels.some((hotel) => hotel.recommended) &&
        nextHotels.length > 0
      ) {
        nextHotels[0] = { ...nextHotels[0], recommended: true };
      }

      return {
        ...prev,
        hotels: nextHotels,
      };
    });
  };

  const updateHotelField = (
    hotelIndex: number,
    field: keyof WorkPlanContent["hotels"][number],
    value: string | boolean,
  ) => {
    setContent((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel, index) =>
        index === hotelIndex
          ? {
              ...hotel,
              [field]: value,
            }
          : hotel,
      ),
    }));
  };

  const setRecommendedHotel = (hotelIndex: number) => {
    setContent((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel, index) => ({
        ...hotel,
        recommended: index === hotelIndex,
      })),
    }));
  };

  const updateHotelPros = (hotelIndex: number, value: string[]) => {
    setContent((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel, index) =>
        index === hotelIndex ? { ...hotel, pros: value } : hotel,
      ),
    }));
  };

  const updateHotelCons = (hotelIndex: number, value: string[]) => {
    setContent((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel, index) =>
        index === hotelIndex ? { ...hotel, cons: value } : hotel,
      ),
    }));
  };

  const addDay = () => {
    setContent((prev) => {
      const nextDayIndex = prev.days.length;

      setQuickAddDrafts((draftPrev) => ({
        ...draftPrev,
        [nextDayIndex]: createEmptyScheduleItem(),
      }));

      return {
        ...prev,
        days: [...prev.days, createEmptyDay(nextDayIndex + 1)],
      };
    });
  };

  const removeDay = (dayIndex: number) => {
    setContent((prev) => {
      if (prev.days.length === 1) return prev;

      return {
        ...prev,
        days: prev.days.filter((_, index) => index !== dayIndex),
      };
    });
  };

  const updateDayField = (
    dayIndex: number,
    field: keyof WorkPlanContent["days"][number],
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              [field]: value,
            }
          : day,
      ),
    }));
  };

  const removeScheduleRow = (dayIndex: number, itemIndex: number) => {
    setContent((prev) => ({
      ...prev,
      days: prev.days.map((day, index) => {
        if (index !== dayIndex) return day;

        return {
          ...day,
          items: day.items.filter((_, i) => i !== itemIndex),
        };
      }),
    }));

    if (editingDayIndex === dayIndex && editingItemIndex === itemIndex) {
      closeAdvancedEditor();
    }
  };

  const handleSave = async () => {
    if (!token || !requestId) return;
    if (requestId === "planCreate" && !planId) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      if (requestId === "planCreate") {
        await editWorkPlan(token, planId, {
          planInfo,
          content,
        });
      } else {
        await updatePlannerWorkPlan(token, requestId, {
          content,
        });
      }

      showToast("Draft saved.", "success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save draft",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !requestId) return;
    if (requestId === "planCreate" && !planId) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (requestId === "planCreate") {
        await editWorkPlan(token, planId, {
          planInfo,
          content,
        });
        await completeWorkPlan(token, planId);

        showToast("Plan submitted successfully.", "success");
        // navigate(`/plans/${planId}`);
      } else {
        await updatePlannerWorkPlan(token, requestId, {
          content,
        });
        await submitPlannerWorkPlan(token, requestId);
        showToast("Plan submitted successfully.", "success");
        navigate(`/requests/${requestId}`);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit plan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!token || !requestId) return;

    setIsEditing(true);
    setErrorMessage("");

    try {
      await updatePlannerWorkPlan(token, requestId, {
        content,
      });

      showToast("Plan editted successfully.", "success");
      navigate(`/requests/${requestId}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to edit plan",
      );
    } finally {
      setIsEditing(false);
    }
  };

  return {
    content,
    setContent,
    setPlanInfo,
    isLoading,
    isSaving,
    isSubmitting,
    errorMessage,
    isEdit,
    isEditing,

    editingDayIndex,
    editingItemIndex,
    advancedDraft,

    getQuickAddDraft,
    updateQuickAddDraft,
    handleQuickAddSchedule,

    openAdvancedEditor,
    closeAdvancedEditor,
    updateAdvancedDraft,
    saveAdvancedEdit,

    updatePreparationField,
    updateExtrasField,

    addHotelOption,
    removeHotelOption,
    updateHotelField,
    setRecommendedHotel,
    updateHotelPros,
    updateHotelCons,

    addDay,
    removeDay,
    updateDayField,
    removeScheduleRow,

    handleSave,
    handleSubmit,
    handleEditSubmit,
  };
}

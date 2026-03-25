import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import {
  getPlannerWorkPlan,
  submitPlannerWorkPlan,
  updatePlannerWorkPlan,
  type WorkPlanContent,
} from "../services/workPlanApi";
import { useAuth } from "../context/AuthContext";
import "../styles/PlannerWorkPlanPage.css";

function normalizeWorkPlanContent(
  raw?: Partial<WorkPlanContent> | null,
): WorkPlanContent {
  const base = createEmptyContent();

  return {
    overview: {
      ...base.overview,
      ...(raw?.overview ?? {}),
    },
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

function createEmptyScheduleItem() {
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

function createEmptyDay(dayNumber: number) {
  return {
    title: `Day ${dayNumber}`,
    dateLabel: "",
    summary: "",
    items: [],
  };
}

function createEmptyHotelOption(recommended = false) {
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

function createEmptyContent(): WorkPlanContent {
  return {
    overview: {
      destinationSummary: "",
      recommendedBudget: "",
      bestFor: "",
      notes: "",
    },
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

export default function PlannerWorkPlanPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<WorkPlanContent>(createEmptyContent());

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [quickAddDrafts, setQuickAddDrafts] = useState<
    Record<number, ReturnType<typeof createEmptyScheduleItem>>
  >({});

  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [advancedDraft, setAdvancedDraft] = useState(createEmptyScheduleItem());

  function sortScheduleItems<
    T extends { startTime?: string; endTime?: string },
  >(items: T[]) {
    return [...items].sort((a, b) => {
      const aKey = `${a.startTime ?? ""}-${a.endTime ?? ""}`;
      const bKey = `${b.startTime ?? ""}-${b.endTime ?? ""}`;
      return aKey.localeCompare(bKey);
    });
  }

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

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token || !requestId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlannerWorkPlan(token, requestId);
        const plan = response.data;

        setTitle(plan.title);
        setSummary(plan.summary);
        setDuration(plan.duration);
        setTags(plan.tags ?? []);
        // setContent(plan.content ?? createEmptyContent());
        setContent(normalizeWorkPlanContent(plan.content));
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

  const updateOverviewField = (
    field: keyof WorkPlanContent["overview"],
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        [field]: value,
      },
    }));
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

  const addScheduleRow = (dayIndex: number) => {
    setContent((prev) => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: [...day.items, createEmptyScheduleItem()],
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

  const updateScheduleRow = (
    dayIndex: number,
    itemIndex: number,
    field: keyof WorkPlanContent["days"][number]["items"][number],
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      days: prev.days.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              items: day.items.map((item, iIndex) =>
                iIndex === itemIndex
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            }
          : day,
      ),
    }));
  };

  const handleSave = async () => {
    if (!token || !requestId) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      await updatePlannerWorkPlan(token, requestId, {
        title,
        summary,
        duration,
        tags,
        content,
      });

      setToastMessage("Draft saved.");
      window.setTimeout(() => setToastMessage(""), 2000);
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

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updatePlannerWorkPlan(token, requestId, {
        title,
        summary,
        duration,
        tags,
        content,
      });

      await submitPlannerWorkPlan(token, requestId);

      navigate(`/planner-proposals?tab=sent&submitted=1`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit plan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="work-plan-state-card">
            <p>Loading work plan...</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow="Plan builder"
        title="Build a detailed travel execution plan"
        description="Create a practical, highly detailed plan including day-by-day timetable, preparation guide, hotel options, and travel tips."
      />

      <section className="section section--compact">
        <div className="work-plan-card">
          <div className="form-grid">
            <div className="form-field form-field--full">
              <label>Plan title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Duration</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <TagInputField
              label="Tags"
              placeholder="Type a tag and press Enter"
              value={tags}
              onChange={setTags}
            />

            <div className="form-field form-field--full">
              <label>Summary</label>
              <textarea
                rows={5}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
          </div>

          <section className="work-plan-section">
            <div className="work-plan-section__header">
              <h3>Overview</h3>
              <p>
                Write a high-level summary of the destination and trip style.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-field form-field--full">
                <label>Destination summary</label>
                <textarea
                  rows={4}
                  value={content.overview.destinationSummary}
                  onChange={(e) =>
                    updateOverviewField("destinationSummary", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Recommended budget</label>
                <input
                  value={content.overview.recommendedBudget}
                  onChange={(e) =>
                    updateOverviewField("recommendedBudget", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Best for</label>
                <input
                  value={content.overview.bestFor}
                  onChange={(e) =>
                    updateOverviewField("bestFor", e.target.value)
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>Planner notes</label>
                <textarea
                  rows={4}
                  value={content.overview.notes}
                  onChange={(e) => updateOverviewField("notes", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="work-plan-section">
            <div className="work-plan-section__header">
              <h3>Preparation guide</h3>
              <p>
                Add travel prep details like visa, documents, airport transfer,
                SIM, money, and packing advice.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-field form-field--full">
                <label>Visa / entry requirements</label>
                <textarea
                  rows={4}
                  value={content.preparation.visaInfo}
                  onChange={(e) =>
                    updatePreparationField("visaInfo", e.target.value)
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>Required documents</label>
                <textarea
                  rows={4}
                  value={content.preparation.documents}
                  onChange={(e) =>
                    updatePreparationField("documents", e.target.value)
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>How to get to the airport</label>
                <textarea
                  rows={4}
                  value={content.preparation.transportToAirport}
                  onChange={(e) =>
                    updatePreparationField("transportToAirport", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>SIM / Wi-Fi</label>
                <textarea
                  rows={4}
                  value={content.preparation.simWifi}
                  onChange={(e) =>
                    updatePreparationField("simWifi", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Money tips</label>
                <textarea
                  rows={4}
                  value={content.preparation.moneyTips}
                  onChange={(e) =>
                    updatePreparationField("moneyTips", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Packing tips</label>
                <textarea
                  rows={4}
                  value={content.preparation.packingTips}
                  onChange={(e) =>
                    updatePreparationField("packingTips", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Other tips</label>
                <textarea
                  rows={4}
                  value={content.preparation.otherTips}
                  onChange={(e) =>
                    updatePreparationField("otherTips", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          <section className="work-plan-section">
            <div className="work-plan-section__header">
              <h3>Hotel options</h3>
              <p>
                Add the main recommended hotel and alternative choices with pros
                and cons so the traveller can compare.
              </p>
            </div>

            <div className="work-plan-hotel-list">
              {content.hotels.map((hotel, hotelIndex) => (
                <div key={hotelIndex} className="work-plan-hotel-card">
                  <div className="work-plan-hotel-card__top">
                    <div>
                      <h4>
                        Hotel option {hotelIndex + 1}
                        {hotel.recommended ? " · Recommended" : ""}
                      </h4>
                      <p>
                        Suggest multiple hotel choices with clear trade-offs.
                      </p>
                    </div>

                    <div className="work-plan-hotel-card__actions">
                      <button
                        type="button"
                        className={
                          hotel.recommended
                            ? "btn btn--primary"
                            : "btn btn--secondary"
                        }
                        onClick={() => setRecommendedHotel(hotelIndex)}
                      >
                        {hotel.recommended ? "Main choice" : "Set as main"}
                      </button>

                      {content.hotels.length > 1 ? (
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => removeHotelOption(hotelIndex)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label>Hotel name</label>
                      <input
                        value={hotel.name}
                        onChange={(e) =>
                          updateHotelField(hotelIndex, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Location</label>
                      <input
                        value={hotel.location}
                        onChange={(e) =>
                          updateHotelField(
                            hotelIndex,
                            "location",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Price range</label>
                      <input
                        value={hotel.priceRange}
                        onChange={(e) =>
                          updateHotelField(
                            hotelIndex,
                            "priceRange",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Booking link</label>
                      <input
                        value={hotel.bookingLink ?? ""}
                        onChange={(e) =>
                          updateHotelField(
                            hotelIndex,
                            "bookingLink",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-field form-field--full">
                      <label>Hotel summary</label>
                      <textarea
                        rows={4}
                        value={hotel.summary}
                        onChange={(e) =>
                          updateHotelField(
                            hotelIndex,
                            "summary",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <TagInputField
                      label="Pros"
                      placeholder="Type a pro and press Enter"
                      value={hotel.pros}
                      onChange={(value) => updateHotelPros(hotelIndex, value)}
                    />

                    <TagInputField
                      label="Cons"
                      placeholder="Type a con and press Enter"
                      value={hotel.cons}
                      onChange={(value) => updateHotelCons(hotelIndex, value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="work-plan-actions-row">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={addHotelOption}
              >
                Add hotel option
              </button>
            </div>
          </section>

          <section className="work-plan-section">
            <div className="work-plan-section__header">
              <h3>Daily timetable</h3>
              <p>
                Build a practical day-by-day schedule with exact time slots,
                places, transport, fees, and notes.
              </p>
            </div>

            <div className="work-plan-days-board">
              {content.days.map((day, dayIndex) => {
                const quickDraft = getQuickAddDraft(dayIndex);

                return (
                  <div key={dayIndex} className="work-plan-day-column">
                    <div className="work-plan-day-column__header">
                      <div>
                        <h4>{day.title || `Day ${dayIndex + 1}`}</h4>
                        <p>{day.dateLabel || "No date label"}</p>
                      </div>

                      {content.days.length > 1 ? (
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => removeDay(dayIndex)}
                        >
                          Remove day
                        </button>
                      ) : null}
                    </div>

                    <div className="form-grid">
                      <div className="form-field">
                        <label>Day title</label>
                        <input
                          value={day.title}
                          onChange={(e) =>
                            updateDayField(dayIndex, "title", e.target.value)
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label>Date label</label>
                        <input
                          placeholder="e.g. 12 Apr 2026"
                          value={day.dateLabel}
                          onChange={(e) =>
                            updateDayField(
                              dayIndex,
                              "dateLabel",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="form-field form-field--full">
                        <label>Day summary</label>
                        <textarea
                          rows={3}
                          value={day.summary}
                          onChange={(e) =>
                            updateDayField(dayIndex, "summary", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="work-plan-quick-add">
                      <div className="work-plan-quick-add__title">
                        Quick add
                      </div>

                      <div className="form-grid">
                        <div className="form-field">
                          <label>Start</label>
                          <input
                            type="time"
                            value={quickDraft.startTime}
                            onChange={(e) =>
                              updateQuickAddDraft(
                                dayIndex,
                                "startTime",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="form-field">
                          <label>End</label>
                          <input
                            type="time"
                            value={quickDraft.endTime}
                            onChange={(e) =>
                              updateQuickAddDraft(
                                dayIndex,
                                "endTime",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="form-field">
                          <label>Place</label>
                          <input
                            value={quickDraft.place}
                            onChange={(e) =>
                              updateQuickAddDraft(
                                dayIndex,
                                "place",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="form-field">
                          <label>Activity</label>
                          <input
                            value={quickDraft.title}
                            onChange={(e) =>
                              updateQuickAddDraft(
                                dayIndex,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="work-plan-actions-row">
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => handleQuickAddSchedule(dayIndex)}
                        >
                          Add schedule
                        </button>
                      </div>
                    </div>

                    <div className="work-plan-day-timetable">
                      <div className="work-plan-day-timetable__head">
                        <span>Time</span>
                        <span>Place</span>
                        <span>Activity</span>
                      </div>

                      {day.items.length === 0 ? (
                        <div className="work-plan-empty-state">
                          No schedules added yet.
                        </div>
                      ) : (
                        day.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="work-plan-timetable-row"
                            onClick={() =>
                              openAdvancedEditor(dayIndex, itemIndex)
                            }
                          >
                            <div className="work-plan-timetable-row__main">
                              <span>
                                {item.startTime || "--:--"} -{" "}
                                {item.endTime || "--:--"}
                              </span>
                              <span>{item.place || "-"}</span>
                              <span>{item.title || "-"}</span>
                            </div>

                            <div className="work-plan-timetable-row__actions">
                              <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAdvancedEditor(dayIndex, itemIndex);
                                }}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeScheduleRow(dayIndex, itemIndex);
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {editingDayIndex === dayIndex &&
                    editingItemIndex !== null ? (
                      <div className="work-plan-advanced-editor">
                        <div className="work-plan-advanced-editor__header">
                          <h5>Advanced edit</h5>
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={closeAdvancedEditor}
                          >
                            Close
                          </button>
                        </div>

                        <div className="form-grid">
                          <div className="form-field">
                            <label>Start time</label>
                            <input
                              type="time"
                              value={advancedDraft.startTime}
                              onChange={(e) =>
                                updateAdvancedDraft("startTime", e.target.value)
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>End time</label>
                            <input
                              type="time"
                              value={advancedDraft.endTime}
                              onChange={(e) =>
                                updateAdvancedDraft("endTime", e.target.value)
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>Place</label>
                            <input
                              value={advancedDraft.place}
                              onChange={(e) =>
                                updateAdvancedDraft("place", e.target.value)
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>Activity title</label>
                            <input
                              value={advancedDraft.title}
                              onChange={(e) =>
                                updateAdvancedDraft("title", e.target.value)
                              }
                            />
                          </div>

                          <div className="form-field form-field--full">
                            <label>Description</label>
                            <textarea
                              rows={3}
                              value={advancedDraft.description}
                              onChange={(e) =>
                                updateAdvancedDraft(
                                  "description",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>Entry fee</label>
                            <input
                              value={advancedDraft.fee}
                              onChange={(e) =>
                                updateAdvancedDraft("fee", e.target.value)
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>Estimated cost</label>
                            <input
                              value={advancedDraft.estimatedCost}
                              onChange={(e) =>
                                updateAdvancedDraft(
                                  "estimatedCost",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>Transport</label>
                            <input
                              value={advancedDraft.transport}
                              onChange={(e) =>
                                updateAdvancedDraft("transport", e.target.value)
                              }
                            />
                          </div>

                          <div className="form-field">
                            <label>Duration note</label>
                            <input
                              value={advancedDraft.durationNote}
                              onChange={(e) =>
                                updateAdvancedDraft(
                                  "durationNote",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="form-field form-field--full">
                            <label>Tips</label>
                            <textarea
                              rows={3}
                              value={advancedDraft.tips}
                              onChange={(e) =>
                                updateAdvancedDraft("tips", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="work-plan-actions-row">
                          <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={closeAdvancedEditor}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn--primary"
                            onClick={saveAdvancedEdit}
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="work-plan-day-column work-plan-day-column--add">
                <button
                  type="button"
                  className="btn btn--secondary btn--large"
                  onClick={addDay}
                >
                  Add day
                </button>
              </div>
            </div>
          </section>

          <section className="work-plan-section">
            <div className="work-plan-section__header">
              <h3>Extra guide</h3>
              <p>
                Add practical supporting information that does not belong in the
                daily timetable.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-field form-field--full">
                <label>Local transport</label>
                <textarea
                  rows={4}
                  value={content.extras.localTransport}
                  onChange={(e) =>
                    updateExtrasField("localTransport", e.target.value)
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>Reservations / booking notes</label>
                <textarea
                  rows={4}
                  value={content.extras.reservations}
                  onChange={(e) =>
                    updateExtrasField("reservations", e.target.value)
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>Emergency info</label>
                <textarea
                  rows={4}
                  value={content.extras.emergencyInfo}
                  onChange={(e) =>
                    updateExtrasField("emergencyInfo", e.target.value)
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>Final notes</label>
                <textarea
                  rows={4}
                  value={content.extras.finalNotes}
                  onChange={(e) =>
                    updateExtrasField("finalNotes", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {errorMessage ? (
            <p className="work-plan-error">{errorMessage}</p>
          ) : null}
          {toastMessage ? (
            <div className="work-plan-toast">{toastMessage}</div>
          ) : null}

          <div className="work-plan-actions-row work-plan-actions-row--final">
            <button
              type="button"
              className="btn btn--secondary btn--large"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>

            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit to traveller"}
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

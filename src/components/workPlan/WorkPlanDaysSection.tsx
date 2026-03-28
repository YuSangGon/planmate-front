import type { WorkPlanContent } from "../../services/workPlanApi";

type ScheduleDraft = {
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

type Props = {
  days: WorkPlanContent["days"];
  getQuickAddDraft: (dayIndex: number) => ScheduleDraft;
  onUpdateQuickAddDraft: (
    dayIndex: number,
    field: keyof ScheduleDraft,
    value: string,
  ) => void;
  onQuickAddSchedule: (dayIndex: number) => void;
  onOpenAdvancedEditor: (dayIndex: number, itemIndex: number) => void;
  onAddDay: () => void;
  onRemoveDay: (dayIndex: number) => void;
  onUpdateDayField: (
    dayIndex: number,
    field: keyof WorkPlanContent["days"][number],
    value: string,
  ) => void;
  onRemoveScheduleRow: (dayIndex: number, itemIndex: number) => void;
};

export default function WorkPlanDaysSection({
  days,
  getQuickAddDraft,
  onUpdateQuickAddDraft,
  onQuickAddSchedule,
  onOpenAdvancedEditor,
  onAddDay,
  onRemoveDay,
  onUpdateDayField,
  onRemoveScheduleRow,
}: Props) {
  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Daily timetable</h3>
        <p>
          Build a practical day-by-day schedule with exact time slots, places,
          transport, fees, and notes.
        </p>
      </div>

      <div className="work-plan-days-board">
        {days.map((day, dayIndex) => {
          const quickDraft = getQuickAddDraft(dayIndex);

          return (
            <div key={dayIndex} className="work-plan-day-column">
              <div className="work-plan-day-column__header">
                <div>
                  <h4>{day.title || `Day ${dayIndex + 1}`}</h4>
                  <p>{day.dateLabel || "No date label"}</p>
                </div>

                {days.length > 1 ? (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onRemoveDay(dayIndex)}
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
                      onUpdateDayField(dayIndex, "title", e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Date label</label>
                  <input
                    placeholder="e.g. 12 Apr 2026"
                    value={day.dateLabel}
                    onChange={(e) =>
                      onUpdateDayField(dayIndex, "dateLabel", e.target.value)
                    }
                  />
                </div>

                <div className="form-field form-field--full">
                  <label>Day summary</label>
                  <textarea
                    rows={3}
                    value={day.summary}
                    onChange={(e) =>
                      onUpdateDayField(dayIndex, "summary", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="work-plan-quick-add">
                <div className="work-plan-quick-add__title">Quick add</div>

                <div className="form-grid">
                  <div className="form-field">
                    <label>Start</label>
                    <input
                      type="time"
                      value={quickDraft.startTime}
                      onChange={(e) =>
                        onUpdateQuickAddDraft(
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
                        onUpdateQuickAddDraft(
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
                        onUpdateQuickAddDraft(dayIndex, "place", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Activity</label>
                    <input
                      value={quickDraft.title}
                      onChange={(e) =>
                        onUpdateQuickAddDraft(dayIndex, "title", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="work-plan-actions-row">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => onQuickAddSchedule(dayIndex)}
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
                      onClick={() => onOpenAdvancedEditor(dayIndex, itemIndex)}
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
                            onOpenAdvancedEditor(dayIndex, itemIndex);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveScheduleRow(dayIndex, itemIndex);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}

        <div className="work-plan-day-column work-plan-day-column--add">
          <button
            type="button"
            className="btn btn--secondary btn--large"
            onClick={onAddDay}
          >
            Add day
          </button>
        </div>
      </div>
    </section>
  );
}

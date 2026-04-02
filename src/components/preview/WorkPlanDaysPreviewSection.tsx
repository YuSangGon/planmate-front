import type { WorkPlanScheduleItem } from "../../services/workPlanApi";
import { useState } from "react";
import { ScheduleItem } from "./ScheduleItem";
import PreviewTextarea from "./PreviewTextarea";

type PreviewDays = {
  title: string;
  dateLabel: string;
  summary: string;
  items: WorkPlanScheduleItem[];
}[];

type Props = {
  days: PreviewDays;
};

export default function WorkPlanDaysPreviewSection({ days }: Props) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const currentDay = days[currentDayIndex];

  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Daily timetable</h3>
        <p>
          Practical day-by-day schedule with exact time slots, places,
          transport, fees, and notes.
        </p>
      </div>

      <div className="work-plan-days-board">
        <div className="work-plan-days-slider">
          <button
            className="day-nav left"
            onClick={() => setCurrentDayIndex((prev) => Math.max(prev - 1, 0))}
          >
            ‹
          </button>

          <div className="work-plan-day-single">
            <div className="work-plan-day-column__header">
              <h4>{`Day ${currentDayIndex + 1}`}</h4>
              <p>{currentDay.dateLabel}</p>
            </div>

            <div className="form-field form-field--full">
              <PreviewTextarea label="" value={currentDay.summary} />
            </div>

            <div className="work-plan-items">
              {currentDay.items.map((item, i) => (
                <ScheduleItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>

          <button
            className="day-nav right"
            onClick={() =>
              setCurrentDayIndex((prev) => Math.min(prev + 1, days.length - 1))
            }
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

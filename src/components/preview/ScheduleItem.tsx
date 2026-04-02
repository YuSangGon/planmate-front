import { useState } from "react";
import { type WorkPlanScheduleItem } from "../../services/workPlanApi";
import PreviewInput from "./PreviewInput";
import PreviewTextarea from "./PreviewTextarea";

type Props = {
  item: WorkPlanScheduleItem;
  index: number;
};

export function ScheduleItem({ item, index }: Props) {
  const [open, setOpen] = useState(false);

  //   const isLocked = !item.title && !item.place;

  return (
    <div
      className={`schedule-row preview-lock is-locked"`}
      onClick={() => setOpen((prev) => !prev)}
      id={"schedult-row" + index}
    >
      <div className="schedule-row__summary">
        <span className="start time">
          <PreviewInput label="start time" value={item.startTime} />
        </span>
        <span className="end time">
          <PreviewInput label="end time" value={item.endTime} />
        </span>
        <span className="place">
          <PreviewInput label="place" value={item.place} />
        </span>
      </div>

      {open && (
        <div className="schedule-row__details">
          <PreviewTextarea label="Description" value={item.description} />
          <PreviewInput label="Fee" value={item.fee} />
          <PreviewInput label="Transport" value={item.transport} />
          <PreviewInput label="Tips" value={item.tips} />
        </div>
      )}
    </div>
  );
}

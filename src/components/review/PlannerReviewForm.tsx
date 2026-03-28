import { useMemo, useState, useEffect } from "react";
import StarRatingField from "./StarRatingField";
import { type PlannerReviewPayload } from "../../services/reviewApi";

type PlannerReviewFormProps = {
  plannerName: string;
  completedAt?: string | null;
  requestId: string;
  initialValues?: Partial<PlannerReviewPayload> | null;
  submitLabel?: string;
  onSubmit?: (payload: PlannerReviewPayload) => Promise<void>;
  onCancel?: () => void;
};

function isWithinReviewWindow(completedAt?: string | null) {
  if (!completedAt) return true;

  const completedTime = new Date(completedAt).getTime();

  if (Number.isNaN(completedTime)) return true;

  const deadline = completedTime + 7 * 24 * 60 * 60 * 1000;
  return Date.now() <= deadline;
}

function getDaysLeft(completedAt?: string | null) {
  if (!completedAt) return null;

  const completedTime = new Date(completedAt).getTime();

  if (Number.isNaN(completedTime)) return null;

  const deadline = completedTime + 7 * 24 * 60 * 60 * 1000;
  const diff = deadline - Date.now();

  if (diff <= 0) return 0;

  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export default function PlannerReviewForm({
  plannerName,
  completedAt,
  requestId,
  initialValues,
  submitLabel = "Submit review",
  onSubmit,
  onCancel,
}: PlannerReviewFormProps) {
  const [planQuality, setPlanQuality] = useState(
    initialValues?.planQuality ?? 3,
  );
  const [communication, setCommunication] = useState(
    initialValues?.communication ?? 3,
  );
  const [timeliness, setTimeliness] = useState(initialValues?.timeliness ?? 3);
  const [personalisation, setPersonalisation] = useState(
    initialValues?.personalisation ?? 3,
  );
  const [practicality, setPracticality] = useState(
    initialValues?.practicality ?? 3,
  );
  const [detailLevel, setDetailLevel] = useState(
    initialValues?.detailLevel ?? 3,
  );
  const [content, setContent] = useState(initialValues?.content ?? "");

  useEffect(() => {
    setPlanQuality(initialValues?.planQuality ?? 3);
    setCommunication(initialValues?.communication ?? 3);
    setTimeliness(initialValues?.timeliness ?? 3);
    setPersonalisation(initialValues?.personalisation ?? 3);
    setPracticality(initialValues?.practicality ?? 3);
    setDetailLevel(initialValues?.detailLevel ?? 3);
    setContent(initialValues?.content ?? "");
  }, [initialValues]);

  const isOpen = isWithinReviewWindow(completedAt);
  const daysLeft = getDaysLeft(completedAt);

  const overallRating = useMemo(() => {
    const total =
      planQuality +
      communication +
      timeliness +
      personalisation +
      practicality +
      detailLevel;

    return Number((total / 6).toFixed(1));
  }, [
    planQuality,
    communication,
    timeliness,
    personalisation,
    practicality,
    detailLevel,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOpen) return;

    onSubmit?.({
      requestId,
      overallRating,
      planQuality,
      communication,
      timeliness,
      personalisation,
      practicality,
      detailLevel,
      content: content.trim(),
    } as PlannerReviewPayload);
  };

  return (
    <div className="planner-review-card">
      <div className="planner-review-card__header">
        <div>
          <h4>Leave a review</h4>
          <p>Share your experience with {plannerName}.</p>
        </div>

        <div className="planner-review-card__overall">
          <span>Overall</span>
          <strong>{overallRating.toFixed(1)}</strong>
        </div>
      </div>

      {completedAt ? (
        <div className="planner-review-card__helper">
          {isOpen
            ? `You can write this review for ${daysLeft ?? 7} more day${daysLeft === 1 ? "" : "s"}.`
            : "The review window for this planner has ended."}
        </div>
      ) : null}

      <form className="planner-review-form" onSubmit={handleSubmit}>
        <div className="planner-review-form__grid">
          <StarRatingField
            label="Plan quality"
            value={planQuality}
            onChange={setPlanQuality}
          />
          <StarRatingField
            label="Communication"
            value={communication}
            onChange={setCommunication}
          />
          <StarRatingField
            label="Timeliness"
            value={timeliness}
            onChange={setTimeliness}
          />
          <StarRatingField
            label="Personalisation"
            value={personalisation}
            onChange={setPersonalisation}
          />
          <StarRatingField
            label="Practicality"
            value={practicality}
            onChange={setPracticality}
          />
          <StarRatingField
            label="Detail level"
            value={detailLevel}
            onChange={setDetailLevel}
          />
        </div>

        <div className="form-field">
          <label htmlFor="planner-review-message">Message</label>
          <textarea
            id="planner-review-message"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a short review about the planner."
            disabled={!isOpen}
          />
        </div>

        <div className="planner-review-form__actions">
          <button type="submit" className="btn btn--primary" disabled={!isOpen}>
            {submitLabel}
          </button>

          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

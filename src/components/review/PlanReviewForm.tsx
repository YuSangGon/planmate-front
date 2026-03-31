import { useMemo, useState, useEffect } from "react";
import StarRatingField from "./StarRatingField";
import type { ReviewType } from "../../services/planApi";
import { useAuth } from "../../context/AuthContext";

type PlanReviewFormProps = {
  initialValues?: ReviewType | null;
  onSubmit?: (payload: ReviewType) => Promise<void>;
};

export default function PlanReviewForm({
  initialValues,
  onSubmit,
}: PlanReviewFormProps) {
  const [planQuality, setPlanQuality] = useState(
    initialValues?.planQuality ?? 3,
  );
  const [practicality, setPracticality] = useState(
    initialValues?.practicality ?? 3,
  );
  const [detailLevel, setDetailLevel] = useState(
    initialValues?.detailLevel ?? 3,
  );
  const [content, setContent] = useState(initialValues?.content ?? "");
  const { user } = useAuth();

  useEffect(() => {
    setPlanQuality(initialValues?.planQuality ?? 3);
    setPracticality(initialValues?.practicality ?? 3);
    setDetailLevel(initialValues?.detailLevel ?? 3);
    setContent(initialValues?.content ?? "");
  }, [initialValues]);

  const overallRating = useMemo(() => {
    const total = planQuality + practicality + detailLevel;

    return Number((total / 3).toFixed(1));
  }, [planQuality, practicality, detailLevel]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.({
      overallRating,
      planQuality,
      practicality,
      detailLevel,
      content: content.trim(),
    } as ReviewType);
  };

  return (
    <div className="planner-review-card">
      <div className="planner-review-card__header">
        <div className="planner-review-card__title">
          {user?.id === initialValues?.user.id
            ? "내가 쓴 리뷰"
            : !initialValues?.user.name
              ? "리뷰 작성하기"
              : initialValues?.user.name}
        </div>
        <div className="planner-review-card__overall">
          <span>Overall</span>
          <strong>{overallRating.toFixed(1)}</strong>
        </div>
      </div>

      <form className="planner-review-form" onSubmit={handleSubmit}>
        <div className="planner-review-form__grid">
          <StarRatingField
            label="Plan quality"
            value={planQuality}
            onChange={setPlanQuality}
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
          />
        </div>

        {initialValues?.status !== "submitted" ? (
          <div className="planner-review-form__actions">
            <button type="submit" className="btn btn--primary">
              Submit
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}

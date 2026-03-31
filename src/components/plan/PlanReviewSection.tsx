import ReviewStarsDisplay from "../review/ReviewStarsDisplay";
import PlanReviewForm from "../review/PlanReviewForm";
import type { PlanReviewPayload } from "../../services/reviewApi";

type Props = {
  plannerReviewItem: PlanReviewPayload | null;
  onSubmitReview: (payload: PlanReviewPayload) => Promise<void>;
};

export default function PlanReviewSection({
  plannerReviewItem,
  onSubmitReview,
}: Props) {
  return plannerReviewItem ? (
    <div className="planner-review-display-card">
      <div className="planner-review-display-card__header">
        <div>
          <h4>Your review</h4>
        </div>

        <div className="planner-review-display-card__overall">
          <span>Overall</span>
          <strong>{plannerReviewItem.overallRating.toFixed(1)}</strong>
        </div>
      </div>

      <div className="planner-review-display-grid">
        <ReviewStarsDisplay
          label="Plan quality"
          value={plannerReviewItem.planQuality}
        />
        <ReviewStarsDisplay
          label="Practicality"
          value={plannerReviewItem.practicality}
        />
        <ReviewStarsDisplay
          label="Detail level"
          value={plannerReviewItem.detailLevel}
        />
      </div>

      {plannerReviewItem.content ? (
        <div className="planner-review-display-card__message">
          <h5>Message</h5>
          <p>{plannerReviewItem.content}</p>
        </div>
      ) : null}
    </div>
  ) : (
    <PlanReviewForm
      initialValues={plannerReviewItem}
      onSubmit={onSubmitReview}
    />
  );
}

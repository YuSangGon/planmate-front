import ReviewStarsDisplay from "../review/ReviewStarsDisplay";
import PlannerReviewForm from "../review/PlannerReviewForm";
import type {
  RequestItem,
  RequestProposalItem,
} from "../../services/requestApi";
import type { PlannerReviewPayload } from "../../services/reviewApi";

function isWithinReviewWindow(completedAt?: string | null) {
  if (!completedAt) return false;

  const completedTime = new Date(completedAt).getTime();
  if (Number.isNaN(completedTime)) return false;

  const deadline = completedTime + 7 * 24 * 60 * 60 * 1000;
  return Date.now() <= deadline;
}

type Props = {
  requestItem: RequestItem;
  acceptedProposal: RequestProposalItem;
  plannerReviewItem: PlannerReviewPayload | null;
  showReviewForm: boolean;
  isEditingReview: boolean;
  onEditReview: () => void;
  onSubmitReview: (payload: PlannerReviewPayload) => Promise<void>;
  onCancelReview: () => void;
};

export default function RequestPlannerReviewSection({
  requestItem,
  acceptedProposal,
  plannerReviewItem,
  showReviewForm,
  isEditingReview,
  onEditReview,
  onSubmitReview,
  onCancelReview,
}: Props) {
  if (requestItem.status !== "completed") return null;

  const completedAt = (
    requestItem as RequestItem & { completedAt?: string | null }
  ).completedAt;

  return plannerReviewItem && !isEditingReview ? (
    <div className="planner-review-display-card">
      <div className="planner-review-display-card__header">
        <div>
          <h4>Your review</h4>
          <p>You already reviewed {acceptedProposal.planner.name}.</p>
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
          label="Communication"
          value={plannerReviewItem.communication}
        />
        <ReviewStarsDisplay
          label="Timeliness"
          value={plannerReviewItem.timeliness}
        />
        <ReviewStarsDisplay
          label="Personalisation"
          value={plannerReviewItem.personalisation}
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

      {isWithinReviewWindow(completedAt) ? (
        <div className="planner-review-display-card__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onEditReview}
          >
            Edit review
          </button>
        </div>
      ) : null}
    </div>
  ) : showReviewForm ? (
    <PlannerReviewForm
      plannerName={acceptedProposal.planner.name}
      completedAt={completedAt}
      requestId={requestItem.id}
      initialValues={plannerReviewItem}
      submitLabel={isEditingReview ? "Save changes" : "Submit review"}
      onSubmit={onSubmitReview}
      onCancel={onCancelReview}
    />
  ) : null;
}

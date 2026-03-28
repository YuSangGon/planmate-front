import { Link } from "react-router-dom";
import type {
  RequestItem,
  RequestProposalItem,
} from "../../services/requestApi";
import type { PlannerReviewPayload } from "../../services/reviewApi";
import RequestPlannerReviewSection from "./RequestPlannerReviewSection";

type Props = {
  requestItem: RequestItem;
  acceptedProposal: RequestProposalItem;
  plannerReviewItem: PlannerReviewPayload | null;
  showReviewForm: boolean;
  isEditingReview: boolean;
  onComplete: () => void;
  onEditReview: () => void;
  onSubmitReview: (payload: PlannerReviewPayload) => Promise<void>;
  onCancelReview: () => void;
};

export default function RequestAcceptedProposalCard({
  requestItem,
  acceptedProposal,
  plannerReviewItem,
  showReviewForm,
  isEditingReview,
  onComplete,
  onEditReview,
  onSubmitReview,
  onCancelReview,
}: Props) {
  return (
    <div className="request-detail-highlight-card">
      <div className="request-detail-highlight-card__top">
        <div>
          <span className="request-detail-highlight-card__eyebrow">
            Accepted planner
          </span>
          <strong>{acceptedProposal.planner.name}</strong>
          <p>{acceptedProposal.planner.email}</p>
        </div>

        <span className="request-status-badge request-status-badge--accepted">
          accepted
        </span>
      </div>

      <p className="request-detail-highlight-card__message">
        {acceptedProposal.message}
      </p>

      <div className="request-proposal-meta">
        {acceptedProposal.proposedPrice != null ? (
          <span>Price: {acceptedProposal.proposedPrice}</span>
        ) : null}
        {acceptedProposal.estimatedDays != null ? (
          <span>{acceptedProposal.estimatedDays} days</span>
        ) : null}
      </div>

      <div className="request-detail-highlight-note">
        This request is now matched, and all other pending proposals have been
        closed automatically.
      </div>

      {requestItem.status === "submitted" ||
      requestItem.status === "completed" ? (
        <div className="request-detail-highlight-actions">
          <Link
            to={`/requests/${requestItem.id}/preview-plan`}
            className="btn btn--primary"
          >
            Preview submitted plan
          </Link>

          {requestItem.status !== "completed" ? (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onComplete}
            >
              Complete
            </button>
          ) : null}
        </div>
      ) : null}

      <RequestPlannerReviewSection
        requestItem={requestItem}
        acceptedProposal={acceptedProposal}
        plannerReviewItem={plannerReviewItem}
        showReviewForm={showReviewForm}
        isEditingReview={isEditingReview}
        onEditReview={onEditReview}
        onSubmitReview={onSubmitReview}
        onCancelReview={onCancelReview}
      />
    </div>
  );
}

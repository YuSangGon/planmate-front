import { useState, useEffect } from "react";
import type {
  RequestItem,
  RequestProposalItem,
} from "../../services/requestApi";
import type { PlannerReviewPayload } from "../../services/reviewApi";
import RequestPlannerReviewSection from "./RequestPlannerReviewSection";
import WorkPlanPreviewModal from "./WorkPlanPreviewModal";
import WorkPlanModal from "./WorkPlanModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isPlanOpen) return;
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isPlanOpen]);

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

      {requestItem.status === "submitted" ? (
        <div className="request-detail-highlight-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setIsModalOpen(true)}
          >
            Preview submitted plan
          </button>

          <button
            type="button"
            className="btn btn--primary"
            onClick={onComplete}
          >
            Complete
          </button>
        </div>
      ) : null}

      {requestItem.status === "completed" ? (
        <div className="request-detail-highlight-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setIsPlanOpen(true)}
          >
            View plan
          </button>
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

      {isModalOpen ? (
        <WorkPlanPreviewModal onClose={() => setIsModalOpen(false)} />
      ) : null}
      {isPlanOpen ? (
        <WorkPlanModal onClose={() => setIsPlanOpen(false)} />
      ) : null}
    </div>
  );
}

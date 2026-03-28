import type {
  RequestItem,
  RequestProposalItem,
} from "../../services/requestApi";
import type { PlannerReviewPayload } from "../../services/reviewApi";
import RequestAcceptedProposalCard from "./RequestAcceptedProposalCard";
import RequestProposalList from "./RequestProposalList";

type ProposalFilter = "all" | "pending" | "accepted" | "rejected";

type Props = {
  requestItem: RequestItem;
  proposals: RequestProposalItem[];
  acceptedProposal: RequestProposalItem | null;
  nonAcceptedProposals: RequestProposalItem[];
  proposalFilter: ProposalFilter;
  onChangeFilter: (value: ProposalFilter) => void;
  activeProposalId: string;
  plannerReviewItem: PlannerReviewPayload | null;
  showReviewForm: boolean;
  isEditingReview: boolean;
  onAccept: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
  onComplete: () => void;
  onEditReview: () => void;
  onSubmitReview: (payload: PlannerReviewPayload) => Promise<void>;
  onCancelReview: () => void;
};

export default function RequestProposalWorkspace({
  requestItem,
  proposals,
  acceptedProposal,
  nonAcceptedProposals,
  proposalFilter,
  onChangeFilter,
  activeProposalId,
  plannerReviewItem,
  showReviewForm,
  isEditingReview,
  onAccept,
  onReject,
  onComplete,
  onEditReview,
  onSubmitReview,
  onCancelReview,
}: Props) {
  return (
    <article className="request-workspace-card">
      <div className="request-detail-section-header">
        <h3>Planner proposals</h3>
        <span>{proposals.length}</span>
      </div>

      <div className="request-proposal-toolbar">
        <button
          type="button"
          className={
            proposalFilter === "all"
              ? "request-proposal-filter request-proposal-filter--active"
              : "request-proposal-filter"
          }
          onClick={() => onChangeFilter("all")}
        >
          All
        </button>

        <button
          type="button"
          className={
            proposalFilter === "pending"
              ? "request-proposal-filter request-proposal-filter--active"
              : "request-proposal-filter"
          }
          onClick={() => onChangeFilter("pending")}
        >
          Pending
        </button>

        <button
          type="button"
          className={
            proposalFilter === "accepted"
              ? "request-proposal-filter request-proposal-filter--active"
              : "request-proposal-filter"
          }
          onClick={() => onChangeFilter("accepted")}
        >
          Accepted
        </button>

        <button
          type="button"
          className={
            proposalFilter === "rejected"
              ? "request-proposal-filter request-proposal-filter--active"
              : "request-proposal-filter"
          }
          onClick={() => onChangeFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      {acceptedProposal &&
      (proposalFilter === "all" || proposalFilter === "accepted") ? (
        <RequestAcceptedProposalCard
          requestItem={requestItem}
          acceptedProposal={acceptedProposal}
          plannerReviewItem={plannerReviewItem}
          showReviewForm={showReviewForm}
          isEditingReview={isEditingReview}
          onComplete={onComplete}
          onEditReview={onEditReview}
          onSubmitReview={onSubmitReview}
          onCancelReview={onCancelReview}
        />
      ) : null}

      <RequestProposalList
        proposals={nonAcceptedProposals}
        acceptedProposal={acceptedProposal}
        activeProposalId={activeProposalId}
        onAccept={onAccept}
        onReject={onReject}
      />
    </article>
  );
}

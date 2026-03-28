import type { RequestProposalItem } from "../../services/requestApi";

type Props = {
  proposals: RequestProposalItem[];
  acceptedProposal: RequestProposalItem | null;
  activeProposalId: string;
  onAccept: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
};

export default function RequestProposalList({
  proposals,
  acceptedProposal,
  activeProposalId,
  onAccept,
  onReject,
}: Props) {
  if (proposals.length === 0) {
    return (
      <p className="request-detail-empty-text">
        No proposals found for this filter.
      </p>
    );
  }

  return (
    <div className="request-proposal-list">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="request-proposal-card">
          <div className="request-proposal-card__top">
            <div className="request-proposal-card__planner">
              <strong>{proposal.planner.name}</strong>
              <span>{proposal.planner.email}</span>
            </div>

            <span
              className={`request-status-badge request-status-badge--${proposal.status}`}
            >
              {proposal.status}
            </span>
          </div>

          <div className="request-proposal-card__summary-grid">
            <div className="request-proposal-stat">
              <span>Proposed price</span>
              <strong>
                {proposal.proposedPrice != null
                  ? proposal.proposedPrice
                  : "Not specified"}
              </strong>
            </div>

            <div className="request-proposal-stat">
              <span>Estimated time</span>
              <strong>
                {proposal.estimatedDays != null
                  ? `${proposal.estimatedDays} days`
                  : "Not specified"}
              </strong>
            </div>
          </div>

          <p className="request-proposal-card__message">{proposal.message}</p>

          <p className="request-proposal-bio">
            {proposal.planner.bio || "No planner bio provided."}
          </p>

          <div className="request-proposal-actions">
            {proposal.status === "pending" && !acceptedProposal ? (
              <>
                <button
                  className="btn btn--primary"
                  disabled={activeProposalId === proposal.id}
                  onClick={() => onAccept(proposal.id)}
                >
                  {activeProposalId === proposal.id
                    ? "Processing..."
                    : "Accept"}
                </button>

                <button
                  className="btn btn--danger-ghost"
                  disabled={activeProposalId === proposal.id}
                  onClick={() => onReject(proposal.id)}
                >
                  Reject
                </button>
              </>
            ) : proposal.status === "accepted" ? (
              <span className="request-proposal-helper request-proposal-helper--accepted">
                You selected this planner
              </span>
            ) : proposal.status === "rejected" ? (
              <span className="request-proposal-helper">
                You rejected this proposal
              </span>
            ) : (
              <span className="request-proposal-helper">
                This proposal is no longer active
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

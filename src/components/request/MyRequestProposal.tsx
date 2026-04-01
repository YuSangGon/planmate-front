import type { ProposalItem } from "../../services/requestApi";

type Props = {
  proposal: ProposalItem;
};

export default function MyRequestProposal({ proposal }: Props) {
  return (
    <div className="request-proposal-list" style={{ marginTop: "20px" }}>
      <div key={proposal.id} className="request-proposal-card">
        <div className="request-proposal-card__top">
          <div className="request-proposal-card__planner">
            <strong>My proposal</strong>
          </div>

          <span
            className={`request-status-badge request-status-badge--${proposal.status}`}
          >
            {proposal.status}
          </span>
        </div>

        <div className="request-proposal-card__summary-grid">
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
      </div>
    </div>
  );
}

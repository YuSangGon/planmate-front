import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RequestItem } from "../../services/requestApi";

type Props = {
  requestItem: RequestItem;
  showFullDetails: boolean;
  onToggleDetails: () => void;
  canViewProposals: boolean;
  onClickApply: () => void;
  isMatchedPlanner?: boolean;
  alreadyProposed: boolean;
};

export default function RequestSummaryCard({
  requestItem,
  showFullDetails,
  onToggleDetails,
  canViewProposals,
  onClickApply,
  isMatchedPlanner = false,
  alreadyProposed,
}: Props) {
  const { t, i18n } = useTranslation("requestDetail");

  return (
    <article className="request-summary-card">
      <div className="request-summary-card__top">
        <div>
          <span className="request-summary-card__eyebrow">
            {t("summary.eyebrow")}
          </span>
          <h2>{requestItem.destination}</h2>
        </div>

        <span
          className={`request-status-badge request-status-badge--${requestItem.status}`}
        >
          {t(`statuses.${requestItem.status}`)}
        </span>
      </div>

      <div className="request-summary-card__meta">
        <span>{requestItem.duration}</span>
        <span>{requestItem.budget}</span>
        <span>
          {new Date(requestItem.createdAt).toLocaleDateString(
            i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
          )}
        </span>
      </div>

      <div className="request-summary-card__content">
        <div className="request-summary-card__block">
          <h3>{t("summary.travelStyle")}</h3>
          <p>{requestItem.travelStyle}</p>
        </div>

        <div className="request-summary-card__block">
          <h3>{t("summary.interests")}</h3>
          <div className="request-detail-tags">
            {(showFullDetails
              ? requestItem.interests
              : requestItem.interests.slice(0, 4)
            ).map((interest) => (
              <span key={interest} className="request-detail-tag">
                {interest}
              </span>
            ))}

            {!showFullDetails && requestItem.interests.length > 4 ? (
              <span className="request-detail-tag request-detail-tag--count">
                {t("summary.moreCount", {
                  count: requestItem.interests.length - 4,
                })}
              </span>
            ) : null}
          </div>
        </div>

        <div className="request-summary-card__block">
          <h3>{t("summary.extraNotes")}</h3>
          <p>
            {showFullDetails
              ? requestItem.extraNotes || t("summary.noNotes")
              : requestItem.extraNotes
                ? requestItem.extraNotes.length > 180
                  ? `${requestItem.extraNotes.slice(0, 180)}...`
                  : requestItem.extraNotes
                : t("summary.noNotes")}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="request-summary-card__toggle"
        onClick={onToggleDetails}
      >
        {showFullDetails ? t("summary.showLess") : t("summary.showFull")}
      </button>

      {!canViewProposals &&
      requestItem.status === "open" &&
      !alreadyProposed ? (
        <div className="request-apply-bar">
          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={onClickApply}
          >
            Apply
          </button>
        </div>
      ) : null}

      {!canViewProposals &&
      (requestItem.status === "matched" ||
        requestItem.status === "in_progress") &&
      isMatchedPlanner ? (
        <div className="request-apply-bar">
          <Link
            to={`/requests/${requestItem.id}/work-plan`}
            className="btn btn--primary btn--large"
          >
            Build plan
          </Link>
        </div>
      ) : null}

      {!canViewProposals &&
      requestItem.status === "submitted" &&
      isMatchedPlanner ? (
        <div className="request-apply-bar">
          <Link
            to={`/requests/${requestItem.id}/work-plan`}
            className="btn btn--primary btn--large"
          >
            Edit Plan
          </Link>
        </div>
      ) : null}
    </article>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  getPlannerOwnPlans,
  getPlannerReceivedDirectProposals,
  getPlannerReceivedReviews,
  getPlannerSentProposals,
  type PlannerOwnPlanItem,
  type PlannerReviewItem,
  type ReceivedDirectProposalItem,
  type SentProposalItem,
} from "../../services/plannerDashboardApi";

export default function PlannerDashboardPanel() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation("profilePage");

  const [sentProposals, setSentProposals] = useState<SentProposalItem[]>([]);
  const [receivedDirectProposals, setReceivedDirectProposals] = useState<
    ReceivedDirectProposalItem[]
  >([]);
  const [ownPlans, setOwnPlans] = useState<PlannerOwnPlanItem[]>([]);
  const [reviews, setReviews] = useState<PlannerReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const [
          sentProposalsResponse,
          directProposalsResponse,
          plansResponse,
          reviewsResponse,
        ] = await Promise.all([
          getPlannerSentProposals(token),
          getPlannerReceivedDirectProposals(token),
          getPlannerOwnPlans(token),
          getPlannerReceivedReviews(token),
        ]);

        setSentProposals(sentProposalsResponse.data);
        setReceivedDirectProposals(directProposalsResponse.data);
        setOwnPlans(plansResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t("dashboard.states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboard();
  }, [token, t]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "—";
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="profile-panel">
        <div className="profile-panel__state-card">
          <p>{t("dashboard.states.loading")}</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="profile-panel">
        <div className="profile-panel__state-card profile-panel__state-card--error">
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <h2>{t("dashboard.title")}</h2>
        <p>{t("dashboard.description")}</p>
      </div>

      <div className="planner-dashboard-summary-grid">
        <article className="planner-dashboard-summary-card">
          <span className="planner-dashboard-summary-card__label">
            {t("dashboard.summary.coins")}
          </span>
          <strong className="planner-dashboard-summary-card__value">
            1,280
          </strong>
          <p className="planner-dashboard-summary-card__description">
            {t("dashboard.summary.coinsDesc")}
          </p>
          <button className="btn btn--secondary">
            {t("dashboard.summary.withdraw")}
          </button>
        </article>

        <article className="planner-dashboard-summary-card">
          <span className="planner-dashboard-summary-card__label">
            {t("dashboard.summary.sentProposals")}
          </span>
          <strong className="planner-dashboard-summary-card__value">
            {sentProposals.length}
          </strong>
          <p className="planner-dashboard-summary-card__description">
            {t("dashboard.summary.sentProposalsDesc")}
          </p>
        </article>

        <article className="planner-dashboard-summary-card">
          <span className="planner-dashboard-summary-card__label">
            {t("dashboard.summary.receivedDirect")}
          </span>
          <strong className="planner-dashboard-summary-card__value">
            {receivedDirectProposals.length}
          </strong>
          <p className="planner-dashboard-summary-card__description">
            {t("dashboard.summary.receivedDirectDesc")}
          </p>
        </article>

        <article className="planner-dashboard-summary-card">
          <span className="planner-dashboard-summary-card__label">
            {t("dashboard.summary.avgRating")}
          </span>
          <strong className="planner-dashboard-summary-card__value">
            {averageRating}
          </strong>
          <p className="planner-dashboard-summary-card__description">
            {t("dashboard.summary.avgRatingDesc")}
          </p>
        </article>
      </div>

      <div className="planner-dashboard-grid">
        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("dashboard.sections.sentList")}</h2>
            <span>{sentProposals.length}</span>
          </div>

          {sentProposals.length > 0 ? (
            <div className="planner-dashboard-list">
              {sentProposals.map((item) => (
                <div key={item.id} className="planner-dashboard-list-item">
                  <div className="planner-dashboard-list-item__top">
                    <div>
                      <strong>{item.request.destination}</strong>
                      <span>
                        {t("dashboard.common.traveller")}:{" "}
                        {item.request.traveller.name}
                      </span>
                    </div>
                    <span
                      className={`planner-status-badge planner-status-badge--${item.status}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p>{item.message}</p>

                  <div className="planner-dashboard-list-item__meta">
                    <span>{item.request.duration}</span>
                    <span>{item.request.budget}</span>
                    {item.proposedPrice != null ? (
                      <span>
                        {t("dashboard.common.price")}: {item.proposedPrice}
                      </span>
                    ) : null}
                    {item.estimatedDays != null ? (
                      <span>
                        {item.estimatedDays} {t("dashboard.common.days")}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="planner-dashboard-empty-text">
              {t("dashboard.empty.sent")}
            </p>
          )}
        </article>

        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("dashboard.sections.receivedDirect")}</h2>
            <span>{receivedDirectProposals.length}</span>
          </div>

          {receivedDirectProposals.length > 0 ? (
            <div className="planner-dashboard-list">
              {receivedDirectProposals.map((item) => (
                <div key={item.id} className="planner-dashboard-list-item">
                  <div className="planner-dashboard-list-item__top">
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {t("dashboard.common.from")}: {item.traveller.name}
                      </span>
                    </div>
                    <span
                      className={`planner-status-badge planner-status-badge--${item.status}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p>{item.message}</p>

                  <div className="planner-dashboard-list-item__meta">
                    <span>{item.destination}</span>
                    <span>{item.duration}</span>
                    <span>{item.budget}</span>
                  </div>

                  <div className="planner-dashboard-list-item__meta">
                    <span>
                      {t("dashboard.common.style")}: {item.travelStyle}
                    </span>
                  </div>

                  {item.interests.length > 0 ? (
                    <div className="planner-dashboard-tags">
                      {item.interests.map((interest) => (
                        <span key={interest} className="planner-dashboard-tag">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="planner-dashboard-empty-text">
              {t("dashboard.empty.receivedDirect")}
            </p>
          )}
        </article>

        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("dashboard.sections.myPlans")}</h2>
            <span>{ownPlans.length}</span>
          </div>

          {ownPlans.length > 0 ? (
            <div className="planner-dashboard-list">
              {ownPlans.map((plan) => (
                <div key={plan.id} className="planner-dashboard-list-item">
                  <div className="planner-dashboard-list-item__top">
                    <div>
                      <strong>{plan.title}</strong>
                      <span>{plan.destination}</span>
                    </div>
                    <span
                      className={`planner-visibility-badge planner-visibility-badge--${plan.visibility}`}
                    >
                      {plan.visibility}
                    </span>
                  </div>

                  <p>{plan.summary}</p>

                  <div className="planner-dashboard-list-item__meta">
                    <span>{plan.duration}</span>
                    <span>GBP {plan.price}</span>
                    {plan.request ? (
                      <span>
                        {t("dashboard.common.request")}:{" "}
                        {plan.request.destination}
                      </span>
                    ) : null}
                  </div>

                  {plan.tags.length > 0 ? (
                    <div className="planner-dashboard-tags">
                      {plan.tags.map((tag) => (
                        <span key={tag} className="planner-dashboard-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="planner-dashboard-empty-text">
              {t("dashboard.empty.plans")}
            </p>
          )}
        </article>

        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("dashboard.sections.reviews")}</h2>
            <span>{reviews.length}</span>
          </div>

          {reviews.length > 0 ? (
            <div className="planner-dashboard-list">
              {reviews.map((review) => (
                <div key={review.id} className="planner-dashboard-list-item">
                  <div className="planner-dashboard-list-item__top">
                    <div>
                      <strong>{review.traveller.name}</strong>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString(
                          i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
                        )}
                      </span>
                    </div>
                    <span className="planner-rating-badge">
                      ⭐ {review.rating.toFixed(1)}
                    </span>
                  </div>

                  <p>{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="planner-dashboard-empty-text">
              {t("dashboard.empty.reviews")}
            </p>
          )}
        </article>
      </div>

      <div className="planner-dashboard-bottom-grid">
        <article className="planner-dashboard-card planner-dashboard-card--placeholder">
          <div className="planner-dashboard-card__header">
            <h2>{t("dashboard.sections.futureReviews")}</h2>
            <span>{t("dashboard.common.uiOnly")}</span>
          </div>

          <p className="planner-dashboard-empty-text">
            {t("dashboard.placeholder.desc")}
          </p>

          <div className="planner-placeholder-list">
            <div className="planner-placeholder-item">
              <strong>{t("dashboard.placeholder.item1Title")}</strong>
              <span>{t("dashboard.placeholder.item1Desc")}</span>
            </div>
            <div className="planner-placeholder-item">
              <strong>{t("dashboard.placeholder.item2Title")}</strong>
              <span>{t("dashboard.placeholder.item2Desc")}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

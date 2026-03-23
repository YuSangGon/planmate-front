import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  getPlannerOwnPlans,
  getPlannerReceivedDirectProposals,
  getPlannerReceivedReviews,
  getPlannerSentProposals,
  type PlannerOwnPlanItem,
  type PlannerReviewItem,
  type ReceivedDirectProposalItem,
  type SentProposalItem,
} from "../services/plannerDashboardApi";
import "../styles/PlannerDashboardPage.css";

export default function PlannerDashboardPage() {
  const { token, user } = useAuth();
  const { t, i18n } = useTranslation("plannerDashboard");

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
          error instanceof Error ? error.message : t("states.loadError"),
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

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title", { name: user?.name ?? "" })}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        {isLoading ? (
          <div className="planner-dashboard-state-card">
            <p>{t("states.loading")}</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="planner-dashboard-state-card planner-dashboard-state-card--error">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage ? (
          <>
            <div className="planner-dashboard-summary-grid">
              <article className="planner-dashboard-summary-card">
                <span className="planner-dashboard-summary-card__label">
                  {t("summary.myCoins.label")}
                </span>
                <strong className="planner-dashboard-summary-card__value">
                  1,280
                </strong>
                <p className="planner-dashboard-summary-card__description">
                  {t("summary.myCoins.description")}
                </p>
                <button className="btn btn--secondary">
                  {t("summary.myCoins.action")}
                </button>
              </article>

              <article className="planner-dashboard-summary-card">
                <span className="planner-dashboard-summary-card__label">
                  {t("summary.sentProposals.label")}
                </span>
                <strong className="planner-dashboard-summary-card__value">
                  {sentProposals.length}
                </strong>
                <p className="planner-dashboard-summary-card__description">
                  {t("summary.sentProposals.description")}
                </p>
              </article>

              <article className="planner-dashboard-summary-card">
                <span className="planner-dashboard-summary-card__label">
                  {t("summary.receivedDirectProposals.label")}
                </span>
                <strong className="planner-dashboard-summary-card__value">
                  {receivedDirectProposals.length}
                </strong>
                <p className="planner-dashboard-summary-card__description">
                  {t("summary.receivedDirectProposals.description")}
                </p>
              </article>

              <article className="planner-dashboard-summary-card">
                <span className="planner-dashboard-summary-card__label">
                  {t("summary.averageRating.label")}
                </span>
                <strong className="planner-dashboard-summary-card__value">
                  {averageRating}
                </strong>
                <p className="planner-dashboard-summary-card__description">
                  {t("summary.averageRating.description")}
                </p>
              </article>
            </div>

            <div className="planner-dashboard-grid">
              <article className="planner-dashboard-card">
                <div className="planner-dashboard-card__header">
                  <h2>{t("sections.sentProposalList.title")}</h2>
                  <span>{sentProposals.length}</span>
                </div>

                {sentProposals.length > 0 ? (
                  <div className="planner-dashboard-list">
                    {sentProposals.map((item) => (
                      <div
                        key={item.id}
                        className="planner-dashboard-list-item"
                      >
                        <div className="planner-dashboard-list-item__top">
                          <div>
                            <strong>{item.request.destination}</strong>
                            <span>
                              {t("labels.traveller")}:{" "}
                              {item.request.traveller.name}
                            </span>
                          </div>
                          <span
                            className={`planner-status-badge planner-status-badge--${item.status}`}
                          >
                            {t(`statuses.${item.status}`)}
                          </span>
                        </div>

                        <p>{item.message}</p>

                        <div className="planner-dashboard-list-item__meta">
                          <span>{item.request.duration}</span>
                          <span>{item.request.budget}</span>
                          {item.proposedPrice != null ? (
                            <span>
                              {t("labels.priceValue", {
                                price: item.proposedPrice,
                              })}
                            </span>
                          ) : null}
                          {item.estimatedDays != null ? (
                            <span>
                              {t("labels.daysValue", {
                                count: item.estimatedDays,
                              })}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="planner-dashboard-empty-text">
                    {t("sections.sentProposalList.empty")}
                  </p>
                )}
              </article>

              <article className="planner-dashboard-card">
                <div className="planner-dashboard-card__header">
                  <h2>{t("sections.directProposalsReceived.title")}</h2>
                  <span>{receivedDirectProposals.length}</span>
                </div>

                {receivedDirectProposals.length > 0 ? (
                  <div className="planner-dashboard-list">
                    {receivedDirectProposals.map((item) => (
                      <div
                        key={item.id}
                        className="planner-dashboard-list-item"
                      >
                        <div className="planner-dashboard-list-item__top">
                          <div>
                            <strong>{item.title}</strong>
                            <span>
                              {t("labels.from")}: {item.traveller.name}
                            </span>
                          </div>
                          <span
                            className={`planner-status-badge planner-status-badge--${item.status}`}
                          >
                            {t(`statuses.${item.status}`)}
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
                            {t("labels.style")}: {item.travelStyle}
                          </span>
                        </div>

                        {item.interests.length > 0 ? (
                          <div className="planner-dashboard-tags">
                            {item.interests.map((interest) => (
                              <span
                                key={interest}
                                className="planner-dashboard-tag"
                              >
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
                    {t("sections.directProposalsReceived.empty")}
                  </p>
                )}
              </article>

              <article className="planner-dashboard-card">
                <div className="planner-dashboard-card__header">
                  <h2>{t("sections.myPlans.title")}</h2>
                  <span>{ownPlans.length}</span>
                </div>

                {ownPlans.length > 0 ? (
                  <div className="planner-dashboard-list">
                    {ownPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="planner-dashboard-list-item"
                      >
                        <div className="planner-dashboard-list-item__top">
                          <div>
                            <strong>{plan.title}</strong>
                            <span>{plan.destination}</span>
                          </div>
                          <span
                            className={`planner-visibility-badge planner-visibility-badge--${plan.visibility}`}
                          >
                            {t(`visibility.${plan.visibility}`)}
                          </span>
                        </div>

                        <p>{plan.summary}</p>

                        <div className="planner-dashboard-list-item__meta">
                          <span>{plan.duration}</span>
                          <span>
                            {t("labels.gbpValue", { price: plan.price })}
                          </span>
                          {plan.request ? (
                            <span>
                              {t("labels.request")}: {plan.request.destination}
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
                    {t("sections.myPlans.empty")}
                  </p>
                )}
              </article>

              <article className="planner-dashboard-card">
                <div className="planner-dashboard-card__header">
                  <h2>{t("sections.reviewsAboutMe.title")}</h2>
                  <span>{reviews.length}</span>
                </div>

                {reviews.length > 0 ? (
                  <div className="planner-dashboard-list">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="planner-dashboard-list-item"
                      >
                        <div className="planner-dashboard-list-item__top">
                          <div>
                            <strong>{review.traveller.name}</strong>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString(
                                i18n.resolvedLanguage === "ko"
                                  ? "ko-KR"
                                  : "en-GB",
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
                    {t("sections.reviewsAboutMe.empty")}
                  </p>
                )}
              </article>
            </div>

            <div className="planner-dashboard-bottom-grid">
              <article className="planner-dashboard-card planner-dashboard-card--placeholder">
                <div className="planner-dashboard-card__header">
                  <h2>{t("sections.reviewsIGave.title")}</h2>
                  <span>{t("sections.reviewsIGave.badge")}</span>
                </div>

                <p className="planner-dashboard-empty-text">
                  {t("sections.reviewsIGave.description")}
                </p>

                <div className="planner-placeholder-list">
                  <div className="planner-placeholder-item">
                    <strong>
                      {t("sections.reviewsIGave.placeholder1Title")}
                    </strong>
                    <span>
                      {t("sections.reviewsIGave.placeholder1Description")}
                    </span>
                  </div>
                  <div className="planner-placeholder-item">
                    <strong>
                      {t("sections.reviewsIGave.placeholder2Title")}
                    </strong>
                    <span>
                      {t("sections.reviewsIGave.placeholder2Description")}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </>
        ) : null}
      </section>
    </MainLayout>
  );
}

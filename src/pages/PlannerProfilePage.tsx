import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { getPlannerDetail, type PlannerProfile } from "../services/plannerApi";
import ReviewStarsDisplay from "../components/review/ReviewStarsDisplay";
import "../styles/PlannerProfilePage.css";

const REVIEWS_PER_PAGE = 10;

export default function PlannerProfilePage() {
  const { plannerId } = useParams();
  const { t, i18n } = useTranslation("plannerProfile");

  const [planner, setPlanner] = useState<PlannerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    const fetchPlanner = async () => {
      if (!plannerId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlannerDetail(plannerId);
        setPlanner(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlanner();
  }, [plannerId, t]);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const plannerReviews = planner?.plannerReviews ?? [];
  const totalReviewPages = Math.max(
    1,
    Math.ceil(plannerReviews.length / REVIEWS_PER_PAGE),
  );

  const paginatedReviews = useMemo(() => {
    const startIndex = (reviewPage - 1) * REVIEWS_PER_PAGE;
    return plannerReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [plannerReviews, reviewPage]);

  useEffect(() => {
    if (reviewPage > totalReviewPages) {
      setReviewPage(totalReviewPages);
    }
  }, [reviewPage, totalReviewPages]);

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="planner-profile-state-card">
            <h2 className="content-title">{t("states.loading")}</h2>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (errorMessage || !planner) {
    return (
      <MainLayout>
        <section className="section">
          <div className="planner-profile-state-card">
            <h2 className="content-title">{t("states.notFoundTitle")}</h2>
            <p className="content-description">
              {errorMessage || t("states.notFoundDescription")}
            </p>
            <Link to="/planners" className="btn btn--primary">
              {t("actions.backToPlanners")}
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={planner.name}
        description={planner.description}
      />

      <section className="section section--compact">
        <div className="planner-profile-layout">
          <div className="planner-profile-main">
            <article className="planner-profile-card planner-profile-card--hero">
              <div className="planner-profile-hero">
                <div className="planner-profile-avatar">{planner.name[0]}</div>

                <div className="planner-profile-hero__content">
                  <h2>{planner.name}</h2>
                  <p className="planner-profile-specialty">
                    {planner.strengths}
                  </p>

                  <div className="planner-profile-meta">
                    <span>⭐ {planner.plannerReviewSummary.rating}</span>
                    <span>{planner.plannerReviewSummary.reviewCount}</span>
                    <span>
                      {t("meta.completedPlans", {
                        count: planner.completedPlans,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="planner-profile-section">
                <h3>{t("sections.aboutPlanner")}</h3>
                <p>{planner.description}</p>
              </div>
            </article>

            <article className="planner-profile-card">
              <div className="planner-profile-section-header">
                <h3>{t("sections.reviews")}</h3>
                <span>
                  {t("meta.reviewsShown", {
                    count: plannerReviews.length,
                  })}
                </span>
              </div>

              <div className="planner-review-list">
                {plannerReviews.length > 0 ? (
                  <>
                    {paginatedReviews.map((review) => (
                      <div key={review.id} className="planner-review-card">
                        <div className="planner-review-card__top">
                          <div>
                            <strong>
                              {review.traveller
                                ? review.traveller.name
                                : "anonymouse"}
                            </strong>
                            <span>
                              {new Date(review.createdAt).toLocaleDateString(
                                i18n.resolvedLanguage === "ko"
                                  ? "ko-KR"
                                  : "en-GB",
                              )}
                            </span>
                          </div>

                          <span className="planner-review-card__rating">
                            ⭐ {Number(review.overallRating).toFixed(1)}
                          </span>
                        </div>

                        <div className="planner-review-card__scores">
                          <ReviewStarsDisplay
                            label="Plan quality"
                            value={Number(review.planQuality)}
                          />
                          <ReviewStarsDisplay
                            label="Communication"
                            value={Number(review.communication)}
                          />
                          <ReviewStarsDisplay
                            label="Timeliness"
                            value={Number(review.timeliness)}
                          />
                          <ReviewStarsDisplay
                            label="Personalisation"
                            value={Number(review.personalisation)}
                          />
                          <ReviewStarsDisplay
                            label="Practicality"
                            value={Number(review.practicality)}
                          />
                          <ReviewStarsDisplay
                            label="Detail level"
                            value={Number(review.detailLevel)}
                          />
                        </div>

                        {review.content ? (
                          <div className="planner-review-card__message">
                            <p>{review.content}</p>
                          </div>
                        ) : null}
                      </div>
                    ))}

                    {plannerReviews.length > REVIEWS_PER_PAGE ? (
                      <div className="planner-review-pagination">
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() =>
                            setReviewPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={reviewPage === 1}
                        >
                          Previous
                        </button>

                        <span className="planner-review-pagination__info">
                          {reviewPage} / {totalReviewPages}
                        </span>

                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() =>
                            setReviewPage((prev) =>
                              Math.min(totalReviewPages, prev + 1),
                            )
                          }
                          disabled={reviewPage === totalReviewPages}
                        >
                          Next
                        </button>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="planner-profile-empty-text">
                    {t("sections.noReviews")}
                  </p>
                )}
              </div>
            </article>
          </div>

          <aside className="planner-profile-side">
            <article className="planner-profile-card">
              <div className="planner-profile-section-header">
                <h3>
                  {t("sections.plansCreatedTitle", { name: planner.name })}
                </h3>
                <span>
                  {t("meta.planCount", {
                    count: planner.plannerPlans.length,
                  })}
                </span>
              </div>

              <div className="planner-plan-list">
                {planner.plannerPlans.length > 0 ? (
                  planner.plannerPlans.map((plan) => (
                    <div key={plan.id} className="planner-plan-card">
                      <div className="planner-plan-card__top">
                        <div>
                          <h4>{plan.title}</h4>
                          <p className="planner-plan-card__destination">
                            {plan.destination}
                          </p>
                        </div>

                        <div className="planner-plan-card__meta">
                          <span>{plan.duration}</span>
                          <span>{plan.price}</span>
                        </div>
                      </div>

                      <p className="planner-plan-card__summary">
                        {plan.summary}
                      </p>

                      <div className="planner-profile-tags">
                        {plan.tags.map((tag) => (
                          <span
                            key={tag}
                            className="planner-profile-tag planner-profile-tag--soft"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="planner-profile-empty-text">
                    {t("sections.noPublicPlans")}
                  </p>
                )}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}

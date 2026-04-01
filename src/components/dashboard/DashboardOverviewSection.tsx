import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardOverview,
  type DashboardPlannerReviewSummary,
  type DashboardStats,
} from "../../services/dashboardApi";
import ReviewStarsDisplay from "../review/ReviewStarsDisplay";

export default function DashboardOverviewSection() {
  const { token } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviewSummary, setReviewSummary] =
    useState<DashboardPlannerReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getDashboardOverview(token);
        setStats(response.data.stats);
        setReviewSummary(response.data.plannerReviewSummary);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard overview.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOverview();
  }, [token]);

  if (isLoading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__state-card">
          <p>Loading overview...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__state-card dashboard-panel__state-card--error">
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__header">
        <h2>Overview</h2>
        <p>See your current performance and activity at a glance.</p>
      </div>

      <div className="dashboard-summary-grid">
        <article className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">Requests</span>
          <strong className="dashboard-summary-card__value">
            {stats?.activeRequestsCount ?? 0}
          </strong>
        </article>

        <article className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">
            Received proposals
          </span>
          <strong className="dashboard-summary-card__value">
            {stats?.receivedProposalsCount ?? 0}
          </strong>
        </article>

        <article className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">My plans</span>
          <strong className="dashboard-summary-card__value">
            {stats?.myPlansCount ?? 0}
          </strong>
        </article>

        <article className="dashboard-summary-card">
          <span className="dashboard-summary-card__label">Completed plans</span>
          <strong className="dashboard-summary-card__value">
            {stats?.completedPlansCount ?? 0}
          </strong>
        </article>
      </div>

      <article className="dashboard-card-block">
        <div className="dashboard-card-block__header">
          <h3>Planner review summary</h3>
          <span>{reviewSummary?.reviewCount ?? 0} reviews</span>
        </div>

        {reviewSummary ? (
          <>
            <div className="dashboard-review-summary-top">
              <div className="dashboard-review-summary-overall">
                <span>Overall</span>
                <strong>{reviewSummary.rating.toFixed(1)}</strong>
              </div>

              <div className="dashboard-review-summary-strengths">
                {reviewSummary.strengths ? (
                  reviewSummary.strengths.split(",").map((item) => (
                    <span key={item.trim()} className="dashboard-strength-tag">
                      {item.trim()}
                    </span>
                  ))
                ) : (
                  <span className="dashboard-muted-text">
                    No strengths yet.
                  </span>
                )}
              </div>
            </div>

            <div className="dashboard-review-summary-grid">
              <ReviewStarsDisplay
                label="Plan quality"
                value={reviewSummary.planQuality}
              />
              <ReviewStarsDisplay
                label="Communication"
                value={reviewSummary.communication}
              />
              <ReviewStarsDisplay
                label="Timeliness"
                value={reviewSummary.timeliness}
              />
              <ReviewStarsDisplay
                label="Personalisation"
                value={reviewSummary.personalisation}
              />
              <ReviewStarsDisplay
                label="Practicality"
                value={reviewSummary.practicality}
              />
              <ReviewStarsDisplay
                label="Detail level"
                value={reviewSummary.detailLevel}
              />
            </div>
          </>
        ) : (
          <p className="dashboard-empty-text">No planner reviews yet.</p>
        )}
      </article>
    </div>
  );
}

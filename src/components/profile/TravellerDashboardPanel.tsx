import { useTranslation } from "react-i18next";

export default function TravellerDashboardPanel() {
  const { t } = useTranslation("profilePage");

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <h2>{t("travellerDashboard.title")}</h2>
        <p>{t("travellerDashboard.description")}</p>
      </div>

      <div className="traveller-dashboard-summary-grid">
        <article className="traveller-dashboard-summary-card">
          <span className="traveller-dashboard-summary-card__label">
            {t("travellerDashboard.summary.openRequests")}
          </span>
          <strong className="traveller-dashboard-summary-card__value">2</strong>
          <p className="traveller-dashboard-summary-card__description">
            {t("travellerDashboard.summary.openRequestsDesc")}
          </p>
        </article>

        <article className="traveller-dashboard-summary-card">
          <span className="traveller-dashboard-summary-card__label">
            {t("travellerDashboard.summary.activeTrips")}
          </span>
          <strong className="traveller-dashboard-summary-card__value">1</strong>
          <p className="traveller-dashboard-summary-card__description">
            {t("travellerDashboard.summary.activeTripsDesc")}
          </p>
        </article>

        <article className="traveller-dashboard-summary-card">
          <span className="traveller-dashboard-summary-card__label">
            {t("travellerDashboard.summary.directProposalsSent")}
          </span>
          <strong className="traveller-dashboard-summary-card__value">3</strong>
          <p className="traveller-dashboard-summary-card__description">
            {t("travellerDashboard.summary.directProposalsSentDesc")}
          </p>
        </article>

        <article className="traveller-dashboard-summary-card">
          <span className="traveller-dashboard-summary-card__label">
            {t("travellerDashboard.summary.completedTrips")}
          </span>
          <strong className="traveller-dashboard-summary-card__value">4</strong>
          <p className="traveller-dashboard-summary-card__description">
            {t("travellerDashboard.summary.completedTripsDesc")}
          </p>
        </article>
      </div>

      <div className="traveller-dashboard-grid">
        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("travellerDashboard.sections.myRequests")}</h2>
            <span>{t("travellerDashboard.common.uiOnly")}</span>
          </div>

          <div className="planner-placeholder-list">
            <div className="planner-placeholder-item">
              <strong>
                {t("travellerDashboard.placeholders.request1Title")}
              </strong>
              <span>{t("travellerDashboard.placeholders.request1Status")}</span>
            </div>
            <div className="planner-placeholder-item">
              <strong>
                {t("travellerDashboard.placeholders.request2Title")}
              </strong>
              <span>{t("travellerDashboard.placeholders.request2Status")}</span>
            </div>
          </div>
        </article>

        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("travellerDashboard.sections.directProposalsSent")}</h2>
            <span>{t("travellerDashboard.common.uiOnly")}</span>
          </div>

          <div className="planner-placeholder-list">
            <div className="planner-placeholder-item">
              <strong>
                {t("travellerDashboard.placeholders.proposal1Title")}
              </strong>
              <span>
                {t("travellerDashboard.placeholders.proposal1Status")}
              </span>
            </div>
            <div className="planner-placeholder-item">
              <strong>
                {t("travellerDashboard.placeholders.proposal2Title")}
              </strong>
              <span>
                {t("travellerDashboard.placeholders.proposal2Status")}
              </span>
            </div>
          </div>
        </article>

        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("travellerDashboard.sections.currentPlans")}</h2>
            <span>{t("travellerDashboard.common.uiOnly")}</span>
          </div>

          <div className="planner-placeholder-list">
            <div className="planner-placeholder-item">
              <strong>{t("travellerDashboard.placeholders.plan1Title")}</strong>
              <span>{t("travellerDashboard.placeholders.plan1Status")}</span>
            </div>
            <div className="planner-placeholder-item">
              <strong>{t("travellerDashboard.placeholders.plan2Title")}</strong>
              <span>{t("travellerDashboard.placeholders.plan2Status")}</span>
            </div>
          </div>
        </article>

        <article className="planner-dashboard-card">
          <div className="planner-dashboard-card__header">
            <h2>{t("travellerDashboard.sections.myReviews")}</h2>
            <span>{t("travellerDashboard.common.uiOnly")}</span>
          </div>

          <div className="planner-placeholder-list">
            <div className="planner-placeholder-item">
              <strong>
                {t("travellerDashboard.placeholders.review1Title")}
              </strong>
              <span>{t("travellerDashboard.placeholders.review1Status")}</span>
            </div>
            <div className="planner-placeholder-item">
              <strong>
                {t("travellerDashboard.placeholders.review2Title")}
              </strong>
              <span>{t("travellerDashboard.placeholders.review2Status")}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

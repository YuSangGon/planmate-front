import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { getPlannerList, type PlannerListItem } from "../services/plannerApi";
import { Link } from "react-router-dom";

export default function PlannerListPage() {
  const { t } = useTranslation("plannerList");

  const [planners, setPlanners] = useState<PlannerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPlanners = async () => {
      try {
        const response = await getPlannerList();
        console.log(response.data);
        setPlanners(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlanners();
  }, [t]);

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="filter-bar">
          <button className="filter-chip filter-chip--active">
            {t("filters.allPlanners")}
          </button>
          <button className="filter-chip">{t("filters.budgetTrips")}</button>
          <button className="filter-chip">{t("filters.cityBreaks")}</button>
          <button className="filter-chip">{t("filters.foodRoutes")}</button>
          <button className="filter-chip">{t("filters.slowTravel")}</button>
        </div>

        {isLoading ? (
          <div className="request-form-card">
            <p className="content-description">{t("states.loading")}</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="request-form-card">
            <p className="content-description" style={{ color: "#b42318" }}>
              {errorMessage}
            </p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && planners.length === 0 ? (
          <div className="request-form-card">
            <p className="content-description">{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && planners.length > 0 ? (
          <div className="grid grid--3">
            {planners.map((planner) => (
              <Link
                to={`/planners/${planner.id}`}
                className="planner-card planner-card--detailed planner-card--clickable"
                key={planner.id}
              >
                <div className="planner-card__avatar">{planner.name[0]}</div>

                <h3>{planner.name}</h3>

                <p className="planner-card__specialty">
                  {planner.plannerReviewSummary?.strengths || "no strengths"}
                </p>

                <p>{planner.description}</p>

                <div className="planner-card__meta">
                  <span>⭐ {planner.plannerReviewSummary?.rating ?? 0}</span>
                  <span>
                    ( {planner.plannerReviewSummary?.reviewCount ?? 0} )
                  </span>
                </div>

                <div className="planner-card__meta">
                  <span>
                    {t("card.completedPlans", {
                      count: planner.completedPlans,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}

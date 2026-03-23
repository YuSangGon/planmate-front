import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyPlans, getPlans, type PlanItem } from "../services/planApi";

export default function PlanListPage() {
  const { user, token } = useAuth();
  const { t } = useTranslation("planList");
  const isPlanner = user?.role === "planner";

  const [publicPlans, setPublicPlans] = useState<PlanItem[]>([]);
  const [myPlans, setMyPlans] = useState<PlanItem[]>([]);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const publicResponse = await getPlans();
        setPublicPlans(publicResponse.data);

        if (isPlanner && token) {
          const myResponse = await getMyPlans(token);
          setMyPlans(myResponse.data);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlans();
  }, [isPlanner, token, t]);

  const sourcePlans = showOnlyMine && isPlanner ? myPlans : publicPlans;

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="plans-toolbar">
          {isPlanner ? (
            <>
              <label className="plans-switch">
                <input
                  type="checkbox"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                />
                <span className="plans-switch__slider" />
                <span className="plans-switch__label">
                  {t("actions.onlyMyPlans")}
                </span>
              </label>

              <Link to="/plans/create" className="btn btn--primary">
                {t("actions.createPlan")}
              </Link>
            </>
          ) : null}
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

        {!isLoading && !errorMessage && sourcePlans.length === 0 ? (
          <div className="request-form-card">
            <p className="content-description">{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && sourcePlans.length > 0 ? (
          <div className="grid grid--3">
            {sourcePlans.map((plan) => (
              <article className="plan-card" key={plan.id}>
                <div className="plan-card__image">
                  <span className="plan-card__tag">
                    {plan.tags[0] || plan.destination}
                  </span>
                </div>

                <div className="plan-card__body">
                  <h3>{plan.title}</h3>
                  <p>{plan.summary}</p>

                  <div className="plan-card__footer">
                    <span className="plan-card__price">
                      {t("card.priceFrom", { price: plan.price })}
                    </span>
                    <Link to={`/plans/${plan.id}`} className="text-link">
                      {t("actions.viewPlan")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}

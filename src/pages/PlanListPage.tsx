import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlans, type PlanItem } from "../services/planApi";
import CreatePlanModal from "../components/plan/CreatePlanModal";

export default function PlanListPage() {
  const { token } = useAuth();
  const { t } = useTranslation("planList");

  const [publicPlans, setPublicPlans] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const publicResponse = await getPlans();
        setPublicPlans(publicResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlans();
  }, [token, t]);

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="plans-toolbar">
          <div />

          {/* <Link to="/plans/create" className="btn btn--primary">
            {t("actions.createPlan")}
          </Link> */}
          <button
            className="btn btn--primary"
            onClick={() => setIsModalOpen(true)}
          >
            {t("actions.createPlan")}
          </button>
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

        {!isLoading && !errorMessage && publicPlans.length === 0 ? (
          <div className="request-form-card">
            <p className="content-description">{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && publicPlans.length > 0 ? (
          <div className="grid grid--3">
            {publicPlans.map((plan) => (
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

      {isModalOpen && (
        <CreatePlanModal
          onClose={() => setIsModalOpen(false)}
          t={t}
          token={token}
        />
      )}
    </MainLayout>
  );
}

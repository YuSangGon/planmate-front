import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  approveTravellerPreviewPlan,
  getTravellerPreviewPlan,
  type WorkPlanPreview,
} from "../services/workPlanApi";
import "../styles/TravellerPlanPreviewPage.css";

export default function TravellerPlanPreviewPage() {
  const { requestId } = useParams();
  const { token } = useAuth();
  const { t } = useTranslation("travellerPlanPreview");

  const [plan, setPlan] = useState<WorkPlanPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token || !requestId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getTravellerPreviewPlan(token, requestId);
        setPlan(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlan();
  }, [token, requestId, t]);

  const handleApprove = async () => {
    if (!token || !requestId || !plan) return;

    setIsApproving(true);
    setErrorMessage("");

    try {
      const response = await approveTravellerPreviewPlan(token, requestId);
      setPlan({ ...plan, status: response.data.status });
      setToastMessage(t("states.approveSuccess"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.approveError"),
      );
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="preview-plan-state-card">
            <p>{t("states.loading")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!plan) {
    return (
      <MainLayout>
        <section className="section">
          <div className="preview-plan-state-card">
            <p>{errorMessage || t("states.notFound")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={"plan preview"}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <article className="preview-plan-card">
          <div className="preview-plan-section">
            <h3>{t("sections.planner")}</h3>
            <p>
              <strong>{plan.planner?.name}</strong>
            </p>
            <p>{plan.planner?.bio || t("sections.noPlannerBio")}</p>
          </div>

          <div className="preview-plan-section">
            <h3>{t("sections.plan")}</h3>

            <div className="preview-plan-days">
              {plan.previewContent.randomSamples.map((day, dayIndex) => (
                <div key={dayIndex} className="preview-plan-day-card">
                  <h4>{day.dayTitle}</h4>

                  <div className="preview-plan-items">
                    <div key={`item-${dayIndex}`} className="preview-plan-item">
                      <span className="preview-plan-item__time">
                        {day.startTime || t("sections.anyTime")} -{" "}
                        {day.endTime || t("sections.anyTime")}
                      </span>

                      <div className="preview-plan-item__content">
                        {day.place ? <p>{day.place}</p> : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errorMessage ? (
            <p className="preview-plan-error">{errorMessage}</p>
          ) : null}
          {toastMessage ? (
            <div className="preview-plan-toast">{toastMessage}</div>
          ) : null}

          {plan.status === "submitted" ? (
            <div className="preview-plan-actions">
              <button
                type="button"
                className="btn btn--primary btn--large"
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? t("actions.approving") : t("actions.approve")}
              </button>
            </div>
          ) : (
            <div className="preview-plan-approved-note">
              {t("states.alreadyApproved")}
            </div>
          )}
        </article>
      </section>
    </MainLayout>
  );
}

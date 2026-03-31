import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/PlanPreviewModal.css";
import WorkPlanPreparationPreviewSection from "./WorkPlanPreparationPreviewSection";
import WorkPlanHotelsPreviewSection from "./WorkPlanHotelsPreviewSection";
import WorkPlanExtrasPreviewSection from "./WorkPlanExtrasPreviewSection";
import WorkPlanDaysPreviewSection from "./WorkPlanDaysPreviewSection";
import { getPublicPlan, type Plan } from "../../services/workPlanApi";
import { useAuth } from "../../context/AuthContext";

type Props = {
  onClose: () => void;
};

export default function WorkPlanModal({ onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { planId } = useParams();
  const [plan, setPlan] = useState<Plan>();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const response = await getPublicPlan(planId as string, token);
        setPlan(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load preview plan",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlan();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Plan</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {!isLoading && (
          <div className="modal-content">
            <section className="section preview-section--compact">
              <article className="preview-plan-card">
                <WorkPlanPreparationPreviewSection
                  preparation={plan?.content.preparation}
                />
              </article>

              <article className="preview-plan-card">
                <WorkPlanHotelsPreviewSection hotels={plan?.content.hotels} />
              </article>

              <article className="preview-plan-card">
                <WorkPlanDaysPreviewSection days={plan?.content.days} />
              </article>

              <article className="preview-plan-card">
                <WorkPlanExtrasPreviewSection extras={plan?.content.extras} />
              </article>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

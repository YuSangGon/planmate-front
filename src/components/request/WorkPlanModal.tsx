import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/PlanPreviewModal.css";
import WorkPlanPreparationPreviewSection from "../preview/WorkPlanPreparationPreviewSection";
import WorkPlanHotelsPreviewSection from "../preview/WorkPlanHotelsPreviewSection";
import WorkPlanExtrasPreviewSection from "../preview/WorkPlanExtrasPreviewSection";
import WorkPlanDaysPreviewSection from "../preview/WorkPlanDaysPreviewSection";
import { getPrivatePlan, type Plan } from "../../services/workPlanApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

type Props = {
  onClose: () => void;
};

export default function WorkPlanModal({ onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { requestId } = useParams();
  const [plan, setPlan] = useState<Plan>();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const response = await getPrivatePlan(
          requestId as string,
          token as string,
        );
        setPlan(response.data);
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Failed to load preview plan",
          "error",
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
                <WorkPlanHotelsPreviewSection
                  hotels={plan?.content.hotels ?? []}
                />
              </article>

              <article className="preview-plan-card">
                <WorkPlanDaysPreviewSection days={plan?.content.days ?? []} />
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

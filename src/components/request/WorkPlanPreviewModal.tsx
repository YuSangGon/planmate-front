import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/PlanPreviewModal.css";
import { useAuth } from "../../context/AuthContext";
import WorkPlanPreparationPreviewSection from "../preview/WorkPlanPreparationPreviewSection";
import WorkPlanHotelsPreviewSection from "../preview/WorkPlanHotelsPreviewSection";
import WorkPlanExtrasPreviewSection from "../preview/WorkPlanExtrasPreviewSection";
import WorkPlanDaysPreviewSection from "../preview/WorkPlanDaysPreviewSection";
import {
  getPrivatePlanPrieview,
  type PlanPreview,
} from "../../services/workPlanApi";
import { useToast } from "../../context/ToastContext";

type Props = {
  onClose: () => void;
};

export default function WorkPlanPreviewModal({ onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const { requestId } = useParams();
  const [plan, setPlan] = useState<PlanPreview>();
  const { token } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const response = await getPrivatePlanPrieview(
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
          <h2 className="modal-title">Plan Preview</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {!isLoading && (
          <div className="modal-content">
            <section className="section preview-section--compact">
              <article className="preview-plan-card">
                <WorkPlanPreparationPreviewSection
                  preparation={plan?.previewContent.preparation}
                />
              </article>

              <article className="preview-plan-card">
                <WorkPlanHotelsPreviewSection
                  hotels={plan?.previewContent.hotels ?? []}
                />
              </article>

              <article className="preview-plan-card">
                <WorkPlanDaysPreviewSection
                  days={plan?.previewContent.days ?? []}
                />
              </article>

              <article className="preview-plan-card">
                <WorkPlanExtrasPreviewSection
                  extras={plan?.previewContent.extras}
                />
              </article>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

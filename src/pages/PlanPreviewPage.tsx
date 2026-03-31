import { useEffect, useState } from "react";
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

export default function PlanPreviewPage() {
  const { requestId } = useParams();
  const { token } = useAuth();

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
          error instanceof Error
            ? error.message
            : "Failed to load preview plan",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlan();
  }, [token, requestId]);

  const handleApprove = async () => {
    if (!token || !requestId || !plan) return;

    setIsApproving(true);
    setErrorMessage("");

    try {
      const response = await approveTravellerPreviewPlan(token, requestId);
      setPlan((prev) =>
        prev
          ? {
              ...prev,
              status: response.data.status,
            }
          : prev,
      );
      setToastMessage(
        "Plan approved. The request is now completed and coins were transferred to the planner.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to approve plan",
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
            <p>Loading preview...</p>
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
            <p>{errorMessage || "Preview plan not found."}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  const preview = plan.previewContent;

  return (
    <MainLayout>
      <PageHero
        eyebrow="Plan preview"
        title="preview title"
        description="Only a few fixed preview parts are shown before approval."
      />

      <section className="section section--compact">
        <article className="preview-plan-card">
          <div className="preview-plan-section">
            <h3>Planner</h3>
            <p>
              <strong>{plan.planner?.name}</strong>
            </p>
            <p>{plan.planner?.bio || "No planner bio provided."}</p>
          </div>

          {preview?.recommendedHotel ? (
            <div className="preview-plan-section">
              <h3>Recommended hotel sample</h3>
              <div className="preview-plan-hotel-card">
                <strong>{preview.recommendedHotel.name}</strong>
                <p>{preview.recommendedHotel.location}</p>
                <p>{preview.recommendedHotel.summary}</p>

                {preview.recommendedHotel.pros.length > 0 ? (
                  <div className="preview-plan-chip-group">
                    {preview.recommendedHotel.pros.slice(0, 3).map((item) => (
                      <span key={item} className="preview-plan-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {preview?.preparation ? (
            <div className="preview-plan-section">
              <h3>Preparation sample</h3>
              <div className="preview-plan-info-grid">
                {preview.preparation.visaInfo ? (
                  <div className="preview-plan-info-card">
                    <strong>Visa</strong>
                    <p>{preview.preparation.visaInfo}</p>
                  </div>
                ) : null}

                {preview.preparation.transportToAirport ? (
                  <div className="preview-plan-info-card">
                    <strong>Airport transfer</strong>
                    <p>{preview.preparation.transportToAirport}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="preview-plan-section">
            <h3>Fixed random samples</h3>
            <p className="preview-plan-helper-text">
              These sample items were randomly selected when the planner
              submitted the plan.
            </p>

            {preview?.randomSamples?.length ? (
              <div className="preview-plan-sample-list">
                {preview.randomSamples.map((item, index) => (
                  <div
                    key={`${item.dayTitle}-${item.startTime}-${index}`}
                    className="preview-plan-sample-card"
                  >
                    <div className="preview-plan-sample-card__top">
                      <div>
                        <strong>{item.dayTitle}</strong>
                        {item.dateLabel ? <span>{item.dateLabel}</span> : null}
                      </div>

                      <span>
                        {item.startTime || "--:--"} - {item.endTime || "--:--"}
                      </span>
                    </div>

                    <h4>{item.title || "Planned activity"}</h4>
                    <p className="preview-plan-sample-card__place">
                      {item.place || "Location details available in full plan"}
                    </p>

                    {item.description ? <p>{item.description}</p> : null}

                    <div className="preview-plan-chip-group">
                      {item.transport ? (
                        <span className="preview-plan-chip">
                          Transport: {item.transport}
                        </span>
                      ) : null}
                      {item.fee ? (
                        <span className="preview-plan-chip">
                          Fee: {item.fee}
                        </span>
                      ) : null}
                      {item.estimatedCost ? (
                        <span className="preview-plan-chip">
                          Cost: {item.estimatedCost}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="preview-plan-empty-text">
                No preview samples available yet.
              </p>
            )}
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
                {isApproving ? "Approving..." : "Approve full plan"}
              </button>
            </div>
          ) : (
            <div className="preview-plan-approved-note">
              This plan has already been approved.
            </div>
          )}
        </article>
      </section>
    </MainLayout>
  );
}

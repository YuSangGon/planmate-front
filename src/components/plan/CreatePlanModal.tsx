// src/components/plan/CreatePlanModal.tsx
import TagInputField from "../common/TagInputField";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/CreatePlanModal.css";
import { createWorkPlan, type PlanInfo } from "../../services/workPlanApi";
import { useToast } from "../../context/ToastContext";

type Props = {
  onClose: () => void;
  t: any;
  token: any;
};

export default function CreatePlanModal({ onClose, t, token }: Props) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCreate = async () => {
    if (!token) return;

    setIsCreating(true);
    setErrorMessage("");

    try {
      const res = await createWorkPlan(token, {
        title: title,
        destination: destination,
        summary: summary,
        price: Number(price),
        duration: duration,
        visibility: visibility,
        tags: tags,
      } as PlanInfo);
      showToast("Plan submitted successfully.", "success");
      onClose();
      navigate(`/plans/create/` + res.data.id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit plan",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <article className="create-plan-card">
          <h2 className="content-title">{t("content.title")}</h2>
          <p className="content-description">{t("content.description")}</p>

          <form className="create-plan-form">
            <div className="form-grid">
              <div className="form-field form-field--full">
                <label>{t("form.title")}</label>
                <input
                  type="text"
                  placeholder={t("form.titlePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>{t("form.destination")}</label>
                <input
                  type="text"
                  placeholder={t("form.destinationPlaceholder")}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>{t("form.duration")}</label>
                <input
                  type="text"
                  placeholder={t("form.durationPlaceholder")}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>{t("form.price")}</label>
                <input
                  type="number"
                  min="0"
                  placeholder={t("form.pricePlaceholder")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>{t("form.visibility")}</label>
                <select
                  value={visibility}
                  onChange={(e) =>
                    setVisibility(e.target.value as "public" | "private")
                  }
                >
                  <option value="public">{t("visibility.public")}</option>
                  <option value="private">{t("visibility.private")}</option>
                </select>
              </div>

              <div className="form-field form-field--full">
                <label>{t("form.summary")}</label>
                <textarea
                  rows={7}
                  placeholder={t("form.summaryPlaceholder")}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <TagInputField
                label={t("form.tags")}
                placeholder={t("form.tagsPlaceholder")}
                value={tags}
                onChange={setTags}
              />
            </div>

            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={handleCreate}
            >
              {isCreating ? "Creating..." : "Go to make plan detail"}
            </button>

            {errorMessage ? (
              <p className="work-plan-error">{errorMessage}</p>
            ) : null}
          </form>
        </article>
      </div>
    </div>
  );
}

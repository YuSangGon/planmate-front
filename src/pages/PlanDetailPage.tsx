import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import { useAuth } from "../context/AuthContext";
import {
  deletePlan,
  getPlanDetail,
  updatePlan,
  type PlanDetail,
} from "../services/planApi";
import "../styles/PlanDetailPage.css";

export default function PlanDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { t } = useTranslation("planDetail");

  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlanDetail(planId);
        const item = response.data;

        setPlan(item);
        setTitle(item.title);
        setDestination(item.destination);
        setSummary(item.summary);
        setPrice(String(item.price));
        setDuration(item.duration);
        setVisibility(item.visibility);
        setTags(item.tags);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlan();
  }, [planId, t]);

  const isOwner = useMemo(() => {
    return (
      !!plan && !!user && user.role === "planner" && plan.planner.id === user.id
    );
  }, [plan, user]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !planId) {
      setErrorMessage(t("errors.loginRequired"));
      return;
    }

    if (
      !title.trim() ||
      !destination.trim() ||
      !summary.trim() ||
      !price.trim() ||
      !duration.trim()
    ) {
      setErrorMessage(t("errors.requiredFields"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updatePlan(token, planId, {
        title: title.trim(),
        destination: destination.trim(),
        summary: summary.trim(),
        price: Number(price),
        duration: duration.trim(),
        visibility,
        tags,
      });

      setPlan((prev) =>
        prev
          ? {
              ...prev,
              title: title.trim(),
              destination: destination.trim(),
              summary: summary.trim(),
              price: Number(price),
              duration: duration.trim(),
              visibility,
              tags,
            }
          : prev,
      );

      setToastMessage(t("states.updated"));
      setIsEditing(false);
      window.setTimeout(() => setToastMessage(""), 1800);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.updateFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !planId) return;

    const confirmed = window.confirm(t("dialogs.deleteConfirm"));
    if (!confirmed) return;

    try {
      await deletePlan(token, planId);
      navigate("/plans");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.deleteFailed"),
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="plan-detail-state-card">
            <p>{t("states.loading")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!plan || errorMessage) {
    return (
      <MainLayout>
        <section className="section">
          <div className="plan-detail-state-card">
            <p>{errorMessage || t("states.notFound")}</p>
            <Link to="/plans" className="btn btn--primary">
              {t("actions.backToPlans")}
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={plan.title}
        description={plan.summary}
      />

      <section className="section section--compact">
        <div className="plan-detail-layout">
          <article className="plan-detail-card">
            {!isEditing ? (
              <>
                <div className="plan-detail-meta">
                  <span>{plan.destination}</span>
                  <span>{plan.duration}</span>
                  <span>{t("meta.priceValue", { price: plan.price })}</span>
                  <span>{t(`visibility.${plan.visibility}`)}</span>
                </div>

                <div className="plan-detail-section">
                  <h3>{t("sections.planner")}</h3>
                  <p>
                    <strong>{plan.planner.name}</strong>
                  </p>
                  <p>{plan.planner.bio || t("sections.noPlannerBio")}</p>
                </div>

                <div className="plan-detail-section">
                  <h3>{t("sections.summary")}</h3>
                  <p>{plan.summary}</p>
                </div>

                <div className="plan-detail-section">
                  <h3>{t("sections.tags")}</h3>
                  <div className="plan-detail-tags">
                    {plan.tags.map((tag) => (
                      <span key={tag} className="plan-detail-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {plan.request ? (
                  <div className="plan-detail-section">
                    <h3>{t("sections.linkedRequest")}</h3>
                    <p>
                      {plan.request.destination} · {plan.request.status}
                    </p>
                  </div>
                ) : null}

                {isOwner ? (
                  <div className="plan-detail-actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      {t("actions.edit")}
                    </button>
                    <button className="btn btn--ghost" onClick={handleDelete}>
                      {t("actions.delete")}
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <form className="create-plan-form" onSubmit={handleUpdate}>
                <div className="form-grid">
                  <div className="form-field form-field--full">
                    <label>{t("form.title")}</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.destination")}</label>
                    <input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.duration")}</label>
                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.price")}</label>
                    <input
                      type="number"
                      min="0"
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
                      rows={6}
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

                {errorMessage ? (
                  <p className="create-plan-error">{errorMessage}</p>
                ) : null}

                {toastMessage ? (
                  <div className="create-plan-toast">{toastMessage}</div>
                ) : null}

                <div className="plan-detail-actions">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("actions.saving")
                      : t("actions.saveChanges")}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    {t("actions.cancel")}
                  </button>
                </div>
              </form>
            )}
          </article>
        </div>
      </section>
    </MainLayout>
  );
}

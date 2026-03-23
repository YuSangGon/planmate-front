import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import { useAuth } from "../context/AuthContext";
import { createPlan } from "../services/planApi";
import "../styles/CreatePlanPage.css";

export default function CreatePlanPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { t } = useTranslation("createPlan");

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setErrorMessage(t("errors.loginRequired"));
      return;
    }

    if (user?.role !== "planner") {
      setErrorMessage(t("errors.onlyPlanners"));
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

    if (Number(price) < 0) {
      setErrorMessage(t("errors.negativePrice"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createPlan(token, {
        title: title.trim(),
        destination: destination.trim(),
        summary: summary.trim(),
        price: Number(price),
        duration: duration.trim(),
        visibility,
        tags,
      });

      setToastMessage(t("states.created"));

      window.setTimeout(() => {
        navigate("/plans");
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.createFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="create-plan-layout">
          <article className="create-plan-card">
            <h2 className="content-title">{t("content.title")}</h2>
            <p className="content-description">{t("content.description")}</p>

            <form className="create-plan-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label htmlFor="plan-title">{t("form.title")}</label>
                  <input
                    id="plan-title"
                    type="text"
                    placeholder={t("form.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="plan-destination">
                    {t("form.destination")}
                  </label>
                  <input
                    id="plan-destination"
                    type="text"
                    placeholder={t("form.destinationPlaceholder")}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="plan-duration">{t("form.duration")}</label>
                  <input
                    id="plan-duration"
                    type="text"
                    placeholder={t("form.durationPlaceholder")}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="plan-price">{t("form.price")}</label>
                  <input
                    id="plan-price"
                    type="number"
                    min="0"
                    placeholder={t("form.pricePlaceholder")}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="plan-visibility">
                    {t("form.visibility")}
                  </label>
                  <select
                    id="plan-visibility"
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
                  <label htmlFor="plan-summary">{t("form.summary")}</label>
                  <textarea
                    id="plan-summary"
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

              {errorMessage ? (
                <p className="create-plan-error">{errorMessage}</p>
              ) : null}

              {toastMessage ? (
                <div className="create-plan-toast">{toastMessage}</div>
              ) : null}

              <div className="create-plan-actions">
                <button
                  type="submit"
                  className="btn btn--primary btn--large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("actions.creating") : t("actions.create")}
                </button>

                <button
                  type="button"
                  className="btn btn--secondary btn--large"
                  onClick={() => navigate("/plans")}
                >
                  {t("actions.cancel")}
                </button>
              </div>
            </form>
          </article>

          <aside className="create-plan-side-card">
            <span className="section__eyebrow">{t("preview.eyebrow")}</span>
            <h3>{t("preview.title")}</h3>

            <div className="create-plan-preview">
              <strong>{title || t("preview.fallbackTitle")}</strong>
              <p>{destination || t("preview.fallbackDestination")}</p>

              <div className="create-plan-preview__meta">
                <span>{duration || t("preview.fallbackDuration")}</span>
                <span>
                  {price
                    ? t("preview.priceValue", { price })
                    : t("preview.fallbackPrice")}
                </span>
                <span>{t(`visibility.${visibility}`)}</span>
              </div>

              <p className="create-plan-preview__summary">
                {summary || t("preview.fallbackSummary")}
              </p>

              {tags.length > 0 ? (
                <div className="create-plan-preview__tags">
                  {tags.map((tag) => (
                    <span key={tag} className="create-plan-preview__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}

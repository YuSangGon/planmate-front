import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import { useAuth } from "../context/AuthContext";
import {
  getPlannerWorkPlan,
  submitPlannerWorkPlan,
  updatePlannerWorkPlan,
  type WorkPlanContent,
} from "../services/workPlanApi";
import "../styles/PlannerWorkPlanPage.css";

export default function PlannerWorkPlanPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation("plannerWorkPlan");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<WorkPlanContent>({
    days: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token || !requestId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlannerWorkPlan(token, requestId);
        const plan = response.data;

        setTitle(plan.title);
        setSummary(plan.summary);
        setDuration(plan.duration);
        setTags(plan.tags ?? []);
        setContent(
          plan.content ?? {
            days: [
              {
                title: t("defaults.dayTitle", { number: 1 }),
                items: [{ time: "", title: "", note: "" }],
              },
            ],
          },
        );
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

  const addDay = () => {
    setContent((prev) => ({
      days: [
        ...prev.days,
        {
          title: t("defaults.dayTitle", { number: prev.days.length + 1 }),
          items: [{ time: "", title: "", note: "" }],
        },
      ],
    }));
  };

  const updateDayTitle = (dayIndex: number, value: string) => {
    setContent((prev) => ({
      days: prev.days.map((day, index) =>
        index === dayIndex ? { ...day, title: value } : day,
      ),
    }));
  };

  const addItem = (dayIndex: number) => {
    setContent((prev) => ({
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: [...day.items, { time: "", title: "", note: "" }],
            }
          : day,
      ),
    }));
  };

  const updateItem = (
    dayIndex: number,
    itemIndex: number,
    field: "time" | "title" | "note",
    value: string,
  ) => {
    setContent((prev) => ({
      days: prev.days.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              items: day.items.map((item, iIndex) =>
                iIndex === itemIndex ? { ...item, [field]: value } : item,
              ),
            }
          : day,
      ),
    }));
  };

  const handleSave = async () => {
    if (!token || !requestId) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      await updatePlannerWorkPlan(token, requestId, {
        title,
        summary,
        duration,
        tags,
        content,
      });

      setToastMessage(t("states.draftSaved"));
      window.setTimeout(() => setToastMessage(""), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.saveError"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!token || !requestId) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updatePlannerWorkPlan(token, requestId, {
        title,
        summary,
        duration,
        tags,
        content,
      });

      await submitPlannerWorkPlan(token, requestId);

      navigate(`/planner-proposals?tab=sent&submitted=1`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.submitError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="work-plan-state-card">
            <p>{t("states.loading")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="work-plan-card">
          <div className="form-grid">
            <div className="form-field form-field--full">
              <label>{t("form.title")}</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-field">
              <label>{t("form.duration")}</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <TagInputField
              label={t("form.tags")}
              placeholder={t("form.tagsPlaceholder")}
              value={tags}
              onChange={setTags}
            />

            <div className="form-field form-field--full">
              <label>{t("form.summary")}</label>
              <textarea
                rows={5}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
          </div>

          <div className="work-plan-days">
            {content.days.map((day, dayIndex) => (
              <div key={dayIndex} className="work-plan-day-card">
                <div className="form-field">
                  <label>{t("form.dayTitle")}</label>
                  <input
                    value={day.title}
                    onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
                  />
                </div>

                <div className="work-plan-items">
                  {day.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="work-plan-item-card">
                      <div className="form-grid">
                        <div className="form-field">
                          <label>{t("form.time")}</label>
                          <input
                            value={item.time ?? ""}
                            onChange={(e) =>
                              updateItem(
                                dayIndex,
                                itemIndex,
                                "time",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="form-field">
                          <label>{t("form.itemTitle")}</label>
                          <input
                            value={item.title}
                            onChange={(e) =>
                              updateItem(
                                dayIndex,
                                itemIndex,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="form-field form-field--full">
                          <label>{t("form.note")}</label>
                          <textarea
                            rows={3}
                            value={item.note ?? ""}
                            onChange={(e) =>
                              updateItem(
                                dayIndex,
                                itemIndex,
                                "note",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => addItem(dayIndex)}
                >
                  {t("actions.addItem")}
                </button>
              </div>
            ))}
          </div>

          <div className="work-plan-actions-row">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={addDay}
            >
              {t("actions.addDay")}
            </button>
          </div>

          {errorMessage ? (
            <p className="work-plan-error">{errorMessage}</p>
          ) : null}
          {toastMessage ? (
            <div className="work-plan-toast">{toastMessage}</div>
          ) : null}

          <div className="work-plan-actions-row">
            <button
              type="button"
              className="btn btn--secondary btn--large"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? t("actions.saving") : t("actions.saveDraft")}
            </button>

            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("actions.submitting") : t("actions.submit")}
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import { useAuth } from "../context/AuthContext";
import "../styles/CreatePlanPage.css";
import { usePlannerWorkPlanEditor } from "../hooks/usePlannerWorkPlanEditor";
import WorkPlanPreparationSection from "../components/workPlan/WorkPlanPreparationSection";
import WorkPlanHotelsSection from "../components/workPlan/WorkPlanHotelsSection";
import WorkPlanDaysSection from "../components/workPlan/WorkPlanDaysSection";
import WorkPlanExtrasSection from "../components/workPlan/WorkPlanExtrasSection";
import WorkPlanAdvancedEditModal from "../components/workPlan/WorkPlanAdvancedEditModal";
import "../styles/PlannerWorkPlanPage.css";
import { getWorkPlanInfo, type PlanInfo } from "../services/workPlanApi";
import { useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function CreatePlanPage() {
  const { token } = useAuth();
  const { t } = useTranslation("createPlan");
  const { planId } = useParams();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token || !planId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getWorkPlanInfo(token, planId);
        const plan = response.data;
        setTitle(plan.title);
        setDestination(plan.destination);
        setDuration(plan.duration);
        setPrice(plan.price.toString());
        setTags(plan.tags);
        setVisibility(plan.visibility);
        setSummary(plan.summary);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Failed to load work plan",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const editor = usePlannerWorkPlanEditor({
    token,
    requestId: "planCreate",
    planId: planId,
  });

  useEffect(() => {
    editor.setPlanInfo({
      title: title,
      destination: destination,
      summary: summary,
      price: Number(price),
      duration: duration,
      visibility: visibility,
      tags: tags,
    } as PlanInfo);
  }, [title, destination, summary, price, duration, visibility, tags]);

  if (editor.isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="work-plan-state-card">
            <p>Loading work plan...</p>
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
        <div className="create-plan-layout">
          <article className="create-plan-card">
            <h2 className="content-title">{t("content.title")}</h2>
            <p className="content-description">{t("content.description")}</p>

            {!isLoading ? (
              <form className="create-plan-form">
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
              </form>
            ) : null}
          </article>
        </div>

        <div className="work-plan-card" style={{ marginTop: "20px" }}>
          <WorkPlanPreparationSection
            preparation={editor.content.preparation}
            onChange={editor.updatePreparationField}
          />

          <WorkPlanHotelsSection
            hotels={editor.content.hotels}
            onAddHotel={editor.addHotelOption}
            onRemoveHotel={editor.removeHotelOption}
            onSetRecommended={editor.setRecommendedHotel}
            onUpdateHotelField={editor.updateHotelField}
            onUpdateHotelPros={editor.updateHotelPros}
            onUpdateHotelCons={editor.updateHotelCons}
          />

          <WorkPlanDaysSection
            days={editor.content.days}
            getQuickAddDraft={editor.getQuickAddDraft}
            onUpdateQuickAddDraft={editor.updateQuickAddDraft}
            onQuickAddSchedule={editor.handleQuickAddSchedule}
            onOpenAdvancedEditor={editor.openAdvancedEditor}
            onAddDay={editor.addDay}
            onRemoveDay={editor.removeDay}
            onUpdateDayField={editor.updateDayField}
            onRemoveScheduleRow={editor.removeScheduleRow}
          />

          <WorkPlanExtrasSection
            extras={editor.content.extras}
            onChange={editor.updateExtrasField}
          />

          {editor.errorMessage ? (
            <p className="work-plan-error">{editor.errorMessage}</p>
          ) : null}

          <div className="work-plan-actions-row work-plan-actions-row--final">
            {!editor.isEdit ? (
              <>
                <button
                  type="button"
                  className="btn btn--secondary btn--large"
                  onClick={editor.handleSave}
                  disabled={editor.isSaving}
                >
                  {editor.isSaving ? "Saving..." : "Save draft"}
                </button>

                <button
                  type="button"
                  className="btn btn--primary btn--large"
                  onClick={editor.handleSubmit}
                  disabled={editor.isSubmitting}
                >
                  {editor.isSubmitting
                    ? "Submitting..."
                    : "Submit to traveller"}
                </button>
              </>
            ) : null}
            {/*
                      (<button
                        type="button"
                        className="btn btn--primary btn--large"
                        onClick={editor.handleSubmit}
                        disabled={editor.isSubmitting}
                      >
                        {editor.isSubmitting ? "Editing..." : "Edit plan"}
                      </button>) 
                      */}
          </div>
        </div>
      </section>

      <WorkPlanAdvancedEditModal
        isOpen={
          editor.editingDayIndex !== null && editor.editingItemIndex !== null
        }
        draft={editor.advancedDraft}
        onClose={editor.closeAdvancedEditor}
        onChange={editor.updateAdvancedDraft}
        onSave={editor.saveAdvancedEdit}
      />
    </MainLayout>
  );
}

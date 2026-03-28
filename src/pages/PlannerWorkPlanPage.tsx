import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import { usePlannerWorkPlanEditor } from "../hooks/usePlannerWorkPlanEditor";
import WorkPlanPreparationSection from "../components/workPlan/workPlanPreparationSection";
import WorkPlanHotelsSection from "../components/workPlan/WorkPlanHotelsSection";
import WorkPlanDaysSection from "../components/workPlan/workPlanDaysSection";
import WorkPlanExtrasSection from "../components/workPlan/WorkPlanExtrasSection";
import WorkPlanAdvancedEditModal from "../components/workPlan/WorkPlanAdvancedEditModal";
import "../styles/PlannerWorkPlanPage.css";

export default function PlannerWorkPlanPage() {
  const { requestId } = useParams();
  const { token } = useAuth();

  const editor = usePlannerWorkPlanEditor({
    token,
    requestId,
  });

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
        eyebrow="Plan builder"
        title="Build a detailed travel execution plan"
        description="Create a practical, highly detailed plan including day-by-day timetable, preparation guide, hotel options, and travel tips."
      />

      <section className="section section--compact">
        <div className="work-plan-card">
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

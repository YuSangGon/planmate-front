// import type { WorkPlanContent } from "../../services/workPlanApi";
import PreviewTextarea from "./PreviewTextarea";

type PreviewExtras =
  | {
      localTransport: string;
      reservations: string;
      emergencyInfo: string;
      finalNotes: string;
    }
  | undefined;

type Props = {
  extras: PreviewExtras;
};

export default function WorkPlanExtrasPreviewSection({ extras }: Props) {
  if (!extras) {
    return <p>No extras info available.</p>;
  }
  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Extra guide</h3>
        <p>
          Practical supporting information that does not belong in the daily
          timetable.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-field form-field--full">
          <PreviewTextarea
            label="Local transport"
            value={extras?.localTransport}
          />
        </div>

        <div className="form-field form-field--full">
          <PreviewTextarea
            label="Reservations / booking notes"
            value={extras?.reservations}
          />
        </div>

        <div className="form-field form-field--full">
          <PreviewTextarea
            label="Emergency info"
            value={extras?.emergencyInfo}
          />
        </div>

        <div className="form-field form-field--full">
          <PreviewTextarea label="Final notes" value={extras?.finalNotes} />
        </div>
      </div>
    </section>
  );
}

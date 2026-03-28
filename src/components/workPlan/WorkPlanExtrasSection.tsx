import type { WorkPlanContent } from "../../services/workPlanApi";

type Props = {
  extras: WorkPlanContent["extras"];
  onChange: (field: keyof WorkPlanContent["extras"], value: string) => void;
};

export default function WorkPlanExtrasSection({ extras, onChange }: Props) {
  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Extra guide</h3>
        <p>
          Add practical supporting information that does not belong in the daily
          timetable.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-field form-field--full">
          <label>Local transport</label>
          <textarea
            rows={4}
            value={extras.localTransport}
            onChange={(e) => onChange("localTransport", e.target.value)}
          />
        </div>

        <div className="form-field form-field--full">
          <label>Reservations / booking notes</label>
          <textarea
            rows={4}
            value={extras.reservations}
            onChange={(e) => onChange("reservations", e.target.value)}
          />
        </div>

        <div className="form-field form-field--full">
          <label>Emergency info</label>
          <textarea
            rows={4}
            value={extras.emergencyInfo}
            onChange={(e) => onChange("emergencyInfo", e.target.value)}
          />
        </div>

        <div className="form-field form-field--full">
          <label>Final notes</label>
          <textarea
            rows={4}
            value={extras.finalNotes}
            onChange={(e) => onChange("finalNotes", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

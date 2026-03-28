import type { WorkPlanContent } from "../../services/workPlanApi";

type Props = {
  preparation: WorkPlanContent["preparation"];
  onChange: (
    field: keyof WorkPlanContent["preparation"],
    value: string,
  ) => void;
};

export default function WorkPlanPreparationSection({
  preparation,
  onChange,
}: Props) {
  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Preparation guide</h3>
        <p>
          Add travel prep details like visa, documents, airport transfer, SIM,
          money, and packing advice.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-field form-field--full">
          <label>Visa / entry requirements</label>
          <textarea
            rows={4}
            value={preparation.visaInfo}
            onChange={(e) => onChange("visaInfo", e.target.value)}
          />
        </div>

        <div className="form-field form-field--full">
          <label>Required documents</label>
          <textarea
            rows={4}
            value={preparation.documents}
            onChange={(e) => onChange("documents", e.target.value)}
          />
        </div>

        <div className="form-field form-field--full">
          <label>How to get to the airport</label>
          <textarea
            rows={4}
            value={preparation.transportToAirport}
            onChange={(e) => onChange("transportToAirport", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>SIM / Wi-Fi</label>
          <textarea
            rows={4}
            value={preparation.simWifi}
            onChange={(e) => onChange("simWifi", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Money tips</label>
          <textarea
            rows={4}
            value={preparation.moneyTips}
            onChange={(e) => onChange("moneyTips", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Packing tips</label>
          <textarea
            rows={4}
            value={preparation.packingTips}
            onChange={(e) => onChange("packingTips", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Other tips</label>
          <textarea
            rows={4}
            value={preparation.otherTips}
            onChange={(e) => onChange("otherTips", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// import type { WorkPlanContent } from "../../services/workPlanApi";
import PreviewTextarea from "./PreviewTextarea";

type PreviewPreparation =
  | {
      visaInfo: string;
      documents: string;
      transportToAirport: string;
      simWifi: string;
      moneyTips: string;
      packingTips: string;
      otherTips: string;
    }
  | undefined;

type Props = {
  preparation: PreviewPreparation;
};

export default function WorkPlanPreparationPreviewSection({
  preparation,
}: Props) {
  if (!preparation) {
    return <p>No preparation info available.</p>;
  }
  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Preparation guide</h3>
        <p>
          travel prep details like visa, documents, airport transfer, SIM,
          money, and packing advice.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-field form-field--full">
          <PreviewTextarea
            label="Visa / entry requirements"
            value={preparation.visaInfo}
          />
        </div>

        <div className="form-field form-field--full">
          <PreviewTextarea
            label="Required documents"
            value={preparation.documents}
          />
        </div>

        <div className="form-field form-field--full">
          <PreviewTextarea
            label="How to get to the airport"
            value={preparation.transportToAirport}
          />
        </div>

        <div className="form-field">
          <PreviewTextarea label="SIM / Wi-Fi" value={preparation.simWifi} />
        </div>

        <div className="form-field">
          <PreviewTextarea label="Money tips" value={preparation.moneyTips} />
        </div>

        <div className="form-field">
          <PreviewTextarea
            label="Packing tips"
            value={preparation.packingTips}
          />
        </div>

        <div className="form-field">
          <PreviewTextarea label="Other tips" value={preparation.otherTips} />
        </div>
      </div>
    </section>
  );
}

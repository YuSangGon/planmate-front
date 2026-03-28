type ScheduleDraft = {
  startTime: string;
  endTime: string;
  place: string;
  title: string;
  description: string;
  fee: string;
  estimatedCost: string;
  transport: string;
  durationNote: string;
  tips: string;
};

type Props = {
  isOpen: boolean;
  draft: ScheduleDraft;
  onClose: () => void;
  onChange: (field: keyof ScheduleDraft, value: string) => void;
  onSave: () => void;
};

export default function WorkPlanAdvancedEditModal({
  isOpen,
  draft,
  onClose,
  onChange,
  onSave,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="work-plan-modal-backdrop" onClick={onClose}>
      <div
        className="work-plan-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="work-plan-modal__header">
          <h5>Advanced edit</h5>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Start time</label>
            <input
              type="time"
              value={draft.startTime}
              onChange={(e) => onChange("startTime", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>End time</label>
            <input
              type="time"
              value={draft.endTime}
              onChange={(e) => onChange("endTime", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Place</label>
            <input
              value={draft.place}
              onChange={(e) => onChange("place", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Activity title</label>
            <input
              value={draft.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>

          <div className="form-field form-field--full">
            <label>Description</label>
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Entry fee</label>
            <input
              value={draft.fee}
              onChange={(e) => onChange("fee", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Estimated cost</label>
            <input
              value={draft.estimatedCost}
              onChange={(e) => onChange("estimatedCost", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Transport</label>
            <input
              value={draft.transport}
              onChange={(e) => onChange("transport", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Duration note</label>
            <input
              value={draft.durationNote}
              onChange={(e) => onChange("durationNote", e.target.value)}
            />
          </div>

          <div className="form-field form-field--full">
            <label>Tips</label>
            <textarea
              rows={3}
              value={draft.tips}
              onChange={(e) => onChange("tips", e.target.value)}
            />
          </div>
        </div>

        <div className="work-plan-actions-row">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn--primary" onClick={onSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

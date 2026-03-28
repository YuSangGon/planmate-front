type Props = {
  isOpen: boolean;
  message: string;
  price: string;
  days: string;
  isSubmitting: boolean;
  onChangeMessage: (value: string) => void;
  onChangePrice: (value: string) => void;
  onChangeDays: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function RequestApplyModal({
  isOpen,
  message,
  price,
  days,
  isSubmitting,
  onChangeMessage,
  onChangePrice,
  onChangeDays,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="request-apply-modal-backdrop" onClick={onClose}>
      <div
        className="request-apply-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="request-apply-modal__header">
          <div>
            <h3>Apply to this request</h3>
            <p>Send a short message and your proposed price.</p>
          </div>

          <button
            type="button"
            className="request-apply-modal__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="request-apply-form">
          <div className="form-field">
            <label htmlFor="apply-message">Short message</label>
            <textarea
              id="apply-message"
              rows={5}
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              placeholder="Write a short introduction."
            />
          </div>

          <div className="form-field">
            <label htmlFor="apply-price">Proposed price</label>
            <input
              id="apply-price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => onChangePrice(e.target.value)}
              placeholder="e.g. 25"
            />
          </div>

          <div className="form-field">
            <label htmlFor="apply-days">Estimated Days</label>
            <input
              id="apply-days"
              type="number"
              min="1"
              value={days}
              onChange={(e) => onChangeDays(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>

          <div className="request-apply-form__actions">
            <button
              type="button"
              className="btn btn--primary"
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>

            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

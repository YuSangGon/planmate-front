type Props = {
  label: string;
  value: string[];
};

export default function PreviewTagInput({ label, value }: Props) {
  const isLocked = value.length === 0;

  return (
    <div className="form-field form-field--full preview-lock">
      <label>{label}</label>

      <div className="tag-input-group">
        {value.length > 0 ? (
          <div className="selected-tags">
            {value.map((tag) => (
              <div key={tag} className="selected-tag">
                <span>{tag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`preview-lock selected-tags ${isLocked ? "is-locked" : ""}`}
          >
            <div className="selected-tag">
              <span>Example tag1</span>
            </div>
            <div className="selected-tag">
              <span>Example tag2</span>
            </div>
            <div className="selected-tag">
              <span>Example tag3</span>
            </div>
            <div className="selected-tag">
              <span>Example tag4</span>
            </div>
            {isLocked && <div className="preview-lock-overlay">🔒</div>}
          </div>
        )}
      </div>
    </div>
  );
}

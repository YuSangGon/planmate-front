type PreviewTextareaProps = {
  label: string;
  value?: string;
  rows?: number;
};

export default function PreviewTextarea({
  label,
  value,
  rows = 4,
}: PreviewTextareaProps) {
  const isLocked = !value;

  return (
    <>
      <label>{label}</label>

      <div className={`preview-lock ${isLocked ? "is-locked" : ""}`}>
        <textarea
          rows={rows}
          value={isLocked ? "If you pay, you can know this part!" : value}
          readOnly
        />

        {isLocked && <div className="preview-lock-overlay">🔒</div>}
      </div>
    </>
  );
}

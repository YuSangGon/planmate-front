type PreviewInputProps = {
  label: string;
  value?: string;
};

export default function PreviewInput({ label, value }: PreviewInputProps) {
  const isLocked = !value;

  return (
    <>
      <label>{label}</label>

      <div className={`preview-lock ${isLocked ? "is-locked" : ""}`}>
        <input
          value={isLocked ? "If you pay, you can know this part!" : value}
          readOnly
        />

        {isLocked && <div className="preview-lock-overlay">🔒</div>}
      </div>
    </>
  );
}

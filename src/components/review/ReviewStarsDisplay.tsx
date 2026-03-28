type ReviewStarsDisplayProps = {
  label: string;
  value: number;
};

export default function ReviewStarsDisplay({
  label,
  value,
}: ReviewStarsDisplayProps) {
  const rounded = Math.round(value);

  return (
    <div className="review-stars-display">
      <span className="review-stars-display__label">{label}</span>

      <div className="review-stars-display__content">
        <div className="review-stars-display__stars" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((score) => (
            <span
              key={score}
              className={
                score <= rounded
                  ? "review-stars-display__star review-stars-display__star--active"
                  : "review-stars-display__star"
              }
            >
              ★
            </span>
          ))}
        </div>

        <strong className="review-stars-display__value">
          {value.toFixed(1)}
        </strong>
      </div>
    </div>
  );
}

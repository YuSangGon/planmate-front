type StarRatingFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export default function StarRatingField({
  label,
  value,
  onChange,
}: StarRatingFieldProps) {
  return (
    <div className="review-rating-field">
      <div className="review-rating-field__top">
        <span className="review-rating-field__label">{label}</span>
        <strong className="review-rating-field__value">
          {value.toFixed(1)}
        </strong>
      </div>

      <div className="review-rating-field__stars">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            className={
              score <= value
                ? "review-rating-field__star review-rating-field__star--active"
                : "review-rating-field__star"
            }
            onClick={() => onChange(score)}
            aria-label={`${label} ${score} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

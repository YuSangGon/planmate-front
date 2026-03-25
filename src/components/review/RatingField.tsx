type RatingFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export default function RatingField({
  label,
  value,
  onChange,
}: RatingFieldProps) {
  return (
    <div className="review-rating-field">
      <label>{label}</label>

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
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

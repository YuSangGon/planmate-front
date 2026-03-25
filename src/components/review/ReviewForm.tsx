import { useState } from "react";
import RatingField from "./RatingField";
import { createReview } from "../../services/reviewApi";
import { useAuth } from "../../context/AuthContext";

type ReviewFormProps = {
  requestId: string;
  onSuccess?: () => void;
};

export default function ReviewForm({ requestId, onSuccess }: ReviewFormProps) {
  const { token } = useAuth();

  const [overallRating, setOverallRating] = useState(5);
  const [planQuality, setPlanQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [timeliness, setTimeliness] = useState(5);
  const [personalisation, setPersonalisation] = useState(5);
  const [practicality, setPracticality] = useState(5);
  const [detailLevel, setDetailLevel] = useState(5);
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setErrorMessage("You need to be logged in.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createReview(token, {
        requestId,
        overallRating,
        planQuality,
        communication,
        timeliness,
        personalisation,
        practicality,
        detailLevel,
        content: content.trim(),
      });

      setToastMessage("Review submitted successfully.");
      setContent("");

      window.setTimeout(() => {
        setToastMessage("");
        onSuccess?.();
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__grid">
        <RatingField
          label="Overall"
          value={overallRating}
          onChange={setOverallRating}
        />
        <RatingField
          label="Plan quality"
          value={planQuality}
          onChange={setPlanQuality}
        />
        <RatingField
          label="Communication"
          value={communication}
          onChange={setCommunication}
        />
        <RatingField
          label="Timeliness"
          value={timeliness}
          onChange={setTimeliness}
        />
        <RatingField
          label="Personalisation"
          value={personalisation}
          onChange={setPersonalisation}
        />
        <RatingField
          label="Practicality"
          value={practicality}
          onChange={setPracticality}
        />
        <RatingField
          label="Detail level"
          value={detailLevel}
          onChange={setDetailLevel}
        />
      </div>

      <div className="form-field form-field--full">
        <label>Written review</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell other travellers what this planner did well."
        />
      </div>

      {errorMessage ? (
        <p className="review-form__error">{errorMessage}</p>
      ) : null}
      {toastMessage ? (
        <div className="review-form__toast">{toastMessage}</div>
      ) : null}

      <button
        type="submit"
        className="btn btn--primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

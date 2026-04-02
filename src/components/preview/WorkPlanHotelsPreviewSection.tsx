import { useState } from "react";
// import type { WorkPlanContent, WorkPlanHotelOption } from "../../services/workPlanApi";
import PreviewInput from "./PreviewInput";
import PreviewTextarea from "./PreviewTextarea";
import PreviewTagInputField from "./PreviewTagInputField";

type PreviewHotels = {
  name: string;
  location: string;
  priceRange: string;
  bookingLink: string;
  summary: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
}[];

type Props = {
  hotels: PreviewHotels;
};

export default function WorkPlanHotelsPreviewSection({ hotels }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!hotels || hotels.length === 0) return null;

  const currentHotel = hotels[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < hotels.length - 1 ? prev + 1 : prev));
  };

  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Hotel options</h3>
        <p>
          The main recommended hotel and alternative choices with pros and cons
          so the traveller can compare.
        </p>
      </div>

      <div className="work-plan-days-board">
        <div className="work-plan-days-slider">
          <button
            className="day-nav left"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ‹
          </button>

          <div className="work-plan-hotel-list work-plan-hotel-single">
            <div className="work-plan-hotel-card">
              <div className="work-plan-hotel-card__top">
                <div>
                  <h4>
                    Hotel option {currentIndex + 1}
                    {currentHotel.recommended ? " · Recommended" : ""}
                  </h4>
                  <p>Suggest multiple hotel choices with clear trade-offs.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <PreviewInput label="Hotel name" value={currentHotel.name} />
                </div>

                <div className="form-field">
                  <PreviewInput
                    label="Location"
                    value={currentHotel.location}
                  />
                </div>

                <div className="form-field">
                  <PreviewInput
                    label="Budget range"
                    value={currentHotel.priceRange}
                  />
                </div>

                <div className="form-field">
                  <PreviewInput
                    label="Booking link"
                    value={currentHotel.bookingLink}
                  />
                </div>

                <div className="form-field form-field--full">
                  <PreviewTextarea
                    label="Hotel description"
                    value={currentHotel.summary}
                  />
                </div>

                <PreviewTagInputField label="Pros" value={currentHotel.pros} />
                <PreviewTagInputField label="Cons" value={currentHotel.cons} />
              </div>
            </div>
          </div>

          <button
            className="day-nav right"
            onClick={handleNext}
            disabled={currentIndex === hotels.length - 1}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

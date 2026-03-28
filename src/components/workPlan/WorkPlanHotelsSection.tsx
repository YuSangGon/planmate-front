import TagInputField from "../common/TagInputField";
import type { WorkPlanContent } from "../../services/workPlanApi";

type Props = {
  hotels: WorkPlanContent["hotels"];
  onAddHotel: () => void;
  onRemoveHotel: (hotelIndex: number) => void;
  onSetRecommended: (hotelIndex: number) => void;
  onUpdateHotelField: (
    hotelIndex: number,
    field: keyof WorkPlanContent["hotels"][number],
    value: string | boolean,
  ) => void;
  onUpdateHotelPros: (hotelIndex: number, value: string[]) => void;
  onUpdateHotelCons: (hotelIndex: number, value: string[]) => void;
};

export default function WorkPlanHotelsSection({
  hotels,
  onAddHotel,
  onRemoveHotel,
  onSetRecommended,
  onUpdateHotelField,
  onUpdateHotelPros,
  onUpdateHotelCons,
}: Props) {
  return (
    <section className="work-plan-section">
      <div className="work-plan-section__header">
        <h3>Hotel options</h3>
        <p>
          Add the main recommended hotel and alternative choices with pros and
          cons so the traveller can compare.
        </p>
      </div>

      <div className="work-plan-hotel-list">
        {hotels.map((hotel, hotelIndex) => (
          <div key={hotelIndex} className="work-plan-hotel-card">
            <div className="work-plan-hotel-card__top">
              <div>
                <h4>
                  Hotel option {hotelIndex + 1}
                  {hotel.recommended ? " · Recommended" : ""}
                </h4>
                <p>Suggest multiple hotel choices with clear trade-offs.</p>
              </div>

              <div className="work-plan-hotel-card__actions">
                <button
                  type="button"
                  className={
                    hotel.recommended
                      ? "btn btn--primary"
                      : "btn btn--secondary"
                  }
                  onClick={() => onSetRecommended(hotelIndex)}
                >
                  {hotel.recommended ? "Main choice" : "Set as main"}
                </button>

                {hotels.length > 1 ? (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onRemoveHotel(hotelIndex)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Hotel name</label>
                <input
                  value={hotel.name}
                  onChange={(e) =>
                    onUpdateHotelField(hotelIndex, "name", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Location</label>
                <input
                  value={hotel.location}
                  onChange={(e) =>
                    onUpdateHotelField(hotelIndex, "location", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Price range</label>
                <input
                  value={hotel.priceRange}
                  onChange={(e) =>
                    onUpdateHotelField(hotelIndex, "priceRange", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Booking link</label>
                <input
                  value={hotel.bookingLink ?? ""}
                  onChange={(e) =>
                    onUpdateHotelField(
                      hotelIndex,
                      "bookingLink",
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="form-field form-field--full">
                <label>Hotel summary</label>
                <textarea
                  rows={4}
                  value={hotel.summary}
                  onChange={(e) =>
                    onUpdateHotelField(hotelIndex, "summary", e.target.value)
                  }
                />
              </div>

              <TagInputField
                label="Pros"
                placeholder="Type a pro and press Enter"
                value={hotel.pros}
                onChange={(value) => onUpdateHotelPros(hotelIndex, value)}
              />

              <TagInputField
                label="Cons"
                placeholder="Type a con and press Enter"
                value={hotel.cons}
                onChange={(value) => onUpdateHotelCons(hotelIndex, value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="work-plan-actions-row">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onAddHotel}
        >
          Add hotel option
        </button>
      </div>
    </section>
  );
}

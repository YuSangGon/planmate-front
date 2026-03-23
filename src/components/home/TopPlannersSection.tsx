const planners = [
  {
    name: "Emma",
    specialty: "Europe city itineraries",
    rating: "4.9",
    reviews: "124 reviews",
  },
  {
    name: "Daniel",
    specialty: "Budget-friendly travel plans",
    rating: "4.8",
    reviews: "96 reviews",
  },
  {
    name: "Sophie",
    specialty: "Food-focused travel routes",
    rating: "5.0",
    reviews: "141 reviews",
  },
];

export default function TopPlannersSection() {
  return (
    <section className="section">
      <div className="section__header">
        <span className="section__eyebrow">Top planners</span>
        <h2 className="section__title">People who genuinely enjoy planning</h2>
      </div>

      <div className="grid grid--3">
        {planners.map((planner) => (
          <article className="planner-card" key={planner.name}>
            <div className="planner-card__avatar">{planner.name[0]}</div>
            <h3>{planner.name}</h3>
            <p>{planner.specialty}</p>
            <div className="planner-card__meta">
              <span>⭐ {planner.rating}</span>
              <span>{planner.reviews}</span>
            </div>
            <button className="btn btn--secondary planner-card__button">
              View profile
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

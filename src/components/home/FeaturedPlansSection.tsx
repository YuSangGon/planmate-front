const featuredPlans = [
  {
    title: "3 Days in London",
    description: "A calm city break with cafés, museums, and riverside walks.",
    tag: "City Break",
    price: "From £18",
  },
  {
    title: "5 Days in Paris",
    description: "A balanced plan for culture, food, and iconic landmarks.",
    tag: "Classic Europe",
    price: "From £22",
  },
  {
    title: "7 Days in Tokyo",
    description:
      "A detailed route for food spots, neighbourhoods, and transport.",
    tag: "Detailed Route",
    price: "From £30",
  },
];

export default function FeaturedPlansSection() {
  return (
    <section className="section">
      <div className="section__header">
        <span className="section__eyebrow">Featured plans</span>
        <h2 className="section__title">Templates travellers already want</h2>
      </div>

      <div className="grid grid--3">
        {featuredPlans.map((plan) => (
          <article className="plan-card" key={plan.title}>
            <div className="plan-card__image">
              <span className="plan-card__tag">{plan.tag}</span>
            </div>
            <div className="plan-card__body">
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <div className="plan-card__footer">
                <span className="plan-card__price">{plan.price}</span>
                <button className="text-link">View plan</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

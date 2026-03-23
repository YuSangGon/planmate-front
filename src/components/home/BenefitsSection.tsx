const benefits = [
  {
    title: "For people who hate planning",
    description:
      "You only describe the sort of trip you want. No research spiral, no tab overload.",
  },
  {
    title: "For people who love organising trips",
    description:
      "Turn your planning skill into something useful and potentially profitable.",
  },
  {
    title: "Built around personalised travel",
    description:
      "Not generic blog itineraries, but plans shaped around budget, vibe, pace, and interests.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="section">
      <div className="section__header section__header--center">
        <span className="section__eyebrow">Why this exists</span>
        <h2 className="section__title">
          Built for two very different types of people
        </h2>
        <p className="section__description">
          Some people love making plans. Some people just want the trip to be
          ready. This product is designed around both.
        </p>
      </div>

      <div className="grid grid--3">
        {benefits.map((benefit) => (
          <article className="feature-card" key={benefit.title}>
            <div className="feature-card__icon">✦</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

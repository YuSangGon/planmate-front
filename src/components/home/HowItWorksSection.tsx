export default function HowItWorksSection() {
  return (
    <section className="section section--alt">
      <div className="section__header">
        <span className="section__eyebrow">How it works</span>
        <h2 className="section__title">
          From vague idea to finished trip plan
        </h2>
      </div>

      <div className="steps">
        <article className="step-card">
          <div className="step-card__number">01</div>
          <h3>Describe your trip</h3>
          <p>
            Share destination, budget, duration, pace, and interests. Even a
            rough idea is enough to begin.
          </p>
        </article>

        <article className="step-card">
          <div className="step-card__number">02</div>
          <h3>Get matched with a planner</h3>
          <p>
            Choose someone whose planning style fits your type of travel and
            expectations.
          </p>
        </article>

        <article className="step-card">
          <div className="step-card__number">03</div>
          <h3>Receive a ready-to-use itinerary</h3>
          <p>
            Get a clearer route, activity ideas, and structure without doing the
            exhausting prep yourself.
          </p>
        </article>
      </div>
    </section>
  );
}

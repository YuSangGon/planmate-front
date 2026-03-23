export default function PromoBannerSection() {
  return (
    <section className="section">
      <div className="promo-banner">
        <div className="promo-banner__content">
          <span className="section__eyebrow">Early concept</span>
          <h2>Start small. Make travel planning feel lighter.</h2>
          <p>
            The first version focuses only on travel. Keep the scope tight,
            prove the idea, and grow from a strong niche.
          </p>
        </div>

        <div className="promo-banner__cards">
          <div className="small-info-card">
            <strong>P users</strong>
            <span>Request a plan without doing the difficult part</span>
          </div>
          <div className="small-info-card">
            <strong>J users</strong>
            <span>Create travel plans people will actually use</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  const goToRequestCreate = () => {
    navigate(`/requests/new`);
  };

  return (
    <section className="cta-section">
      <div className="cta-section__content">
        <span className="section__eyebrow section__eyebrow--light">
          Ready to start
        </span>
        <h2>Let someone else plan your next trip</h2>
        <p>
          You do not need a perfect idea. Just explain the kind of journey you
          want, and start with a simple request.
        </p>
      </div>

      <div className="cta-section__actions">
        <button
          className="btn btn--primary-light btn--large"
          onClick={() => goToRequestCreate()}
        >
          Create request
        </button>
        {/* <button className="btn btn--outline-light btn--large">
          See examples
        </button> */}
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <h3 className="footer__logo">PlanMate</h3>
          <p className="footer__text">
            Travel planning made simple for people who do not want to plan.
          </p>
        </div>

        <div className="footer__links">
          <a href="/">Home</a>
          <a href="/plans">Plans</a>
          <a href="/request">Request</a>
          <a href="/planners">Planners</a>
        </div>
      </div>

      <div className="footer__bottom">
        © 2026 PlanMate. All rights reserved.
      </div>
    </footer>
  );
}

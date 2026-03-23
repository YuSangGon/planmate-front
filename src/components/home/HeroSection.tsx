import { useAppTranslation } from "../../hooks/useAppTranslation";

export default function HeroSection() {
  const { t } = useAppTranslation("home");

  return (
    <section className="hero">
      <div className="hero__left">
        <div className="hero__topline">
          <span className="pill">{t("heroBadge")}</span>
          <span className="pill pill--soft">{t("heroBadge2")}</span>
        </div>

        <h1 className="hero__title">
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
          {t("heroTitle3") && (
            <>
              <br />
              {t("heroTitle3")}
            </>
          )}
        </h1>

        <p className="hero__description">{t("heroDescription")}</p>

        <div className="hero__actions">
          <button className="btn btn--primary btn--large">
            {t("heroPrimary")}
          </button>
          <button className="btn btn--secondary btn--large">
            {t("heroSecondary")}
          </button>
        </div>

        <div className="hero__meta">
          <div className="hero__meta-item">
            <strong>{t("easy")}</strong>
            <span>{t("easyDesc")}</span>
          </div>
          <div className="hero__meta-item">
            <strong>{t("personal")}</strong>
            <span>{t("personalDesc")}</span>
          </div>
          <div className="hero__meta-item">
            <strong>{t("stressFree")}</strong>
            <span>{t("stressFreeDesc")}</span>
          </div>
        </div>
      </div>

      <div className="hero__right">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <span className="dashboard-card__badge">Sample request</span>
            <span className="dashboard-card__time">Delivered in 24h</span>
          </div>

          <h3 className="dashboard-card__title">4-day Edinburgh trip</h3>

          <div className="dashboard-card__section">
            <p className="dashboard-card__label">Traveller brief</p>
            <ul className="dashboard-list">
              <li>Budget: £350</li>
              <li>Style: cosy, scenic, slow-paced</li>
              <li>Interests: cafés, bookstores, viewpoints</li>
              <li>Avoid: overpacked schedules</li>
            </ul>
          </div>

          <div className="dashboard-card__divider" />

          <div className="dashboard-card__section">
            <p className="dashboard-card__label">Planner output</p>
            <div className="mini-plan">
              <div className="mini-plan__item">
                <span>Day 1</span>
                <p>Old Town walk + café route + sunset viewpoint</p>
              </div>
              <div className="mini-plan__item">
                <span>Day 2</span>
                <p>Castle area + museum stop + relaxed dinner picks</p>
              </div>
              <div className="mini-plan__item">
                <span>Day 3</span>
                <p>Dean Village + photo spots + local brunch list</p>
              </div>
            </div>
          </div>
        </div>

        <div className="floating-stat floating-stat--one">
          <strong>1,200+</strong>
          <span>travel plans imagined</span>
        </div>

        <div className="floating-stat floating-stat--two">
          <strong>4.9/5</strong>
          <span>planner satisfaction</span>
        </div>
      </div>
    </section>
  );
}

import { useTranslation } from "react-i18next";

export default function ProfilePaymentPanel() {
  const { t } = useTranslation("profilePage");

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <h2>{t("payment.title")}</h2>
        <p>{t("payment.description")}</p>
      </div>

      <div className="profile-payment-grid">
        <article className="profile-card-block">
          <div>Coming soon...</div>
        </article>
        {/* <article className="profile-card-block">
          <h3>{t("payment.cards.title")}</h3>

          <div className="profile-placeholder-stack">
            <div className="profile-placeholder-row">
              <strong>{t("payment.cards.card1")}</strong>
              <span>{t("payment.common.mock")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("payment.cards.card2")}</strong>
              <span>{t("payment.common.mock")}</span>
            </div>
          </div>

          <div className="profile-placeholder-stack">
            <div className="profile-placeholder-row">
              <strong>{t("payment.cards.card1")}</strong>
              <span>{t("payment.common.mock")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("payment.cards.card2")}</strong>
              <span>{t("payment.common.mock")}</span>
            </div>
          </div>

          <button className="btn btn--secondary">
            {t("payment.cards.add")}
          </button>
        </article> */}

        {/* <article className="profile-card-block">
          <h3>{t("payment.billing.title")}</h3>

          <div className="profile-placeholder-stack">
            <div className="profile-placeholder-row">
              <strong>{t("payment.billing.item1.amount")}</strong>
              <span>{t("payment.billing.item1.desc")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("payment.billing.item2.amount")}</strong>
              <span>{t("payment.billing.item2.desc")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("payment.billing.item3.amount")}</strong>
              <span>{t("payment.billing.item3.desc")}</span>
            </div>
          </div>
        </article> */}
      </div>
    </div>
  );
}

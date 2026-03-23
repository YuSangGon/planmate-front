import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function ProfileAccountPanel() {
  const { user } = useAuth();
  const { t } = useTranslation("profilePage");

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <h2>{t("account.title")}</h2>
        <p>{t("account.description")}</p>
      </div>

      <div className="profile-account-grid">
        <article className="profile-card-block">
          <h3>{t("account.basicInfo.title")}</h3>

          <div className="profile-info-list">
            <div className="profile-info-item">
              <span>{t("account.basicInfo.name")}</span>
              <strong>{user?.name ?? "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>{t("account.basicInfo.email")}</span>
              <strong>{user?.email ?? "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>{t("account.basicInfo.role")}</span>
              <strong>
                {user?.role ? t(`account.roles.${user.role}`) : "-"}
              </strong>
            </div>
          </div>
        </article>

        <article className="profile-card-block">
          <h3>{t("account.settings.title")}</h3>
          <p className="profile-muted-text">
            {t("account.settings.description")}
          </p>

          <div className="profile-placeholder-stack">
            <div className="profile-placeholder-row">
              <strong>{t("account.settings.avatar")}</strong>
              <span>{t("account.settings.notConnected")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("account.settings.bio")}</strong>
              <span>{t("account.settings.notConnected")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("account.settings.preferences")}</strong>
              <span>{t("account.settings.notConnected")}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

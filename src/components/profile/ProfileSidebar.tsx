import { useTranslation } from "react-i18next";

type ProfileTab = "account" | "payment";

type ProfileSidebarProps = {
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
};

export default function ProfileSidebar({
  activeTab,
  onChangeTab,
}: ProfileSidebarProps) {
  const { t } = useTranslation("profilePage");

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar__section">
        <span className="profile-sidebar__eyebrow">
          {t("sidebar.workspacePlanner")}
        </span>

        <button
          type="button"
          className={
            activeTab === "account"
              ? "profile-sidebar__item profile-sidebar__item--active"
              : "profile-sidebar__item"
          }
          onClick={() => onChangeTab("account")}
        >
          <span>{t("sidebar.account.title")}</span>
          <small>{t("sidebar.account.description")}</small>
        </button>

        <button
          type="button"
          className={
            activeTab === "payment"
              ? "profile-sidebar__item profile-sidebar__item--active"
              : "profile-sidebar__item"
          }
          onClick={() => onChangeTab("payment")}
        >
          <span>{t("sidebar.payment.title")}</span>
          <small>{t("sidebar.payment.description")}</small>
        </button>
      </div>
    </aside>
  );
}

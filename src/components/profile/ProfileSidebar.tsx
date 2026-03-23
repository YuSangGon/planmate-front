import { useTranslation } from "react-i18next";

type ProfileTab = "account" | "dashboard" | "payment";

type ProfileSidebarProps = {
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
  isPlanner: boolean;
};

export default function ProfileSidebar({
  activeTab,
  onChangeTab,
  isPlanner,
}: ProfileSidebarProps) {
  const { t } = useTranslation("profilePage");

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar__section">
        <span className="profile-sidebar__eyebrow">
          {isPlanner
            ? t("sidebar.workspacePlanner")
            : t("sidebar.workspaceTraveller")}
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
            activeTab === "dashboard"
              ? "profile-sidebar__item profile-sidebar__item--active"
              : "profile-sidebar__item"
          }
          onClick={() => onChangeTab("dashboard")}
        >
          <span>{t("sidebar.dashboard.title")}</span>
          <small>{t("sidebar.dashboard.description")}</small>
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

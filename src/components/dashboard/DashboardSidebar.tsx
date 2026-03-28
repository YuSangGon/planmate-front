import type { DashboardTab } from "../../pages/DashboardPage";

type DashboardSidebarProps = {
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
};

export default function DashboardSidebar({
  activeTab,
  onChangeTab,
}: DashboardSidebarProps) {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__section">
        <span className="dashboard-sidebar__eyebrow">Workspace</span>

        <button
          type="button"
          className={
            activeTab === "overview"
              ? "dashboard-sidebar__item dashboard-sidebar__item--active"
              : "dashboard-sidebar__item"
          }
          onClick={() => onChangeTab("overview")}
        >
          <span>Overview</span>
          <small>Stats and planner reviews</small>
        </button>

        <button
          type="button"
          className={
            activeTab === "requests"
              ? "dashboard-sidebar__item dashboard-sidebar__item--active"
              : "dashboard-sidebar__item"
          }
          onClick={() => onChangeTab("requests")}
        >
          <span>Requests</span>
          <small>Manage request workflow</small>
        </button>

        <button
          type="button"
          className={
            activeTab === "proposals"
              ? "dashboard-sidebar__item dashboard-sidebar__item--active"
              : "dashboard-sidebar__item"
          }
          onClick={() => onChangeTab("proposals")}
        >
          <span>Proposals</span>
          <small>Manage offers and decisions</small>
        </button>

        <button
          type="button"
          className={
            activeTab === "myPlans"
              ? "dashboard-sidebar__item dashboard-sidebar__item--active"
              : "dashboard-sidebar__item"
          }
          onClick={() => onChangeTab("myPlans")}
        >
          <span>My plans</span>
          <small>Created plans and plan reviews</small>
        </button>
      </div>
    </aside>
  );
}

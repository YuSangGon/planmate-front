import { useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardOverviewSection from "../components/dashboard/DashboardOverviewSection";
import DashboardRequestsSection from "../components/dashboard/DashboardRequestsSection";
import DashboardProposalsSection from "../components/dashboard/DashboardProposalsSection";
import DashboardPlansSection from "../components/dashboard/DashboardPlansSection";
import "../styles/DashboardPage.css";

export type DashboardTab = "overview" | "requests" | "proposals" | "myPlans";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  const pageDescription = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return "Check your overall activity, planner review summary, and key stats in one place.";
      case "requests":
        return "Track requests that are currently in progress and continue the next step.";
      case "proposals":
        return "Review proposals you received and decide what to do next.";
      case "myPlans":
        return "See the plans you created and the reviews attached to them.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <MainLayout>
      <PageHero
        eyebrow="Dashboard"
        title="Manage your travel workflow"
        description={pageDescription}
      />

      <section className="section section--compact">
        <div className="dashboard-shell">
          <DashboardSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

          <div className="dashboard-content">
            {activeTab === "overview" && <DashboardOverviewSection />}
            {activeTab === "requests" && <DashboardRequestsSection />}
            {activeTab === "proposals" && <DashboardProposalsSection />}
            {activeTab === "myPlans" && <DashboardPlansSection />}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

import "./App.css";
import HomePage from "./pages/HomaPage";
import PlanListPage from "./pages/PlanListPage";
import RequestPage from "./pages/RequestPage";
import PlannerListPage from "./pages/PlannerListPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PlannerDashboardPage from "./pages/PlannerDashboardPage";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import BrowseRequestsPage from "./pages/BrowseRequestsPage";
import BrowseRequestDetailPage from "./pages/BrowseRequestDetailPage";
import RequestProposalsPage from "./pages/RequestProposalsPage";
import PlannerProfilePage from "./pages/PlannerProfilePage";
import CreatePlanPage from "./pages/CreatePlanPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import RequestListPage from "./pages/RequestListPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import ShopPage from "./pages/ShopPage";
import PlannerProposalListPage from "./pages/PlannerProposalListPage";
import PlannerSentProposalDetailPage from "./pages/PlannerSentProposalDetailPage";
import PlannerReceivedProposalDetailPage from "./pages/PlannerReceivedProposalDetailPage";
import PlannerWorkPlanPage from "./pages/PlannerWorkPlanPage";
import TravellerPlanPreviewPage from "./pages/TravellerPlanPreviewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plans" element={<PlanListPage />} />
      <Route path="/plans/:planId" element={<PlanDetailPage />} />
      <Route
        path="/plans/create"
        element={
          <ProtectedRoute>
            <CreatePlanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <RequestListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/new"
        element={
          <ProtectedRoute>
            <RequestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/:requestId/work-plan"
        element={
          <ProtectedRoute allowedRoles={["planner"]}>
            <PlannerWorkPlanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/:requestId/preview-plan"
        element={
          <ProtectedRoute>
            <TravellerPlanPreviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/:requestId"
        element={
          <ProtectedRoute>
            <RequestDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planners/:plannerId"
        element={
          <ProtectedRoute>
            <PlannerProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planners"
        element={
          <ProtectedRoute>
            <PlannerListPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/browse-requests"
        element={
          <ProtectedRoute>
            <BrowseRequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner-dashboard"
        element={
          <ProtectedRoute>
            <PlannerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/browse-requests/:requestId"
        element={
          <ProtectedRoute>
            <BrowseRequestDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-requests/:requestId/proposals"
        element={
          <ProtectedRoute>
            <RequestProposalsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <ShopPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner-proposals"
        element={
          <ProtectedRoute>
            <PlannerProposalListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner-proposals/sent/:proposalId"
        element={
          <ProtectedRoute>
            <PlannerSentProposalDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner-proposals/received/:proposalId"
        element={
          <ProtectedRoute>
            <PlannerReceivedProposalDetailPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardRequests,
  type DashboardRequestItem,
} from "../../services/dashboardApi";

export default function DashboardRequestsSection() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // const [items, setItems] = useState<DashboardRequestItem[]>([]);
  const [itemsForPlanner, setItemsForPlanner] = useState<
    DashboardRequestItem[]
  >([]);
  const [itemsForTraveller, setItemsForTraveller] = useState<
    DashboardRequestItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getDashboardRequests(token);
        // setItems(response.data);
        setItemsForPlanner(
          response.data.filter((item) => item.planner?.id === user?.id),
        );
        setItemsForTraveller(
          response.data.filter((item) => item.traveller?.id === user?.id),
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load active requests.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchItems();
  }, [token]);

  const goToRequestDetail = (requestId: string) => {
    navigate(`/requests/${requestId}`);
  };

  function DashboardItem({ item }: { item: DashboardRequestItem }) {
    return (
      <div
        className="dashboard-list-item"
        onClick={() => goToRequestDetail(item.id)}
        style={{ cursor: "pointer" }}
      >
        <div className="dashboard-list-item__top">
          <strong>{item.destination}</strong>
          <span
            className={`request-status-badge request-status-badge--${item.status}`}
          >
            {item.status}
          </span>
        </div>

        <div className="dashboard-list-item__meta">
          <span>{item.duration}</span>
          <span>{item.budget}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__state-card">
          <p>Loading active requests...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__state-card dashboard-panel__state-card--error">
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__header">
        <h2>Active requests</h2>
        <p>Continue current requests and move them to the next step.</p>
      </div>

      {itemsForPlanner.length > 0 && (
        <div className="dashboard-section">
          <h3 className="dashboard-section__title">As a planner</h3>
          <div className="dashboard-list">
            {itemsForPlanner.map((item) => (
              <DashboardItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {itemsForTraveller.length > 0 && (
        <div className="dashboard-section">
          <h3 className="dashboard-section__title">My requests</h3>
          <div className="dashboard-list">
            {itemsForTraveller.map((item) => (
              <DashboardItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {itemsForPlanner.length === 0 && itemsForTraveller.length === 0 && (
        <p className="dashboard-empty-text">No active requests right now.</p>
      )}
    </div>
  );
}

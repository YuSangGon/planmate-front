import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardRequests,
  type DashboardRequestItem,
} from "../../services/dashboardApi";

export default function DashboardRequestsSection() {
  const { token } = useAuth();

  const [items, setItems] = useState<DashboardRequestItem[]>([]);
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
        setItems(response.data);
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

      {items.length > 0 ? (
        <div className="dashboard-list">
          {items.map((item) => (
            <div key={item.id} className="dashboard-list-item">
              <div className="dashboard-list-item__top">
                <div>
                  <strong>{item.destination}</strong>
                  <span>{item.status}</span>
                </div>

                <Link
                  to={`/requests/${item.id}`}
                  className="btn btn--secondary"
                >
                  Open detail
                </Link>
              </div>

              <div className="dashboard-list-item__meta">
                <span>{item.duration}</span>
                <span>{item.budget}</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-empty-text">No active requests right now.</p>
      )}
    </div>
  );
}

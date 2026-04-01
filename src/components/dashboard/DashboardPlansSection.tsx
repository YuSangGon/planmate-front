import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardPlans,
  type DashboardPlanItem,
} from "../../services/dashboardApi";

export default function DashboardPlansSection() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [planItems, setPlanItems] = useState<DashboardPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getDashboardPlans(token);
        setPlanItems(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load plans.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchItems();
  }, [token]);

  const goToDetail = (planId: string) => {
    navigate(`/plans/${planId}`);
  };

  if (isLoading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__state-card">
          <p>Loading plans...</p>
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
        <h2>My plans</h2>
      </div>

      {planItems.length > 0 ? (
        <div className="dashboard-list">
          {planItems.map((plan) => (
            <div
              key={plan.id}
              className="dashboard-list-item"
              onClick={() => goToDetail(plan.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="dashboard-list-item__top">
                <div>
                  <strong>{plan.title}</strong>
                  <span>{plan.destination}</span>
                </div>

                {/* <Link to={`/plans/${plan.id}`} className="btn btn--secondary">
                  Open plan
                </Link> */}
              </div>

              <p>{plan.summary}</p>

              <div className="dashboard-list-item__meta">
                <span>{plan.duration}</span>
                <span>{plan.price}</span>
                <span>{plan.visibility}</span>
                <span>{plan.reviews.length} reviews</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-empty-text">
          You have not created any plans yet.
        </p>
      )}
    </div>
  );
}

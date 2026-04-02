import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardProposals,
  type DashboardProposalItem,
} from "../../services/dashboardApi";

export default function DashboardProposalsSection() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [recievedItems, setRecievedItems] = useState<DashboardProposalItem[]>(
    [],
  );
  const [sendItems, setSendItems] = useState<DashboardProposalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getDashboardProposals(token);
        setRecievedItems(
          response.data.filter((d) => d.planner.id !== user?.id),
        );
        setSendItems(response.data.filter((d) => d.planner.id === user?.id));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load received proposals.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchItems();
  }, [token]);

  const goToDetail = (requestId: string) => {
    navigate(`/requests/${requestId}`);
  };

  if (isLoading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__state-card">
          <p>Loading received proposals...</p>
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
        <h2>Received proposals</h2>
        {/* <p>See incoming proposals and continue the decision process.</p> */}
      </div>

      {recievedItems.length > 0 ? (
        <div className="dashboard-list">
          {recievedItems.map((item) => (
            <div
              key={item.id}
              className="dashboard-list-item"
              onClick={() => goToDetail(item.requestId)}
              style={{ cursor: "pointer" }}
            >
              <div className="dashboard-list-item__top">
                <div>
                  <strong>{item.destination}</strong>
                  <span>From {item.travellerName}</span>
                </div>

                {/* <Link
                  to={`/requests/${item.requestId}`}
                  className="btn btn--secondary"
                >
                  Open request
                </Link> */}
              </div>

              <p>{item.message}</p>

              <div className="dashboard-list-item__meta">
                {item.proposedPrice != null ? (
                  <span>Price {item.proposedPrice}</span>
                ) : null}
                {item.estimatedDays != null ? (
                  <span>{item.estimatedDays} days</span>
                ) : null}
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-empty-text">No received proposals yet.</p>
      )}

      <div className="dashboard-panel__header">
        <h2>Sent proposals</h2>
        {/* <p>See outcoming proposals and continue the next process.</p> */}
      </div>

      {sendItems.length > 0 ? (
        <div className="dashboard-list">
          {sendItems.map((item) => (
            <div
              key={item.id}
              className="dashboard-list-item"
              onClick={() => goToDetail(item.requestId)}
              style={{ cursor: "pointer" }}
            >
              <div className="dashboard-list-item__top">
                <div>
                  <strong>{item.destination}</strong>
                  <span>From {item.travellerName}</span>
                </div>

                {/* <Link
                  to={`/requests/${item.requestId}`}
                  className="btn btn--secondary"
                >
                  Open request
                </Link> */}
              </div>

              <p>{item.message}</p>

              <div className="dashboard-list-item__meta">
                {item.proposedPrice != null ? (
                  <span>Price {item.proposedPrice}</span>
                ) : null}
                {item.estimatedDays != null ? (
                  <span>{item.estimatedDays} days</span>
                ) : null}
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-empty-text">No sent proposals yet.</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  getRequests,
  getMyRequests,
  type RequestItem,
} from "../services/requestApi";
import "../styles/RequestListPage.css";

export default function RequestListPage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation("requestList");

  const [allRequests, setAllRequests] = useState<RequestItem[]>([]);
  const [myRequests, setMyRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getRequests(token);
        setAllRequests(response.data);

        const myResponse = await getMyRequests(token);
        setMyRequests(myResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRequests();
  }, [token, t]);

  const sourceRequests = showOnlyMine ? myRequests : allRequests;

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="request-list-toolbar">
          <>
            <label className="plans-switch">
              <input
                type="checkbox"
                checked={showOnlyMine}
                onChange={(e) => setShowOnlyMine(e.target.checked)}
              />
              <span className="plans-switch__slider" />
              <span className="plans-switch__label">
                {t("actions.onlyMyRequests")}
              </span>
            </label>
          </>

          <div />
          <Link to="/requests/new" className="btn btn--primary">
            {t("actions.newRequest")}
          </Link>
        </div>

        {isLoading ? (
          <div className="request-list-state-card">
            <p>{t("states.loading")}</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="request-list-state-card request-list-state-card--error">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && sourceRequests.length === 0 ? (
          <div className="request-list-state-card">
            <p>{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && sourceRequests.length > 0 ? (
          <div className="request-list-grid">
            {sourceRequests.map((request) => (
              <Link
                to={`/requests/${request.id}`}
                className="request-list-card"
                key={request.id}
              >
                <div className="request-list-card__top">
                  <div>
                    <span className="request-list-card__meta">
                      {new Date(request.createdAt).toLocaleDateString(
                        i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
                      )}
                    </span>
                    <h2>{request.destination}</h2>
                  </div>

                  <span
                    className={`request-status-badge request-status-badge--${request.status}`}
                  >
                    {t(`statuses.${request.status}`)}
                  </span>
                </div>

                <div className="request-list-card__meta-row">
                  <span>{request.duration}</span>
                  <span>{request.budget}</span>
                </div>

                <p className="request-list-card__summary">
                  {request.extraNotes || t("card.noNotes")}
                </p>

                <div className="request-list-card__tags">
                  {request.interests.slice(0, 3).map((interest) => (
                    <span key={interest} className="request-list-card__tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}

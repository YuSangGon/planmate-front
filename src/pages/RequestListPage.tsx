import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import { getMyRequests, type RequestItem } from "../services/requestApi";
import "../styles/RequestListPage.css";

export default function RequestListPage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation("requestList");

  const [items, setItems] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMyRequests(token);
        setItems(response.data);
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

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="request-list-toolbar">
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

        {!isLoading && !errorMessage && items.length === 0 ? (
          <div className="request-list-state-card">
            <p>{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="request-list-grid">
            {items.map((item) => (
              <Link
                to={`/requests/${item.id}`}
                className="request-list-card"
                key={item.id}
              >
                <div className="request-list-card__top">
                  <div>
                    <span className="request-list-card__meta">
                      {new Date(item.createdAt).toLocaleDateString(
                        i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
                      )}
                    </span>
                    <h2>{item.destination}</h2>
                  </div>

                  <span
                    className={`request-status-badge request-status-badge--${item.status}`}
                  >
                    {t(`statuses.${item.status}`)}
                  </span>
                </div>

                <div className="request-list-card__meta-row">
                  <span>{item.duration}</span>
                  <span>{item.budget}</span>
                </div>

                <p className="request-list-card__summary">
                  {item.extraNotes || t("card.noNotes")}
                </p>

                <div className="request-list-card__tags">
                  {item.interests.slice(0, 3).map((interest) => (
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

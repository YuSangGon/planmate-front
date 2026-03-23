import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import { getBrowseRequests } from "../services/plannerRequestApi";
import "../styles/BrowseRequestsPage.css";

type BrowseRequestItem = {
  id: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
  status: string;
  createdAt: string;
};

const filterOptions = [
  { key: "all", value: "All" },
  { key: "budget", value: "Budget" },
  { key: "luxury", value: "Luxury" },
  { key: "foodFocused", value: "Food-focused" },
  { key: "slowTravel", value: "Slow travel" },
];

export default function BrowseRequestsPage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation("browseRequests");

  const [items, setItems] = useState<BrowseRequestItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBrowseRequests = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getBrowseRequests(token);
        setItems(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBrowseRequests();
  }, [token, t]);

  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") {
      return items;
    }

    const selectedOption = filterOptions.find(
      (option) => option.key === selectedFilter,
    );

    if (!selectedOption) {
      return items;
    }

    const query = selectedOption.value.toLowerCase();

    return items.filter((item) => {
      const styles = item.travelStyle.toLowerCase();
      const interests = item.interests.join(", ").toLowerCase();

      return styles.includes(query) || interests.includes(query);
    });
  }, [items, selectedFilter]);

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="browse-requests-toolbar">
          <div className="browse-requests-toolbar__left">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                className={
                  selectedFilter === filter.key
                    ? "filter-chip filter-chip--active"
                    : "filter-chip"
                }
                onClick={() => setSelectedFilter(filter.key)}
              >
                {t(`filters.${filter.key}`)}
              </button>
            ))}
          </div>

          <div className="browse-requests-toolbar__right">
            <span className="browse-requests-count">
              {t("count", { count: filteredItems.length })}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="browse-requests-state-card">
            <p>{t("states.loading")}</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="browse-requests-state-card browse-requests-state-card--error">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && filteredItems.length === 0 ? (
          <div className="browse-requests-state-card">
            <p>{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && filteredItems.length > 0 ? (
          <div className="browse-requests-list">
            {filteredItems.map((request) => (
              <article className="request-card" key={request.id}>
                <div className="request-card__top">
                  <div>
                    <span className="request-card__meta">
                      {new Date(request.createdAt).toLocaleString(
                        i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
                      )}
                    </span>
                    <h2 className="request-card__title">
                      {request.destination}
                    </h2>
                  </div>

                  <div className="request-card__summary">
                    <span>{request.duration}</span>
                    <span>{request.budget}</span>
                  </div>
                </div>

                <div className="request-card__section">
                  <h3>{t("sections.travelStyle")}</h3>
                  <div className="request-card__tags">
                    {request.travelStyle
                      .split(",")
                      .map((style) => style.trim())
                      .filter(Boolean)
                      .map((style) => (
                        <span key={style} className="request-card__tag">
                          {style}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="request-card__section">
                  <h3>{t("sections.interests")}</h3>
                  <div className="request-card__tags">
                    {request.interests.map((interest) => (
                      <span
                        key={interest}
                        className="request-card__tag request-card__tag--soft"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="request-card__section">
                  <h3>{t("sections.notes")}</h3>
                  <p>{request.extraNotes || t("sections.noNotes")}</p>
                </div>

                <div className="request-card__actions">
                  <Link
                    to={`/browse-requests/${request.id}`}
                    className="btn btn--secondary"
                  >
                    {t("actions.viewDetails")}
                  </Link>
                  <Link
                    to={`/browse-requests/${request.id}`}
                    className="btn btn--primary"
                  >
                    {t("actions.sendProposal")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}

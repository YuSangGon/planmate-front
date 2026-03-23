import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  getPlannerReceivedProposals,
  getPlannerSentProposals,
  type PlannerReceivedProposalItem,
  type PlannerSentProposalItem,
} from "../services/plannerProposalApi";
import "../styles/PlannerProposalPages.css";

type ProposalTab = "sent" | "received";

export default function PlannerProposalListPage() {
  const { token } = useAuth();
  const { t } = useTranslation("plannerProposals");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("tab") as ProposalTab) || "sent";

  const [sentItems, setSentItems] = useState<PlannerSentProposalItem[]>([]);
  const [receivedItems, setReceivedItems] = useState<
    PlannerReceivedProposalItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const [sentResponse, receivedResponse] = await Promise.all([
          getPlannerSentProposals(token),
          getPlannerReceivedProposals(token),
        ]);

        setSentItems(sentResponse.data);
        setReceivedItems(receivedResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [token, t]);

  const items = activeTab === "sent" ? sentItems : receivedItems;

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="planner-proposal-submenu">
          <button
            type="button"
            className={
              activeTab === "sent"
                ? "planner-proposal-submenu__item planner-proposal-submenu__item--active"
                : "planner-proposal-submenu__item"
            }
            onClick={() => setSearchParams({ tab: "sent" })}
          >
            {t("tabs.sent")}
          </button>

          <button
            type="button"
            className={
              activeTab === "received"
                ? "planner-proposal-submenu__item planner-proposal-submenu__item--active"
                : "planner-proposal-submenu__item"
            }
            onClick={() => setSearchParams({ tab: "received" })}
          >
            {t("tabs.received")}
          </button>
        </div>

        {isLoading ? (
          <div className="planner-proposal-state-card">
            <p>{t("states.loading")}</p>
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="planner-proposal-state-card planner-proposal-state-card--error">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          <div className="planner-proposal-state-card">
            <p>{t("states.empty")}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="planner-proposal-list">
            {activeTab === "sent"
              ? sentItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/planner-proposals/sent/${item.id}`}
                    className="planner-proposal-card"
                  >
                    <div className="planner-proposal-card__top">
                      <div>
                        <strong>{item.request.destination}</strong>
                        <span>
                          {t("labels.traveller")}: {item.request.traveller.name}
                        </span>
                      </div>
                      <span
                        className={`planner-status-badge planner-status-badge--${item.status}`}
                      >
                        {t(`statuses.${item.status}`)}
                      </span>
                    </div>

                    <p>{item.message}</p>

                    <div className="planner-proposal-card__meta">
                      <span>{item.request.duration}</span>
                      <span>{item.request.budget}</span>
                      {item.proposedPrice != null ? (
                        <span>
                          {t("labels.priceValue", {
                            price: item.proposedPrice,
                          })}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))
              : receivedItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/planner-proposals/received/${item.id}`}
                    className="planner-proposal-card"
                  >
                    <div className="planner-proposal-card__top">
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {t("labels.traveller")}: {item.traveller.name}
                        </span>
                      </div>
                      <span
                        className={`planner-status-badge planner-status-badge--${item.status}`}
                      >
                        {t(`statuses.${item.status}`)}
                      </span>
                    </div>

                    <p>{item.message}</p>

                    <div className="planner-proposal-card__meta">
                      <span>{item.destination}</span>
                      <span>{item.duration}</span>
                      <span>{item.budget}</span>
                    </div>
                  </Link>
                ))}
          </div>
        ) : null}
      </section>
    </MainLayout>
  );
}

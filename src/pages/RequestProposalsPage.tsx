import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import { acceptProposal, getRequestProposals } from "../services/proposalApi";

type ProposalItem = {
  id: string;
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  planner: {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
    role: string;
  };
};

export default function RequestProposalsPage() {
  const { requestId } = useParams();
  const { token } = useAuth();
  const { t } = useTranslation("requestProposals");

  const [items, setItems] = useState<ProposalItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeProposalId, setActiveProposalId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !requestId) return;

      try {
        const response = await getRequestProposals(token, requestId);
        setItems(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      }
    };

    void fetchData();
  }, [token, requestId, t]);

  const handleAccept = async (proposalId: string) => {
    if (!token) return;

    setActiveProposalId(proposalId);

    try {
      await acceptProposal(token, proposalId);

      setItems((prev) =>
        prev.map((item) =>
          item.id === proposalId
            ? { ...item, status: "accepted" }
            : item.status === "pending"
              ? { ...item, status: "rejected" }
              : item,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.acceptError"),
      );
    } finally {
      setActiveProposalId("");
    }
  };

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        {errorMessage ? <p>{errorMessage}</p> : null}

        <div className="open-requests-list">
          {items.map((item) => (
            <article className="request-card" key={item.id}>
              <div className="request-card__top">
                <div>
                  <span className="request-card__meta">
                    {t(`status.${item.status}`)}
                  </span>
                  <h2 className="request-card__title">{item.planner.name}</h2>
                </div>

                <div className="request-card__summary">
                  {item.proposedPrice ? (
                    <span>
                      {t("meta.price")}: {item.proposedPrice}
                    </span>
                  ) : null}
                  {item.estimatedDays ? (
                    <span>
                      {item.estimatedDays} {t("common.days")}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="request-card__section">
                <h3>{t("sections.proposal")}</h3>
                <p>{item.message}</p>
              </div>

              <div className="request-card__section">
                <h3>{t("sections.plannerBio")}</h3>
                <p>{item.planner.bio || t("sections.noBio")}</p>
              </div>

              <div className="request-card__actions">
                <button
                  className="btn btn--primary"
                  onClick={() => handleAccept(item.id)}
                  disabled={
                    item.status !== "pending" || activeProposalId === item.id
                  }
                >
                  {activeProposalId === item.id
                    ? t("actions.accepting")
                    : t("actions.accept")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

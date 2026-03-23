import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  acceptPlannerReceivedProposal,
  getPlannerReceivedProposalDetail,
  rejectPlannerReceivedProposal,
  type PlannerReceivedProposalDetail,
} from "../services/plannerProposalApi";
import "../styles/PlannerProposalPages.css";

export default function PlannerReceivedProposalDetailPage() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation("plannerProposalDetail");

  const [item, setItem] = useState<PlannerReceivedProposalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!token || !proposalId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlannerReceivedProposalDetail(
          token,
          proposalId,
        );
        setItem(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDetail();
  }, [token, proposalId, t]);

  const handleAccept = async () => {
    if (!token || !proposalId || !item) return;

    setActiveAction("accept");

    try {
      await acceptPlannerReceivedProposal(token, proposalId);
      setItem({ ...item, status: "accepted" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.acceptError"),
      );
    } finally {
      setActiveAction("");
    }
  };

  const handleReject = async () => {
    if (!token || !proposalId || !item) return;

    setActiveAction("reject");

    try {
      await rejectPlannerReceivedProposal(token, proposalId);
      setItem({ ...item, status: "rejected" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.rejectError"),
      );
    } finally {
      setActiveAction("");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="planner-proposal-state-card">
            <p>{t("states.loading")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!item) {
    return (
      <MainLayout>
        <section className="section">
          <div className="planner-proposal-state-card planner-proposal-state-card--error">
            <p>{errorMessage || t("states.notFound")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  const canRespond = item.status === "pending";

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("received.hero.eyebrow")}
        title={item.title}
        description={t("received.hero.description")}
      />

      <section className="section section--compact">
        <div className="planner-proposal-detail-card">
          <div className="planner-proposal-detail-card__top">
            <div>
              <h2>{item.title}</h2>
              <p>
                {t("labels.traveller")}: {item.traveller.name} ·{" "}
                {item.traveller.email}
              </p>
            </div>
            <span
              className={`planner-status-badge planner-status-badge--${item.status}`}
            >
              {t(`statuses.${item.status}`)}
            </span>
          </div>

          <div className="planner-proposal-detail-grid">
            <div className="planner-proposal-main-block">
              <div className="planner-proposal-detail-section">
                <h3>{t("received.sections.message")}</h3>
                <p>{item.message}</p>
              </div>

              <div className="planner-proposal-detail-section">
                <h3>{t("received.sections.extraNotes")}</h3>
                <p>{item.extraNotes || t("received.sections.noExtraNotes")}</p>
              </div>
            </div>

            <div className="planner-proposal-side-block">
              <div className="planner-proposal-card__meta">
                <span>{item.destination}</span>
                <span>{item.duration}</span>
                <span>{item.budget}</span>
              </div>

              <div className="planner-proposal-detail-section">
                <h3>{t("received.sections.travelStyle")}</h3>
                <p>{item.travelStyle}</p>
              </div>

              <div className="planner-proposal-detail-section">
                <h3>{t("received.sections.interests")}</h3>
                <div className="planner-proposal-tags">
                  {item.interests.map((interest) => (
                    <span key={interest} className="planner-proposal-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <p className="planner-proposal-error">{errorMessage}</p>
          ) : null}

          <div className="planner-proposal-actions">
            {canRespond ? (
              <>
                <button
                  className="btn btn--primary"
                  onClick={handleAccept}
                  disabled={activeAction !== ""}
                >
                  {activeAction === "accept"
                    ? t("actions.accepting")
                    : t("actions.accept")}
                </button>
                <button
                  className="btn btn--danger-ghost"
                  onClick={handleReject}
                  disabled={activeAction !== ""}
                >
                  {activeAction === "reject"
                    ? t("actions.rejecting")
                    : t("actions.reject")}
                </button>
              </>
            ) : (
              <span className="planner-proposal-helper">
                {t("received.alreadyHandled", {
                  status: t(`statuses.${item.status}`),
                })}
              </span>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

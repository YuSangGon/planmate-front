import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  deletePlannerSentProposal,
  getPlannerSentProposalDetail,
  updatePlannerSentProposal,
  withdrawPlannerSentProposal,
  type PlannerSentProposalDetail,
} from "../services/plannerProposalApi";
import "../styles/PlannerProposalPages.css";

export default function PlannerSentProposalDetailPage() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation("plannerProposalDetail");

  const [item, setItem] = useState<PlannerSentProposalDetail | null>(null);
  const [message, setMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!token || !proposalId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlannerSentProposalDetail(token, proposalId);
        setItem(response.data);
        setMessage(response.data.message);
        setProposedPrice(
          response.data.proposedPrice != null
            ? String(response.data.proposedPrice)
            : "",
        );
        setEstimatedDays(
          response.data.estimatedDays != null
            ? String(response.data.estimatedDays)
            : "",
        );
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

  const handleSave = async () => {
    if (!token || !proposalId || !item) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await updatePlannerSentProposal(token, proposalId, {
        message: message.trim(),
        proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
        estimatedDays: estimatedDays ? Number(estimatedDays) : undefined,
      });

      setItem(response.data);
      setToastMessage(t("states.updated"));
      window.setTimeout(() => setToastMessage(""), 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.updateError"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !proposalId) return;
    const confirmed = window.confirm(t("dialogs.deleteConfirm"));
    if (!confirmed) return;

    try {
      await deletePlannerSentProposal(token, proposalId);
      navigate("/planner-proposals?tab=sent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.deleteError"),
      );
    }
  };

  const handleWithdraw = async () => {
    if (!token || !proposalId) return;
    const confirmed = window.confirm(t("dialogs.withdrawConfirm"));
    if (!confirmed) return;

    try {
      await withdrawPlannerSentProposal(token, proposalId);
      navigate("/planner-proposals?tab=sent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.withdrawError"),
      );
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

  const canEditOrDelete = item.status === "pending";
  const canWithdraw = item.status === "accepted";

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("sent.hero.eyebrow")}
        title={item.request.destination}
        description={t("sent.hero.description")}
      />

      <section className="section section--compact">
        <div className="planner-proposal-detail-card">
          <div className="planner-proposal-detail-card__top">
            <div>
              <h2>{item.request.destination}</h2>
              <p>
                {t("labels.traveller")}: {item.request.traveller.name} ·{" "}
                {item.request.budget}
              </p>
            </div>
            <span
              className={`planner-status-badge planner-status-badge--${item.status}`}
            >
              {t(`statuses.${item.status}`)}
            </span>
          </div>

          <div className="planner-proposal-detail-grid">
            <div className="form-field">
              <label>{t("sent.sections.message")}</label>
              <textarea
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!canEditOrDelete}
              />
            </div>

            <div className="planner-proposal-side-block">
              <div className="form-field">
                <label>{t("sent.sections.proposedPrice")}</label>
                <input
                  type="number"
                  min="0"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  disabled={!canEditOrDelete}
                />
              </div>

              <div className="form-field">
                <label>{t("sent.sections.estimatedDays")}</label>
                <input
                  type="number"
                  min="1"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  disabled={!canEditOrDelete}
                />
              </div>

              <div className="planner-proposal-card__meta">
                <span>{item.request.duration}</span>
                <span>
                  {t("labels.offerCostValue", { cost: item.request.offerCost })}
                </span>
                <span>{item.request.status}</span>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <p className="planner-proposal-error">{errorMessage}</p>
          ) : null}

          {toastMessage ? (
            <div className="planner-proposal-toast">{toastMessage}</div>
          ) : null}

          <div className="planner-proposal-actions">
            {canEditOrDelete ? (
              <>
                <button
                  className="btn btn--primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? t("actions.saving") : t("actions.saveChanges")}
                </button>
                <button
                  className="btn btn--danger-ghost"
                  onClick={handleDelete}
                >
                  {t("actions.delete")}
                </button>
              </>
            ) : null}

            {canWithdraw ? (
              <>
                <button
                  className="btn btn--primary"
                  onClick={() =>
                    navigate(`/requests/${item.request.id}/work-plan`)
                  }
                >
                  {t("actions.goToPlanBuilder")}
                </button>

                <button
                  className="btn btn--danger-ghost"
                  onClick={handleWithdraw}
                >
                  {t("actions.withdraw")}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

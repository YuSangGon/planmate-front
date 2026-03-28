import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  acceptProposal,
  getRequestDetail,
  getRequestProposals,
  rejectProposal,
  completeRequest,
  type RequestItem,
  type RequestProposalItem,
} from "../services/requestApi";
import {
  createPlannerReview,
  editPlannerReview,
  getPlannerReviewForRequest,
  type PlannerReviewPayload,
} from "../services/reviewApi";
import { createProposal } from "../services/plannerRequestApi";
import RequestSummaryCard from "../components/request/RequestSummaryCard";
import RequestProposalWorkspace from "../components/request/RequestProposalWorkspace";
import RequestApplyModal from "../components/request/RequestApplyModal";
import "../styles/RequestDetailPage.css";

type ProposalFilter = "all" | "pending" | "accepted" | "rejected";

function isWithinReviewWindow(completedAt?: string | null) {
  if (!completedAt) return false;

  const completedTime = new Date(completedAt).getTime();
  if (Number.isNaN(completedTime)) return false;

  const deadline = completedTime + 7 * 24 * 60 * 60 * 1000;
  return Date.now() <= deadline;
}

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const { token, user } = useAuth();
  const { t } = useTranslation("requestDetail");
  const { showToast } = useToast();

  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [plannerReviewItem, setPlannerReviewItem] =
    useState<PlannerReviewPayload | null>(null);
  const [proposals, setProposals] = useState<RequestProposalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeProposalId, setActiveProposalId] = useState("");
  const [proposalFilter, setProposalFilter] = useState<ProposalFilter>("all");
  const [showFullDetails, setShowFullDetails] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [canViewProposals, setCanViewProposals] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyPrice, setApplyPrice] = useState("");
  const [applyDays, setApplyDays] = useState("");
  const [isSubmittingApply, setIsSubmittingApply] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !requestId) {
        setIsLoading(false);
        return;
      }

      try {
        const [requestDetail, proposalsResponse, reviewDetail] =
          await Promise.all([
            getRequestDetail(token, requestId),
            getRequestProposals(token, requestId),
            getPlannerReviewForRequest(token, requestId),
          ]);

        setRequestItem(requestDetail.data);
        setPlannerReviewItem(reviewDetail.data);
        setCanViewProposals(proposalsResponse.data.canView);
        setProposals(proposalsResponse.data.items);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [token, requestId, t]);

  useEffect(() => {
    const completedAt = (
      requestItem as RequestItem & { completedAt?: string | null }
    )?.completedAt;

    if (
      requestItem?.status === "completed" &&
      isWithinReviewWindow(completedAt) &&
      !plannerReviewItem
    ) {
      setShowReviewForm(true);
    }
  }, [requestItem, plannerReviewItem]);

  const acceptedProposal = useMemo(
    () => proposals.find((item) => item.status === "accepted") ?? null,
    [proposals],
  );

  const filteredProposals = useMemo(() => {
    if (proposalFilter === "all") return proposals;
    return proposals.filter((item) => item.status === proposalFilter);
  }, [proposalFilter, proposals]);

  const nonAcceptedProposals = filteredProposals.filter(
    (item) => item.status !== "accepted",
  );

  const handleAccept = async (proposalId: string) => {
    if (!token || !requestItem) return;

    setActiveProposalId(proposalId);
    setErrorMessage("");

    try {
      const response = await acceptProposal(token, proposalId);
      const { acceptedProposal, rejectedProposalIds, request } = response.data;

      setProposals((prev) =>
        prev.map((item) => {
          if (item.id === acceptedProposal.id) {
            return { ...item, ...acceptedProposal, status: "accepted" };
          }

          if (rejectedProposalIds.includes(item.id)) {
            return { ...item, status: "rejected" };
          }

          return item;
        }),
      );

      setRequestItem({
        ...requestItem,
        plannerId: request.plannerId,
        status: request.status,
      });

      setProposalFilter("all");
      showToast(t("toasts.accepted"), "success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.acceptError"),
      );
    } finally {
      setActiveProposalId("");
    }
  };

  const handleReject = async (proposalId: string) => {
    if (!token) return;

    const confirmed = window.confirm(t("dialogs.rejectConfirm"));
    if (!confirmed) return;

    setActiveProposalId(proposalId);
    setErrorMessage("");

    try {
      await rejectProposal(token, proposalId);

      setProposals((prev) =>
        prev.map((item) =>
          item.id === proposalId ? { ...item, status: "rejected" } : item,
        ),
      );

      showToast(t("toasts.rejected"), "error");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.rejectError"),
      );
    } finally {
      setActiveProposalId("");
    }
  };

  const handleCompleteRequest = async () => {
    if (!token || !requestItem) return;

    try {
      const response = await completeRequest(token, requestItem.id);
      setRequestItem(response.data);
      setShowReviewForm(true);
      showToast(t("toasts.completed"), "success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.completeError"),
      );
    }
  };

  const handleReviewSubmit = async (payload: PlannerReviewPayload) => {
    if (!token) return;

    try {
      if (isEditingReview) {
        await editPlannerReview(token, payload);
      } else {
        await createPlannerReview(token, payload);
      }

      setPlannerReviewItem(payload);
      setShowReviewForm(false);
      setIsEditingReview(false);
      showToast(
        isEditingReview ? "Review updated." : "Review submitted.",
        "success",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "review submit error",
      );
    }
  };

  const handleSubmitApply = async () => {
    if (!token || !requestId) return;

    if (applyMessage.trim().length < 10) {
      setErrorMessage("Please write a message.");
      return;
    }

    setIsSubmittingApply(true);
    setErrorMessage("");

    try {
      await createProposal(token, requestId, {
        message: applyMessage.trim(),
        proposedPrice: applyPrice ? Number(applyPrice) : undefined,
        estimatedDays: applyDays ? Number(applyDays) : undefined,
      });

      setShowApplyModal(false);
      setApplyMessage("");
      setApplyPrice("");
      setApplyDays("");
      showToast("Proposal sent successfully.", "success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send proposal",
      );
    } finally {
      setIsSubmittingApply(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="request-detail-state-card">
            <p>{t("states.loading")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!requestItem || errorMessage) {
    return (
      <MainLayout>
        <section className="section">
          <div className="request-detail-state-card request-detail-state-card--error">
            <p>{errorMessage || t("states.notFound")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={requestItem.destination}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <RequestSummaryCard
          requestItem={requestItem}
          showFullDetails={showFullDetails}
          onToggleDetails={() => setShowFullDetails((prev) => !prev)}
          canViewProposals={canViewProposals}
          onClickApply={() => setShowApplyModal(true)}
          isMatchedPlanner={requestItem.plannerId === user?.id}
        />

        {canViewProposals ? (
          <RequestProposalWorkspace
            requestItem={requestItem}
            proposals={proposals}
            acceptedProposal={acceptedProposal}
            nonAcceptedProposals={nonAcceptedProposals}
            proposalFilter={proposalFilter}
            onChangeFilter={setProposalFilter}
            activeProposalId={activeProposalId}
            plannerReviewItem={plannerReviewItem}
            showReviewForm={showReviewForm}
            isEditingReview={isEditingReview}
            onAccept={handleAccept}
            onReject={handleReject}
            onComplete={handleCompleteRequest}
            onEditReview={() => {
              setIsEditingReview(true);
              setShowReviewForm(true);
            }}
            onSubmitReview={handleReviewSubmit}
            onCancelReview={() => {
              setShowReviewForm(false);
              setIsEditingReview(false);
            }}
          />
        ) : null}

        <RequestApplyModal
          isOpen={showApplyModal}
          message={applyMessage}
          price={applyPrice}
          days={applyDays}
          isSubmitting={isSubmittingApply}
          onChangeMessage={setApplyMessage}
          onChangePrice={setApplyPrice}
          onChangeDays={setApplyDays}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleSubmitApply}
        />
      </section>
    </MainLayout>
  );
}

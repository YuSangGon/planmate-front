import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  acceptProposal,
  getMyRequests,
  getRequestDetail,
  getRequestProposals,
  rejectProposal,
  completeRequest,
  type RequestItem,
  type RequestProposalItem,
} from "../services/requestApi";
import "../styles/RequestDetailPage.css";
import { Link, useParams } from "react-router-dom";

type ProposalFilter = "all" | "pending" | "accepted" | "rejected";

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const { token } = useAuth();
  const { t, i18n } = useTranslation("requestDetail");

  const [requestItem, setRequestItem] = useState<RequestItem | null>(null);
  const [proposals, setProposals] = useState<RequestProposalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeProposalId, setActiveProposalId] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [proposalFilter, setProposalFilter] = useState<ProposalFilter>("all");
  const [showFullDetails, setShowFullDetails] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [canViewProposals, setCanViewProposals] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !requestId) {
        setIsLoading(false);
        return;
      }

      try {
        const [requestDetail, proposalsResponse] = await Promise.all([
          getRequestDetail(token, requestId),
          getRequestProposals(token, requestId),
        ]);

        setRequestItem(requestDetail.data);
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

  const acceptedProposal = useMemo(
    () => proposals.find((item) => item.status === "accepted") ?? null,
    [proposals],
  );

  const filteredProposals = useMemo(() => {
    if (proposalFilter === "all") {
      return proposals;
    }

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
            return {
              ...item,
              ...acceptedProposal,
              status: "accepted",
            };
          }

          if (rejectedProposalIds.includes(item.id)) {
            return {
              ...item,
              status: "rejected",
            };
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
      setToastMessage(t("toasts.accepted"));
      window.setTimeout(() => setToastMessage(""), 2600);
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

      setToastMessage(t("toasts.rejected"));
      window.setTimeout(() => setToastMessage(""), 2000);
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
      setToastMessage(t("toasts.completed"));
      window.setTimeout(() => setToastMessage(""), 2600);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("states.completeError"),
      );
    }
  };

  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 아직 실제 API 연결 전 임시 처리
    setToastMessage("Review submitted.");
    setShowReviewForm(false);
    setReviewRating(5);
    setReviewContent("");
    window.setTimeout(() => setToastMessage(""), 2600);
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
        <article className="request-summary-card">
          <div className="request-summary-card__top">
            <div>
              <span className="request-summary-card__eyebrow">
                {t("summary.eyebrow")}
              </span>
              <h2>{requestItem.destination}</h2>
            </div>

            <span
              className={`request-status-badge request-status-badge--${requestItem.status}`}
            >
              {t(`statuses.${requestItem.status}`)}
            </span>
          </div>

          <div className="request-summary-card__meta">
            <span>{requestItem.duration}</span>
            <span>{requestItem.budget}</span>
            <span>
              {new Date(requestItem.createdAt).toLocaleDateString(
                i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
              )}
            </span>
          </div>

          <div className="request-summary-card__content">
            <div className="request-summary-card__block">
              <h3>{t("summary.travelStyle")}</h3>
              <p>{requestItem.travelStyle}</p>
            </div>

            <div className="request-summary-card__block">
              <h3>{t("summary.interests")}</h3>
              <div className="request-detail-tags">
                {(showFullDetails
                  ? requestItem.interests
                  : requestItem.interests.slice(0, 4)
                ).map((interest) => (
                  <span key={interest} className="request-detail-tag">
                    {interest}
                  </span>
                ))}

                {!showFullDetails && requestItem.interests.length > 4 ? (
                  <span className="request-detail-tag request-detail-tag--count">
                    {t("summary.moreCount", {
                      count: requestItem.interests.length - 4,
                    })}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="request-summary-card__block">
              <h3>{t("summary.extraNotes")}</h3>
              <p>
                {showFullDetails
                  ? requestItem.extraNotes || t("summary.noNotes")
                  : requestItem.extraNotes
                    ? requestItem.extraNotes.length > 180
                      ? `${requestItem.extraNotes.slice(0, 180)}...`
                      : requestItem.extraNotes
                    : t("summary.noNotes")}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="request-summary-card__toggle"
            onClick={() => setShowFullDetails((prev) => !prev)}
          >
            {showFullDetails ? t("summary.showLess") : t("summary.showFull")}
          </button>
        </article>

        {canViewProposals ? (
          <article className="request-workspace-card">
            <div className="request-detail-section-header">
              <h3>{t("proposals.title")}</h3>
              <span>{proposals.length}</span>
            </div>

            <div className="request-proposal-toolbar">
              <button
                type="button"
                className={
                  proposalFilter === "all"
                    ? "request-proposal-filter request-proposal-filter--active"
                    : "request-proposal-filter"
                }
                onClick={() => setProposalFilter("all")}
              >
                {t("filters.all")}
              </button>

              <button
                type="button"
                className={
                  proposalFilter === "pending"
                    ? "request-proposal-filter request-proposal-filter--active"
                    : "request-proposal-filter"
                }
                onClick={() => setProposalFilter("pending")}
              >
                {t("filters.pending")}
              </button>

              <button
                type="button"
                className={
                  proposalFilter === "accepted"
                    ? "request-proposal-filter request-proposal-filter--active"
                    : "request-proposal-filter"
                }
                onClick={() => setProposalFilter("accepted")}
              >
                {t("filters.accepted")}
              </button>

              <button
                type="button"
                className={
                  proposalFilter === "rejected"
                    ? "request-proposal-filter request-proposal-filter--active"
                    : "request-proposal-filter"
                }
                onClick={() => setProposalFilter("rejected")}
              >
                {t("filters.rejected")}
              </button>
            </div>

            {acceptedProposal &&
            (proposalFilter === "all" || proposalFilter === "accepted") ? (
              <div className="request-detail-highlight-card">
                <div className="request-detail-highlight-card__top">
                  <div>
                    <span className="request-detail-highlight-card__eyebrow">
                      {t("acceptedPlanner.eyebrow")}
                    </span>
                    <strong>{acceptedProposal.planner.name}</strong>
                    <p>{acceptedProposal.planner.email}</p>
                  </div>

                  <span className="request-status-badge request-status-badge--accepted">
                    {t("statuses.accepted")}
                  </span>
                </div>

                <p className="request-detail-highlight-card__message">
                  {acceptedProposal.message}
                </p>

                <div className="request-proposal-meta">
                  {acceptedProposal.proposedPrice != null ? (
                    <span>
                      {t("proposalCard.priceValue", {
                        price: acceptedProposal.proposedPrice,
                      })}
                    </span>
                  ) : null}
                  {acceptedProposal.estimatedDays != null ? (
                    <span>
                      {t("proposalCard.daysValue", {
                        count: acceptedProposal.estimatedDays,
                      })}
                    </span>
                  ) : null}
                </div>

                <div className="request-detail-highlight-note">
                  {t("acceptedPlanner.note")}
                </div>

                {requestItem.status === "submitted" ||
                requestItem.status === "completed" ? (
                  <div className="request-detail-highlight-actions">
                    <Link
                      to={`/requests/${requestItem.id}/preview-plan`}
                      className="btn btn--primary"
                    >
                      {t("acceptedPlanner.previewPlan")}
                    </Link>

                    {requestItem.status !== "completed" ? (
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={handleCompleteRequest}
                      >
                        Complete
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {showReviewForm && requestItem.status === "completed" ? (
                  <form
                    className="request-review-form"
                    onSubmit={handleReviewSubmit}
                  >
                    <div className="request-review-form__header">
                      <h4>Leave a review</h4>
                      <p>Share your experience with this planner.</p>
                    </div>

                    <div className="form-field">
                      <label htmlFor="review-rating">Rating</label>
                      <select
                        id="review-rating"
                        value={reviewRating}
                        onChange={(e) =>
                          setReviewRating(Number(e.target.value))
                        }
                      >
                        <option value={5}>5</option>
                        <option value={4}>4</option>
                        <option value={3}>3</option>
                        <option value={2}>2</option>
                        <option value={1}>1</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor="review-content">Review</label>
                      <textarea
                        id="review-content"
                        rows={4}
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Write your review here."
                      />
                    </div>

                    <div className="request-review-form__actions">
                      <button type="submit" className="btn btn--primary">
                        Submit review
                      </button>

                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            ) : null}

            {nonAcceptedProposals.length > 0 ? (
              <div className="request-proposal-list">
                {nonAcceptedProposals.map((proposal) => (
                  <div key={proposal.id} className="request-proposal-card">
                    <div className="request-proposal-card__top">
                      <div className="request-proposal-card__planner">
                        <strong>{proposal.planner.name}</strong>
                        <span>{proposal.planner.email}</span>
                      </div>

                      <span
                        className={`request-status-badge request-status-badge--${proposal.status}`}
                      >
                        {t(`statuses.${proposal.status}`)}
                      </span>
                    </div>

                    <div className="request-proposal-card__summary-grid">
                      <div className="request-proposal-stat">
                        <span>{t("proposalCard.proposedPrice")}</span>
                        <strong>
                          {proposal.proposedPrice != null
                            ? proposal.proposedPrice
                            : t("proposalCard.notSpecified")}
                        </strong>
                      </div>

                      <div className="request-proposal-stat">
                        <span>{t("proposalCard.estimatedTime")}</span>
                        <strong>
                          {proposal.estimatedDays != null
                            ? t("proposalCard.daysValue", {
                                count: proposal.estimatedDays,
                              })
                            : t("proposalCard.notSpecified")}
                        </strong>
                      </div>
                    </div>

                    <p className="request-proposal-card__message">
                      {proposal.message}
                    </p>

                    <p className="request-proposal-bio">
                      {proposal.planner.bio || t("proposalCard.noBio")}
                    </p>

                    <div className="request-proposal-actions">
                      {proposal.status === "pending" && !acceptedProposal ? (
                        <>
                          <button
                            className="btn btn--primary"
                            disabled={activeProposalId === proposal.id}
                            onClick={() => handleAccept(proposal.id)}
                          >
                            {activeProposalId === proposal.id
                              ? t("actions.processing")
                              : t("actions.accept")}
                          </button>

                          <button
                            className="btn btn--danger-ghost"
                            disabled={activeProposalId === proposal.id}
                            onClick={() => handleReject(proposal.id)}
                          >
                            {t("actions.reject")}
                          </button>
                        </>
                      ) : proposal.status === "accepted" ? (
                        <span className="request-proposal-helper request-proposal-helper--accepted">
                          {t("helpers.selectedPlanner")}
                        </span>
                      ) : proposal.status === "rejected" ? (
                        <span className="request-proposal-helper">
                          {t("helpers.rejectedProposal")}
                        </span>
                      ) : (
                        <span className="request-proposal-helper">
                          {t("helpers.inactiveProposal")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="request-detail-empty-text">
                {t("proposals.empty")}
              </p>
            )}
          </article>
        ) : null}

        {toastMessage ? (
          <div className="request-detail-toast">{toastMessage}</div>
        ) : null}
      </section>
    </MainLayout>
  );
}

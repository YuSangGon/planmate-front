import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  createProposal,
  getBrowseRequestDetail,
} from "../services/plannerRequestApi";
import "../styles/OpenRequestDetailPage.css";

type MyProposal = {
  id: string;
  message: string;
  proposedPrice?: number | null;
  estimatedDays?: number | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
};

type OpenRequestDetail = {
  id: string;
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  extraNotes?: string;
  createdAt: string;
  traveller: {
    id: string;
    name: string;
    bio?: string | null;
  };
  _count: {
    proposals: number;
  };
  myProposal: MyProposal | null;
};

export default function OpenRequestDetailPage() {
  const { requestId } = useParams();
  const { token } = useAuth();
  const { t, i18n } = useTranslation("browseRequestDetail");

  const [requestItem, setRequestItem] = useState<OpenRequestDetail | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!token || !requestId) return;

      try {
        const response = await getBrowseRequestDetail(token, requestId);
        setRequestItem(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load request",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDetail();
  }, [token, requestId]);

  const handleSubmitProposal = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !requestId || !requestItem) return;

    if (message.trim().length < 10) {
      setErrorMessage("Please write at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createProposal(token, requestId, {
        message: message.trim(),
        proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
        estimatedDays: estimatedDays ? Number(estimatedDays) : undefined,
      });

      setRequestItem({
        ...requestItem,
        myProposal: response.data,
        _count: {
          ...requestItem._count,
          proposals: requestItem._count.proposals + 1,
        },
      });

      setToast("Proposal sent successfully.");
      setMessage("");
      setProposedPrice("");
      setEstimatedDays("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send proposal",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <p>{t("states.loading")}</p>
        </section>
      </MainLayout>
    );
  }

  if (!requestItem) {
    return (
      <MainLayout>
        <section className="section">
          <p>{t("states.notFound")}</p>
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
        <div className="request-detail-layout">
          <article className="request-detail-card">
            <div className="request-detail-meta">
              <span>{requestItem.duration}</span>
              <span>{requestItem.budget}</span>
              <span>
                {t("meta.proposalsCount", {
                  count: requestItem._count.proposals,
                })}
              </span>
            </div>

            <div className="request-detail-section">
              <h3>{t("sections.traveller")}</h3>
              <p>
                <strong>{requestItem.traveller.name}</strong>
              </p>
              {requestItem.traveller.bio ? (
                <p>{requestItem.traveller.bio}</p>
              ) : null}
            </div>

            <div className="request-detail-section">
              <h3>{t("sections.travelStyle")}</h3>
              <p>{requestItem.travelStyle}</p>
            </div>

            <div className="request-detail-section">
              <h3>{t("sections.interests")}</h3>
              <div className="request-detail-tags">
                {requestItem.interests.map((item) => (
                  <span key={item} className="request-detail-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="request-detail-section">
              <h3>{t("sections.notes")}</h3>
              <p>{requestItem.extraNotes || t("sections.noNotes")}</p>
            </div>
          </article>

          <aside className="proposal-form-card">
            {requestItem.myProposal ? (
              <>
                <h2 className="content-title">{t("myProposal.title")}</h2>
                <p className="content-description">
                  {t("myProposal.description")}
                </p>

                <div className="proposal-detail">
                  <div className="proposal-detail__row">
                    <span className="proposal-detail__label">
                      {t("myProposal.statusLabel")}
                    </span>
                    <span
                      className={`proposal-status proposal-status--${requestItem.myProposal.status}`}
                    >
                      {t(`statuses.${requestItem.myProposal.status}`)}
                    </span>
                  </div>

                  <div className="proposal-detail__section">
                    <h3>{t("myProposal.introduction")}</h3>
                    <p>{requestItem.myProposal.message}</p>
                  </div>

                  <div className="proposal-detail__meta">
                    <div className="proposal-detail__meta-card">
                      <span>{t("myProposal.proposedPrice")}</span>
                      <strong>
                        {requestItem.myProposal.proposedPrice != null
                          ? requestItem.myProposal.proposedPrice
                          : t("myProposal.notSpecified")}
                      </strong>
                    </div>

                    <div className="proposal-detail__meta-card">
                      <span>{t("myProposal.estimatedDays")}</span>
                      <strong>
                        {requestItem.myProposal.estimatedDays != null
                          ? t("myProposal.daysValue", {
                              count: requestItem.myProposal.estimatedDays,
                            })
                          : t("myProposal.notSpecified")}
                      </strong>
                    </div>
                  </div>

                  <div className="proposal-detail__footer">
                    <span>
                      {t("myProposal.sentOn", {
                        date: new Date(
                          requestItem.myProposal.createdAt,
                        ).toLocaleString(
                          i18n.resolvedLanguage === "ko" ? "ko-KR" : "en-GB",
                        ),
                      })}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="content-title">{t("form.title")}</h2>
                <p className="content-description">{t("form.description")}</p>

                <form className="proposal-form" onSubmit={handleSubmitProposal}>
                  <div className="form-field">
                    <label htmlFor="proposal-message">
                      {t("form.introduction")}
                    </label>
                    <textarea
                      id="proposal-message"
                      rows={6}
                      placeholder={t("form.introductionPlaceholder")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="proposal-price">
                        {t("form.proposedPrice")}
                      </label>
                      <input
                        id="proposal-price"
                        type="number"
                        min="0"
                        placeholder={t("form.proposedPricePlaceholder")}
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="proposal-days">
                        {t("form.estimatedDays")}
                      </label>
                      <input
                        id="proposal-days"
                        type="number"
                        min="1"
                        placeholder={t("form.estimatedDaysPlaceholder")}
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(e.target.value)}
                      />
                    </div>
                  </div>

                  {errorMessage ? (
                    <p className="proposal-form-error">{errorMessage}</p>
                  ) : null}
                  {toast ? (
                    <p className="proposal-form-success">{toast}</p>
                  ) : null}

                  <button
                    className="btn btn--primary btn--large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("form.sending") : t("form.submit")}
                  </button>
                </form>
              </>
            )}
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}

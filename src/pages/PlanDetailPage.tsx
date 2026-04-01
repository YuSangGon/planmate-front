import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import { useAuth } from "../context/AuthContext";
import {
  deletePlan,
  getPlanDetail,
  updatePlan,
  type PlanDetail,
  purchasePlan,
  type ReviewType,
} from "../services/planApi";
import "../styles/PlanDetailPage.css";
import WorkPlanPreviewModal from "../components/preview/WorkPlanPreviewModal";
import WorkPlanModal from "../components/preview/WorkPlanModal";
import PlanReviewForm from "../components/review/PlanReviewForm";
import { createPlanReview } from "../services/reviewApi";

export default function PlanDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { t } = useTranslation("planDetail");

  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [myReview, setMyReview] = useState<ReviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [salePrice, setSalePrice] = useState(0);
  const [dataRefresh, setDataRefresh] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPlanDetail(token, planId);
        const item = response.data;
        const isGotPlan = response.isGotPlan;
        const myItem = response.myReview;

        setMyReview(myItem);
        setIsPurchased(isGotPlan);
        setPlan(item);
        setTitle(item.title);
        setDestination(item.destination);
        setSummary(item.summary);
        setPrice(String(item.price));
        setDuration(item.duration);
        setVisibility(item.visibility);
        setTags(item.tags);
        setSalePrice(item.salePrice);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlan();
  }, [planId, t, dataRefresh]);

  useEffect(() => {
    if (!isModalOpen) return;
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isPlanOpen) return;
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, [isPlanOpen]);

  const isOwner = useMemo(() => {
    return !!plan && !!user && plan.planner.id === user.id;
  }, [plan, user]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !planId) {
      setErrorMessage(t("errors.loginRequired"));
      return;
    }

    if (
      !title.trim() ||
      !destination.trim() ||
      !summary.trim() ||
      !price.trim() ||
      !duration.trim()
    ) {
      setErrorMessage(t("errors.requiredFields"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updatePlan(token, planId, {
        title: title.trim(),
        destination: destination.trim(),
        summary: summary.trim(),
        price: Number(price),
        duration: duration.trim(),
        visibility,
        tags,
      });

      setPlan((prev) =>
        prev
          ? {
              ...prev,
              title: title.trim(),
              destination: destination.trim(),
              summary: summary.trim(),
              price: Number(price),
              duration: duration.trim(),
              visibility,
              tags,
            }
          : prev,
      );

      setToastMessage(t("states.updated"));
      setIsEditing(false);
      window.setTimeout(() => setToastMessage(""), 1800);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.updateFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchase = async () => {
    if (!token) {
      const loginConfirmed = window.confirm(
        "로그인 후 구매가능합니다. 로그인하시겠습니까?",
      );
      if (!loginConfirmed) return;
      navigate("/login");
    }

    if (!token || !planId) return;
    const confirmed = window.confirm("구매하시겠습니까?");
    if (!confirmed) return;

    try {
      setIsPurchasing(true);
      await purchasePlan(token, planId, salePrice);
      setIsPurchased(true);
      setToastMessage("Completed purchasing.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.deleteFailed"),
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !planId) return;

    const confirmed = window.confirm(t("dialogs.deleteConfirm"));
    if (!confirmed) return;

    try {
      await deletePlan(token, planId);
      navigate("/plans");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.deleteFailed"),
      );
    }
  };

  const onSubmitReview = async (payload: ReviewType) => {
    if (!token || !planId) return;

    try {
      await createPlanReview(token, payload, planId);
      setDataRefresh(!dataRefresh);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.deleteFailed"),
      );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="section">
          <div className="plan-detail-state-card">
            <p>{t("states.loading")}</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!plan || errorMessage) {
    return (
      <MainLayout>
        <section className="section">
          <div className="plan-detail-state-card">
            <p>{errorMessage || t("states.notFound")}</p>
            <Link to="/plans" className="btn btn--primary">
              {t("actions.backToPlans")}
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={plan.title}
        description={plan.summary}
      />

      <section className="section section--compact">
        <div className="plan-detail-layout">
          <article className="plan-detail-card">
            {!isEditing ? (
              <>
                <div className="plan-detail-meta">
                  <span>{plan.destination}</span>
                  <span>{plan.duration}</span>
                  <span>{t("meta.priceValue", { price: plan.price })}</span>
                  <span>{t(`visibility.${plan.visibility}`)}</span>
                </div>

                <div className="plan-detail-section">
                  <h3>{t("sections.planner")}</h3>
                  <p>
                    <strong>{plan.planner.name}</strong>
                  </p>
                  <p>{plan.planner.bio || t("sections.noPlannerBio")}</p>
                </div>

                <div className="plan-detail-section">
                  <h3>{t("sections.summary")}</h3>
                  <p>{plan.summary}</p>
                </div>

                <div className="plan-detail-section">
                  <h3>{t("sections.tags")}</h3>
                  <div className="plan-detail-tags">
                    {plan.tags.map((tag) => (
                      <span key={tag} className="plan-detail-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {plan.request ? (
                  <div className="plan-detail-section">
                    <h3>{t("sections.linkedRequest")}</h3>
                    <p>
                      {plan.request.destination} · {plan.request.status}
                    </p>
                  </div>
                ) : null}

                {isOwner ? (
                  <div className="plan-detail-actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      {t("actions.edit")}
                    </button>
                    {/* <button className="btn btn--ghost" onClick={handleDelete}>
                      {t("actions.delete")}
                    </button> */}
                  </div>
                ) : null}
                {!isOwner && !isPurchased ? (
                  <div className="plan-purchase-actions">
                    <div className="purchase-bar">
                      <div className="price-section">
                        <span className="price-label">총 가격</span>
                        <span className="price-value">
                          {salePrice?.toLocaleString()} coins
                        </span>
                      </div>

                      <div className="purchase-btn-wrap">
                        <button
                          className="btn btn--primary"
                          onClick={() => setIsModalOpen(true)}
                        >
                          preview
                        </button>
                        <button
                          className="btn btn--purchase"
                          onClick={handlePurchase}
                        >
                          {isPurchasing ? "구매중..." : "구매하기"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                {isOwner || isPurchased ? (
                  <div className="plan-purchase-actions">
                    <div className="purchase-bar">
                      <div className="price-section"></div>

                      <div className="purchase-btn-wrap">
                        <button
                          className="btn btn--primary"
                          onClick={() => setIsPlanOpen(true)}
                        >
                          상세 Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <form className="create-plan-form" onSubmit={handleUpdate}>
                <div className="form-grid">
                  <div className="form-field form-field--full">
                    <label>{t("form.title")}</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.destination")}</label>
                    <input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.duration")}</label>
                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.price")}</label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label>{t("form.visibility")}</label>
                    <select
                      value={visibility}
                      onChange={(e) =>
                        setVisibility(e.target.value as "public" | "private")
                      }
                    >
                      <option value="public">{t("visibility.public")}</option>
                      <option value="private">{t("visibility.private")}</option>
                    </select>
                  </div>

                  <div className="form-field form-field--full">
                    <label>{t("form.summary")}</label>
                    <textarea
                      rows={6}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  </div>

                  <TagInputField
                    label={t("form.tags")}
                    placeholder={t("form.tagsPlaceholder")}
                    value={tags}
                    onChange={setTags}
                  />
                </div>

                {errorMessage ? (
                  <p className="create-plan-error">{errorMessage}</p>
                ) : null}

                {toastMessage ? (
                  <div className="create-plan-toast">{toastMessage}</div>
                ) : null}

                <div className="plan-detail-actions">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("actions.saving")
                      : t("actions.saveChanges")}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    {t("actions.cancel")}
                  </button>
                </div>
              </form>
            )}
          </article>

          <article className="plan-detail-card">
            <div className="plan-overall-review">
              <div className="overall-score-wrapper">
                <div className="overall-score">
                  {plan.planReviewSummary?.rating.toFixed(1) ||
                    Number(0).toFixed(1)}
                </div>
                <div className="overall-label">Overall</div>
              </div>

              <div className="overall-detail-score">
                {[
                  {
                    label: "Quality",
                    value: plan.planReviewSummary?.planQuality || 0,
                  },
                  {
                    label: "Practicality",
                    value: plan.planReviewSummary?.practicality || 0,
                  },
                  {
                    label: "Detail Level",
                    value: plan.planReviewSummary?.detailLevel || 0,
                  },
                ].map((item) => {
                  const percent = (item.value / 5) * 100;
                  return (
                    <div key={item.label} className="overall-review-item">
                      <div className="item-label">{item.label}</div>
                      <div className="item-bar-wrapper">
                        <div
                          className="item-bar-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="item-rating">{item.value.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {!isOwner && isPurchased && !!user && (
            <PlanReviewForm
              initialValues={myReview}
              onSubmit={onSubmitReview}
            />
          )}

          {plan.planReviews
            ?.filter((review) => review.user.id !== user?.id)
            .map((review) => {
              return <PlanReviewForm initialValues={review} />;
            })}
        </div>
      </section>
      {isModalOpen ? (
        <WorkPlanPreviewModal onClose={() => setIsModalOpen(false)} />
      ) : null}
      {isPlanOpen ? (
        <WorkPlanModal onClose={() => setIsPlanOpen(false)} />
      ) : null}
    </MainLayout>
  );
}

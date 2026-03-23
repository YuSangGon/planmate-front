import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import TagInputField from "../components/common/TagInputField";
import { useAuth } from "../context/AuthContext";
import { createRequest } from "../services/requestApi";
import "../styles/RequestPage.css";
import { currencies, type CurrencyOption } from "../constants/currencies";

const popularTravelStyles = [
  "Cosy",
  "Scenic",
  "Slow-paced",
  "Food-focused",
  "Cultural",
  "Luxury",
  "Budget",
  "Nature",
];

const popularInterests = [
  "Cafés",
  "Bookstores",
  "Viewpoints",
  "Local food",
  "Museums",
  "Photography",
  "Shopping",
  "Night walks",
];

type ToastType = "success" | "error" | "info";

type ToastState = {
  type: ToastType;
  message: string;
} | null;

export default function RequestPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation("requestCreate");

  const [duration, setDuration] = useState(4);
  const [currency, setCurrency] = useState<CurrencyOption>(currencies[0]);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [extraNotes, setExtraNotes] = useState("");

  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencyRef = useRef<HTMLDivElement | null>(null);
  const [offerCost, setOfferCost] = useState("30");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(e.target as Node)
      ) {
        setIsCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const validateForm = () => {
    if (!destination.trim()) return t("validation.destination");
    if (!budgetAmount.trim()) return t("validation.budgetRequired");
    if (Number(budgetAmount) < 0) return t("validation.budgetNegative");
    if (travelStyles.length === 0) return t("validation.travelStyle");
    if (interests.length === 0) return t("validation.interests");
    if (!offerCost.trim()) return t("validation.offerCostRequired");
    if (Number(offerCost) < 0) return t("validation.offerCostNegative");

    return "";
  };

  const handleSubmit = async () => {
    const validationMessage = validateForm();

    if (validationMessage) {
      setFormError(validationMessage);
      setToast({
        type: "error",
        message: validationMessage,
      });
      return;
    }

    if (!token) {
      const msg = t("validation.loginRequired");
      setFormError(msg);
      setToast({ type: "error", message: msg });
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await createRequest(token, {
        destination: destination.trim(),
        duration: `${duration} ${duration === 1 ? "day" : "days"}`,
        budget: `${currency.code} ${budgetAmount}`,
        offerCost: Number(offerCost),
        travelStyle: travelStyles.join(", "),
        interests,
        extraNotes: extraNotes.trim(),
      });

      setToast({
        type: "success",
        message: t("toast.success"),
      });

      window.setTimeout(() => {
        navigate("/requests", { replace: true });
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("toast.fail");

      setFormError(message);
      setToast({
        type: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="request-layout">
          <div className="request-form-card">
            <h2 className="content-title">{t("form.title")}</h2>
            <p className="content-description">{t("form.description")}</p>

            <div className="form-grid">
              <div className="form-field">
                <label>{t("fields.destination")}</label>
                <input
                  id="destination"
                  type="text"
                  placeholder={t("placeholders.destination")}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>{t("fields.duration")}</label>

                <div className="duration-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setDuration((prev) => Math.max(1, prev - 1))}
                    disabled={duration === 1}
                  >
                    −
                  </button>

                  <div className="stepper-value">{duration}</div>

                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() =>
                      setDuration((prev) => Math.min(100, prev + 1))
                    }
                    disabled={duration === 100}
                  >
                    +
                  </button>

                  <span className="stepper-suffix">
                    {duration === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>

              <div className="form-field">
                <label>{t("fields.budget")}</label>

                <div className="budget-input">
                  <div className="currency-select" ref={currencyRef}>
                    <button
                      type="button"
                      className="currency-select__trigger"
                      onClick={() => setIsCurrencyOpen((prev) => !prev)}
                    >
                      {currency.symbol}
                    </button>

                    {isCurrencyOpen && (
                      <div className="currency-select__dropdown">
                        {currencies.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            className="currency-select__item"
                            onClick={() => {
                              setCurrency(item);
                              setIsCurrencyOpen(false);
                            }}
                          >
                            <span className="currency-symbol">
                              {item.symbol}
                            </span>
                            <span className="currency-label">{item.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="budget-amount">
                    <input
                      type="number"
                      className="budget-input__amount"
                      placeholder="0"
                      min="0"
                      step="1"
                      value={budgetAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setBudgetAmount("");
                          return;
                        }

                        const nextValue = Number(value);
                        if (nextValue >= 0) {
                          setBudgetAmount(value);
                        }
                      }}
                    />

                    <div className="budget-stepper">
                      <button
                        type="button"
                        className="budget-stepper__btn"
                        onClick={() =>
                          setBudgetAmount((prev) => {
                            const current = Number(prev || 0);
                            return String(current + 1);
                          })
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="budget-stepper__btn"
                        onClick={() =>
                          setBudgetAmount((prev) => {
                            const current = Number(prev || 0);
                            return String(Math.max(0, current - 1));
                          })
                        }
                        disabled={Number(budgetAmount || 0) <= 0}
                      >
                        −
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label>{t("fields.offerCost")}</label>
                <input
                  id="offer-cost"
                  type="number"
                  min="0"
                  placeholder="e.g. 30"
                  value={offerCost}
                  onChange={(e) => setOfferCost(e.target.value)}
                />
              </div>

              <TagInputField
                label={t("fields.travelStyle")}
                placeholder={t("placeholders.travelStyle")}
                value={travelStyles}
                onChange={setTravelStyles}
                popularTags={popularTravelStyles}
              />

              <TagInputField
                label={t("fields.interests")}
                placeholder={t("placeholders.interests")}
                value={interests}
                onChange={setInterests}
                popularTags={popularInterests}
              />

              <div className="form-field form-field--full">
                <label>{t("fields.notes")}</label>
                <textarea
                  id="extra-notes"
                  rows={6}
                  placeholder={t("placeholders.notes")}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                />
              </div>
            </div>

            {formError ? (
              <p className="request-form-error">{formError}</p>
            ) : null}

            <div className="request-form__actions">
              <button
                type="button"
                className="btn btn--primary btn--large"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("actions.submitting") : t("actions.submit")}
              </button>

              <button type="button" className="btn btn--secondary btn--large">
                {t("actions.saveDraft")}
              </button>
            </div>
          </div>

          <aside className="request-side-card">
            <span className="section__eyebrow">{t("preview.eyebrow")}</span>
            <h3>{t("preview.title")}</h3>
            <p>{t("preview.description")}</p>

            <div className="preview-box">
              <strong>{t("preview.sampleSummary")}</strong>
              <ul className="dashboard-list">
                <li>Destination: {destination || "Edinburgh"}</li>
                <li>
                  Duration: {duration} {duration === 1 ? "day" : "days"}
                </li>
                <li>
                  Budget: {currency.symbol}({currency.code}){" "}
                  {budgetAmount || "350"}
                </li>
                <li>Offer cost: {offerCost || "30"} coins</li>
                <li>
                  Style:{" "}
                  {travelStyles.length > 0
                    ? travelStyles.join(", ")
                    : "calm, scenic, not overpacked"}
                </li>
                <li>
                  Interests:{" "}
                  {interests.length > 0
                    ? interests.join(", ")
                    : "cafés, books, local food"}
                </li>
              </ul>
            </div>

            <div className="preview-note">
              A simple request is enough. It does not need to be perfect.
            </div>
          </aside>
        </div>
      </section>
      {toast ? (
        <div className={`request-toast request-toast--${toast.type}`}>
          {toast.message}
        </div>
      ) : null}
    </MainLayout>
  );
}

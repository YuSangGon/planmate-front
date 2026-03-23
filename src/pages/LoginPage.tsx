import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useAppTranslation } from "../hooks/useAppTranslation";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useAppTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from || "/profile", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginBenefits = [
    {
      title: t("profile:openRequest"),
      description: "See updates on custom travel plans from planners.",
    },
    {
      title: t("profile:savedPlans"),
      description: "Keep useful plans ready for your next trip.",
    },
    {
      title: "Continue",
      description: "Pick up right where you left off.",
    },
  ];

  return (
    <AuthLayout
      eyebrow={t("welcomeBack")}
      title={t("loginTitle")}
      description={t("loginDescription")}
      benefits={loginBenefits}
    >
      <div className="auth-card">
        <div className="auth-card__header">
          <h2>{t("loginCardTitle")}</h2>
          <p>{t("loginCardDescription")}</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="email">{t("email")}</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-field">
            <div className="form-field__row">
              <label htmlFor="password">{t("password")}</label>
              <button type="button" className="auth-link auth-link--button">
                {t("forgotPassword")}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {errorMessage ? (
            <p className="auth-error-message">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="btn btn--primary btn--large auth-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : t("loginButton")}
          </button>
        </form>

        <div className="auth-divider">
          <span>{t("continueWith")}</span>
        </div>

        <div className="auth-socials">
          <button className="auth-social-btn" type="button">
            Google
          </button>
          <button className="auth-social-btn" type="button">
            Apple
          </button>
        </div>

        <p className="auth-footer-text">
          {t("noAccount")}{" "}
          <Link to="/signup" className="auth-link auth-link--strong">
            {t("common:signup")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

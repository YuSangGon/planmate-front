import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useAppTranslation } from "../hooks/useAppTranslation";
import type { UserRole } from "../services/authApi";

export default function SignupPage() {
  const { signup } = useAuth();
  const { t } = useAppTranslation(["auth", "common"]);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("traveller");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signupBenefits = [
    {
      title: t("travellerOption"),
      description: "Submit requests and save useful plans.",
    },
    {
      title: t("plannerOption"),
      description: "Create travel plans and help other people.",
    },
    {
      title: "Start simple",
      description: "Begin with a small trip request and expand later.",
    },
  ];

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signup({ name, email, password });
      navigate("/profile", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={t("common:signup")}
      title={t("signupTitle")}
      description={t("signupDescription")}
      benefits={signupBenefits}
    >
      <div className="auth-card">
        <div className="auth-card__header">
          <h2>{t("signupCardTitle")}</h2>
          <p>{t("signupCardDescription")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-field">
            <label htmlFor="name">{t("fullName")}</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t("fullName")}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">{t("email")}</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-password">{t("password")}</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder={t("createPassword")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {/* <div className="form-field">
            <label htmlFor="account-type">{t("joinAs")}</label>
            <select
              id="account-type"
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <option value="traveller">{t("travellerOption")}</option>
              <option value="planner">{t("plannerOption")}</option>
            </select>
          </div> */}

          {errorMessage ? (
            <p className="auth-error-message">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="btn btn--primary btn--large auth-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : t("signupButton")}
          </button>
        </form>

        {/* <div className="auth-divider">
          <span>{t("continueWith")}</span>
        </div>

        <div className="auth-socials">
          <button className="auth-social-btn" type="button">
            Google
          </button>
          <button className="auth-social-btn" type="button">
            Apple
          </button>
        </div> */}

        <p className="auth-footer-text">
          {t("haveAccount")}{" "}
          <Link to="/login" className="auth-link auth-link--strong">
            {t("common:login")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

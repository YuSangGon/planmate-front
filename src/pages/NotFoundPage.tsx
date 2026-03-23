import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

export default function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <MainLayout>
      <section className="section">
        <div className="request-form-card">
          <span className="section__eyebrow">{t("notFound.eyebrow")}</span>
          <h1 className="content-title">{t("notFound.title")}</h1>
          <p className="content-description">{t("notFound.description")}</p>
          <Link to="/" className="btn btn--primary btn--large">
            {t("notFound.action")}
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

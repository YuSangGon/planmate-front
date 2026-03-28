import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileAccountPanel from "../components/profile/ProfileAccountPanel";
import ProfilePaymentPanel from "../components/profile/ProfilePaymentPanel";
import "../styles/ProfilePage.css";

type ProfileTab = "account" | "payment";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation("profilePage");
  const [activeTab, setActiveTab] = useState<ProfileTab>("account");

  const pageDescription = useMemo(() => {
    if (activeTab === "account") {
      return t("descriptions.account");
    }

    return t("descriptions.payment");
  }, [activeTab, t]);

  const pageTitle = useMemo(() => {
    if (user?.name) {
      return i18n.resolvedLanguage === "ko"
        ? `${user.name}님의 프로필`
        : `${user.name}'s profile`;
    }

    return t("titleFallback");
  }, [user?.name, i18n.resolvedLanguage, t]);

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={pageTitle}
        description={pageDescription}
      />

      <section className="section section--compact">
        <div className="profile-shell">
          <ProfileSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

          <div className="profile-content">
            {activeTab === "account" && <ProfileAccountPanel />}
            {activeTab === "payment" && <ProfilePaymentPanel />}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

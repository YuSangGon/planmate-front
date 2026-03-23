import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import { buyCoinPackage, getWalletBalance } from "../services/walletApi";
import "../styles/ShopPage.css";

const coinPackages = [
  {
    id: "starter",
    coins: 100,
    price: "£9.99",
  },
  {
    id: "standard",
    coins: 250,
    price: "£19.99",
  },
  {
    id: "plus",
    coins: 500,
    price: "£34.99",
  },
  {
    id: "pro",
    coins: 1000,
    price: "£59.99",
  },
] as const;

export default function ShopPage() {
  const { user, token } = useAuth();
  const { t, i18n } = useTranslation("shop");

  const [coinBalance, setCoinBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activePackageId, setActivePackageId] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getWalletBalance(token);
        setCoinBalance(response.data.coinBalance);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBalance();
  }, [token]);

  const handleBuy = async (packageId: string) => {
    if (!token) return;

    setActivePackageId(packageId);

    try {
      const response = await buyCoinPackage(token, packageId);
      setCoinBalance(response.data.coinBalance);
      setToastMessage(t("toast.buySuccess"));
      window.setTimeout(() => setToastMessage(""), 2200);
    } finally {
      setActivePackageId("");
    }
  };

  const balanceTitle = useMemo(() => {
    if (!user?.name) {
      return t("balance.titleFallback");
    }

    return i18n.resolvedLanguage === "ko"
      ? `${user.name}님의 코인`
      : `${user.name}'s coins`;
  }, [user?.name, i18n.resolvedLanguage, t]);

  return (
    <MainLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section className="section section--compact">
        <div className="shop-layout">
          <div className="shop-main">
            <article className="shop-balance-card">
              <div>
                <span className="shop-balance-card__eyebrow">
                  {t("balance.eyebrow")}
                </span>
                <h2>{balanceTitle}</h2>
                <p className="shop-balance-card__description">
                  {t("balance.description")}
                </p>
              </div>

              <div className="shop-balance-card__value-block">
                <strong>{isLoading ? "..." : coinBalance}</strong>
                <span>{t("balance.coinsUnit")}</span>
              </div>
            </article>

            <div className="shop-pack-grid">
              {coinPackages.map((pack) => (
                <article className="shop-pack-card" key={pack.id}>
                  <span className="shop-pack-card__badge">
                    {t(`packages.${pack.id}.badge`)}
                  </span>
                  <h3>{t(`packages.${pack.id}.name`)}</h3>
                  <strong className="shop-pack-card__coins">
                    {t("packages.coinsValue", { count: pack.coins })}
                  </strong>
                  <p className="shop-pack-card__price">{pack.price}</p>
                  <p className="shop-pack-card__description">
                    {t(`packages.${pack.id}.description`)}
                  </p>

                  <button
                    className="btn btn--primary btn--large"
                    onClick={() => handleBuy(pack.id)}
                    disabled={activePackageId === pack.id}
                  >
                    {activePackageId === pack.id
                      ? t("actions.buying")
                      : t("actions.buyCoins")}
                  </button>
                </article>
              ))}
            </div>

            <article className="shop-info-card">
              <div className="shop-info-card__header">
                <h3>{t("howItWorks.title")}</h3>
              </div>

              <div className="shop-flow">
                <div className="shop-flow__step">
                  <strong>{t("howItWorks.step1.title")}</strong>
                  <p>{t("howItWorks.step1.description")}</p>
                </div>

                <div className="shop-flow__step">
                  <strong>{t("howItWorks.step2.title")}</strong>
                  <p>{t("howItWorks.step2.description")}</p>
                </div>

                <div className="shop-flow__step">
                  <strong>{t("howItWorks.step3.title")}</strong>
                  <p>{t("howItWorks.step3.description")}</p>
                </div>

                <div className="shop-flow__step">
                  <strong>{t("howItWorks.step4.title")}</strong>
                  <p>{t("howItWorks.step4.description")}</p>
                </div>
              </div>
            </article>
          </div>

          <aside className="shop-side">
            <article className="shop-side-card">
              <h3>{t("history.title")}</h3>
              <p className="shop-side-card__description">
                {t("history.description")}
              </p>

              <div className="shop-history-list">
                <div className="shop-history-item">
                  <strong>{t("history.item1.coins")}</strong>
                  <span>{t("history.item1.meta")}</span>
                </div>
                <div className="shop-history-item">
                  <strong>{t("history.item2.coins")}</strong>
                  <span>{t("history.item2.meta")}</span>
                </div>
              </div>
            </article>

            <article className="shop-side-card">
              <h3>{t("usageGuide.title")}</h3>
              <div className="shop-usage-list">
                <div className="shop-usage-item">
                  <strong>{t("usageGuide.item1.title")}</strong>
                  <span>{t("usageGuide.item1.description")}</span>
                </div>
                <div className="shop-usage-item">
                  <strong>{t("usageGuide.item2.title")}</strong>
                  <span>{t("usageGuide.item2.description")}</span>
                </div>
                <div className="shop-usage-item">
                  <strong>{t("usageGuide.item3.title")}</strong>
                  <span>{t("usageGuide.item3.description")}</span>
                </div>
              </div>
            </article>
          </aside>
        </div>

        {toastMessage ? <div className="shop-toast">{toastMessage}</div> : null}
      </section>
    </MainLayout>
  );
}

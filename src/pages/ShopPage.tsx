import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import PageHero from "../components/common/PageHero";
import { useAuth } from "../context/AuthContext";
import {
  buyCoinPackage,
  getWalletBalance,
  getShopItems,
  type ShopItem,
} from "../services/walletApi";
import "../styles/ShopPage.css";

export default function ShopPage() {
  const { user, token } = useAuth();
  const { t, i18n } = useTranslation("shop");

  const [coinBalance, setCoinBalance] = useState(0);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeItemCode, setActiveItemCode] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchShopData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const [balanceResponse, itemsResponse] = await Promise.all([
          getWalletBalance(token),
          getShopItems(token),
        ]);

        setCoinBalance(balanceResponse.data.coinBalance);
        setShopItems(itemsResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : t("states.loadError"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchShopData();
  }, [token, t]);

  const handleBuy = async (itemCode: string) => {
    if (!token) return;

    setActiveItemCode(itemCode);

    try {
      const response = await buyCoinPackage(token, itemCode);
      setCoinBalance(response.data.coinBalance);
      setToastMessage(t("toast.buySuccess"));
      window.setTimeout(() => setToastMessage(""), 2200);
    } finally {
      setActiveItemCode("");
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

            {isLoading ? (
              <div className="shop-info-card">
                <p>{t("states.loading")}</p>
              </div>
            ) : null}

            {!isLoading && errorMessage ? (
              <div className="shop-info-card">
                <p className="work-plan-error">{errorMessage}</p>
              </div>
            ) : null}

            {!isLoading && !errorMessage ? (
              <div className="shop-pack-grid">
                {shopItems.map((item) => (
                  <article className="shop-pack-card" key={item.itemCode}>
                    <span className="shop-pack-card__badge">
                      {item.subDescription}
                    </span>
                    {/* {item.priceInfo.isSale && (
                      <span className="shop-pack-card__sale-badge">SALE</span>
                    )} */}
                    <h3>{item.itemName}</h3>
                    <strong className="shop-pack-card__coins">
                      {t("packages.coinsValue", { count: item.coins })}
                    </strong>
                    <p className="shop-pack-card__price">
                      {item.priceInfo.isSale ? (
                        <span className="shop-price--sale">
                          <span className="shop-price__original">
                            {item.priceInfo.countryCode} {item.priceInfo.price}
                          </span>
                          <span className="shop-price__arrow">→</span>
                          <span className="shop-price__discount">
                            {item.priceInfo.countryCode}{" "}
                            {item.priceInfo.salePrice}
                            {/* <span className="shop-price__percent">
                              {Math.round(
                                (1 -
                                  Number(
                                    item.priceInfo.salePrice.replace("£", ""),
                                  ) /
                                    Number(
                                      item.priceInfo.price.replace("£", ""),
                                    )) *
                                  100,
                              )}
                              % OFF
                            </span> */}
                          </span>
                        </span>
                      ) : (
                        <span className="shop-price__normal">
                          {item.priceInfo.countryCode} {item.priceInfo.price}
                        </span>
                      )}
                    </p>
                    <p className="shop-pack-card__description">
                      {item.mainDescription}
                    </p>

                    <button
                      className="btn btn--primary btn--large"
                      onClick={() => handleBuy(item.itemCode)}
                      disabled={activeItemCode === item.itemCode}
                    >
                      {activeItemCode === item.itemCode
                        ? t("actions.buying")
                        : t("actions.buyCoins")}
                    </button>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="shop-side">
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
          </aside>
        </div>

        {toastMessage ? <div className="shop-toast">{toastMessage}</div> : null}
      </section>
    </MainLayout>
  );
}

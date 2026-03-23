import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { t, i18n } = useAppTranslation("common");

  const isPlanner = user?.role === "planner";

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const currentLang = i18n.resolvedLanguage?.startsWith("ko") ? "ko" : "en";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeLanguage = (lng: "en" | "ko") => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo logo--link">
          <span className="logo__mark">✦</span>
          <span className="logo__text">PlanMate</span>
        </Link>

        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav__link nav__link--active" : "nav__link"
            }
          >
            {t("home")}
          </NavLink>

          {!isPlanner && isLoggedIn && (
            <NavLink
              to="/requests"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              {t("requests")}
            </NavLink>
          )}

          {isLoggedIn && isPlanner && (
            <NavLink
              to="/browse-requests"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              {t("browse")}
            </NavLink>
          )}

          {isLoggedIn && isPlanner && (
            <NavLink
              to="/planner-proposals?tab=sent"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              {t("proposals")}
            </NavLink>
          )}

          <NavLink
            to="/plans"
            className={({ isActive }) =>
              isActive ? "nav__link nav__link--active" : "nav__link"
            }
          >
            {t("plans")}
          </NavLink>

          <NavLink
            to="/planners"
            className={({ isActive }) =>
              isActive ? "nav__link nav__link--active" : "nav__link"
            }
          >
            {t("planners")}
          </NavLink>

          {/* {isLoggedIn && (
            <>
              <NavLink
                to={isPlanner ? "/planner-dashboard" : "/profile"}
                className={({ isActive }) =>
                  isActive ? "nav__link nav__link--active" : "nav__link"
                }
              >
                {isPlanner ? t("dashboard") : t("myPage")}
              </NavLink>
            </>
          )} */}

          {isLoggedIn && !isPlanner && (
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Shop
            </NavLink>
          )}
        </nav>

        <div className="header__actions">
          <div className="language-switcher" ref={langRef}>
            <button
              type="button"
              className="language-switcher__button"
              onClick={() => setIsLangOpen((prev) => !prev)}
            >
              <Globe size={18} />
            </button>

            {isLangOpen && (
              <div className="language-switcher__dropdown">
                <button
                  className={`language-switcher__item ${
                    currentLang === "en" ? "active" : ""
                  }`}
                  onClick={() => {
                    handleChangeLanguage("en");
                    setIsLangOpen(false);
                  }}
                >
                  {t("english")}
                </button>

                <button
                  className={`language-switcher__item ${
                    currentLang === "ko" ? "active" : ""
                  }`}
                  onClick={() => {
                    handleChangeLanguage("ko");
                    setIsLangOpen(false);
                  }}
                >
                  {t("korean")}
                </button>
              </div>
            )}
          </div>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn--primary">
                {t("login")}
              </Link>
            </>
          ) : (
            <div className="header__user" ref={dropdownRef}>
              <button
                type="button"
                className="header__user-pill"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <span className="header__user-avatar">
                  {!isPlanner ? "P" : "J"}
                </span>

                <span className="header__user-name">
                  {user?.name}
                  <span className="header__user-role">
                    {isPlanner ? t("planner") : t("traveller")}
                  </span>
                </span>
              </button>

              {isOpen && (
                <div className="header__dropdown">
                  <Link
                    to="/profile"
                    className="header__dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    className="header__dropdown-item"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

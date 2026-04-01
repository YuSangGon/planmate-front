import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { changePasswordApi } from "../../services/authApi";
import { useToast } from "../../context/ToastContext";

export default function ProfileAccountPanel() {
  const { user, token } = useAuth();
  const { t } = useTranslation("profilePage");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oriPassword, setOriPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (newPassword === "" && confirmPassword === "") {
      setErrorMessage("");
      return;
    }

    if (newPassword !== "" && confirmPassword === "") {
      setErrorMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("wrong");
    } else {
      setErrorMessage("correct");
    }
  }, [confirmPassword, newPassword]);

  const changePassword = async () => {
    if (oriPassword === "") {
      setErrorMessage("write your origianl password");
      return;
    }
    if (errorMessage === "wrong") {
      setErrorMessage("write same password");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("password should be more than 6 letters");
    }

    try {
      const payload = {
        originalPassword: oriPassword,
        newPassword: newPassword,
      };
      await changePasswordApi(token, payload);
      setErrorMessage("");
      setIsChangingPassword(false);
      setNewPassword("");
      setOriPassword("");
      setConfirmPassword("");
      showToast("Complete password chagne", "success");
    } catch {
      setErrorMessage("Change failed. check your origianl password");
    }
  };

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <h2>{t("account.title")}</h2>
        <p>{t("account.description")}</p>
      </div>

      <div className="profile-account-grid">
        <article className="profile-card-block">
          <h3>{t("account.basicInfo.title")}</h3>

          <div className="profile-info-list">
            <div className="profile-info-item">
              <span>{t("account.basicInfo.name")}</span>
              <strong>{user?.name ?? "-"}</strong>
            </div>
            <div className="profile-info-item">
              <span>{t("account.basicInfo.email")}</span>
              <strong>{user?.email ?? "-"}</strong>
            </div>
            <div className="profile-info-item password">
              <span>Password</span>
              <strong>************</strong>
              {!isChangingPassword ? (
                <button
                  className="profile-password-change-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  change
                </button>
              ) : (
                <button
                  className="profile-password-confirm-btn"
                  onClick={() => changePassword()}
                >
                  confirm
                </button>
              )}
            </div>
            {isChangingPassword && (
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Original Password</label>
                  <input
                    type="password"
                    value={oriPassword}
                    onChange={(e) => setOriPassword(e.target.value)}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
            {errorMessage !== "" && (
              <span
                className={
                  errorMessage === "correct"
                    ? "correct-password"
                    : "error-password"
                }
              >
                {errorMessage}
              </span>
            )}
            {/* <div className="profile-info-item">
              <span>{t("account.basicInfo.role")}</span>
              <strong>
                {user?.role ? t(`account.roles.${user.role}`) : "-"}
              </strong>
            </div> */}
          </div>
        </article>

        {/* <article className="profile-card-block">
          <h3>{t("account.settings.title")}</h3>
          <p className="profile-muted-text">
            {t("account.settings.description")}
          </p>

          <div className="profile-placeholder-stack">
            <div className="profile-placeholder-row">
              <strong>{t("account.settings.avatar")}</strong>
              <span>{t("account.settings.notConnected")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("account.settings.bio")}</strong>
              <span>{t("account.settings.notConnected")}</span>
            </div>
            <div className="profile-placeholder-row">
              <strong>{t("account.settings.preferences")}</strong>
              <span>{t("account.settings.notConnected")}</span>
            </div>
          </div>
        </article> */}
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureNamespaces } from "../i18n";

type Namespace = "common" | "auth" | "home" | "profile";

export function useAppTranslation(namespaces: Namespace | Namespace[]) {
  const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces];
  const { t, i18n } = useTranslation(nsArray);

  useEffect(() => {
    const language = (
      i18n.resolvedLanguage ||
      i18n.language ||
      "en"
    ).startsWith("ko")
      ? "ko"
      : "en";

    void ensureNamespaces(language, nsArray);
  }, [i18n, nsArray.join("|")]);

  return { t, i18n };
}

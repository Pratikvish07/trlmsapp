import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import i18n, { persistLanguage } from "./config";
import { getLanguageCode, translateText } from "./translations";
import { addTranslationListener, removeTranslationListener } from "./googleTranslate";

const I18nContext = createContext({
  language: "en",
  setLanguage: async () => {},
  t: (value) => value
});

function isVisibleTranslation(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  if (/[�]/.test(trimmed) || /(?:Ã|Â|à[¤-¿]|à[¦-§]|à[®-¯]|à[°-³]|à[´-µ]|à[¨-©]|àª|à²|à³|à«)/.test(trimmed)) {
    return false;
  }

  return !/^[?\s.,:;!()[\]{}\-_/\\|'"`~@#$%^&*+=<>]+$/.test(trimmed);
}

export function I18nProvider({ language, onChangeLanguage, children }) {
  const resolvedLanguage = getLanguageCode(language);
  const [, setLanguageVersion] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageVersion((current) => current + 1);
    };

    i18n.on("languageChanged", handleLanguageChange);
    addTranslationListener(handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
      removeTranslationListener(handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (i18n.language !== resolvedLanguage) {
      i18n.changeLanguage(resolvedLanguage);
    }
  }, [resolvedLanguage]);

  const handleSetLanguage = useCallback(
    async (nextLanguage) => {
      const nextCode = getLanguageCode(nextLanguage);
      await persistLanguage(nextCode);
      await i18n.changeLanguage(nextCode);
      if (onChangeLanguage) {
        await onChangeLanguage(nextCode);
      }
    },
    [onChangeLanguage]
  );

  const translate = useCallback(
    (text, options = {}) => {
      if (typeof text !== "string") {
        return text;
      }

      const translation = translateText(resolvedLanguage, text);
      if (translation === text) {
        const fallbackTranslation = i18n.t(text, {
          lng: resolvedLanguage,
          defaultValue: text,
          ...options
        });

        return isVisibleTranslation(fallbackTranslation) ? fallbackTranslation : text;
      }

      return isVisibleTranslation(translation) ? translation : text;
    },
    [resolvedLanguage]
  );

  const value = useMemo(
    () => ({
      language: resolvedLanguage,
      setLanguage: handleSetLanguage,
      t: translate
    }),
    [handleSetLanguage, resolvedLanguage, translate]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useTranslatedValue(value) {
  const { t } = useI18n();

  return useMemo(() => {
    if (typeof value !== "string") {
      return value;
    }

    return t(value);
  }, [t, value]);
}

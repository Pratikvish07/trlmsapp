import React from "react";
import { Text as RNText, TextInput as RNTextInput } from "react-native";
import { useTranslatedValue } from "@/i18n/I18nProvider";

export function Text({ children, ...props }) {
  const plainText = typeof children === "string" || typeof children === "number"
    ? String(children)
    : "";
  const translated = useTranslatedValue(plainText);
  const resolvedChildren =
    plainText && typeof translated === "string" && translated.trim()
      ? translated
      : children;

  return <RNText {...props}>{resolvedChildren}</RNText>;
}

export function TextInput({ placeholder, ...props }) {
  const translatedPlaceholder = useTranslatedValue(placeholder);
  const resolvedPlaceholder =
    typeof translatedPlaceholder === "string" && translatedPlaceholder.trim()
      ? translatedPlaceholder
      : placeholder;

  return <RNTextInput {...props} placeholder={resolvedPlaceholder} />;
}

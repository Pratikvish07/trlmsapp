// Central design tokens for the TRLM app. Every StyleSheet in src/styles
// should pull colors, radii, spacing, and typography from here instead of
// hardcoding hex values, so the brand can be updated in one place.

export const colors = {
  // Brand - matches the "Livelihood Tracker" marketing identity (deep blue
  // wordmark fading into a lighter sky blue, orange as the sole warm accent).
  primary: "#1D4ED8",
  primaryDark: "#1E3A8A",
  primary600: "#2563EB",
  secondary: "#0EA5E9",
  accent: "#F97316",

  // Card accent palette - the four color-coded action icons from the
  // marketing mockup (My Activities/Support/Progress/Field Visit), plus a
  // fifth for Reports-style cards. Kept distinct from `success`/`warning`
  // etc. below since those carry semantic meaning (status colors) while
  // these are purely a rotating decorative palette for dashboard cards.
  cardGreen: "#16A34A",
  cardBlue: "#2563EB",
  cardOrange: "#F97316",
  cardPurple: "#9333EA",
  cardTeal: "#0D9488",

  // Background
  appBg: "#F8FAFB",
  surface: "#FFFFFF",

  // Text
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textPlaceholder: "#94A3B8",
  textOnPrimary: "#FFFFFF",

  // Border
  border: "#E2E8F0",
  inputBorder: "#CBD5E1",

  // Status
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",

  // Light tints of the status/accent colors, for pill and badge
  // backgrounds where the full-saturation color would be too strong.
  successLight: "#DCFCE7",
  warningLight: "#FEF3C7",
  errorLight: "#FEE2E2",
  accentLight: "#FFEDD5"
};

// @expo-google-fonts/inter exposes one font family per weight - these are
// the family names to use directly as fontFamily (fontWeight is kept
// alongside each for the web fallback before fonts finish loading).
export const typography = {
  fontFamily: "Inter",
  regular: "Inter_400Regular",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  weight: {
    regular: "400",
    semiBold: "600",
    bold: "700"
  }
};

export const radii = {
  button: 8,
  input: 8,
  card: 12,
  pill: 999
};

export const spacing = {
  screenPad: 20,
  cardPad: 16
};

export const sizes = {
  buttonHeight: 46,
  inputHeight: 44,
  iconStroke: 2
};

export const animation = {
  fast: 300,
  slow: 500
};

export default {
  colors,
  typography,
  radii,
  spacing,
  sizes,
  animation
};

import { Platform, StyleSheet } from "react-native";
import { colors, typography, radii, spacing, sizes } from "./theme";

const isWeb = Platform.OS === "web";

const webShadow = (color = "#000", offset = { width: 0, height: 0 }, opacity = 0.2, radius = 4) => {
  if (!isWeb) return {};

  const normalizeColor = (value) => {
    if (!value) return `rgba(0,0,0,${opacity})`;
    const trimmed = value.trim();
    if (trimmed.startsWith("#")) {
      let hex = trimmed.slice(1);
      if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
      }
      const intValue = parseInt(hex, 16);
      const r = (intValue >> 16) & 255;
      const g = (intValue >> 8) & 255;
      const b = intValue & 255;
      return `rgba(${r},${g},${b},${opacity})`;
    }
    if (trimmed.startsWith("rgb(")) {
      return trimmed.replace("rgb(", "rgba(").replace(")", `,${opacity})`);
    }
    if (trimmed.startsWith("rgba(")) {
      return trimmed;
    }
    return trimmed;
  };

  return {
    boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${normalizeColor(color)}`,
  };
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.appBg
  },
  screenPad: {
    padding: spacing.screenPad,
    gap: 12,
    paddingBottom: 90
  },
  dashboardHeaderWrap: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 2,
    gap: 10
  },
  languageScreenPad: {
    flexGrow: 1,
    padding: spacing.screenPad,
    gap: 16,
    paddingBottom: 90,
    backgroundColor: colors.appBg
  },
  languageTopBand: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#d97706",
    marginHorizontal: 6
  },
  languageHero: {
    backgroundColor: "#f5f0df",
    borderWidth: 1,
    borderColor: "#d4c59a",
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: "#5b5b39",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden"
  },
  languageHeroAura: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(15,118,110,0.12)",
    top: -120,
    right: -80
  },
  languageHeroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  languageSeal: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#a07f2f",
    backgroundColor: "#fff8df",
    alignItems: "center",
    justifyContent: "center"
  },
  languageSealText: {
    color: "#7c5a10",
    fontWeight: "900",
    fontFamily: typography.bold,
    fontSize: 18
  },
  languageGovtCopy: {
    flex: 1,
    gap: 2
  },
  languageGovtLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  languageGovtDept: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  languageTitleWrap: {
    paddingTop: 4,
    gap: 4
  },
  languageEyebrow: {
    color: colors.primary,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 1.2
  },
  languageCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: "#d5c9ab",
    padding: spacing.cardPad,
    gap: 12,
    shadowColor: "#534d3a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  languageCardHeader: {
    gap: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ebe2ca"
  },
  languageCardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  languageCardHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: typography.regular
  },
  languagePillBanner: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#93c5fd",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  languagePillBannerText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  languageOption: {
    width: "48%",
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface
  },
  languageOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark
  },
  languageOptionLeft: {
    gap: 4
  },
  languageOptionPrefix: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  languageOptionPrefixActive: {
    color: colors.textOnPrimary
  },
  languageOptionText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontFamily: typography.bold,
    fontSize: 16
  },
  languageOptionTextActive: {
    color: colors.textOnPrimary
  },
  languageOptionSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  languageOptionSubtextActive: {
    color: colors.textOnPrimary
  },
  languageDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: "#64748b",
    backgroundColor: colors.surface
  },
  languageDotActive: {
    borderColor: colors.surface,
    backgroundColor: colors.success
  },
  trlmHeaderCard: {
    backgroundColor: "#f5f0df",
    borderWidth: 1,
    borderColor: "#d4c59a",
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: "#5b5b39",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3
  },
  trlmHeaderCardCompact: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10
  },
  trlmHeaderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  trlmBrandRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  trlmSeal: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#a07f2f",
    backgroundColor: "#fff8df",
    alignItems: "center",
    justifyContent: "center"
  },
  trlmSealText: {
    color: "#7c5a10",
    fontWeight: "900",
    fontFamily: typography.bold,
    fontSize: 13
  },
  trlmBrandCopy: {
    flex: 1,
    gap: 2
  },
  trlmGovtLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  trlmGovtDept: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  trlmHeaderBody: {
    gap: 6
  },
  trlmBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff9eb",
    borderWidth: 1,
    borderColor: "#d6c38f",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  trlmBadgeText: {
    color: "#6c5718",
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  trlmHeaderTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  trlmHeaderSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: typography.regular
  },
  trlmLogoutButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  trlmLogoutButtonText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  trlmLogoutIcon: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  sessionGateScreen: {
    flex: 1,
    backgroundColor: colors.appBg
  },
  sessionGateContent: {
    flexGrow: 1,
    padding: spacing.screenPad,
    gap: 16,
    paddingBottom: 40
  },
  sessionGateHero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4
  },
  sessionGateEyebrow: {
    color: "#bfdbfe",
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  sessionGateTitle: {
    color: colors.textOnPrimary,
    fontSize: 26,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  sessionGateHint: {
    color: "#dbeafe",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: typography.regular
  },
  sessionGateCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  sessionGateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  sessionGateLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  sessionGateValue: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "right"
  },
  sessionGateActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: 6
  },
  sessionGateGhostButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#93c5fd",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12
  },
  sessionGateGhostButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  sessionGatePrimaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4
  },
  sessionGateButtonDisabled: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textPlaceholder,
    shadowOpacity: 0
  },
  sessionGatePrimaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  sessionStripCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  sessionStripCopy: {
    flex: 1,
    gap: 4
  },
  sessionStripTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  sessionStripHint: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: typography.regular
  },
  sessionStripActions: {
    alignItems: "flex-end",
    gap: 8
  },
  sessionStripButton: {
    minWidth: 88,
    minHeight: 34,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  sessionStripButtonText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  sessionStatusBadge: {
    minHeight: 26,
    borderRadius: 999,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  sessionStatusBadgeSuccess: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success
  },
  sessionStatusBadgePending: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning
  },
  sessionStatusBadgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  centerScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.screenPad,
    gap: 12
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  logoText: {
    color: colors.textOnPrimary,
    fontWeight: "800",
    fontFamily: typography.bold,
    fontSize: 24
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary
  },
  subtitleCenter: {
    color: colors.textSecondary,
    fontFamily: typography.regular
  },
  loader: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: "700",
    fontFamily: typography.bold
  },

  // Enhanced Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: "#f4efe2",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.screenPad,
  },
  splashTopBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: "#d97706"
  },
  splashBottomBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: "#1f4b3f"
  },
  splashBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f4efe2",
  },
  splashDecoCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(31,75,63,0.08)",
    top: -110,
    right: -90,
  },
  splashDecoCircle2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(217,119,6,0.08)",
    bottom: -70,
    left: -60,
  },
  splashDecoCircle3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(30,58,138,0.05)",
    top: "37%",
    left: -35,
  },
  splashGridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    left: "18%",
    backgroundColor: "rgba(31,75,63,0.08)"
  },
  splashGridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    top: "32%",
    backgroundColor: "rgba(217,119,6,0.08)"
  },
  splashAuthorityBadge: {
    position: "absolute",
    top: 74,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#fff8df",
    borderWidth: 1,
    borderColor: "#c6a54d"
  },
  splashAuthorityText: {
    color: "#7c5a10",
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
    letterSpacing: 1.4
  },
  splashLogoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  splashLogoOuterGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(217,119,6,0.18)",
  },
  splashLogoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fffdf7",
    ...Platform.select({
      web: webShadow("#5c5133", { width: 0, height: 8 }, 0.16, 16),
      default: {
        shadowColor: "#5c5133",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
    borderWidth: 4,
    borderColor: "rgba(31,75,63,0.25)",
  },
  splashLogoImage: {
    width: 92,
    height: 92,
    borderRadius: 46
  },
  splashLogoText: {
    color: "#1f4b3f",
    fontWeight: "900",
    fontFamily: typography.bold,
    fontSize: 32,
    letterSpacing: 2,
  },
  splashAppName: {
    fontSize: 30,
    fontWeight: "900",
    fontFamily: typography.bold,
    color: "#13294b",
    textAlign: "center",
    marginBottom: 8,
    maxWidth: 320,
    lineHeight: 36,
  },
  splashSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 0.5,
    maxWidth: 300,
    lineHeight: 22
  },
  splashLoaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  splashLoaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(31,75,63,0.35)",
  },
  splashLoaderDotActive: {
    backgroundColor: "#1f4b3f",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  splashVersion: {
    position: "absolute",
    bottom: 40,
    color: "rgba(19,41,75,0.45)",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    letterSpacing: 1,
  },
  splashTagline: {
    position: "absolute",
    bottom: 60,
    color: "rgba(31,75,63,0.78)",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  headerTextWrap: {
    gap: 3
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.regular
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3
  },
  diagramCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 12,
    borderWidth: 1,
    borderColor: "#9ec5ff",
    gap: 10
  },
  mediaBox: {
    backgroundColor: "#ffe7d3",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f7b98f",
    gap: 6
  },
  modeSwitch: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: radii.button,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryBtnText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  inputWrap: {
    gap: 6
  },
  label: {
    fontWeight: "600",
    fontFamily: typography.semiBold,
    color: colors.textPrimary
  },
  required: {
    color: colors.error,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: colors.surface
  },
  inputDisabled: {
    backgroundColor: "#eef2f7",
    color: colors.textSecondary
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.regular
  },
  validText: {
    color: colors.success
  },
  invalidText: {
    color: colors.error
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  secureNote: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: typography.regular
  },
  button: {
    backgroundColor: colors.textPrimary,
    borderRadius: radii.button,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.textPlaceholder,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  pillText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  pillTextActive: {
    color: colors.textOnPrimary
  },
  dashboardWrap: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.appBg
  },
  dashboardGlowTop: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(0,180,216,0.12)",
    top: -90,
    right: -80
  },
  dashboardGlowBottom: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0,150,183,0.1)",
    bottom: 30,
    left: -90
  },
  dashboardContentShell: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 76,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden"
  },
  tabContent: {
    gap: 12
  },
  dashboardHeaderRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  crpImageBox: {
    width: 58,
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9ca3af",
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center"
  },
  crpImageIcon: {
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.textPrimary
  },
  crpInfoBox: {
    flex: 1,
    backgroundColor: "#6b7280",
    borderRadius: 8,
    padding: 8,
    gap: 3
  },
  crpInfoText: {
    color: colors.textOnPrimary,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  diagramTopInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  memberHeaderBox: {
    backgroundColor: "#6b7280",
    borderRadius: 8,
    padding: 8,
    gap: 4
  },
  memberHeaderText: {
    color: colors.textOnPrimary,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  dashboardYellowBox: {
    marginTop: 10,
    backgroundColor: colors.warningLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: 10,
    gap: 8
  },
  dashboardActionRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 6
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: 10,
    alignItems: "center"
  },
  quickActionText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  imageActivityBox: {
    backgroundColor: "#e5edff",
    borderWidth: 1,
    borderColor: "#8ea7dd",
    borderRadius: 10,
    padding: 10,
    gap: 8
  },
  imageActivityText: {
    color: colors.primary,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  geoPinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  geoPin: {
    fontSize: 18
  },
  processNoteBox: {
    backgroundColor: "#fff5f5",
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 4
  },
  processNoteText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  innerPanel: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    padding: 10,
    gap: 8
  },
  profileBtnStack: {
    gap: 8,
    width: "60%"
  },
  profileShell: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    gap: 14
  },
  profileHeroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: spacing.cardPad,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  profileAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fde68a"
  },
  profileAvatarText: {
    color: colors.textOnPrimary,
    fontSize: 22,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  profileHeroCopy: {
    flex: 1,
    gap: 4
  },
  profileHeroEyebrow: {
    color: "#bfdbfe",
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  profileHeroTitle: {
    color: colors.textOnPrimary,
    fontSize: 21,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  profileHeroSubtitle: {
    color: colors.inputBorder,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  profileRoleBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  profileRoleBadgeText: {
    color: "#f8fafc",
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 0.5
  },
  profileInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.cardPad,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  profileCardHeader: {
    gap: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7"
  },
  profileCardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  profileCardHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: typography.regular
  },
  profileInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7"
  },
  profileInfoLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  profileInfoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "right",
    flexShrink: 1,
    marginLeft: 12
  },
  profileActionCard: {
    backgroundColor: "#fffaf0",
    borderRadius: 22,
    padding: spacing.cardPad,
    borderWidth: 1,
    borderColor: "#fcd9a7",
    gap: 12,
    shadowColor: "#7c2d12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1
  },
  profileActionHeader: {
    gap: 4
  },
  profileActionTitle: {
    color: "#7c2d12",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  profileActionHint: {
    color: "#9a3412",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: typography.regular
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.successLight,
    borderRadius: 10,
    padding: 10,
    gap: 4
  },
  metricCardWarn: {
    backgroundColor: colors.warningLight
  },
  metricLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: typography.regular
  },
  metricValue: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontFamily: typography.bold,
    fontSize: 16
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary
  },
  infoGrid: {
    gap: 4
  },
  infoLine: {
    color: colors.textPrimary,
    fontFamily: typography.regular
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 110
  },
  barCol: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end"
  },
  bar: {
    width: "100%",
    borderRadius: 5,
    minHeight: 8
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  badgeGood: {
    backgroundColor: colors.successLight,
    color: colors.success
  },
  badgeWarn: {
    backgroundColor: colors.errorLight,
    color: colors.error
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.textPlaceholder,
    borderRadius: radii.button,
    paddingVertical: 10,
    alignItems: "center"
  },
  outlineText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  mapBox: {
    height: 150,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.card,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#edf5ff"
  },
  mapText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  radiusCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.success,
    backgroundColor: "rgba(34,197,94,0.2)"
  },
  radiusCircleInvalid: {
    borderColor: colors.error,
    backgroundColor: "rgba(239,68,68,0.2)"
  },
  badgeAlert: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.errorLight,
    color: colors.error,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  noteBox: {
    backgroundColor: "#e6f0ff",
    borderColor: "#8fb5ff",
    borderWidth: 1,
    borderRadius: radii.card,
    padding: 12,
    gap: 6
  },
  noteTitle: {
    color: colors.primary,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  loanHeroCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 20,
    padding: spacing.cardPad,
    borderWidth: 1,
    borderColor: "#cfe0ff",
    gap: 12
  },
  loanHeroTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  loanHeroSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: typography.regular
  },
  loanSegmentWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  govPanelCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.cardPad,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  alertPanelCard: {
    backgroundColor: "#fff7f7",
    borderRadius: 18,
    padding: spacing.cardPad,
    borderWidth: 1,
    borderColor: colors.error,
    gap: 10
  },
  bottomNavShell: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fbfdff",
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12
  },
  languageMenuPopup: {
    alignSelf: "flex-end",
    marginRight: 12,
    marginBottom: 8,
    width: 172,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8
  },
  languageMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2
  },
  languageMenuItemActive: {
    backgroundColor: "#eff6ff"
  },
  languageMenuText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.bold
  },
  languageMenuHint: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  languageMenuTextActive: {
    color: colors.primary
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    borderRadius: 14
  },
  navItemActive: {
    backgroundColor: "#eff6ff"
  },
  navIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  navIconWrapActive: {
    backgroundColor: colors.primary
  },
  navIconText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  navIconTextActive: {
    color: colors.textOnPrimary
  },
  navText: {
    color: colors.textSecondary,
    fontWeight: "700",
    fontFamily: typography.bold,
    fontSize: 12
  },
  navTextActive: {
    color: colors.primary
  },
  languageNavItem: {
    flex: 1.2
  },
  languageSwitcherButton: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8
  },
  languageSwitcherCode: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold
  },
  loginTopBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 4,
    paddingTop: 4
  },
  loginLanguageSwitcherButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10
  },
  loginLanguageSwitcherText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.semiBold
  },
  loginLanguageMenuPopup: {
    alignSelf: "flex-end",
    marginTop: 6,
    width: 190,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingVertical: 6,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8
  },

  // Enhanced Login/Signup Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: colors.appBg,
    position: "relative"
  },
  authGlowPrimary: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(0,180,216,0.16)",
    top: -80,
    right: -90
  },
  authGlowSecondary: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(0,150,183,0.12)",
    bottom: 140,
    left: -90
  },
  loginHeader: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  loginLogoWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  loginGlassChip: {
    marginBottom: 14,
    backgroundColor: "rgba(15,23,42,0.82)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7
  },
  loginGlassChipText: {
    color: "#f8fafc",
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  loginLogoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#93c5fd",
  },
  loginLogoText: {
    color: colors.textOnPrimary,
    fontWeight: "900",
    fontFamily: typography.bold,
    fontSize: 22,
    letterSpacing: 2,
  },
  loginLogoImage: {
    width: 58,
    height: 58,
    borderRadius: 29
  },
  loginAppName: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.primary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  loginTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    fontFamily: typography.regular,
    textAlign: "center",
  },
  loginHeroMetricRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  loginHeroMetric: {
    minWidth: 78,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  loginHeroMetricValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  loginHeroMetricLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
    marginTop: 3
  },
  loginFormArea: {
    flexGrow: 1,
    padding: spacing.screenPad,
    paddingBottom: 42
  },
  loginTabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    padding: 5,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#d8e2ee",
  },
  loginTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radii.button,
  },
loginTabActive: {
    backgroundColor: colors.primary,
  },
  loginTabText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.textSecondary,
  },
  loginTabTextActive: {
    color: colors.textOnPrimary,
  },
  loginCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginCardGlass: {
    backgroundColor: "rgba(255,255,255,0.84)"
  },
  responseModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.screenPad
  },
  responseModalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
    gap: 14,
    alignItems: "center"
  },
  responseStatusIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4
  },
  responseStatusIconSuccess: {
    backgroundColor: colors.successLight,
    borderColor: colors.success
  },
  responseStatusIconError: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error
  },
  responseStatusIconText: {
    color: "#163c2a",
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  responseModalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  responseModalScroll: {
    maxHeight: 260
  },
  responseModalMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  responseIdBox: {
    width: "100%",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center"
  },
  responseIdLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 4
  },
  responseIdValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
    fontFamily: typography.bold,
    letterSpacing: 1
  },
  responseModalHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  loginCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.primary,
    marginBottom: 16,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  formRibbon: {
    alignSelf: "center",
    backgroundColor: "#e0ecff",
    borderWidth: 1,
    borderColor: "#b8d0ff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 16
  },
  formRibbonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  loginInput: {
    backgroundColor: "rgba(248,250,252,0.95)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  loginInputFocus: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  loginIdTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  loginIdPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: "#f8fafc",
  },
  loginIdPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  loginIdPillText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
  },
  loginIdPillTextActive: {
    color: colors.textOnPrimary,
  },
loginButton: {
    backgroundColor: colors.primary600,
    borderRadius: radii.button,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    shadowColor: colors.primary600,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    minHeight: 48,
    zIndex: 100,
  },
  loginButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  loginSwitchMode: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  loginSwitchModeText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: typography.regular,
  },
  loginSwitchModeBtn: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  loginDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  loginDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  loginDividerText: {
    color: colors.textPlaceholder,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  loginFooter: {
    alignItems: "center",
    paddingVertical: 16,
  },
  loginFooterText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: typography.regular,
  },
  signupContainer: {
    flex: 1,
  },
  signupSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 0,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  signupRow: {
    flexDirection: "row",
    gap: 10,
  },
  signupHalfInput: {
    flex: 1,
  },
  signupValidIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -8,
    marginBottom: 8,
  },
  signupValidText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  signupNoteBox: {
    backgroundColor: colors.warningLight,
    borderRadius: radii.card,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  signupNoteTitle: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.warning,
    marginBottom: 4,
  },
  signupNoteText: {
    fontSize: 12,
    color: colors.warning,
    lineHeight: 18,
    fontFamily: typography.regular,
  },
  signupScrollView: {
    flex: 1,
  },
  formSectionCard: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.cardPad,
    marginBottom: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  dropdownWrap: {
    gap: 8
  },
  dropdownTrigger: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: "rgba(248,250,252,0.98)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dropdownTriggerOpen: {
    borderColor: colors.primary,
    backgroundColor: colors.surface
  },
  dropdownTriggerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    paddingRight: 12
  },
  dropdownPlaceholder: {
    color: colors.textPlaceholder,
    fontWeight: "500",
    fontFamily: typography.regular
  },
  dropdownChevron: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.98)",
    overflow: "hidden"
  },
  dropdownScroll: {
    maxHeight: 220
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7"
  },
  dropdownOptionActive: {
    backgroundColor: "#e8efff"
  },
  dropdownOptionText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.semiBold
  },
  dropdownOptionTextActive: {
    color: colors.primary
  },
  dropdownDisabled: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: "rgba(248,250,252,0.95)",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  dropdownDisabledText: {
    color: colors.textPlaceholder,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.regular
  },
  enhancedCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.cardPad,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  crpAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#34d399",
  },
  crpAvatarText: {
    color: colors.textOnPrimary,
    fontWeight: "900",
    fontFamily: typography.bold,
    fontSize: 18,
  },
  crpNameText: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  crpDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    fontFamily: typography.regular,
  },
  crpBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  crpBadgeText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  metricsHeader: {
    marginBottom: 12,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderRadius: radii.card,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: radii.card,
    padding: spacing.cardPad,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  reportStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    borderRadius: radii.card,
    padding: 12,
  },
  reportStat: {
    alignItems: "center",
    flex: 1,
  },
  reportStatValue: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.primary,
  },
  reportStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  statusSuccess: {
    backgroundColor: colors.successLight,
  },
  statusPending: {
    backgroundColor: colors.warningLight,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  statusTextSuccess: {
    color: colors.success,
  },
  statusTextPending: {
    color: colors.warning,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 10,
  },
  alertDotPending: {
    backgroundColor: colors.warning,
  },
  alertDotUpcoming: {
    backgroundColor: colors.primary,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    fontFamily: typography.regular,
  },
  activityItem: {
    backgroundColor: "#f8fafc",
    borderRadius: radii.card,
    padding: spacing.cardPad,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityBadgeDone: {
    backgroundColor: colors.successLight,
  },
  activityBadgeProgress: {
    backgroundColor: "#dbeafe",
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  activityBadgeTextDone: {
    color: colors.success,
  },
  activityBadgeTextProgress: {
    color: colors.primary,
  },
  activityDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  activityDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    fontFamily: typography.regular,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    marginTop: 4,
    textAlign: "right",
  },

  // Geofence Styles
  geofenceContainer: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: radii.card,
    padding: 12,
    marginBottom: 16,
    gap: 6,
  },
  geofenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  geofenceLabel: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    color: colors.primary,
  },
  geofenceValue: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  geofenceCoords: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    fontFamily: typography.regular,
  },
  geofenceMessage: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    marginTop: 2,
  },
  geofenceRefreshBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  geofenceRefreshText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  geofenceBtnRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  geofenceMapBtn: {
    flex: 1,
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    alignItems: "center",
  },
  geofenceMapText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  geofenceInfoBox: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radii.card,
    padding: 12,
    marginBottom: 16,
    gap: 4,
  },
  geofenceInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.warning,
  },
  geofenceInfoText: {
    fontSize: 12,
    color: colors.warning,
    lineHeight: 18,
    fontFamily: typography.regular,
  },

  // Government Form Style Styles
  govFormCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  govFormTitle: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  govFormSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: typography.regular,
  },
  govFormField: {
    marginBottom: 16,
  },
  govFormLabel: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  govFormInput: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  govFormValidation: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    marginTop: 4,
  },
  govFormRow: {
    flexDirection: "row",
    gap: 12,
  },
  govFormHalf: {
    flex: 1,
  },
  govFormPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default styles;

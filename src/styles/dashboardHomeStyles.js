import { StyleSheet } from "react-native";
import { colors, typography, radii, spacing, sizes } from "./theme";

export const pageStyles = StyleSheet.create({
  screen: {
    paddingVertical: 10,
    paddingHorizontal: spacing.screenPad,
    position: "relative",
    backgroundColor: colors.appBg
  },
  bgGlowTop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(59,130,246,0.14)",
    top: -70,
    right: -50
  },
  bgGlowBottom: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(20,184,166,0.12)",
    bottom: -80,
    left: -60
  },
  frame: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.94)",
    padding: 14,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6
  },
  topRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  imageCard: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warningLight,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3
  },
  imageAvatarText: { color: colors.warning, fontSize: 20, fontWeight: "900",
 fontFamily: typography.bold, textAlign: "center" },
  imageText: { color: colors.textSecondary, fontSize: 10, fontWeight: "800",
 fontFamily: typography.bold, textAlign: "center" },
  infoCard: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    gap: 5
  },
  infoLine: { color: colors.textOnPrimary, fontSize: 12, fontWeight: "800",
 fontFamily: typography.bold, },
  dropdownWrap: { position: "relative", zIndex: 10 },
  dropdownTrigger: {
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dropdownText: { color: colors.textOnPrimary, fontSize: 12, fontWeight: "800",
 fontFamily: typography.bold, letterSpacing: 0.2 },
  dropdownArrow: { color: colors.warning, fontWeight: "900",
 fontFamily: typography.bold, },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    overflow: "hidden"
  },
  dropdownItem: { paddingVertical: 9, paddingHorizontal: 10, backgroundColor: colors.surface },
  dropdownItemActive: { backgroundColor: colors.surface },
  dropdownItemText: { color: colors.textPrimary, fontSize: 12, fontWeight: "700",
 fontFamily: typography.bold, },
  dropdownItemTextActive: { color: colors.primary },
  dashboardCard: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warningLight,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 14,
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3
  },
  dashboardHeadingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  dashboardEyebrow: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: typography.bold,
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  dashboardTitle: {
    fontSize: 32,
    color: colors.textPrimary,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dashboardDateBadge: {
    borderRadius: 999,
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  dashboardDateLabel: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  metricStatCard: {
    width: "48%",
    minHeight: 116,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.cardPad,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2
  },
  metricAccent: {
    width: 38,
    height: 6,
    borderRadius: 999,
    marginBottom: 10
  },
  metricStatLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
    minHeight: 30
  },
  metricStatValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
    fontFamily: typography.bold,
    marginTop: 4
  },
  metricStatHint: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    fontFamily: typography.semiBold,
    marginTop: 6
  },
  metricCompactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  metricCompactLeft: {
    flex: 1,
    flexDirection: "column",
    gap: 4
  },
  metricCompactLabel: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  metricCompactValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
    fontFamily: typography.bold,
    textAlign: "right",
    minWidth: 88
  },
  graphPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  graphText: { color: "#dbeafe", fontSize: 11, fontWeight: "700",
 fontFamily: typography.bold, },
  graphPillTeal: {
    backgroundColor: colors.primary
  },
  graphPillOrange: {
    backgroundColor: colors.accent
  },
  dashboardGraphStrip: {
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    padding: 14,
    gap: 12
  },
  dashboardGraphStripCopy: {
    gap: 4
  },
  dashboardGraphStripTitle: {
    color: colors.textOnPrimary,
    fontSize: 17,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dashboardGraphStripHint: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18
  },
  dashboardGraphStripActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  graphPageCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 14
  },
  graphPageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  graphPageEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  graphPageTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  graphTotalBadge: {
    minWidth: 88,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center"
  },
  graphTotalBadgeLabel: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  graphTotalBadgeValue: {
    color: colors.textOnPrimary,
    fontSize: 20,
    fontWeight: "900",
    fontFamily: typography.bold,
    marginTop: 2
  },
  graphSpotlightCard: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.cardPad
  },
  graphSpotlightTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: typography.bold,
    marginBottom: 10
  },
  graphSpotlightBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    minHeight: 210
  },
  graphSpotlightBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 8
  },
  graphSpotlightValue: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  graphSpotlightTrack: {
    width: "100%",
    height: 140,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: "flex-end",
    overflow: "hidden"
  },
  graphSpotlightFill: {
    width: "100%",
    borderRadius: 18,
    minHeight: 12
  },
  graphSpotlightLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  legendWrap: {
    gap: 10
  },
  legendCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  legendLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  legendValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  legendProgressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  legendProgressFill: {
    height: "100%",
    borderRadius: 999,
    minWidth: 8
  },
  backToDashboardBtn: {
    alignSelf: "center",
    minWidth: 180,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  backToDashboardText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  quickActionsCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1
  },
  quickActionsTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "800",
 fontFamily: typography.bold, },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  submitActionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12
  },
  graphActionBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  graphActionBtnText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  submitActionBtn: {
    minWidth: 104,
    backgroundColor: colors.warning,
    borderRadius: radii.button,
    paddingHorizontal: 16,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  submitActionBtnText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  dashboardInlineAlert: {
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accentLight,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    padding: 14,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  dashboardInlineAlertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  dashboardInlineAlertBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  dashboardInlineAlertBadgeText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dashboardInlineAlertCopy: {
    flex: 1,
    gap: 2
  },
  dashboardInlineAlertTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dashboardInlineAlertSubtitle: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dashboardInlineAlertList: {
    gap: 8
  },
  dashboardInlineAlertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  dashboardAlertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginTop: 4
  },
  dashboardInlineAlertText: {
    flex: 1,
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    lineHeight: 18
  },
  dashboardActivityPanel: {
    marginTop: 12,
    borderRadius: radii.card,
    backgroundColor: colors.primaryDark,
    minHeight: 124,
    padding: spacing.cardPad
  },
  dashboardActivityTitle: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
    textDecorationLine: "underline"
  },
  dashboardActivityLine: {
    marginTop: 10,
    color: "#dbeafe",
    fontSize: 13,
    lineHeight: 18
  },
  dashboardActivityEmpty: {
    marginTop: 12,
    color: "#dbeafe",
    fontSize: 13,
    lineHeight: 18
  },
  alertPopupOverlay: {
    position: "absolute",
    top: 92,
    left: 12,
    right: 12,
    zIndex: 50,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  alertPopupCard: {
    borderWidth: 1,
    borderColor: colors.textPrimary,
    backgroundColor: colors.warningLight,
    borderRadius: radii.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3
  },
  dashboardAlertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  dashboardAlertIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.warning,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.warning
  },
  dashboardAlertIcon: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dashboardAlertCopy: {
    flex: 1,
    gap: 1
  },
  dashboardAlertTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dashboardAlertHint: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dashboardAlertBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6
  },
  dashboardAlertBadgeText: {
      color: colors.textOnPrimary,
      fontSize: 12,
      fontWeight: "900",
      fontFamily: typography.bold,
    },
    dashboardAlertList: {
      marginTop: 10,
      gap: 8
    },
    dashboardAlertListRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8
    },
    dashboardAlertListDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.warning,
      marginTop: 5
    },
    dashboardAlertListText: {
      flex: 1,
      color: colors.accent,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: typography.bold,
      lineHeight: 18
    },
    actionBtnMuted: {
      flex: 1,
      backgroundColor: colors.border,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 18,
      minHeight: 76,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
      shadowColor: colors.textSecondary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 1
    },
    actionBtnAmber: {
      backgroundColor: colors.warningLight,
      borderColor: colors.warningLight
    },
    actionBtnSlate: {
      backgroundColor: colors.surface,
      borderColor: colors.border
    },
    actionBtnPrimary: {
      flex: 1,
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 18,
      minHeight: 76,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.24,
      shadowRadius: 5,
      elevation: 2
    },
  actionTextMuted: { color: colors.textPrimary, fontSize: 12, fontWeight: "700",
 fontFamily: typography.bold, textAlign: "center" },
  actionTextPrimary: { color: colors.textOnPrimary, fontSize: 12, fontWeight: "800",
 fontFamily: typography.bold, textAlign: "center" }
});

export const wrStyles = StyleSheet.create({
  metricBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden"
  },
  metricLabel: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  metricValueBox: {
    width: 62,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  metricValueText: { color: colors.textOnPrimary, fontWeight: "800",
 fontFamily: typography.bold, fontSize: 13 },
  metricInput: {
    width: 86,
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    fontWeight: "700",
    fontFamily: typography.bold,
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  submitRow: { flexDirection: "row", gap: 8 },
  reportWorkflowCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 8
  },
  workflowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  workflowHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  workflowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  workflowLabel: {
    width: 118,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  workflowValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  workflowMediaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4
  },
  mediaBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  mediaBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  mediaStatusText: {
    color: colors.textSecondary,
    fontSize: 12
  },
  workflowActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4
  },
  locationBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: radii.button
  },
  locationBtnText: {
    color: "#dbeafe",
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  graphBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: radii.button
  },
  graphBtnText: { color: "#dbeafe", fontWeight: "700",
 fontFamily: typography.bold, },
  submitBtn: {
    width: 84,
    backgroundColor: colors.warning,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.button
  },
  submitBtnText: { color: colors.textOnPrimary, fontWeight: "800",
 fontFamily: typography.bold, },
  distanceText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14
  },
  alertDot: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 8, backgroundColor: colors.accent },
  alertText: { flex: 1, fontSize: 12, color: colors.textPrimary, paddingVertical: 8, paddingRight: 8 },
  activityCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primaryDark,
    padding: spacing.cardPad,
    minHeight: 128,
    borderRadius: radii.card
  },
  activityTitle: {
    color: "#eff6ff",
    fontWeight: "800",
    fontFamily: typography.bold,
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 8
  },
  activityLine: { color: "#e2e8f0", fontSize: 12, marginTop: 2 },
  backBtn: {
    alignSelf: "flex-end",
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.button
  },
  backBtnText: { color: colors.textOnPrimary, fontSize: 11, fontWeight: "700",
 fontFamily: typography.bold, }
});

export const neStyles = StyleSheet.create({
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8
  },
  fieldLabel: {
    width: 88,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  fieldValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  selectStrip: {
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14
  },
  selectText: {
    color: "#dbeafe",
    fontWeight: "700",
    fontFamily: typography.bold,
    fontSize: 12
  },
  portionRow: {
    flexDirection: "row",
    gap: 8
  },
  portionBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  portionBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14
  },
  alertDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 8,
    backgroundColor: colors.warning
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingRight: 8
  },
  activityCard: {
    borderWidth: 1,
    borderColor: colors.warningLight,
    backgroundColor: colors.warning,
    padding: spacing.cardPad,
    minHeight: 152,
    borderRadius: radii.card
  },
  activityTitle: {
    color: "#fff7ed",
    fontWeight: "800",
    fontFamily: typography.bold,
    textDecorationLine: "underline",
    textAlign: "center",
    marginBottom: 8
  },
  activityLine: {
    color: "#fff7ed",
    fontSize: 12,
    marginTop: 3
  }
});

export const smStyles = StyleSheet.create({
  fieldRow: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6
  },
  fieldLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dropdownTriggerText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    flex: 1,
    marginRight: 6
  },
  dropdownArrow: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.surface
  },
  dropdownItemActive: {
    backgroundColor: colors.surface
  },
  dropdownItemText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  optionPill: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  optionPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  optionPillText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  optionPillTextActive: {
    color: colors.textOnPrimary
  },
  readonlyRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8
  },
  readonlyLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  readonlyValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  uploadBtn: {
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.textPlaceholder,
    borderRadius: radii.button,
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  uploadBtnText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  previewCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.cardPad,
    borderRadius: radii.card,
    gap: 6
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  previewBox: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 8
  },
  previewImage: {
    width: "100%",
    height: 140,
    borderRadius: 4,
    resizeMode: "cover"
  },
  previewText: {
    color: "#dbeafe",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  dotToggle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1
  },
  lhIndicatorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  lhIndicatorBtnOn: {
    backgroundColor: colors.successLight,
    borderColor: colors.success
  },
  lhIndicatorBtnOff: {
    backgroundColor: colors.border,
    borderColor: colors.textSecondary
  },
  lhIndicatorText: {
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  lhIndicatorTextOn: {
    color: colors.success
  },
  lhIndicatorTextOff: {
    color: colors.textSecondary
  },
  dotToggleOn: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  dotToggleOff: {
    backgroundColor: colors.inputBorder,
    borderColor: colors.textPlaceholder
  },
  cboInput: {
    width: 142,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: colors.textPrimary,
    fontSize: 12
  },
  cboInputDisabled: {
    backgroundColor: colors.border,
    color: colors.textSecondary
  },
  radiusRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8
  },
  radiusStatusIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1
  },
  radiusStatusIdle: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textSecondary
  },
  radiusStatusGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  radiusStatusRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  radiusText: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 8
  },
  checkBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11
  },
  checkBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.warning,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const flowStyles = StyleSheet.create({
  statusHeroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4
  },
  statusHeroAccent: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.warning,
    borderWidth: 3,
    borderColor: colors.warningLight
  },
  statusHeroCopy: {
    flex: 1,
    gap: 3
  },
  statusHeroEyebrow: {
    color: "#bfdbfe",
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  statusHeroTitle: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  statusHeroSubtitle: {
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  statusTitleWrap: {
    marginTop: 14,
    marginBottom: 8,
    gap: 4
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  statusHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  moduleStack: {
    gap: 10
  },
  profileButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2
  },
  profileButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  trackingEntryBtn: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2
  },
  trackingEntryBtnText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  statusFooterCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 10
  },
  footerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10
    },
  footerStatusText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  geoDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1
  },
  geoDotGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  geoDotIdle: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textSecondary
  },
  geoDotRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  primarySaveBtn: {
      width: "100%",
      backgroundColor: colors.accent,
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: radii.button,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
      elevation: 2
    },
  primarySaveText: {
      color: colors.textOnPrimary,
      fontSize: 14,
      fontWeight: "800",
      fontFamily: typography.bold,
    },
  statusBackBtn: {
      marginTop: 12,
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primaryDark,
      borderRadius: radii.button,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12
    },
  statusBackBtnText: {
        color: colors.textOnPrimary,
        fontSize: 13,
        fontWeight: "800",
        fontFamily: typography.bold,
      },
    trackingCard: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 10,
      gap: 8
    },
    trackingTitle: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: "900",
      fontFamily: typography.bold,
    },
    trackingHint: {
      color: colors.textSecondary,
      fontSize: 11,
      lineHeight: 16
    },
    trackingActionRow: {
      flexDirection: "row",
      gap: 8
    },
    secondaryTrackBtn: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 9,
      paddingHorizontal: 8
    },
    secondaryTrackBtnText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: "800",
      fontFamily: typography.bold,
      textAlign: "center"
    },
    mediaMetaText: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: "700",
      fontFamily: typography.bold,
    },
  remarksInput: {
      minHeight: 70,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: colors.textPrimary,
      textAlignVertical: "top"
    },
    trackingShell: {
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 16,
      gap: 14,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3
    },
    trackingHero: {
      gap: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.92)"
    },
    trackingTitleWrap: {
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 9,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 1
    },
    trackingHeroTitle: {
      color: colors.textPrimary,
      fontSize: 21,
      fontWeight: "900",
      fontFamily: typography.bold,
    },
    trackingEyebrow: {
      alignSelf: "flex-start",
      color: colors.primary,
      fontSize: 12,
      fontWeight: "900",
      fontFamily: typography.bold,
      textTransform: "uppercase",
      letterSpacing: 0.6
    },
    trackingHeroHint: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18
    },
    trackingMemberCard: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 14,
      gap: 10
    },
    trackingMemberRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    trackingMemberLabel: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: "800",
      fontFamily: typography.bold,
      textTransform: "uppercase",
      letterSpacing: 0.4
    },
    trackingMemberValue: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: "800",
      fontFamily: typography.bold,
      textAlign: "right"
    },
    trackingStatusCard: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 14,
      gap: 12,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 1
    },
    trackingStatusGrid: {
      gap: 8
    },
    trackingStatusPill: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10
    },
    trackingStatusLabel: {
      color: colors.textSecondary,
      fontSize: 10,
      fontWeight: "800",
      fontFamily: typography.bold,
      textTransform: "uppercase",
      letterSpacing: 0.5
    },
    trackingStatusValue: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: "800",
      fontFamily: typography.bold,
      marginTop: 3
    },
    trackingFooterCard: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 12,
      gap: 12
    },
    trackingSaveRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10
    },
    formTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: "800",
      fontFamily: typography.bold,
  },
  investmentShell: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3
  },
  investmentHero: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  investmentTitleWrap: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1
  },
  investmentTitle: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  investmentEyebrow: {
    alignSelf: "flex-start",
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  investmentHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  investmentCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  investmentFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  investmentFieldLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  investmentInput: {
    width: 116,
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  investmentActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 2
  },
  investmentSaveBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2
  },
  investmentSaveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  investmentBackBtn: {
    minWidth: 116,
    maxWidth: 140,
    minHeight: 40,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  investmentBackBtnText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  formLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  input: {
    width: 128,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  ddWrap: {
    width: "100%",
    position: "relative",
    zIndex: 40
  },
  ddBox: {
    width: "100%",
    minHeight: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  ddText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    flex: 1,
    marginRight: 10
  },
  ddArrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  ddMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
    maxHeight: 190,
    boxShadow: "0px 10px 24px rgba(15, 23, 42, 0.12)",
    elevation: 6,
    zIndex: 50
  },
  ddScroll: {
    maxHeight: 190
  },
  ddOption: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  ddOptionActive: {
    backgroundColor: colors.surface
  },
  ddOptionText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  ddOptionTextActive: {
    color: colors.primary
  }
});

export const apStyles = StyleSheet.create({
  frame: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3
  },
  heroCard: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  titleWrap: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1
  },
  title: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  sectionType: {
    alignSelf: "flex-start",
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  sectionCard: {
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  fieldBlock: {
    width: "100%",
    gap: 7
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  input: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  dropdown: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2
  },
  actionBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  actionBtnText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const nfStyles = StyleSheet.create({
  frame: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 8
  },
  titleWrap: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  label: {
    width: 84,
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  input: {
    width: 132,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  dateTrigger: {
    width: 132,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 28,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dateTriggerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  datePlaceholderText: {
    color: colors.textSecondary
  },
  dateTriggerIcon: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  dropdown: {
    width: 132,
    borderRadius: 0,
    borderColor: colors.border,
    paddingVertical: 3
  },
  toggleWrap: {
    width: 132,
    flexDirection: "row",
    gap: 6
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3
  },
  toggleBtnActive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary
  },
  toggleText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  complianceHeader: {
    alignItems: "center",
    marginTop: 4
  },
  complianceTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: typography.bold,
    textDecorationLine: "underline"
  },
  saveBtn: {
    alignSelf: "flex-start",
    marginTop: 6,
    minWidth: 120,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const tsCardStyles = StyleSheet.create({
  frame: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3
  },
  heroCard: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  titleWrap: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1
  },
  title: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  sectionType: {
    alignSelf: "flex-start",
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  memberCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 10
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  memberLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  memberValue: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  geoCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 12
  },
  geoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  geoCopy: {
    flex: 1,
    gap: 3
  },
  geoTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  geoHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  geoActionBtn: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  geoActionBtnText: {
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  moduleCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  mainButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.textSecondary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  mainButtonText: {
    color: colors.textOnPrimary,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "800",
    fontFamily: typography.bold,
    lineHeight: 24
  },
  segmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  segmentBtn: {
    flex: 1,
    minHeight: 54,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.textSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  segmentBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  lockedButton: {
    opacity: 0.6
  },
  segmentBtnText: {
    color: colors.textOnPrimary,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
    lineHeight: 18
  },
  footerCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 12
  },
  geoDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1
  },
  geoDotGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  geoDotIdle: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textSecondary
  },
  geoDotRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  saveBtn: {
    width: "100%",
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const tsDetailStyles = StyleSheet.create({
  frame: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3
  },
  heroCard: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  titleWrap: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1
  },
  title: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  sectionType: {
    alignSelf: "flex-start",
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  sectionCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  fieldBlock: {
    width: "100%",
    gap: 7
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  input: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  dropdown: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  selectWrap: {
    width: "100%",
    position: "relative",
    zIndex: 40
  },
  selectInput: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 38,
    paddingVertical: 12
  },
  selectChevronWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    minHeight: 48,
    width: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  selectChevron: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  selectMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
    maxHeight: 190,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6
  },
  selectScroll: {
    maxHeight: 190
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  selectOptionText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  selectEmptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontStyle: "italic",
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  dateTrigger: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dateTriggerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  datePlaceholderText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontFamily: typography.semiBold,
  },
  dateTriggerIcon: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4
  },
  saveBtn: {
    alignSelf: "center",
    minWidth: 180,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 2,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.48)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.cardPad,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 10
  },
  modalBadge: {
    alignSelf: "center",
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successLight,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  modalBadgeText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: typography.bold,
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  modalIconCircle: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  modalIconCircleSaved: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successLight
  },
  modalIconCircleAlert: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorLight
  },
  modalIconText: {
    fontSize: 26,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  modalIconTextSaved: {
    color: colors.primary
  },
  modalIconTextAlert: {
    color: colors.error
  },
  modalBadgeSaved: {
    backgroundColor: colors.successLight,
    borderColor: colors.successLight
  },
  modalBadgeAlert: {
    backgroundColor: colors.errorLight,
    borderColor: colors.errorLight
  },
  modalBadgeTextSaved: {
    color: colors.primary,
    textTransform: "none",
    letterSpacing: 0.2
  },
  modalBadgeTextAlert: {
    color: colors.error,
    textTransform: "none",
    letterSpacing: 0.2
  },
  modalFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  modalFieldRowLast: {
    borderBottomWidth: 0
  },
  modalFieldLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    flexShrink: 0,
    maxWidth: "45%"
  },
  modalFieldValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "right",
    flexShrink: 1
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  modalContentCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  modalPreviewImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: colors.border
  },
  modalMessage: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "700",
    fontFamily: typography.bold,
    textAlign: "left"
  },
  modalScroll: {
    maxHeight: 280
  },
  modalDateInput: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  modalActionRow: {
    flexDirection: "row",
    gap: 10
  },
  modalSecondaryBtn: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  modalSecondaryBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  modalPrimaryBtn: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  modalPrimaryBtnWide: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3
  },
  modalPrimaryBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const fsStyles = StyleSheet.create({
  frame: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 10
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  fieldBlock: {
    width: "100%",
    gap: 7
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  cardInput: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 38,
    paddingVertical: 12
  },
  togglePillRow: {
    flexDirection: "row",
    gap: 10
  },
  togglePill: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center"
  },
  togglePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark
  },
  togglePillText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  togglePillTextActive: {
    color: colors.textOnPrimary
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2
  },
  popupActionBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  popupActionBtnDisabled: {
    opacity: 0.5
  },
  popupActionBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  saveActionBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.success,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  saveActionBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  label: {
    width: 142,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdown: {
    flex: 1,
    borderRadius: 0,
    borderColor: colors.border,
    paddingVertical: 5
  },
  selectInput: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 11,
    paddingLeft: 8,
    paddingRight: 28,
    paddingVertical: 5
  },
  toggleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1
  },
  toggleDotOn: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  toggleDotOff: {
    backgroundColor: colors.inputBorder,
    borderColor: colors.textSecondary
  },
  toggleText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  bottomRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  popupBtn: {
    width: 74,
    minHeight: 64,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  popupBtnText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "center",
    textDecorationLine: "underline"
  },
  saveBtn: {
    minWidth: 96,
    backgroundColor: colors.success,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 18
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const pastStyles = StyleSheet.create({
  frame: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 8
  },
  sectionCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  fieldBlock: {
    width: "100%",
    gap: 7
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  cardInput: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 38,
    paddingVertical: 12
  },
  cardInputReadOnly: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2
  },
  section: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 8,
    gap: 4
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  label: {
    width: 144,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  inputReadOnly: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    color: colors.textPrimary,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  dropdown: {
    flex: 1,
    borderRadius: 0,
    borderColor: colors.border,
    paddingVertical: 5
  },
  selectInput: {
    flex: 1,
    minHeight: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 11,
    paddingLeft: 8,
    paddingRight: 28,
    paddingVertical: 5
  },
  saveBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.success,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  linkBtn: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  linkBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "center"
  }
});

export const txnStyles = StyleSheet.create({
  frame: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 8
  },
  sectionCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 14,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  fieldBlock: {
    width: "100%",
    gap: 7
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  cardInput: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 38,
    paddingVertical: 12
  },
  uploadRow: {
    gap: 10
  },
  uploadBtn: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  uploadBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  uploadMetaCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 4
  },
  uploadMetaLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  uploadMetaValue: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 10
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    textAlign: "center"
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    fontFamily: typography.bold,
    textAlign: "center"
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPad,
    gap: 10
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  summaryLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
    textAlign: "right"
  },
  actionRow: {
    flexDirection: "row",
    gap: 12
  },
  saveBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  backBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  backBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  label: {
    width: 188,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  inputReadOnly: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    color: colors.textPrimary,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  dropdown: {
    flex: 1,
    borderRadius: 0,
    borderColor: colors.border,
    paddingVertical: 5
  },
  tableTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
    marginTop: 6
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.border
  },
  tableRow: {
    flexDirection: "row"
  },
  thMonth: {
    width: 58,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: 4,
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary
  },
  th: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: 4,
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    color: colors.textPrimary
  },
  tdMonth: {
    width: 58,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: 4,
    fontSize: 10,
    color: colors.textPrimary
  },
  td: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: 4,
    fontSize: 10,
    color: colors.textPrimary
  },
  legacyButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8
  },
  legacyActionBtn: {
    minWidth: 86,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8
  },
  legacyActionBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  legacyBackBtn: {
    minWidth: 70,
    backgroundColor: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8
  },
  legacyBackBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const lhcboStyles = StyleSheet.create({
  frame: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    gap: 12
  },
  formCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.cardPad,
    gap: 12,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2
  },
  formHeader: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    gap: 4
  },
  formEyebrow: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: typography.bold,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  formHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  label: {
    width: 120,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: typography.bold,
    lineHeight: 16
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  metaPanel: {
    flexDirection: "row",
    gap: 10
  },
  metaChip: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4
  },
  metaChipLabel: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "800",
    fontFamily: typography.bold,
    textTransform: "uppercase"
  },
  metaChipValue: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  uploadBtn: {
    minWidth: 132,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  uploadBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  helpText: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16
  },
  autoText: {
    color: colors.error,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  previewHeading: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    fontFamily: typography.bold,
    marginTop: 2
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6
  },
  navBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  navBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  previewBox: {
    flex: 1,
    minHeight: 140,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 8
  },
  previewImage: {
    width: "100%",
    height: 140
  },
  previewText: {
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20
  },
  radiusRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  geoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1
  },
  geoDotIdle: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textSecondary
  },
  geoDotGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  geoDotIdle: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textSecondary
  },
  geoDotRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  radiusText: {
    flex: 1,
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4
  },
  checkBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  checkBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const chcEntStyles = StyleSheet.create({
  enterpriseBanner: {
    backgroundColor: colors.warningLight,
    borderWidth: 2,
    borderColor: colors.warning,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4
  },
  bannerIcon: {
    fontSize: 24,
    fontWeight: "900",
    fontFamily: typography.bold,
    color: colors.warning,
    marginBottom: 8
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "900",
    fontFamily: typography.bold,
    color: colors.warning,
    textAlign: "center",
    marginBottom: 4
  },
  bannerHint: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
    color: colors.warning,
    textAlign: "center",
    lineHeight: 18
  },
  entFieldRow: {
    ...lhcboStyles.row,
    backgroundColor: colors.warningLight
  },
  entLabel: {
    ...lhcboStyles.label,
    color: colors.warning
  },
  entInput: {
    ...lhcboStyles.input,
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
    minHeight: 52,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  entServicesInput: {
    ...lhcboStyles.input,
    minHeight: 80,
    textAlignVertical: "top"
  },
  fixedActivityRow: {
    ...lhcboStyles.row,
    backgroundColor: colors.successLight,
    borderColor: colors.successLight
  },
  fixedActivityText: {
    ...lhcboStyles.input,
    color: colors.success,
    fontWeight: "900",
    fontFamily: typography.bold,
    backgroundColor: colors.successLight
  }
});

export const lhGuideStyles = StyleSheet.create({
  frame: {
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 10
  },
  headerCard: {
    backgroundColor: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2
  },
  headerLine: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  formCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.cardPad,
    gap: 8
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  dropdownLabel: {
    width: 118,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdownValueBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dropdownValue: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdownArrow: {
    color: colors.accent,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  rulesCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: spacing.cardPad,
    gap: 4
  },
  ruleLine: {
    color: colors.textPrimary,
    fontSize: 12,
    lineHeight: 24,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  ruleLineActive: {
    color: colors.error
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2
  },
  geoDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1
  },
  geoDotGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  geoDotIdle: {
    backgroundColor: colors.textPlaceholder,
    borderColor: colors.textSecondary
  },
  geoDotRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  backBtn: {
    alignSelf: "flex-end",
    backgroundColor: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: radii.button,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  backBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const lhcboStatusStyles = StyleSheet.create({
  frame: {
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 10
  },
  titleText: {
    fontSize: 15,
    fontWeight: "900",
    fontFamily: typography.bold,
    textAlign: "left"
  },
  titlePage: {
    color: colors.textPrimary
  },
  titleRed: {
    color: colors.error
  },
  headerCard: {
    backgroundColor: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2
  },
  headerLine: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  contentCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.border,
    minHeight: 470,
    paddingVertical: 18,
    paddingHorizontal: 10,
    justifyContent: "space-between"
  },
  buttonStack: {
    gap: 34,
    marginTop: 10
  },
  blockBtn: {
    alignSelf: "center",
    width: "74%",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    shadowColor: colors.textSecondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  blockBtnText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  chcDetailsWrap: {
    width: "100%",
    marginTop: 4,
    marginBottom: 12
  },
  chcPlaceholder: {
    alignSelf: "center",
    width: 136,
    height: 176,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    backgroundColor: colors.border,
    marginTop: 90
  },
  footerRow: {
    width: "82%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  geoDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1
  },
  geoDotGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  geoDotRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});

export const lhStyles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 3
  },
  headerLine: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  dropdownLabel: {
    width: 108,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdownValueBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dropdownValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  dropdownArrow: {
    color: colors.accent,
    fontWeight: "900",
    fontFamily: typography.bold,
  },
  notesCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  noteLine: {
    color: colors.textPrimary,
    fontSize: 12,
    lineHeight: 18
  },
  noteDivider: {
    color: colors.textSecondary,
    marginVertical: 3
  },
  notePlain: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontFamily: typography.bold,
  },
  noteHighlight: {
    color: colors.error,
    fontWeight: "800",
    fontFamily: typography.bold,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  geoDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1
  },
  geoDotGreen: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  geoDotRed: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.button,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: typography.bold,
  }
});
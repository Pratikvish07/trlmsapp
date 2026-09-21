import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../../../components/dashboard/TranslatedInputs";
import PostCheckoutModal from "../../PostCheckoutModal";
import { pageStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

export default function DashboardHomeView() {
  const {
    headerCrpInitials,
    headerCrpId,
    headerCrpName,
    setShowCrpTypeMenu,
    selectedCrpType,
    showCrpTypeMenu,
    crpTypeOptions,
    setSelectedCrpType,
    renderAlertPopup,
    dashboardDateLabel,
    dashboardHighlights,
    handleGraphPress,
    onOpenWorkingReport,
    dashboardAlertCount,
    dashboardNotificationItems,
    activities,
    onOpenNewEnrolment,
    onOpenShgMember,
    onOpenUpdateData,
    showPostCheckoutModal,
    setShowPostCheckoutModal,
    onLogout
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={pageStyles.bgGlowTop} />
      <View style={pageStyles.bgGlowBottom} />
      <View style={pageStyles.frame}>
        <View style={pageStyles.topRow}>
          <View style={pageStyles.imageCard}>
            <Text style={pageStyles.imageAvatarText}>{headerCrpInitials}</Text>
            <Text style={pageStyles.imageText}>CRP</Text>
          </View>
          <View style={pageStyles.infoCard}>
            <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
            <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
          </View>
        </View>

        <View style={pageStyles.dropdownWrap}>
          <Pressable
            style={pageStyles.dropdownTrigger}
            onPress={() => setShowCrpTypeMenu((prev) => !prev)}
          >
            <Text style={pageStyles.dropdownText}>Type of CRP: {selectedCrpType}</Text>
            <Text style={pageStyles.dropdownArrow}>{showCrpTypeMenu ? "^" : "v"}</Text>
          </Pressable>
          {showCrpTypeMenu ? (
            <View style={pageStyles.dropdownMenu}>
              {crpTypeOptions.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    pageStyles.dropdownItem,
                    selectedCrpType === item && pageStyles.dropdownItemActive
                  ]}
                  onPress={() => {
                    setSelectedCrpType(item);
                    setShowCrpTypeMenu(false);
                  }}
                >
                  <Text
                    style={[
                      pageStyles.dropdownItemText,
                      selectedCrpType === item && pageStyles.dropdownItemTextActive
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {renderAlertPopup()}

        <View style={pageStyles.dashboardCard}>
          <View style={pageStyles.dashboardHeadingRow}>
            <View>
              <Text style={pageStyles.dashboardEyebrow}>Live Performance</Text>
              <Text style={pageStyles.dashboardTitle}>Dashboard</Text>
            </View>
            <View style={pageStyles.dashboardDateBadge}>
              <Text style={pageStyles.dashboardDateLabel}>{dashboardDateLabel}</Text>
            </View>
          </View>

          <View style={pageStyles.metricGrid}>
            {dashboardHighlights.map((item) => (
              <View key={item.key} style={pageStyles.metricStatCard}>
                <View style={[pageStyles.metricAccent, { backgroundColor: item.tint }]} />
                <Text style={pageStyles.metricStatLabel}>{item.label}</Text>
                <Text style={pageStyles.metricStatValue}>{item.value}</Text>
                <Text style={pageStyles.metricStatHint}>{item.hint}</Text>
              </View>
            ))}
          </View>

          <View style={pageStyles.dashboardGraphStrip}>
            <View style={pageStyles.dashboardGraphStripCopy}>
              <Text style={pageStyles.dashboardGraphStripTitle}>Insights & Trends</Text>
              <Text style={pageStyles.dashboardGraphStripHint}>
                Open visual summaries for visits, member coverage, and honorarium.
              </Text>
            </View>
            <View style={pageStyles.dashboardGraphStripActions}>
              <Pressable style={pageStyles.graphPill} onPress={() => handleGraphPress("visits")}>
                <Text style={pageStyles.graphText}>Visits</Text>
              </Pressable>
              <Pressable style={[pageStyles.graphPill, pageStyles.graphPillTeal]} onPress={() => handleGraphPress("members")}>
                <Text style={pageStyles.graphText}>Members</Text>
              </Pressable>
              <Pressable style={[pageStyles.graphPill, pageStyles.graphPillOrange]} onPress={() => handleGraphPress("honorarium")}>
                <Text style={pageStyles.graphText}>Honorarium</Text>
              </Pressable>
            </View>
          </View>

          <View style={pageStyles.submitActionRow}>
            <Pressable style={pageStyles.graphActionBtn} onPress={() => handleGraphPress("visits")}>
              <Text style={pageStyles.graphActionBtnText}>Open Graphs</Text>
            </Pressable>
            <Pressable style={pageStyles.submitActionBtn} onPress={onOpenWorkingReport}>
              <Text style={pageStyles.submitActionBtnText}>Submit</Text>
            </Pressable>
          </View>

          <View style={pageStyles.dashboardInlineAlert}>
            <View style={pageStyles.dashboardInlineAlertHeader}>
              <View style={pageStyles.dashboardInlineAlertBadge}>
                <Text style={pageStyles.dashboardInlineAlertBadgeText}>!</Text>
              </View>
              <View style={pageStyles.dashboardInlineAlertCopy}>
                <Text style={pageStyles.dashboardInlineAlertTitle}>Pending & Upcoming Notifications</Text>
                <Text style={pageStyles.dashboardInlineAlertSubtitle}>
                  {dashboardAlertCount} item{dashboardAlertCount > 1 ? "s" : ""} need attention
                </Text>
              </View>
            </View>

            <View style={pageStyles.dashboardInlineAlertList}>
              {dashboardNotificationItems.map((item, index) => (
                <View key={`inline-alert-${index}-${item}`} style={pageStyles.dashboardInlineAlertItem}>
                  <View style={pageStyles.dashboardAlertDot} />
                  <Text style={pageStyles.dashboardInlineAlertText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={pageStyles.dashboardActivityPanel}>
            <Text style={pageStyles.dashboardActivityTitle}>Different Activities of the Concern CRP</Text>
            {activities.length ? (
              activities.slice(0, 3).map((item) => (
                <Text key={item.id} style={pageStyles.dashboardActivityLine}>
                  - {item.title}
                </Text>
              ))
            ) : (
              <Text style={pageStyles.dashboardActivityEmpty}>Daily visit reports will appear here.</Text>
            )}
          </View>
        </View>

        <View style={pageStyles.quickActionsCard}>
          <Text style={pageStyles.quickActionsTitle}>Quick Actions</Text>
          <View style={pageStyles.actionsRow}>
            <Pressable style={[pageStyles.actionBtnMuted, pageStyles.actionBtnAmber]} onPress={onOpenNewEnrolment}>
              <Text style={pageStyles.actionTextMuted}>New{"\n"}Enrolment</Text>
            </Pressable>
            <Pressable style={pageStyles.actionBtnPrimary} onPress={onOpenShgMember}>
              <Text style={pageStyles.actionTextPrimary}>SHG{"\n"}Member</Text>
            </Pressable>
            <Pressable style={[pageStyles.actionBtnMuted, pageStyles.actionBtnSlate]} onPress={onOpenUpdateData}>
              <Text style={pageStyles.actionTextMuted}>Update Data</Text>
            </Pressable>
          </View>
        </View>

        <PostCheckoutModal
          visible={showPostCheckoutModal}
          onClose={() => setShowPostCheckoutModal(false)}
          onLogout={onLogout}
        />
      </View>
    </View>
  );
}

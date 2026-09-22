import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/dashboard/TranslatedInputs";
import PostCheckoutModal from "@/components/PostCheckoutModal";
import { pageStyles } from "@/styles/dashboardHomeStyles";
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
            {[0, 2].map((rowStart) => (
              <View key={`metric-row-${rowStart}`} style={pageStyles.metricGridRow}>
                {dashboardHighlights.slice(rowStart, rowStart + 2).map((item) => (
                  <View key={item.key} style={pageStyles.metricStatCard}>
                    <View style={[pageStyles.metricAccent, { backgroundColor: item.tint }]} />
                    <Text style={pageStyles.metricStatLabel}>{item.label}</Text>
                    <Text style={pageStyles.metricStatValue}>{item.value}</Text>
                    <Text style={pageStyles.metricStatHint}>{item.hint}</Text>
                  </View>
                ))}
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
          <View style={pageStyles.dashboardActionGrid}>
            <View style={pageStyles.dashboardActionRow}>
              <Pressable
                style={[pageStyles.dashboardActionCard, pageStyles.dashboardActionCardGreen]}
                onPress={onOpenWorkingReport}
              >
                <View style={[pageStyles.dashboardActionIconWrap, pageStyles.dashboardActionIconGreen]}>
                  <Text style={pageStyles.dashboardActionIconText}>📋</Text>
                </View>
                <Text style={pageStyles.dashboardActionLabel}>My{"\n"}Activities</Text>
              </Pressable>
              <Pressable
                style={[pageStyles.dashboardActionCard, pageStyles.dashboardActionCardBlue]}
                onPress={onOpenShgMember}
              >
                <View style={[pageStyles.dashboardActionIconWrap, pageStyles.dashboardActionIconBlue]}>
                  <Text style={pageStyles.dashboardActionIconText}>🤝</Text>
                </View>
                <Text style={pageStyles.dashboardActionLabel}>SHG{"\n"}Member</Text>
              </Pressable>
            </View>
            <View style={pageStyles.dashboardActionRow}>
              <Pressable
                style={[pageStyles.dashboardActionCard, pageStyles.dashboardActionCardOrange]}
                onPress={onOpenNewEnrolment}
              >
                <View style={[pageStyles.dashboardActionIconWrap, pageStyles.dashboardActionIconOrange]}>
                  <Text style={pageStyles.dashboardActionIconText}>📝</Text>
                </View>
                <Text style={pageStyles.dashboardActionLabel}>New{"\n"}Enrolment</Text>
              </Pressable>
              <Pressable
                style={[pageStyles.dashboardActionCard, pageStyles.dashboardActionCardPurple]}
                onPress={() => onOpenUpdateData("newEnrolment")}
              >
                <View style={[pageStyles.dashboardActionIconWrap, pageStyles.dashboardActionIconPurple]}>
                  <Text style={pageStyles.dashboardActionIconText}>🔄</Text>
                </View>
                <Text style={pageStyles.dashboardActionLabel}>Update{"\n"}Data</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={pageStyles.dashboardReportsCard} onPress={() => handleGraphPress("visits")}>
            <View style={pageStyles.dashboardReportsIconWrap}>
              <Text style={pageStyles.dashboardReportsIconText}>📊</Text>
            </View>
            <View style={pageStyles.dashboardReportsTextWrap}>
              <Text style={pageStyles.dashboardReportsTitle}>Reports</Text>
              <Text style={pageStyles.dashboardReportsHint}>Visits, members & honorarium graphs</Text>
            </View>
            <Text style={pageStyles.dashboardReportsArrow}>{"→"}</Text>
          </Pressable>
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

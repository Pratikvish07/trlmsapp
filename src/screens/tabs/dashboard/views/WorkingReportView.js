import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, wrStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

export default function WorkingReportView() {
  const {
    renderAlertPopup,
    dashboardMetrics,
    workingReport,
    selectedAssignedMember,
    handleUploadImage,
    handleUploadVideo,
    uploadedImageName,
    uploadedImageDate,
    uploadedVideoName,
    uploadedVideoDate,
    checkRadiusDistance,
    isDistanceLoading,
    handleSubmitCrpTrackingReport,
    distanceToMember,
    setShowDashboardAlerts,
    dashboardAlertCount,
    dashboardNotificationItems,
    activities,
    onBackToDashboard,
    headerCrpId,
    headerCrpName
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      {renderAlertPopup()}
      <View style={pageStyles.frame}>
      <View style={pageStyles.topRow}>
        <View style={pageStyles.imageCard}>
          <Text style={pageStyles.imageText}>CRP{"\n"}Image</Text>
        </View>
        <View style={pageStyles.infoCard}>
          <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
          <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
        </View>
      </View>

      <View style={wrStyles.metricBox}>
        <Text style={wrStyles.metricLabel}>Total Field Visit in last 30 days</Text>
        <View style={wrStyles.metricValueBox}>
          <Text style={wrStyles.metricValueText}>{dashboardMetrics.totalVisits30}</Text>
        </View>
      </View>

      <View style={wrStyles.metricBox}>
        <Text style={wrStyles.metricLabel}>Total SHG Members Visited</Text>
        <View style={wrStyles.metricValueBox}>
          <Text style={wrStyles.metricValueText}>{dashboardMetrics.totalMembersVisited}</Text>
        </View>
      </View>

      <View style={wrStyles.metricBox}>
        <Text style={wrStyles.metricLabel}>No. of Days Attendance Counted</Text>
        <View style={wrStyles.metricValueBox}>
          <Text style={wrStyles.metricValueText}>{dashboardMetrics.attendanceDays}</Text>
        </View>
      </View>

      <View style={wrStyles.metricBox}>
        <Text style={wrStyles.metricLabel}>Honorarium to be Claimed</Text>
        <View style={wrStyles.metricValueBox}>
          <Text style={wrStyles.metricValueText}>
            {dashboardMetrics.honorariumToBeClaimed}
          </Text>
        </View>
      </View>

      <View style={wrStyles.metricBox}>
        <Text style={wrStyles.metricLabel}>Last Honorarium Received</Text>
        <View style={wrStyles.metricValueBox}>
          <Text style={wrStyles.metricValueText}>{workingReport.amountReceived}</Text>
        </View>
      </View>

      <View style={wrStyles.reportWorkflowCard}>
        <Text style={wrStyles.workflowTitle}>CRP Daily Tracking Workflow</Text>
        <Text style={wrStyles.workflowHint}>
          SHG assignment is locked with geolocation. Image and video upload are mandatory,
          and attendance counts only when CRP location matches within 150 metres.
        </Text>
        <Text style={wrStyles.workflowHint}>
          First tap on `Match 150m Geo` to lock the SHG location from the current device position.
        </Text>

        <View style={wrStyles.workflowRow}>
          <Text style={wrStyles.workflowLabel}>Assigned SHG</Text>
          <Text style={wrStyles.workflowValue}>
            {selectedAssignedMember?.shgName || "No SHG assigned"}
          </Text>
        </View>
        <View style={wrStyles.workflowRow}>
          <Text style={wrStyles.workflowLabel}>Assigned Member</Text>
          <Text style={wrStyles.workflowValue}>
            {selectedAssignedMember?.memberName || "No member assigned"}
          </Text>
        </View>
        <View style={wrStyles.workflowRow}>
          <Text style={wrStyles.workflowLabel}>Locked SHG Geo</Text>
          <Text style={wrStyles.workflowValue}>
            {selectedAssignedMember &&
            Number.isFinite(Number(selectedAssignedMember.latitude)) &&
            Number.isFinite(Number(selectedAssignedMember.longitude))
              ? `${selectedAssignedMember.latitude.toFixed(6)}, ${selectedAssignedMember.longitude.toFixed(6)}`
              : "Not locked yet"}
          </Text>
        </View>
        <View style={wrStyles.workflowRow}>
          <Text style={wrStyles.workflowLabel}>Members Visited Today</Text>
          <Text style={wrStyles.workflowValue}>{dashboardMetrics.totalMembersVisitedToday}</Text>
        </View>

        <View style={wrStyles.workflowMediaRow}>
          <Pressable style={wrStyles.mediaBtn} onPress={handleUploadImage}>
            <Text style={wrStyles.mediaBtnText}>Upload Image*</Text>
          </Pressable>
          <Pressable style={wrStyles.mediaBtn} onPress={handleUploadVideo}>
            <Text style={wrStyles.mediaBtnText}>Upload Video*</Text>
          </Pressable>
        </View>

        <Text style={wrStyles.mediaStatusText}>
          Image: {uploadedImageName ? `${uploadedImageName} (${uploadedImageDate})` : "Pending"}
        </Text>
        <Text style={wrStyles.mediaStatusText}>
          Video: {uploadedVideoName ? `${uploadedVideoName} (${uploadedVideoDate})` : "Pending"}
        </Text>

        <View style={wrStyles.workflowActions}>
          <Pressable style={wrStyles.locationBtn} onPress={() => checkRadiusDistance(false)}>
            <Text style={wrStyles.locationBtnText}>
              {isDistanceLoading ? "Checking..." : "Match 150m Geo"}
            </Text>
          </Pressable>
          <Pressable style={wrStyles.submitBtn} onPress={handleSubmitCrpTrackingReport}>
            <Text style={wrStyles.submitBtnText}>Submit Daily Report</Text>
          </Pressable>
        </View>

        <Text style={wrStyles.distanceText}>
          {distanceToMember === null
            ? "Distance not checked yet."
            : `Current distance from SHG geolocation: ${distanceToMember}m`}
        </Text>
      </View>

      <Pressable style={pageStyles.dashboardInlineAlert} onPress={() => setShowDashboardAlerts(true)}>
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
            <View key={`wr-inline-alert-${index}-${item}`} style={pageStyles.dashboardInlineAlertItem}>
              <View style={pageStyles.dashboardAlertDot} />
              <Text style={pageStyles.dashboardInlineAlertText}>{item}</Text>
            </View>
          ))}
        </View>
      </Pressable>

      <View style={wrStyles.activityCard}>
        <Text style={wrStyles.activityTitle}>Different Activities of the Concern CRP</Text>
        {activities.length ? (
          activities.slice(0, 3).map((item) => (
            <Text key={item.id} style={wrStyles.activityLine}>
              - {item.title} ({item.reportDate})
            </Text>
          ))
        ) : (
          <Text style={wrStyles.activityLine}>- No daily report submitted yet</Text>
        )}
      </View>

      <Pressable style={wrStyles.backBtn} onPress={onBackToDashboard}>
        <Text style={wrStyles.backBtnText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  </View>
  );
}

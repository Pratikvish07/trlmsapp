import React from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, flowStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

export default function ShgTrackingView() {
  const {
    selectedMemberName,
    selectedShgName,
    handleShgTrackingGeoCheck,
    isDistanceLoading,
    handleShgTrackingImageUpload,
    handleShgTrackingVideoUpload,
    uploadedImageName,
    uploadedVideoName,
    locationPromptRequired,
    distanceToMember,
    trackingRemarks,
    setTrackingRemarks,
    geoStatusVariant,
    trackingSubmitting,
    handleSaveTrackedStatus,
    onOpenUpdateData,
    currentStatusView,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={flowStyles.trackingShell}>
        <View style={flowStyles.trackingHero}>
          <View style={flowStyles.trackingTitleWrap}>
            <Text style={flowStyles.trackingHeroTitle}>SHG Tracking</Text>
          </View>
          <Text style={flowStyles.trackingEyebrow}>Field Verification</Text>
          <Text style={flowStyles.trackingHeroHint}>
            Validate geolocation, capture evidence, and submit the tracking update for this SHG member.
          </Text>
        </View>

        <View style={flowStyles.trackingMemberCard}>
          <View style={flowStyles.trackingMemberRow}>
            <Text style={flowStyles.trackingMemberLabel}>SHG Member</Text>
            <Text style={flowStyles.trackingMemberValue}>{selectedMemberName}</Text>
          </View>
          <View style={flowStyles.trackingMemberRow}>
            <Text style={flowStyles.trackingMemberLabel}>SHG Name</Text>
            <Text style={flowStyles.trackingMemberValue}>{selectedShgName}</Text>
          </View>
        </View>

        <View style={flowStyles.trackingStatusCard}>
          <Text style={flowStyles.trackingTitle}>SHG Tracking Under CRP</Text>
          <Text style={flowStyles.trackingHint}>
            Enable location, click or upload live image, upload video, add remarks, then save.
            Attendance counts only when assigned SHG geolocation matches.
          </Text>
          <View style={flowStyles.trackingActionRow}>
            <Pressable style={flowStyles.secondaryTrackBtn} onPress={handleShgTrackingGeoCheck}>
              <Text style={flowStyles.secondaryTrackBtnText}>
                {isDistanceLoading ? "Checking..." : "Enable / Match Geo"}
              </Text>
            </Pressable>
            <Pressable style={flowStyles.secondaryTrackBtn} onPress={() => handleShgTrackingImageUpload("library")}>
              <Text style={flowStyles.secondaryTrackBtnText}>Click / Upload Image</Text>
            </Pressable>
            <Pressable style={flowStyles.secondaryTrackBtn} onPress={handleShgTrackingVideoUpload}>
              <Text style={flowStyles.secondaryTrackBtnText}>Upload Video</Text>
            </Pressable>
          </View>

          <View style={flowStyles.trackingStatusGrid}>
            <View style={flowStyles.trackingStatusPill}>
              <Text style={flowStyles.trackingStatusLabel}>Image</Text>
              <Text style={flowStyles.trackingStatusValue}>{uploadedImageName || "Pending"}</Text>
            </View>
            <View style={flowStyles.trackingStatusPill}>
              <Text style={flowStyles.trackingStatusLabel}>Video</Text>
              <Text style={flowStyles.trackingStatusValue}>{uploadedVideoName || "Pending"}</Text>
            </View>
            <View style={flowStyles.trackingStatusPill}>
              <Text style={flowStyles.trackingStatusLabel}>Geo Status</Text>
              <Text style={flowStyles.trackingStatusValue}>
                {locationPromptRequired ? "Location off" : distanceToMember === null ? "Not checked" : `${distanceToMember}m matched`}
              </Text>
            </View>
          </View>

          <TextInput
            style={flowStyles.remarksInput}
            value={trackingRemarks}
            onChangeText={setTrackingRemarks}
            placeholder="Add remarks"
            multiline
          />
        </View>

        <View style={flowStyles.trackingFooterCard}>
          <View style={flowStyles.trackingSaveRow}>
            <View
              style={[
                flowStyles.geoDot,
                geoStatusVariant === "green"
                  ? flowStyles.geoDotGreen
                  : geoStatusVariant === "red"
                    ? flowStyles.geoDotRed
                    : flowStyles.geoDotIdle
              ]}
            />
            <Pressable
              style={[
                flowStyles.primarySaveBtn,
                trackingSubmitting && flowStyles.lockedButton
              ]}
              disabled={trackingSubmitting}
              onPress={() => handleSaveTrackedStatus("technicalSupport")}
            >
              <Text style={flowStyles.primarySaveText}>
                {trackingSubmitting ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>

          <Pressable style={flowStyles.statusBackBtn} onPress={() => onOpenUpdateData(currentStatusView)}>
            <Text style={flowStyles.statusBackBtnText}>Back</Text>
          </Pressable>
        </View>
        {renderResponsePopup()}
      </View>
    </View>
  );
}

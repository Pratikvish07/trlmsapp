import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/dashboard/TranslatedInputs";
import { pageStyles, tsCardStyles } from "@/styles/dashboardHomeStyles";
import { colors } from "@/styles/theme";
import { useDashboardContext } from "../DashboardContext";

const SEGMENT_ICONS = {
  "Past Supports": "time-outline",
  "Present Support": "hourglass-outline",
  "Support Required": "alert-circle-outline"
};

const SEGMENTS = ["Past Supports", "Present Support", "Support Required"];

export default function TechnicalSupportView() {
  const {
    selectedMemberName,
    selectedShgName,
    geoStatusVariant,
    checkRadiusDistance,
    isDistanceLoading,
    handleOpenTechnicalSupportModule,
    supportStage,
    handleOpenSupportHistory,
    supportHistoryLoading,
    showResponsePopup,
    showSavedDataPopup,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={tsCardStyles.frame}>
        <View style={tsCardStyles.heroCard}>
          <View style={tsCardStyles.titleWrap}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
            <Text style={tsCardStyles.title}>Support Status</Text>
          </View>
          <View style={tsCardStyles.sectionTypeRow}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.primary} />
            <Text style={tsCardStyles.sectionType}>Geo Locked Access</Text>
          </View>
          <Text style={tsCardStyles.sectionHint}>
            Enable geolocation first. Only when the token turns green can you open support modules.
          </Text>
        </View>

        <View style={tsCardStyles.memberCard}>
          <View style={tsCardStyles.memberRow}>
            <View style={tsCardStyles.memberLabelRow}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
              <Text style={tsCardStyles.memberLabel}>SHG Member</Text>
            </View>
            <Text style={tsCardStyles.memberValue}>{selectedMemberName}</Text>
          </View>
          <View style={tsCardStyles.memberRow}>
            <View style={tsCardStyles.memberLabelRow}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={tsCardStyles.memberLabel}>SHG Name</Text>
            </View>
            <Text style={tsCardStyles.memberValue}>{selectedShgName}</Text>
          </View>
        </View>

        <View
          style={[
            tsCardStyles.geoCard,
            geoStatusVariant === "green"
              ? tsCardStyles.geoCardGreen
              : geoStatusVariant === "red"
                ? tsCardStyles.geoCardRed
                : null
          ]}
        >
          <View style={tsCardStyles.geoHeaderRow}>
            <View
              style={[
                tsCardStyles.geoDot,
                geoStatusVariant === "green"
                  ? tsCardStyles.geoDotGreen
                  : geoStatusVariant === "red"
                    ? tsCardStyles.geoDotRed
                    : tsCardStyles.geoDotIdle
              ]}
            >
              <Ionicons
                name={
                  geoStatusVariant === "green"
                    ? "checkmark"
                    : geoStatusVariant === "red"
                      ? "close"
                      : "location-outline"
                }
                size={14}
                color={colors.textOnPrimary}
              />
            </View>
            <View style={tsCardStyles.geoCopy}>
              <Text style={tsCardStyles.geoTitle}>Geo Access Token</Text>
              <Text style={tsCardStyles.geoHint}>
                {geoStatusVariant === "green"
                  ? "Verified. You can proceed to support modules."
                  : geoStatusVariant === "red"
                    ? "Location mismatch. Verify again near the assigned SHG."
                    : "Verification pending. Enable location to continue."}
              </Text>
            </View>
          </View>

          <Pressable style={tsCardStyles.geoActionBtn} onPress={() => checkRadiusDistance(false)}>
            <Ionicons name="navigate-outline" size={16} color={colors.textOnPrimary} />
            <Text style={tsCardStyles.geoActionBtnText}>
              {isDistanceLoading ? "Checking Geo..." : "Enable / Match Geo"}
            </Text>
          </Pressable>
        </View>

        <View style={tsCardStyles.moduleCard}>
          <Pressable
            style={[
              tsCardStyles.mainButton,
              geoStatusVariant !== "green" && tsCardStyles.lockedButton
            ]}
            onPress={() => handleOpenTechnicalSupportModule("technicalSupportTech")}
          >
            <Ionicons name="construct-outline" size={22} color={colors.textOnPrimary} />
            <Text style={tsCardStyles.mainButtonText}>Technical Support{"\n"}Details</Text>
          </Pressable>
          <Pressable
            style={[
              tsCardStyles.mainButton,
              tsCardStyles.mainButtonTeal,
              geoStatusVariant !== "green" && tsCardStyles.lockedButton
            ]}
            onPress={() => handleOpenTechnicalSupportModule("technicalSupportFinancial")}
          >
            <Ionicons name="cash-outline" size={22} color={colors.textOnPrimary} />
            <Text style={tsCardStyles.mainButtonText}>Financial Support{"\n"}Details</Text>
          </Pressable>

          <View style={tsCardStyles.segmentRow}>
            {SEGMENTS.map((item) => {
              const active = supportStage === item;
              return (
                <Pressable
                  key={item}
                  style={[
                    tsCardStyles.segmentBtn,
                    active ? tsCardStyles.segmentBtnActive : tsCardStyles.segmentBtnInactive,
                    geoStatusVariant !== "green" && tsCardStyles.lockedButton
                  ]}
                  onPress={() => handleOpenSupportHistory(item)}
                  disabled={supportHistoryLoading}
                >
                  <Ionicons
                    name={SEGMENT_ICONS[item]}
                    size={18}
                    color={active ? colors.textOnPrimary : colors.primary}
                  />
                  <Text
                    style={[
                      tsCardStyles.segmentBtnText,
                      active ? tsCardStyles.segmentBtnTextActive : tsCardStyles.segmentBtnTextInactive
                    ]}
                  >
                    {item === "Past Supports"
                      ? "Past\nSupports"
                      : item === "Present Support"
                        ? "Present\nSupport"
                        : "Support\nRequired"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={tsCardStyles.footerCard}>
          <Pressable
            style={tsCardStyles.saveBtn}
            onPress={() => {
              if (geoStatusVariant !== "green") {
                showResponsePopup(
                  "Geo Verification Required",
                  "Get the green geo token before proceeding from this screen."
                );
                return;
              }
              showSavedDataPopup(
                "Technical support status",
                {
                  shgMember: selectedMemberName,
                  shgName: selectedShgName,
                  geoToken: geoStatusVariant,
                  supportStage
                },
                "shgMember"
              );
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.textOnPrimary} />
            <Text style={tsCardStyles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
        {renderResponsePopup()}
      </View>
    </View>
  );
}

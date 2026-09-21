import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/dashboard/TranslatedInputs";
import { pageStyles, tsCardStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

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
            <Text style={tsCardStyles.title}>Support Status</Text>
          </View>
          <Text style={tsCardStyles.sectionType}>Geo Locked Access</Text>
          <Text style={tsCardStyles.sectionHint}>
            Enable geolocation first. Only when the token turns green can you open support modules.
          </Text>
        </View>

        <View style={tsCardStyles.memberCard}>
          <View style={tsCardStyles.memberRow}>
            <Text style={tsCardStyles.memberLabel}>SHG Member</Text>
            <Text style={tsCardStyles.memberValue}>{selectedMemberName}</Text>
          </View>
          <View style={tsCardStyles.memberRow}>
            <Text style={tsCardStyles.memberLabel}>SHG Name</Text>
            <Text style={tsCardStyles.memberValue}>{selectedShgName}</Text>
          </View>
        </View>

        <View style={tsCardStyles.geoCard}>
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
            />
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
            <Text style={tsCardStyles.mainButtonText}>Technical Support{"\n"}Details</Text>
          </Pressable>
          <Pressable
            style={[
              tsCardStyles.mainButton,
              geoStatusVariant !== "green" && tsCardStyles.lockedButton
            ]}
            onPress={() => handleOpenTechnicalSupportModule("technicalSupportFinancial")}
          >
            <Text style={tsCardStyles.mainButtonText}>Financial Support{"\n"}Details</Text>
          </Pressable>

          <View style={tsCardStyles.segmentRow}>
            {SEGMENTS.map((item) => (
              <Pressable
                key={item}
                style={[
                  tsCardStyles.segmentBtn,
                  supportStage === item && tsCardStyles.segmentBtnActive,
                  geoStatusVariant !== "green" && tsCardStyles.lockedButton
                ]}
                onPress={() => handleOpenSupportHistory(item)}
                disabled={supportHistoryLoading}
              >
                <Text style={tsCardStyles.segmentBtnText}>
                  {item === "Past Supports"
                    ? "Past\nSupports"
                    : item === "Present Support"
                      ? "Present\nSupport"
                      : "Support\nRequired"}
                </Text>
              </Pressable>
            ))}
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
            <Text style={tsCardStyles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
        {renderResponsePopup()}
      </View>
    </View>
  );
}

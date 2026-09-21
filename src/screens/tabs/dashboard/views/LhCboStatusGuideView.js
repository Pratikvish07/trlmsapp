import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, lhGuideStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const RULE_TEXT_BY_TYPE = {
  "Producer Group (PG)":
    "- If Producers Group Activity is selected, further details will be shown on Page 1B.8A",
  "Non-Farm Collective (NFC)":
    "- If Non-Farm Collective Activity is selected, further details will be shown on Page 1B.8B",
  "Integrated Farming Cluster (IFC)":
    "- If Integrated Farming Cluster Activity is selected, further details will be shown on Page 1B.8C",
  "Custom Hiring Center (CHC)":
    "- If Custom Hiring Center Activity is selected, further details will be shown on Page 1B.8D",
  "Farmer Producer Company (FPC)":
    "- If Farmer Producer Company Activity is selected, further details will be shown on Page 1B.8E"
};

export default function LhCboStatusGuideView() {
  const {
    lhCboType,
    selectedLhCboName,
    user,
    displayedLhCboActivity,
    isChcEnterprisesMode,
    geoStatusVariant,
    handleLhCboGuideSaveAndNext,
    onOpenUpdateData
  } = useDashboardContext();

  const selectedRuleText = RULE_TEXT_BY_TYPE[lhCboType] || RULE_TEXT_BY_TYPE["Producer Group (PG)"];

  return (
    <View style={pageStyles.screen}>
      <View style={[pageStyles.frame, lhGuideStyles.frame]}>
        <View style={lhGuideStyles.headerCard}>
          <Text style={lhGuideStyles.headerLine}>LH CBO Name: {selectedLhCboName}</Text>
          <Text style={lhGuideStyles.headerLine}>GP/VC Name: {user.gpVcName || "-"}</Text>
        </View>

        <View style={lhGuideStyles.formCard}>
          <View style={lhGuideStyles.dropdownRow}>
            <Text style={lhGuideStyles.dropdownLabel}>Livelihood Activity:</Text>
            <View style={lhGuideStyles.dropdownValueBox}>
              <Text style={lhGuideStyles.dropdownValue}>{displayedLhCboActivity}</Text>
              {isChcEnterprisesMode ? null : (
                <Text style={lhGuideStyles.dropdownArrow}>v</Text>
              )}
            </View>
          </View>
          <View style={lhGuideStyles.dropdownRow}>
            <Text style={lhGuideStyles.dropdownLabel}>Category:</Text>
            <View style={lhGuideStyles.dropdownValueBox}>
              <Text style={lhGuideStyles.dropdownValue}>{lhCboType}</Text>
              <Text style={lhGuideStyles.dropdownArrow}>v</Text>
            </View>
          </View>

          <View style={lhGuideStyles.rulesCard}>
            <Text style={[lhGuideStyles.ruleLine, lhGuideStyles.ruleLineActive]}>
              {selectedRuleText}
            </Text>
          </View>

            <View style={lhGuideStyles.footerRow}>
              <View
                style={[
                  lhGuideStyles.geoDot,
                  geoStatusVariant === "green"
                    ? lhGuideStyles.geoDotGreen
                    : geoStatusVariant === "red"
                      ? lhGuideStyles.geoDotRed
                      : lhGuideStyles.geoDotIdle
                ]}
              />
              <Pressable style={lhGuideStyles.saveBtn} onPress={handleLhCboGuideSaveAndNext}>
                <Text style={lhGuideStyles.saveBtnText}>Save & Next</Text>
              </Pressable>
          </View>
        </View>

        <Pressable style={lhGuideStyles.backBtn} onPress={() => onOpenUpdateData("lhCboActivity")}>
          <Text style={lhGuideStyles.backBtnText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

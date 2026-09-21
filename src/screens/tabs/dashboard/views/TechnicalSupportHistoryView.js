import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, flowStyles, fsStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const STAGE_KEY_BY_LABEL = {
  "Past Supports": "PastSupport",
  "Present Support": "PresentSupport",
  "Support Required": "SupportRequired"
};

function formatSupportDate(value) {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : "-";
}

export default function TechnicalSupportHistoryView() {
  const {
    supportStage,
    supportHistory,
    memberActivityRecords,
    selectedMemberName,
    onOpenUpdateData,
    renderResponsePopup
  } = useDashboardContext();

  const stageKey = STAGE_KEY_BY_LABEL[supportStage] || "PastSupport";
  const stageData = supportHistory?.[stageKey] || {};
  const financialEntries = Array.isArray(stageData.Financial) ? stageData.Financial : [];
  const technicalEntries = Array.isArray(stageData.Technical) ? stageData.Technical : [];

  const resolveActivityName = (activityId) =>
    memberActivityRecords.find((item) => String(item.id) === String(activityId))?.name ||
    `Activity #${activityId}`;

  return (
    <View style={pageStyles.screen}>
      <View style={flowStyles.investmentShell}>
        <View style={flowStyles.investmentHero}>
          <View style={flowStyles.investmentTitleWrap}>
            <Text style={flowStyles.investmentTitle}>{supportStage || "Support History"}</Text>
          </View>
          <Text style={flowStyles.investmentEyebrow}>Technical Support</Text>
          <Text style={flowStyles.investmentHint}>
            Live records from the server for {selectedMemberName}.
          </Text>
        </View>

        <View style={fsStyles.card}>
          <Text style={fsStyles.fieldLabel}>Financial Support</Text>
          {financialEntries.length === 0 ? (
            <Text style={fsStyles.fieldLabel}>No records yet.</Text>
          ) : (
            financialEntries.map((entry, index) => (
              <View key={entry.FinancialSupportId ?? index} style={fsStyles.fieldBlock}>
                <Text style={fsStyles.fieldLabel}>{resolveActivityName(entry.ActivityId)}</Text>
                <Text>
                  Support Required: {entry.IsFinancialSupportRequired ? "Yes" : "No"}
                  {"\n"}
                  Loan Cycle: {entry.LoanCycleName || entry.LoanCycleId || "-"}
                  {"\n"}
                  Saved On: {formatSupportDate(entry.CreatedDate)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={fsStyles.card}>
          <Text style={fsStyles.fieldLabel}>Technical Support</Text>
          {technicalEntries.length === 0 ? (
            <Text style={fsStyles.fieldLabel}>No records yet.</Text>
          ) : (
            technicalEntries.map((entry, index) => (
              <View key={entry.TechnicalSupportId ?? index} style={fsStyles.fieldBlock}>
                <Text style={fsStyles.fieldLabel}>{resolveActivityName(entry.ActivityId)}</Text>
                <Text>Saved On: {formatSupportDate(entry.CreatedDate)}</Text>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={fsStyles.saveActionBtn}
          onPress={() => onOpenUpdateData("technicalSupport")}
        >
          <Text style={fsStyles.saveActionBtnText}>Back</Text>
        </Pressable>
      </View>
      {renderResponsePopup()}
    </View>
  );
}

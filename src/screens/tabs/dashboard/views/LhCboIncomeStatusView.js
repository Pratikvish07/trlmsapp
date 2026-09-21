import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, tsDetailStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const INCOME_TITLE_BY_TYPE = {
  pg: "Income Status - Producer Group",
  nfc: "Income Status - Non-Farm Collective",
  ifc: "Income Status - Integrated Farming Cluster",
  fpc: "Income Status - Farmer Producer Company"
};
const INCOME_FIELDS = [
  ["totalIncomeSinceLastYear", "Total Income Since last year"],
  ["totalIncomeUpToLastMonth", "Total Income incurred up to last Month"],
  ["totalRecurringExpenditureLastMonth", "Total Recurring expenditure on last month"],
  ["netProfitUpToLastMonth", "Net Profit incurred up to last month"]
];

export default function LhCboIncomeStatusView() {
  const {
    selectedLhCboTypeKey,
    lhCboIncomeForms,
    setLhCboIncomeForms,
    showSavedDataPopup,
    selectedLhCboStatusView,
    renderResponsePopup
  } = useDashboardContext();

  const activeIncomeForm = lhCboIncomeForms[selectedLhCboTypeKey] || lhCboIncomeForms.pg;

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, tsDetailStyles.frame]}>
          <View style={tsDetailStyles.heroCard}>
            <View style={tsDetailStyles.titleWrap}>
              <Text style={tsDetailStyles.title}>Income Status</Text>
            </View>
            <Text style={tsDetailStyles.sectionType}>{INCOME_TITLE_BY_TYPE[selectedLhCboTypeKey] || INCOME_TITLE_BY_TYPE.pg}</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Save the latest income and expenditure numbers for the selected livelihood CBO.
            </Text>
          </View>
          <View style={tsDetailStyles.sectionCard}>
            {INCOME_FIELDS.map(([key, label]) => (
              <View key={key} style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>{label}</Text>
                <TextInput
                  style={tsDetailStyles.selectInput}
                  value={activeIncomeForm[key]}
                  onChangeText={(text) =>
                    setLhCboIncomeForms((prev) => ({
                      ...prev,
                      [selectedLhCboTypeKey]: {
                        ...prev[selectedLhCboTypeKey],
                        [key]: text.replace(/[^\d.]/g, "")
                      }
                    }))
                  }
                  keyboardType="numeric"
                  placeholder={label}
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}
            <Pressable
              style={tsDetailStyles.modalPrimaryBtnWide}
              onPress={() =>
                showSavedDataPopup("Income Status", activeIncomeForm, selectedLhCboStatusView)
              }
            >
              <Text style={tsDetailStyles.modalPrimaryBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

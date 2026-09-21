import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, tsDetailStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const FINANCIAL_META_BY_TYPE = {
  pg: {
    title: "Financial Status",
    subtitle: "Producer Group",
    fields: [
      ["totalWorkingCapitalReceived", "Total Working Capital Received"],
      ["totalInfrastructureFundReceived", "Total Infrastructure Fund Received"],
      ["totalFundReceivedFromOtherSource", "Total Fund received from Other Source"],
      ["otherSourceDetails", "Other Source Details"],
      ["totalRepaymentDone", "Total Repayment done as on reporting Month"],
      ["balanceFundToBeRepaid", "Balance Fund to be repaid"]
    ]
  },
  nfc: {
    title: "Financial Status",
    subtitle: "Non-Farm Collective",
    fields: [
      ["totalWorkingCapitalApproved", "Total Working Capital Approved"],
      ["totalWorkingCapitalUsed", "Total Working Capital Used"],
      ["totalRepaymentDone", "Total Repayment done as on reporting Month"],
      ["balanceFundToBeRepaid", "Balance Fund to be repaid"]
    ]
  },
  ifc: {
    title: "Financial Status",
    subtitle: "Integrated Farming Cluster",
    fields: [
      ["totalWorkingCapitalApproved", "Total Working Capital Approved"],
      ["totalWorkingCapitalUsed", "Total Working Capital Used"],
      ["totalShareMoneyUsed", "Total Share Money Used"],
      ["balanceFund", "Balance Fund"]
    ]
  },
  fpc: {
    title: "Loan Status",
    subtitle: "Farmer Producer Company",
    fields: [
      ["totalWorkingCapitalApproved", "Total Working Capital Approved"],
      ["totalWorkingCapitalUsed", "Total Working Capital Used"],
      ["totalShareMoneyUsed", "Total Share Money Used"],
      ["balanceFund", "Balance Fund"]
    ]
  }
};

export default function LhCboFinancialStatusView() {
  const {
    selectedLhCboTypeKey,
    lhCboFinancialForms,
    setLhCboFinancialForms,
    showSavedDataPopup,
    selectedLhCboStatusView,
    renderResponsePopup
  } = useDashboardContext();

  const financialMeta = FINANCIAL_META_BY_TYPE[selectedLhCboTypeKey] || FINANCIAL_META_BY_TYPE.pg;
  const activeFinancialForm = lhCboFinancialForms[selectedLhCboTypeKey] || lhCboFinancialForms.pg;

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, tsDetailStyles.frame]}>
          <View style={tsDetailStyles.heroCard}>
            <View style={tsDetailStyles.titleWrap}>
              <Text style={tsDetailStyles.title}>{financialMeta.title}</Text>
            </View>
            <Text style={tsDetailStyles.sectionType}>{financialMeta.subtitle}</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Enter the financial values and save to review them in the response popup.
            </Text>
          </View>
          <View style={tsDetailStyles.sectionCard}>
            {financialMeta.fields.map(([key, label]) => (
              <View key={key} style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>{label}</Text>
                <TextInput
                  style={tsDetailStyles.selectInput}
                  value={activeFinancialForm[key]}
                  onChangeText={(text) =>
                    setLhCboFinancialForms((prev) => ({
                      ...prev,
                      [selectedLhCboTypeKey]: {
                        ...prev[selectedLhCboTypeKey],
                        [key]: key.toLowerCase().includes("detail") ? text : text.replace(/[^\d.]/g, "")
                      }
                    }))
                  }
                  keyboardType={key.toLowerCase().includes("detail") ? "default" : "numeric"}
                  placeholder={label}
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}
            <Pressable
              style={tsDetailStyles.modalPrimaryBtnWide}
              onPress={() =>
                showSavedDataPopup(`${financialMeta.subtitle} ${financialMeta.title}`, activeFinancialForm, selectedLhCboStatusView)
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

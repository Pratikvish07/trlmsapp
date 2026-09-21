import React from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, flowStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const NUMERIC_FIELDS = [
  { key: "totalInvestment", label: "Total Investment" },
  { key: "loanFromShg", label: "Loan from SHG" },
  { key: "loanFromBank", label: "Loan from Bank" },
  { key: "individualFinancing", label: "Individual Financing" },
  { key: "ownContribution", label: "Own Contribution" },
  { key: "csr", label: "CSR" },
  { key: "governmentGrant", label: "Government Grant" },
  { key: "otherSource", label: "Other Source" }
];

export default function LhInvestmentView() {
  const {
    investmentProfile,
    setInvestmentProfile,
    handleSaveInvestmentProfile,
    apiSavingKey,
    onOpenUpdateData,
    currentStatusView,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={flowStyles.investmentShell}>
        <View style={flowStyles.investmentHero}>
          <View style={flowStyles.investmentTitleWrap}>
            <Text style={flowStyles.investmentTitle}>Investment Profile</Text>
          </View>
          <Text style={flowStyles.investmentEyebrow}>Livelihood Finance</Text>
          <Text style={flowStyles.investmentHint}>
            Capture the current investment details for this livelihood activity.
          </Text>
        </View>

        <View style={flowStyles.investmentCard}>
          {NUMERIC_FIELDS.map((item) => (
          <View style={flowStyles.investmentFieldRow} key={item.key}>
            <Text style={flowStyles.investmentFieldLabel}>{item.label}</Text>
            <TextInput
              style={flowStyles.investmentInput}
              value={investmentProfile[item.key]}
              onChangeText={(text) =>
                setInvestmentProfile((prev) => ({
                  ...prev,
                  [item.key]: text.replace(/[^\d.]/g, "")
                }))
              }
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#64748b"
            />
          </View>
        ))}

          <View style={flowStyles.investmentActionRow}>
            <Pressable
              style={flowStyles.investmentSaveBtn}
              onPress={handleSaveInvestmentProfile}
              disabled={apiSavingKey === "investmentProfile"}
            >
              <Text style={flowStyles.investmentSaveBtnText}>
                {apiSavingKey === "investmentProfile" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
            <Pressable
              style={flowStyles.investmentBackBtn}
              onPress={() => onOpenUpdateData(currentStatusView)}
            >
              <Text style={flowStyles.investmentBackBtnText}>Back to Status</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {renderResponsePopup()}
    </View>
  );
}

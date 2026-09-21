import React from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import { pageStyles, flowStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const MONTH_ROWS = ["month1", "month2", "month3", "month4", "month5", "month6"];
const INCOME_FIELDS = [
  { key: "totalIncomeLastYear", label: "Total Income Since last year" },
  { key: "presentMonthIncome", label: "Present Month Income" },
  { key: "futureProjection", label: "Future Projection (Next Six Month)" }
];

export default function LhIncomeView() {
  const {
    incomeProfile,
    setIncomeProfile,
    handleSaveIncomeProfile,
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
            <Text style={flowStyles.investmentTitle}>Income Profile</Text>
          </View>
          <Text style={flowStyles.investmentEyebrow}>Income Tracking</Text>
          <Text style={flowStyles.investmentHint}>
            Capture the latest and projected income details for this activity.
          </Text>
        </View>

        <View style={flowStyles.investmentCard}>
          {INCOME_FIELDS.map((item) => (
            <View style={flowStyles.investmentFieldRow} key={item.key}>
              <Text style={flowStyles.investmentFieldLabel}>{item.label}</Text>
              <TextInput
                style={flowStyles.investmentInput}
                value={incomeProfile[item.key]}
                onChangeText={(text) =>
                  setIncomeProfile((prev) => ({
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

          {MONTH_ROWS.map((monthKey, index) => (
            <View style={flowStyles.investmentFieldRow} key={monthKey}>
              <Text style={flowStyles.investmentFieldLabel}>Month {index + 1} Actual Income</Text>
              <TextInput
                style={flowStyles.investmentInput}
                value={incomeProfile[monthKey]}
                onChangeText={(text) =>
                  setIncomeProfile((prev) => ({
                    ...prev,
                    [monthKey]: text.replace(/[^\d.]/g, "")
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
              onPress={handleSaveIncomeProfile}
              disabled={apiSavingKey === "incomeProfile"}
            >
              <Text style={flowStyles.investmentSaveBtnText}>
                {apiSavingKey === "incomeProfile" ? "Saving..." : "Save"}
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

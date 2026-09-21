import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../../../components/dashboard/TranslatedInputs";
import EditableSelect from "../../../../components/dashboard/EditableSelect";
import { pageStyles, flowStyles, fsStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const LOAN_CYCLE_OPTIONS = ["Cycle 1", "Cycle 2", "Cycle 3"];

export default function TechnicalSupportFinancialView() {
  const {
    memberActivityOptions,
    financialSupportForm,
    setFinancialSupportForm,
    showResponsePopup,
    buildFinancialSupportProjection,
    handleSaveFinancialSupport,
    apiSavingKey,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={flowStyles.investmentShell}>
        <View style={flowStyles.investmentHero}>
          <View style={flowStyles.investmentTitleWrap}>
            <Text style={flowStyles.investmentTitle}>Financial Support</Text>
          </View>
          <Text style={flowStyles.investmentEyebrow}>Loan Assessment</Text>
          <Text style={flowStyles.investmentHint}>
            Select the support requirement and preferred cycle to view the loan projection.
          </Text>
        </View>

        <View style={fsStyles.card}>
          <View style={fsStyles.fieldBlock}>
            <Text style={fsStyles.fieldLabel}>Activity of the Member</Text>
            <EditableSelect
              value={financialSupportForm.activityOfMember}
              options={memberActivityOptions}
              onChange={(value) =>
                setFinancialSupportForm((prev) => ({ ...prev, activityOfMember: value }))
              }
              placeholder="Select or type activity"
              inputStyle={fsStyles.cardInput}
            />
          </View>

          <View style={fsStyles.fieldBlock}>
            <Text style={fsStyles.fieldLabel}>Financial Support Required</Text>
            <View style={fsStyles.togglePillRow}>
              <Pressable
                style={[
                  fsStyles.togglePill,
                  financialSupportForm.financialSupportRequired && fsStyles.togglePillActive
                ]}
                onPress={() =>
                  setFinancialSupportForm((prev) => ({
                    ...prev,
                    financialSupportRequired: true
                  }))
                }
              >
                <Text
                  style={[
                    fsStyles.togglePillText,
                    financialSupportForm.financialSupportRequired && fsStyles.togglePillTextActive
                  ]}
                >
                  Yes
                </Text>
              </Pressable>
              <Pressable
                style={[
                  fsStyles.togglePill,
                  !financialSupportForm.financialSupportRequired && fsStyles.togglePillActive
                ]}
                onPress={() =>
                  setFinancialSupportForm((prev) => ({
                    ...prev,
                    financialSupportRequired: false
                  }))
                }
              >
                <Text
                  style={[
                    fsStyles.togglePillText,
                    !financialSupportForm.financialSupportRequired && fsStyles.togglePillTextActive
                  ]}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={fsStyles.fieldBlock}>
            <Text style={fsStyles.fieldLabel}>Loan Cycle of Support Preferred</Text>
            <EditableSelect
              value={financialSupportForm.loanCyclePreferred}
              options={LOAN_CYCLE_OPTIONS}
              onChange={(value) =>
                setFinancialSupportForm((prev) => ({ ...prev, loanCyclePreferred: value }))
              }
              placeholder="Select or type cycle"
              inputStyle={fsStyles.cardInput}
            />
          </View>

          <View style={fsStyles.actionRow}>
            <Pressable
              style={[
                fsStyles.popupActionBtn,
                !financialSupportForm.financialSupportRequired && fsStyles.popupActionBtnDisabled
              ]}
              onPress={() => {
                if (!financialSupportForm.financialSupportRequired) {
                  return;
                }
                if (!financialSupportForm.activityOfMember || !financialSupportForm.loanCyclePreferred) {
                  showResponsePopup(
                    "Incomplete Details",
                    "Select activity and loan cycle before viewing the loan projection."
                  );
                  return;
                }
                showResponsePopup("Loan Projection", buildFinancialSupportProjection());
              }}
            >
              <Text style={fsStyles.popupActionBtnText}>Loan Projection</Text>
            </Pressable>
            <Pressable
              style={fsStyles.saveActionBtn}
              onPress={handleSaveFinancialSupport}
              disabled={apiSavingKey === "financialSupport"}
            >
              <Text style={fsStyles.saveActionBtnText}>
                {apiSavingKey === "financialSupport" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      {renderResponsePopup()}
    </View>
  );
}

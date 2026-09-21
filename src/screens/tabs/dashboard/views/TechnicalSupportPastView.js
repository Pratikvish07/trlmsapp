import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import EditableSelect from "@/components/dashboard/EditableSelect";
import { pageStyles, flowStyles, pastStyles } from "@/styles/dashboardHomeStyles";
import { SUPPORT_SOURCE_OPTIONS } from "@/constants/livelihoodOptions";
import { useDashboardContext } from "../DashboardContext";

const RATE_OPTIONS = ["8", "10", "12", "14"];
const STATUS_OPTIONS = ["Pending", "Completed"];

export default function TechnicalSupportPastView() {
  const {
    memberActivityOptions,
    pastSupportForm,
    setPastSupportForm,
    onOpenUpdateData,
    showSavedDataPopup,
    renderResponsePopup
  } = useDashboardContext();

  const topBalance = Math.max(
    (Number(pastSupportForm.topAmount) || 0) - (Number(pastSupportForm.repaymentCompleted) || 0),
    0
  );

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={flowStyles.investmentShell}>
          <View style={flowStyles.investmentHero}>
            <View style={flowStyles.investmentTitleWrap}>
              <Text style={flowStyles.investmentTitle}>Past Support</Text>
            </View>
            <Text style={flowStyles.investmentEyebrow}>Loan History</Text>
            <Text style={flowStyles.investmentHint}>
              Review earlier financial support details and repayment status for this member.
            </Text>
          </View>

          <View style={pastStyles.sectionCard}>
            <Text style={pastStyles.sectionTitle}>Previous Support Snapshot</Text>

            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Financial Support Taken on LH Activity</Text>
              <EditableSelect
                value={pastSupportForm.topActivity}
                options={memberActivityOptions}
                onChange={(value) => setPastSupportForm((prev) => ({ ...prev, topActivity: value }))}
                placeholder="Select or type activity"
                inputStyle={pastStyles.cardInput}
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Amount of Loan Taken</Text>
              <TextInput
                style={pastStyles.cardInput}
                value={pastSupportForm.topAmount}
                onChangeText={(text) =>
                  setPastSupportForm((prev) => ({ ...prev, topAmount: text.replace(/[^\d.]/g, "") }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>SHG Loan taken through</Text>
              <EditableSelect
                value={pastSupportForm.topLoanThrough}
                options={SUPPORT_SOURCE_OPTIONS}
                onChange={(value) =>
                  setPastSupportForm((prev) => ({ ...prev, topLoanThrough: value }))
                }
                placeholder="Select or type source"
                inputStyle={pastStyles.cardInput}
              />
            </View>
          </View>

          <View style={pastStyles.sectionCard}>
            <Text style={pastStyles.sectionTitle}>Repayment & Transaction Status</Text>

            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Financial Support Taken on LH Activity</Text>
              <EditableSelect
                value={pastSupportForm.bottomActivity}
                options={memberActivityOptions}
                onChange={(value) =>
                  setPastSupportForm((prev) => ({ ...prev, bottomActivity: value }))
                }
                placeholder="Select or type activity"
                inputStyle={pastStyles.cardInput}
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Amount of Loan Taken</Text>
              <TextInput
                style={pastStyles.cardInput}
                value={pastSupportForm.bottomAmount}
                onChangeText={(text) =>
                  setPastSupportForm((prev) => ({ ...prev, bottomAmount: text.replace(/[^\d.]/g, "") }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>SHG Loan taken through</Text>
              <EditableSelect
                value={pastSupportForm.bottomLoanThrough}
                options={SUPPORT_SOURCE_OPTIONS}
                onChange={(value) =>
                  setPastSupportForm((prev) => ({ ...prev, bottomLoanThrough: value }))
                }
                placeholder="Select or type source"
                inputStyle={pastStyles.cardInput}
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Rate of Interest</Text>
              <EditableSelect
                value={pastSupportForm.interestRate}
                options={RATE_OPTIONS}
                onChange={(value) => setPastSupportForm((prev) => ({ ...prev, interestRate: value }))}
                placeholder="Select or type rate"
                inputStyle={pastStyles.cardInput}
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Repayment Completed</Text>
              <TextInput
                style={pastStyles.cardInput}
                value={pastSupportForm.repaymentCompleted}
                onChangeText={(text) =>
                  setPastSupportForm((prev) => ({
                    ...prev,
                    repaymentCompleted: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Balance Amount</Text>
              <TextInput style={pastStyles.cardInputReadOnly} value={`${topBalance}`} editable={false} />
            </View>
            <View style={pastStyles.fieldBlock}>
              <Text style={pastStyles.fieldLabel}>Transaction Status</Text>
              <EditableSelect
                value={pastSupportForm.transactionStatus}
                options={STATUS_OPTIONS}
                onChange={(value) =>
                  setPastSupportForm((prev) => ({ ...prev, transactionStatus: value }))
                }
                placeholder="Select or type status"
                inputStyle={pastStyles.cardInput}
              />
            </View>

            <View style={pastStyles.actionRow}>
              <Pressable
                style={pastStyles.linkBtn}
                onPress={() => onOpenUpdateData("technicalSupportTransaction")}
              >
                <Text style={pastStyles.linkBtnText}>Transaction Details</Text>
              </Pressable>
              <Pressable
                style={pastStyles.saveBtn}
                onPress={() => {
                  showSavedDataPopup("Past support details", pastSupportForm, "technicalSupport");
                }}
              >
                <Text style={pastStyles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

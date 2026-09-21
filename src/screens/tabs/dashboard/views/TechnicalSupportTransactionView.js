import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import EditableSelect from "../../../../components/dashboard/EditableSelect";
import { pageStyles, flowStyles, txnStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const PAYMENT_BY_OPTIONS = ["SHG", "VO", "CLF", "Bank"];

export default function TechnicalSupportTransactionView() {
  const {
    pastSupportForm,
    transactionDetailsForm,
    setTransactionDetailsForm,
    handleUploadPaymentSlip,
    showSavedDataPopup,
    onOpenUpdateData,
    renderResponsePopup
  } = useDashboardContext();

  const principalDue = Number(pastSupportForm.bottomAmount) || 0;
  const interestDue = Number(((principalDue * (Number(pastSupportForm.interestRate) || 0)) / 100).toFixed(2));
  const totalDue = Number((principalDue + interestDue).toFixed(2));
  const monthName = new Date().toLocaleString("en-US", { month: "short" });
  const outstandingAmount = Math.max(
    totalDue - ((Number(transactionDetailsForm.principalPaid) || 0) + (Number(transactionDetailsForm.interestPaid) || 0)),
    0
  ).toFixed(2);

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={flowStyles.investmentShell}>
          <View style={flowStyles.investmentHero}>
            <View style={flowStyles.investmentTitleWrap}>
              <Text style={flowStyles.investmentTitle}>Transaction Details</Text>
            </View>
            <Text style={flowStyles.investmentEyebrow}>Repayment Record</Text>
            <Text style={flowStyles.investmentHint}>
              Capture monthly repayment, upload the payment slip, and review the outstanding amount.
            </Text>
          </View>

          <View style={txnStyles.sectionCard}>
            <Text style={txnStyles.sectionTitle}>Payment Entry</Text>

            <View style={txnStyles.fieldBlock}>
              <Text style={txnStyles.fieldLabel}>Present Month Loan Repayment Status</Text>
              <TextInput
                style={txnStyles.cardInput}
                value={transactionDetailsForm.presentMonthLoanRepaymentStatus}
                onChangeText={(text) =>
                  setTransactionDetailsForm((prev) => ({
                    ...prev,
                    presentMonthLoanRepaymentStatus: text
                  }))
                }
                placeholder="Auto (Present Month)"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={txnStyles.fieldBlock}>
              <Text style={txnStyles.fieldLabel}>Payment Details of Loan Taken By</Text>
              <EditableSelect
                value={transactionDetailsForm.paymentDetailsBy}
                options={PAYMENT_BY_OPTIONS}
                onChange={(value) =>
                  setTransactionDetailsForm((prev) => ({ ...prev, paymentDetailsBy: value }))
                }
                placeholder="Select or type payment source"
                inputStyle={txnStyles.cardInput}
              />
            </View>

            <View style={txnStyles.fieldBlock}>
              <Text style={txnStyles.fieldLabel}>Upload Payment Slip (PDF / Image)</Text>
              <View style={txnStyles.uploadRow}>
                <Pressable style={txnStyles.uploadBtn} onPress={handleUploadPaymentSlip}>
                  <Text style={txnStyles.uploadBtnText}>Upload Slip</Text>
                </Pressable>
                <View style={txnStyles.uploadMetaCard}>
                  <Text style={txnStyles.uploadMetaLabel}>
                    {transactionDetailsForm.paymentSlipType || "Pending"}
                  </Text>
                  <Text style={txnStyles.uploadMetaValue}>
                    {transactionDetailsForm.paymentSlipName || "No file selected"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={txnStyles.metricsGrid}>
              <View style={txnStyles.metricCard}>
                <Text style={txnStyles.metricLabel}>Principal Due</Text>
                <Text style={txnStyles.metricValue}>{principalDue}</Text>
              </View>
              <View style={txnStyles.metricCard}>
                <Text style={txnStyles.metricLabel}>Interest Due</Text>
                <Text style={txnStyles.metricValue}>{interestDue}</Text>
              </View>
              <View style={txnStyles.metricCard}>
                <Text style={txnStyles.metricLabel}>Total Due</Text>
                <Text style={txnStyles.metricValue}>{totalDue}</Text>
              </View>
            </View>

            <View style={txnStyles.fieldBlock}>
              <Text style={txnStyles.fieldLabel}>Principal (Amount Paid)</Text>
              <TextInput
                style={txnStyles.cardInput}
                value={transactionDetailsForm.principalPaid}
                onChangeText={(text) =>
                  setTransactionDetailsForm((prev) => ({
                    ...prev,
                    principalPaid: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={txnStyles.fieldBlock}>
              <Text style={txnStyles.fieldLabel}>Interest (Amount Paid)</Text>
              <TextInput
                style={txnStyles.cardInput}
                value={transactionDetailsForm.interestPaid}
                onChangeText={(text) =>
                  setTransactionDetailsForm((prev) => ({
                    ...prev,
                    interestPaid: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={txnStyles.fieldBlock}>
              <Text style={txnStyles.fieldLabel}>Total (Amount Paid)</Text>
              <TextInput
                style={txnStyles.cardInput}
                value={transactionDetailsForm.totalPaid}
                onChangeText={(text) =>
                  setTransactionDetailsForm((prev) => ({
                    ...prev,
                    totalPaid: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={txnStyles.sectionCard}>
            <Text style={txnStyles.sectionTitle}>Month-wise Repayment Status</Text>
            <View style={txnStyles.summaryCard}>
              <View style={txnStyles.summaryRow}>
                <Text style={txnStyles.summaryLabel}>Month</Text>
                <Text style={txnStyles.summaryValue}>{monthName}</Text>
              </View>
              <View style={txnStyles.summaryRow}>
                <Text style={txnStyles.summaryLabel}>Principal to be Paid</Text>
                <Text style={txnStyles.summaryValue}>{principalDue}</Text>
              </View>
              <View style={txnStyles.summaryRow}>
                <Text style={txnStyles.summaryLabel}>Interest to be Paid</Text>
                <Text style={txnStyles.summaryValue}>{interestDue}</Text>
              </View>
              <View style={txnStyles.summaryRow}>
                <Text style={txnStyles.summaryLabel}>Principal Paid</Text>
                <Text style={txnStyles.summaryValue}>{transactionDetailsForm.principalPaid || "0"}</Text>
              </View>
              <View style={txnStyles.summaryRow}>
                <Text style={txnStyles.summaryLabel}>Interest Paid</Text>
                <Text style={txnStyles.summaryValue}>{transactionDetailsForm.interestPaid || "0"}</Text>
              </View>
              <View style={txnStyles.summaryRow}>
                <Text style={txnStyles.summaryLabel}>Outstanding</Text>
                <Text style={txnStyles.summaryValue}>{outstandingAmount}</Text>
              </View>
            </View>

            <View style={txnStyles.actionRow}>
              <Pressable
                style={txnStyles.saveBtn}
                onPress={() => {
                  showSavedDataPopup("Transaction details", transactionDetailsForm, "technicalSupportPast");
                }}
              >
                <Text style={txnStyles.saveBtnText}>Save</Text>
              </Pressable>
              <Pressable
                style={txnStyles.backBtn}
                onPress={() => onOpenUpdateData("technicalSupportPast")}
              >
                <Text style={txnStyles.backBtnText}>Back</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

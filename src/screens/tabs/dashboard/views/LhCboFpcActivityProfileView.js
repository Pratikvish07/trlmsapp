import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import EditableSelect from "@/components/dashboard/EditableSelect";
import { pageStyles, tsDetailStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const YES_NO_OPTIONS = ["Yes", "No"];

// SRS (Page 1B.8D, Farmer Producer Company) describes 5 broad functional
// areas rather than a ready field list - these sections translate each
// area's sub-items into the same field-per-row pattern the other CBO
// activity profiles use, grouped under section headers the same way
// NFC's Activity Profile groups its "Legal Compliances" fields.
const SECTIONS = [
  {
    title: "1. Member Management",
    fields: [
      ["membersOnboarded", "Members Onboarded (KYC, land, crop profiles)", "number"],
      ["shareCapitalCollected", "Share Capital Contribution Collected", "amount"],
      ["boardMeetingHeld", "Board / AGM Meeting Held", "yesno"],
      ["lastMeetingDate", "Last Meeting Date (DD-MM-YYYY)", "text"]
    ]
  },
  {
    title: "2. Financial & Accounting",
    fields: [
      ["bookkeepingMaintained", "Digital Bookkeeping Maintained", "yesno"],
      ["passbookUpdated", "Member Passbook Updated", "yesno"],
      ["loanApplicationsProcessed", "Loan Applications Processed", "number"],
      ["gstComplianceFiled", "GST / Statutory Compliance Filed", "yesno"]
    ]
  },
  {
    title: "3. Input Supply Chain",
    fields: [
      ["demandIndentCollected", "Member Demand / Indent Collected", "yesno"],
      ["bulkProcurementDone", "Bulk Procurement Order Placed", "yesno"],
      ["inputsDistributedToMembers", "Inputs Distributed to Members", "yesno"]
    ]
  },
  {
    title: "4. Production Support",
    fields: [
      ["advisoryProvided", "Crop/Weather Advisory Provided", "yesno"],
      ["trainingConducted", "Capacity Building Training Conducted", "yesno"],
      ["machineryBookingUsage", "Farm Machinery (CHC) Booking/Usage", "yesno"]
    ]
  },
  {
    title: "5. Aggregation & Marketing",
    fields: [
      ["produceAggregatedQty", "Produce Aggregated (Quantity)", "number"],
      ["qualityGradingDone", "Quality Grading Completed", "yesno"],
      ["warehouseStockManaged", "Warehouse Stock Managed", "yesno"],
      ["salesInvoiced", "Buyer Sales Invoiced", "yesno"]
    ]
  }
];

export default function LhCboFpcActivityProfileView() {
  const {
    fpcActivityProfileForm,
    setFpcActivityProfileForm,
    apiSavingKey,
    saveActivityProfile,
    selectedLhCboStatusView,
    renderResponsePopup
  } = useDashboardContext();

  const renderField = ([key, label, type]) => {
    if (type === "yesno") {
      return (
        <View key={key} style={tsDetailStyles.fieldBlock}>
          <Text style={tsDetailStyles.label}>{label}</Text>
          <EditableSelect
            value={fpcActivityProfileForm[key]}
            options={YES_NO_OPTIONS}
            onChange={(value) =>
              setFpcActivityProfileForm((prev) => ({ ...prev, [key]: value }))
            }
            placeholder="Select Yes / No"
          />
        </View>
      );
    }

    return (
      <View key={key} style={tsDetailStyles.fieldBlock}>
        <Text style={tsDetailStyles.label}>{label}</Text>
        <TextInput
          style={tsDetailStyles.selectInput}
          value={fpcActivityProfileForm[key]}
          onChangeText={(text) =>
            setFpcActivityProfileForm((prev) => ({
              ...prev,
              [key]: type === "number" ? text.replace(/[^\d.]/g, "") : text
            }))
          }
          keyboardType={type === "number" ? "numeric" : "default"}
          placeholder={type === "number" ? "0" : label}
          placeholderTextColor="#64748b"
        />
      </View>
    );
  };

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, tsDetailStyles.frame]}>
          <View style={tsDetailStyles.heroCard}>
            <View style={tsDetailStyles.titleWrap}>
              <Text style={tsDetailStyles.title}>Activity Profile</Text>
            </View>
            <Text style={tsDetailStyles.sectionType}>Farmer Producer Company</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Capture membership, accounting, supply chain, production support, and marketing activity.
            </Text>
          </View>

          {SECTIONS.map((section) => (
            <View key={section.title} style={tsDetailStyles.sectionCard}>
              <Text style={tsDetailStyles.sectionTitle}>{section.title}</Text>
              {section.fields.map(renderField)}
            </View>
          ))}

          <Pressable
            style={tsDetailStyles.modalPrimaryBtnWide}
            disabled={Boolean(apiSavingKey)}
            onPress={() =>
              saveActivityProfile(
                "Farmer Producer Company Activity Profile",
                fpcActivityProfileForm,
                selectedLhCboStatusView,
                {
                  profileType: "Farmer Producer Company Activity Profile",
                  saveKey: "fpcActivityProfile"
                }
              )
            }
          >
            <Text style={tsDetailStyles.modalPrimaryBtnText}>
              {apiSavingKey === "fpcActivityProfile" ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

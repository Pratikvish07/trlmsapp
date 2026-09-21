import React from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import { pageStyles, lhcboStatusStyles, tsDetailStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const TITLE_META_MAP = {
  lhCboStatusPg: { page: "Page:1B.8A", red: "Producer Group", tail: " Activity Status" },
  lhCboStatusNfc: { page: "", red: "", tail: "" },
  lhCboStatusIfc: {
    page: "Page:1B.8C",
    red: "Integrated Farming Cluster",
    tail: " Activity Status"
  },
  lhCboStatusChc: {
    page: "Page:1B.8D",
    red: "Custom Hiring Center",
    tail: " Activity Status"
  },
  lhCboStatusFpc: {
    page: "Page:1B.8E",
    red: "Farmer Producer Company",
    tail: " Activity Status"
  }
};
const HEADER_NAME_MAP = {
  lhCboStatusPg: "PG Name",
  lhCboStatusNfc: "NFC Name",
  lhCboStatusIfc: "IFC Name",
  lhCboStatusChc: "CHC Name",
  lhCboStatusFpc: "FPC Name"
};
const BUTTON_LABEL_MAP = {
  lhCboStatusPg: ["Activity Profile", "Financial Status", "Income\nStatus"],
  lhCboStatusNfc: ["Activity Profile", "Financial Status", "Income\nStatus"],
  lhCboStatusIfc: ["Activity Profile", "Financial Status", "Income\nStatus"],
  lhCboStatusFpc: ["Activity Profile", "Financial Status", "Income\nStatus"]
};
const ACTIVITY_ROUTE_MAP = {
  lhCboStatusPg: "lhCboPgActivityProfile",
  lhCboStatusNfc: "lhCboNfcActivityProfile",
  lhCboStatusIfc: "",
  lhCboStatusFpc: ""
};
const CHC_FIELDS = [
  ["districtName", "Name of the District"],
  ["blockName", "Name of the Block"],
  ["gpVcName", "Name of the GP/VC"],
  ["villageOrganizationName", "Name of the Village Organization"],
  ["chcName", "Name of the CHC"],
  ["establishedDate", "Date of CHC established"],
  ["establishedThroughConvergence", "CHC establishment through convergence (Y/N)"],
  ["departmentAndScheme", "If Yes, Name of Department and Scheme"],
  ["separateBankAccount", "Having Separate Bank Account (Y/N)"],
  ["bankAccountNumber", "CHC Bank Account Number"],
  ["bankName", "Name of the Bank"],
  ["bankBranchName", "Name of the Bank Branch"],
  ["amountFromTrlm", "Amount received from TRLM"],
  ["amountFromDepartment", "Amount received from line Department"],
  ["availableMachineries", "Available machineries"],
  ["chcManagerDeployed", "CHC Manager deployed (Y/N)"],
  ["chcManagerName", "Name of the CHC Manager"],
  ["chcManagerContact", "Contact No of the CHC Manager"],
  ["totalIncomeSinceInception", "Total Income (since inception)"],
  ["totalExpenditureSinceInception", "Total Expenditure (since inception)"],
  ["netProfitOrLoss", "Net Profit / Loss"],
  ["cashInHand", "Cash in Hand"],
  ["cashAtBank", "Cash at Bank"]
];

export default function LhCboStatusView() {
  const {
    homeView,
    selectedLhCboName,
    user,
    chcDetailForm,
    setChcDetailForm,
    showResponsePopup,
    onOpenUpdateData,
    geoStatusVariant,
    apiSavingKey,
    saveActivityProfile,
    showSavedDataPopup,
    displayedLhCboActivity,
    lhCboType,
    renderResponsePopup
  } = useDashboardContext();

  const isChcView = homeView === "lhCboStatusChc";

  return (
    <View style={pageStyles.screen}>
      <View style={[pageStyles.frame, lhcboStatusStyles.frame]}>
        {homeView !== "lhCboStatusPg" && homeView !== "lhCboStatusNfc" ? (
          <Text style={lhcboStatusStyles.titleText}>
            <Text style={lhcboStatusStyles.titlePage}>{TITLE_META_MAP[homeView].page} </Text>
            <Text style={lhcboStatusStyles.titleRed}>{TITLE_META_MAP[homeView].red}</Text>
            <Text style={lhcboStatusStyles.titlePage}>{TITLE_META_MAP[homeView].tail}</Text>
          </Text>
        ) : null}
        <View style={lhcboStatusStyles.headerCard}>
          <Text style={lhcboStatusStyles.headerLine}>
            {HEADER_NAME_MAP[homeView]}: {selectedLhCboName}
          </Text>
          <Text style={lhcboStatusStyles.headerLine}>GP/VC Name: {user.gpVcName || "-"}</Text>
        </View>

        <View style={lhcboStatusStyles.contentCard}>
          {isChcView ? (
            <View style={lhcboStatusStyles.chcDetailsWrap}>
              <View style={tsDetailStyles.sectionCard}>
                <Text style={tsDetailStyles.sectionTitle}>Custom Hiring Center Details</Text>
                {CHC_FIELDS.map(([key, label]) => (
                  <View key={key} style={tsDetailStyles.fieldBlock}>
                    <Text style={tsDetailStyles.label}>{label}</Text>
                    <TextInput
                      style={tsDetailStyles.selectInput}
                      value={chcDetailForm[key]}
                      onChangeText={(text) =>
                        setChcDetailForm((prev) => ({
                          ...prev,
                          [key]: text
                        }))
                      }
                      placeholder={label}
                      placeholderTextColor="#64748b"
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={lhcboStatusStyles.buttonStack}>
              <Pressable
                style={lhcboStatusStyles.blockBtn}
                onPress={() => {
                  if (!ACTIVITY_ROUTE_MAP[homeView]) {
                    showResponsePopup(
                      "Activity Profile",
                      "This type does not have a separate activity-profile page in the current flow."
                    );
                    return;
                  }
                  onOpenUpdateData(ACTIVITY_ROUTE_MAP[homeView]);
                }}
              >
                <Text style={lhcboStatusStyles.blockBtnText}>{BUTTON_LABEL_MAP[homeView][0]}</Text>
              </Pressable>
              <Pressable
                style={lhcboStatusStyles.blockBtn}
                onPress={() => onOpenUpdateData("lhCboFinancialStatus")}
              >
                <Text style={lhcboStatusStyles.blockBtnText}>{BUTTON_LABEL_MAP[homeView][1]}</Text>
              </Pressable>
              <Pressable
                style={lhcboStatusStyles.blockBtn}
                onPress={() => onOpenUpdateData("lhCboIncomeStatus")}
              >
                <Text style={lhcboStatusStyles.blockBtnText}>{BUTTON_LABEL_MAP[homeView][2]}</Text>
              </Pressable>
            </View>
          )}

          <View style={lhcboStatusStyles.footerRow}>
            <View
              style={[
                lhcboStatusStyles.geoDot,
                geoStatusVariant === "green"
                  ? lhcboStatusStyles.geoDotGreen
                  : geoStatusVariant === "red"
                    ? lhcboStatusStyles.geoDotRed
                    : lhcboStatusStyles.geoDotIdle
              ]}
            />
            <Pressable
              style={lhcboStatusStyles.saveBtn}
              disabled={Boolean(apiSavingKey)}
              onPress={() => {
                if (isChcView) {
                  saveActivityProfile(
                    "Custom Hiring Center Activity Profile",
                    chcDetailForm,
                    "technicalSupportTech",
                    {
                      profileType: "Custom Hiring Center Activity Profile",
                      saveKey: "chcActivityProfile"
                    }
                  );
                  return;
                }

                showSavedDataPopup(
                  `${TITLE_META_MAP[homeView].red} status`,
                  {
                    name: selectedLhCboName,
                    gpVcName: user.gpVcName || "-",
                    activity: displayedLhCboActivity,
                    category: lhCboType,
                    geoStatus: geoStatusVariant
                  },
                  "technicalSupportTech"
                );
              }}
            >
              <Text style={lhcboStatusStyles.saveBtnText}>
                {apiSavingKey === "chcActivityProfile" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
        {renderResponsePopup()}
      </View>
    </View>
  );
}

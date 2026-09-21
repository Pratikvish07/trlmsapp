import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/dashboard/TranslatedInputs";
import EditableSelect from "@/components/dashboard/EditableSelect";
import { pageStyles, tsDetailStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const YES_NO_OPTIONS = ["Yes", "No"];
const PG_FIELDS = [
  ["trainingGovernance", "Training received on PG Governance & Management"],
  ["trainingBooks", "Training received on PG books on records"],
  ["businessPlanPrepared", "Whether a Business Plan has been prepared"],
  ["businessPlanSubmitted", "Whether Business Plan has been submitted for financial support from NRLM"],
  ["fundReceivedFromNrlm", "Whether any fund has been received from NRLM"],
  ["booksMaintained", "Whether PG maintaining books of records"],
  ["dailyBusinessRegister", "Whether PG maintaining Daily Business Register"],
  ["memberLedger", "Whether PG maintaining Member Ledger"],
  ["memberPassbook", "Whether PG maintaining Member Passbook"],
  ["assetRegister", "Whether PG maintaining Asset Register"]
];

export default function LhCboPgActivityProfileView() {
  const {
    activityOptions,
    pgActivityProfileForm,
    setPgActivityProfileForm,
    apiSavingKey,
    saveActivityProfile,
    selectedLhCboStatusView,
    renderResponsePopup
  } = useDashboardContext();

  const commodityOptions = activityOptions.map((item) => item.name).filter(Boolean);

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, tsDetailStyles.frame]}>
          <View style={tsDetailStyles.heroCard}>
            <View style={tsDetailStyles.titleWrap}>
              <Text style={tsDetailStyles.title}>Activity Profile</Text>
            </View>
            <Text style={tsDetailStyles.sectionType}>Producer Group</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Capture the producer group activity profile and governance readiness details.
            </Text>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Primary Commodity of the PG</Text>
              <EditableSelect
                value={pgActivityProfileForm.primaryCommodity}
                options={commodityOptions}
                onChange={(value) =>
                  setPgActivityProfileForm((prev) => ({ ...prev, primaryCommodity: value }))
                }
                placeholder="Select or type commodity"
              />
            </View>

            {PG_FIELDS.map(([key, label]) => (
              <View key={key} style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>{label}</Text>
                <EditableSelect
                  value={pgActivityProfileForm[key]}
                  options={YES_NO_OPTIONS}
                  onChange={(value) =>
                    setPgActivityProfileForm((prev) => ({ ...prev, [key]: value }))
                  }
                  placeholder="Select Yes / No"
                />
              </View>
            ))}

            <Pressable
              style={tsDetailStyles.modalPrimaryBtnWide}
              disabled={Boolean(apiSavingKey)}
              onPress={() =>
                saveActivityProfile(
                  "Producer Group Activity Profile",
                  pgActivityProfileForm,
                  selectedLhCboStatusView,
                  {
                    profileType: "Producer Group Activity Profile",
                    saveKey: "pgActivityProfile"
                  }
                )
              }
            >
              <Text style={tsDetailStyles.modalPrimaryBtnText}>
                {apiSavingKey === "pgActivityProfile" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

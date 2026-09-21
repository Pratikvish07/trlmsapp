import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import EditableSelect from "@/components/dashboard/EditableSelect";
import { pageStyles, tsDetailStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const YES_NO_OPTIONS = ["Yes", "No"];
const VOLUME_UNIT_OPTIONS = ["KG", "Unit", "Litre", "Piece"];
const YES_NO_FIELDS = [
  ["machineryProcured", "Machinery Procured"],
  ["signboardMounted", "Signboard Mounted on Enterprise"],
  ["marketLinked", "Market Linked"],
  ["productionShed", "Production Shed"],
  ["homeBasedProduction", "Home-based Production"]
];
const TEXT_FIELDS = [
  ["gst", "GST"],
  ["gstRenewalDate", "GST Renewal Date"],
  ["pan", "PAN"],
  ["panRenewalDate", "PAN Renewal Date"],
  ["tradeLicense", "Trade License"],
  ["tradeRenewalDate", "Trade Renewal Date"],
  ["fssai", "FSSAI"],
  ["fssaiRenewDate", "FSSAI Renewal Date"]
];

export default function LhCboNfcActivityProfileView() {
  const {
    nonFarmSetupCategoryOptions,
    nfcActivityProfileForm,
    setNfcActivityProfileForm,
    apiSavingKey,
    saveActivityProfile,
    selectedLhCboStatusView,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, tsDetailStyles.frame]}>
          <View style={tsDetailStyles.heroCard}>
            <View style={tsDetailStyles.titleWrap}>
              <Text style={tsDetailStyles.title}>Activity Profile</Text>
            </View>
            <Text style={tsDetailStyles.sectionType}>Non-Farm Collective</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Record product details, compliances, and monthly production information.
            </Text>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Product / Activity Details</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={nfcActivityProfileForm.productActivityDetails}
                onChangeText={(text) =>
                  setNfcActivityProfileForm((prev) => ({ ...prev, productActivityDetails: text }))
                }
                placeholder="Enter product or activity details"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Set-up Category</Text>
              <EditableSelect
                value={nfcActivityProfileForm.setUpCategory}
                options={nonFarmSetupCategoryOptions}
                onChange={(value) =>
                  setNfcActivityProfileForm((prev) => ({ ...prev, setUpCategory: value }))
                }
                placeholder="Select category"
              />
            </View>
            {YES_NO_FIELDS.map(([key, label]) => (
              <View key={key} style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>{label}</Text>
                <EditableSelect
                  value={nfcActivityProfileForm[key]}
                  options={YES_NO_OPTIONS}
                  onChange={(value) =>
                    setNfcActivityProfileForm((prev) => ({ ...prev, [key]: value }))
                  }
                  placeholder="Select Yes / No"
                />
              </View>
            ))}
            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Total Employment associated</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={nfcActivityProfileForm.totalEmploymentAssociated}
                onChangeText={(text) =>
                  setNfcActivityProfileForm((prev) => ({
                    ...prev,
                    totalEmploymentAssociated: text.replace(/[^\d]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Enter number"
                placeholderTextColor="#64748b"
              />
            </View>
            {TEXT_FIELDS.map(([key, label]) => (
              <View key={key} style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>{label}</Text>
                <TextInput
                  style={tsDetailStyles.selectInput}
                  value={nfcActivityProfileForm[key]}
                  onChangeText={(text) =>
                    setNfcActivityProfileForm((prev) => ({ ...prev, [key]: text }))
                  }
                  placeholder={label}
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}
            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Monthly Production Volume</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={nfcActivityProfileForm.monthlyProductionVolume}
                onChangeText={(text) =>
                  setNfcActivityProfileForm((prev) => ({
                    ...prev,
                    monthlyProductionVolume: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#64748b"
              />
            </View>
            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Volume Unit</Text>
              <EditableSelect
                value={nfcActivityProfileForm.volumeUnit}
                options={VOLUME_UNIT_OPTIONS}
                onChange={(value) =>
                  setNfcActivityProfileForm((prev) => ({ ...prev, volumeUnit: value }))
                }
                placeholder="Select unit"
              />
            </View>

            <Pressable
              style={tsDetailStyles.modalPrimaryBtnWide}
              disabled={Boolean(apiSavingKey)}
              onPress={() =>
                saveActivityProfile(
                  "Non-Farm Collective Activity Profile",
                  nfcActivityProfileForm,
                  selectedLhCboStatusView,
                  {
                    profileType: "Non-Farm Collective Activity Profile",
                    saveKey: "nfcActivityProfile"
                  }
                )
              }
            >
              <Text style={tsDetailStyles.modalPrimaryBtnText}>
                {apiSavingKey === "nfcActivityProfile" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

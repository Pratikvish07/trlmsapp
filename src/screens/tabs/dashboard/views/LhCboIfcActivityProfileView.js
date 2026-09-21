import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import EditableSelect from "@/components/dashboard/EditableSelect";
import { pageStyles, tsDetailStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const YES_NO_OPTIONS = ["Yes", "No"];
const AEP_OPTIONS = ["SRI", "NPM", "CMSA", "Other"];

// SRS (Page 1B.8C) describes IFC's Activity Profile as two narrative
// process areas - Profiling & Planning, and component-wise Livelihood
// Tracking (Crops/Livestock/Water/NTFP) - rather than a ready field list
// like PG/NFC have. These fields translate that into the same
// field-per-row pattern the other CBO activity profiles use.
const TEXT_FIELDS = [
  ["householdsProfiled", "Households Profiled (Baseline Survey, target 250-300)"],
  ["plannedLivelihoodActivities", "Planned Livelihood Activities per Household (3-4)"],
  ["clusterVillagesCovered", "Cluster Villages Covered (2-3 villages)"],
  ["livestockStockTracked", "Livestock Stock Numbers Tracked"]
];
const YES_NO_FIELDS = [
  ["vaccinationHealthEventsRecorded", "Vaccination / Health Events Recorded"],
  ["waterHarvestingMicroIrrigation", "Water Harvesting / Micro-irrigation Adopted"],
  ["ntfpCollectionTracked", "NTFP Collection / Processing Tracked"]
];

export default function LhCboIfcActivityProfileView() {
  const {
    ifcActivityProfileForm,
    setIfcActivityProfileForm,
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
            <Text style={tsDetailStyles.sectionType}>Integrated Farming Cluster</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Capture household profiling and component-wise livelihood tracking for the cluster.
            </Text>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <Text style={tsDetailStyles.sectionTitle}>Profiling & Planning</Text>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>{TEXT_FIELDS[0][1]}</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={ifcActivityProfileForm.householdsProfiled}
                onChangeText={(text) =>
                  setIfcActivityProfileForm((prev) => ({
                    ...prev,
                    householdsProfiled: text.replace(/[^\d]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Number of households"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>{TEXT_FIELDS[1][1]}</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={ifcActivityProfileForm.plannedLivelihoodActivities}
                onChangeText={(text) =>
                  setIfcActivityProfileForm((prev) => ({ ...prev, plannedLivelihoodActivities: text }))
                }
                placeholder="e.g. Vegetable cultivation, Goat rearing, Apiculture"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>{TEXT_FIELDS[2][1]}</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={ifcActivityProfileForm.clusterVillagesCovered}
                onChangeText={(text) =>
                  setIfcActivityProfileForm((prev) => ({ ...prev, clusterVillagesCovered: text }))
                }
                placeholder="Village names"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <Text style={tsDetailStyles.sectionTitle}>Livelihood Tracking (Component-wise)</Text>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Agro-Ecological Practices Adopted</Text>
              <EditableSelect
                value={ifcActivityProfileForm.agroEcologicalPractices}
                options={AEP_OPTIONS}
                onChange={(value) =>
                  setIfcActivityProfileForm((prev) => ({ ...prev, agroEcologicalPractices: value }))
                }
                placeholder="Select or type practice"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>{TEXT_FIELDS[3][1]}</Text>
              <TextInput
                style={tsDetailStyles.selectInput}
                value={ifcActivityProfileForm.livestockStockTracked}
                onChangeText={(text) =>
                  setIfcActivityProfileForm((prev) => ({
                    ...prev,
                    livestockStockTracked: text.replace(/[^\d]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Number of livestock"
                placeholderTextColor="#64748b"
              />
            </View>

            {YES_NO_FIELDS.map(([key, label]) => (
              <View key={key} style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>{label}</Text>
                <EditableSelect
                  value={ifcActivityProfileForm[key]}
                  options={YES_NO_OPTIONS}
                  onChange={(value) =>
                    setIfcActivityProfileForm((prev) => ({ ...prev, [key]: value }))
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
                  "Integrated Farming Cluster Activity Profile",
                  ifcActivityProfileForm,
                  selectedLhCboStatusView,
                  {
                    profileType: "Integrated Farming Cluster Activity Profile",
                    saveKey: "ifcActivityProfile"
                  }
                )
              }
            >
              <Text style={tsDetailStyles.modalPrimaryBtnText}>
                {apiSavingKey === "ifcActivityProfile" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

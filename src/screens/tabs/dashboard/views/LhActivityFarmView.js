import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import CycleDropdown from "../../../../components/dashboard/CycleDropdown";
import { pageStyles, apStyles, wrStyles } from "../../../../styles/dashboardHomeStyles";
import { FARM_PRODUCTION_UNIT_OPTIONS, FARM_TYPE_OPTIONS } from "../../../../constants/livelihoodOptions";
import { useDashboardContext } from "../DashboardContext";

export default function LhActivityFarmView() {
  const {
    activityTypes,
    unitOfAreaOptions,
    seasonOptions,
    landTypeOptions,
    subCategories,
    activityType,
    activityProfile,
    setActivityProfile,
    handleSaveFarmLivestockFisheryProfile,
    apiSavingKey,
    showAppAlert,
    onOpenUpdateData,
    currentStatusView,
    renderResponsePopup
  } = useDashboardContext();

  const activityNameOptions = activityTypes.map((item) => item.name).filter(Boolean);
  const unitAreaOptions = unitOfAreaOptions;
  const typeOptions = FARM_TYPE_OPTIONS;
  const farmSeasonOptions = seasonOptions;
  const landOptions = landTypeOptions;
  const productionOptions = subCategories.map((item) => item.name).filter(Boolean);
  const productionUnitOptions = FARM_PRODUCTION_UNIT_OPTIONS;

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, apStyles.frame]}>
          <View style={apStyles.heroCard}>
            <View style={apStyles.titleWrap}>
              <Text style={apStyles.title}>Activity Profile</Text>
            </View>
            <Text style={apStyles.sectionType}>{activityType || "Farm"}</Text>
            <Text style={apStyles.sectionHint}>
              Fill the selected farm-based activity details below.
            </Text>
          </View>

          <View style={apStyles.sectionCard}>
            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Name of the Activity</Text>
              <CycleDropdown
                value={activityProfile.activityName}
                options={activityNameOptions}
                style={apStyles.dropdown}
                onChange={(value) =>
                  setActivityProfile((prev) => ({ ...prev, activityName: value }))
                }
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Quantum of Area</Text>
              <TextInput
                style={apStyles.input}
                value={activityProfile.areaQuantity}
                onChangeText={(text) =>
                  setActivityProfile((prev) => ({
                    ...prev,
                    areaQuantity: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Enter number"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Unit of Area</Text>
              <CycleDropdown
                value={activityProfile.areaUnit}
                options={unitAreaOptions}
                style={apStyles.dropdown}
                onChange={(value) => setActivityProfile((prev) => ({ ...prev, areaUnit: value }))}
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Type of Activity</Text>
              <CycleDropdown
                value={activityProfile.activityMode}
                options={typeOptions}
                style={apStyles.dropdown}
                onChange={(value) =>
                  setActivityProfile((prev) => ({ ...prev, activityMode: value }))
                }
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>If Seasonal</Text>
              <CycleDropdown
                value={activityProfile.seasonality}
                options={farmSeasonOptions}
                style={apStyles.dropdown}
                onChange={(value) =>
                  setActivityProfile((prev) => ({ ...prev, seasonality: value }))
                }
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>If Perennial</Text>
              <TextInput
                style={apStyles.input}
                value={activityProfile.period}
                onChangeText={(text) =>
                  setActivityProfile((prev) => ({
                    ...prev,
                    period: text.replace(/\D/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Enter value"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Type of Land</Text>
              <CycleDropdown
                value={activityProfile.landType}
                options={landOptions}
                style={apStyles.dropdown}
                onChange={(value) => setActivityProfile((prev) => ({ ...prev, landType: value }))}
              />
            </View>
          </View>

          <View style={apStyles.actionRow}>
            <Pressable
              style={apStyles.actionBtn}
              onPress={() => {
                handleSaveFarmLivestockFisheryProfile("farm", "Activity profile", "lhStatusFarm");
              }}
              disabled={apiSavingKey === "Activity profile"}
            >
              <Text style={apStyles.actionBtnText}>
                {apiSavingKey === "Activity profile" ? "Saving..." : "Save"}
              </Text>
            </Pressable>
            <Pressable
              style={apStyles.actionBtn}
              onPress={() => showAppAlert("Edit", "Modify values and press Save to proceed.")}
            >
              <Text style={apStyles.actionBtnText}>Edit</Text>
            </Pressable>
          </View>

          <View style={apStyles.sectionCard}>
            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Name of the Production</Text>
              <CycleDropdown
                value={activityProfile.productionName}
                options={productionOptions}
              style={apStyles.dropdown}
              onChange={(value) =>
                  setActivityProfile((prev) => ({ ...prev, productionName: value }))
                }
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Production Quantity</Text>
              <TextInput
                style={apStyles.input}
                value={activityProfile.productionQty}
              onChangeText={(text) =>
                setActivityProfile((prev) => ({
                  ...prev,
                    productionQty: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="Enter number"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={apStyles.fieldBlock}>
              <Text style={apStyles.label}>Production Unit</Text>
              <CycleDropdown
                value={activityProfile.productionUnit}
                options={productionUnitOptions}
              style={apStyles.dropdown}
              onChange={(value) =>
                  setActivityProfile((prev) => ({ ...prev, productionUnit: value }))
                }
              />
            </View>
          </View>

        <Pressable style={wrStyles.backBtn} onPress={() => onOpenUpdateData(currentStatusView)}>
          <Text style={wrStyles.backBtnText}>Back to Status</Text>
        </Pressable>
      </View>
    </ScrollView>
    {renderResponsePopup()}
  </View>
  );
}

import React from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import CycleDropdown from "@/components/dashboard/CycleDropdown";
import { pageStyles, flowStyles, wrStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const WATERBODY_TYPE_OPTIONS = ["Seasonal", "Perennial", "Canal", "Pond"];
const ACTIVITY_MODE_OPTIONS = ["Rabi", "Kharif", "Summer", "Winter", "Rainy"];
const PRODUCTION_OPTIONS = ["Fish", "Seed"];
const PRODUCTION_UNIT_OPTIONS = ["KG", "Quintal"];

export default function LhActivityFisheryView() {
  const {
    fisherySubCategoryOptions,
    unitOfAreaOptions,
    activityProfile,
    setActivityProfile,
    handleSaveFarmLivestockFisheryProfile,
    apiSavingKey,
    onOpenUpdateData,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={pageStyles.frame}>
        <Text style={flowStyles.formTitle}>Activity Profile - Fishery</Text>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Name of the Activity:</Text>
          <CycleDropdown
            value={activityProfile.activityName}
            options={fisherySubCategoryOptions}
            onChange={(value) => setActivityProfile((prev) => ({ ...prev, activityName: value }))}
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Total Waterbody Area:</Text>
          <TextInput
            style={flowStyles.input}
            value={activityProfile.waterbodyArea}
            onChangeText={(text) =>
              setActivityProfile((prev) => ({
                ...prev,
                waterbodyArea: text.replace(/[^\d.]/g, "")
              }))
            }
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#64748b"
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Unit of Area:</Text>
          <CycleDropdown
            value={activityProfile.areaUnit}
            options={unitOfAreaOptions}
            onChange={(value) => setActivityProfile((prev) => ({ ...prev, areaUnit: value }))}
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Type of Activity:</Text>
          <CycleDropdown
            value={activityProfile.activityMode}
            options={ACTIVITY_MODE_OPTIONS}
            onChange={(value) =>
              setActivityProfile((prev) => ({ ...prev, activityMode: value }))
            }
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Type of Waterbody:</Text>
          <CycleDropdown
            value={activityProfile.waterbodyType}
            options={WATERBODY_TYPE_OPTIONS}
            onChange={(value) =>
              setActivityProfile((prev) => ({ ...prev, waterbodyType: value }))
            }
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Name of Production:</Text>
          <CycleDropdown
            value={activityProfile.productionName}
            options={PRODUCTION_OPTIONS}
            onChange={(value) =>
              setActivityProfile((prev) => ({ ...prev, productionName: value }))
            }
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Production Quantity:</Text>
          <TextInput
            style={flowStyles.input}
            value={activityProfile.productionQty}
            onChangeText={(text) =>
              setActivityProfile((prev) => ({
                ...prev,
                productionQty: text.replace(/[^\d.]/g, "")
              }))
            }
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#64748b"
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Production Unit:</Text>
          <CycleDropdown
            value={activityProfile.productionUnit}
            options={PRODUCTION_UNIT_OPTIONS}
            onChange={(value) =>
              setActivityProfile((prev) => ({ ...prev, productionUnit: value }))
            }
          />
        </View>
        <Pressable
          style={flowStyles.primarySaveBtn}
          onPress={() => handleSaveFarmLivestockFisheryProfile("fishery", "Fishery activity profile")}
          disabled={apiSavingKey === "Fishery activity profile"}
        >
          <Text style={flowStyles.primarySaveText}>
            {apiSavingKey === "Fishery activity profile" ? "Saving..." : "Save"}
          </Text>
        </Pressable>
        <Pressable style={wrStyles.backBtn} onPress={() => onOpenUpdateData("lhStatusFishery")}>
          <Text style={wrStyles.backBtnText}>Back to Status</Text>
        </Pressable>
      </View>
      {renderResponsePopup()}
    </View>
  );
}

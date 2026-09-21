import React from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "../../../../components/dashboard/TranslatedInputs";
import CycleDropdown from "../../../../components/dashboard/CycleDropdown";
import { pageStyles, flowStyles, wrStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const PRODUCTION_OPTIONS = ["Milk", "Egg", "Meat"];
const PRODUCTION_UNIT_OPTIONS = ["Litre", "KG", "Quintal", "Nos"];

export default function LhActivityLivestockView() {
  const {
    livestockSubCategoryOptions,
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
        <Text style={flowStyles.formTitle}>Activity Profile - Livestock</Text>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Name of the Activity:</Text>
          <CycleDropdown
            value={activityProfile.activityName}
            options={livestockSubCategoryOptions}
            onChange={(value) => setActivityProfile((prev) => ({ ...prev, activityName: value }))}
          />
        </View>
        <View style={flowStyles.formRow}>
          <Text style={flowStyles.formLabel}>Total Number of Livestock:</Text>
          <TextInput
            style={flowStyles.input}
            value={activityProfile.totalLivestock}
            onChangeText={(text) =>
              setActivityProfile((prev) => ({ ...prev, totalLivestock: text.replace(/\D/g, "") }))
            }
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#64748b"
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
          onPress={() => handleSaveFarmLivestockFisheryProfile("livestock", "Livestock activity profile")}
          disabled={apiSavingKey === "Livestock activity profile"}
        >
          <Text style={flowStyles.primarySaveText}>
            {apiSavingKey === "Livestock activity profile" ? "Saving..." : "Save"}
          </Text>
        </Pressable>
        <Pressable style={wrStyles.backBtn} onPress={() => onOpenUpdateData("lhStatusLivestock")}>
          <Text style={wrStyles.backBtnText}>Back to Status</Text>
        </Pressable>
      </View>
      {renderResponsePopup()}
    </View>
  );
}

import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/dashboard/TranslatedInputs";
import { pageStyles, flowStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const STATUS_TITLE_MAP = {
  lhStatusFarm: "SHG Member Farm-based Activity Status",
  lhStatusNonFarm: "SHG Member Non-Farm-based Activity Status",
  lhStatusLivestock: "SHG Member Livestock-based Activity Status",
  lhStatusFishery: "SHG Member Fishery-based Activity Status"
};
const STATUS_TO_SUBCATEGORY = {
  lhStatusFarm: "Farm",
  lhStatusNonFarm: "NonFarm",
  lhStatusLivestock: "Livestock",
  lhStatusFishery: "Fishery"
};

export default function LhStatusView() {
  const {
    homeView,
    selectedMemberName,
    selectedShgName,
    onOpenUpdateData,
    activityBySubCategory,
    onOpenShgMember
  } = useDashboardContext();

  const selectedSubCategory = STATUS_TO_SUBCATEGORY[homeView] || "Farm";

  return (
    <View style={pageStyles.screen}>
      <View style={pageStyles.frame}>
        <View style={flowStyles.statusHeroCard}>
          <View style={flowStyles.statusHeroAccent} />
          <View style={flowStyles.statusHeroCopy}>
            <Text style={flowStyles.statusHeroEyebrow}>Tracking Context</Text>
            <Text style={flowStyles.statusHeroTitle}>{selectedMemberName}</Text>
            <Text style={flowStyles.statusHeroSubtitle}>{selectedShgName}</Text>
          </View>
        </View>

        <View style={flowStyles.statusTitleWrap}>
          <Text style={flowStyles.statusTitle}>{STATUS_TITLE_MAP[homeView]}</Text>
          <Text style={flowStyles.statusHint}>Choose a module to continue CRP tracking.</Text>
        </View>

        <View style={flowStyles.moduleStack}>
          <Pressable
            style={flowStyles.profileButton}
            onPress={() => onOpenUpdateData(activityBySubCategory[selectedSubCategory])}
          >
            <Text style={flowStyles.profileButtonText}>Activity Profile</Text>
          </Pressable>

          <Pressable
            style={flowStyles.profileButton}
            onPress={() => onOpenUpdateData("lhInvestment")}
          >
            <Text style={flowStyles.profileButtonText}>Investment Profile</Text>
          </Pressable>

          <Pressable style={flowStyles.profileButton} onPress={() => onOpenUpdateData("lhIncome")}>
            <Text style={flowStyles.profileButtonText}>Income Profile</Text>
          </Pressable>

          <Pressable style={flowStyles.trackingEntryBtn} onPress={() => onOpenUpdateData("shgTracking")}>
            <Text style={flowStyles.trackingEntryBtnText}>Tracking</Text>
          </Pressable>
        </View>

        <View style={flowStyles.statusFooterCard}>
          <Pressable
            style={flowStyles.primarySaveBtn}
            onPress={() => onOpenUpdateData("technicalSupport")}
          >
            <Text style={flowStyles.primarySaveText}>Save</Text>
          </Pressable>
        </View>

        <Pressable style={flowStyles.statusBackBtn} onPress={onOpenShgMember}>
        <Text style={flowStyles.statusBackBtnText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  </View>
  );
}

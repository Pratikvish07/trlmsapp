import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/dashboard/TranslatedInputs";
import { pageStyles, flowStyles } from "@/styles/dashboardHomeStyles";
import { colors } from "@/styles/theme";
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
          <View style={flowStyles.statusHeroAccent}>
            <Ionicons name="person" size={20} color={colors.textOnPrimary} />
          </View>
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

        <View style={flowStyles.moduleGrid}>
          <View style={flowStyles.moduleRow}>
            <Pressable
              style={[flowStyles.moduleCard, flowStyles.moduleCardGreen]}
              onPress={() => onOpenUpdateData(activityBySubCategory[selectedSubCategory])}
            >
              <View style={[flowStyles.moduleIconWrap, flowStyles.moduleIconGreen]}>
                <Ionicons name="bar-chart-outline" size={22} color={colors.textOnPrimary} />
              </View>
              <Text style={flowStyles.moduleCardLabel}>Activity{"\n"}Profile</Text>
            </Pressable>

            <Pressable
              style={[flowStyles.moduleCard, flowStyles.moduleCardBlue]}
              onPress={() => onOpenUpdateData("lhInvestment")}
            >
              <View style={[flowStyles.moduleIconWrap, flowStyles.moduleIconBlue]}>
                <Ionicons name="wallet-outline" size={22} color={colors.textOnPrimary} />
              </View>
              <Text style={flowStyles.moduleCardLabel}>Investment{"\n"}Profile</Text>
            </Pressable>
          </View>

          <View style={flowStyles.moduleRow}>
            <Pressable
              style={[flowStyles.moduleCard, flowStyles.moduleCardOrange]}
              onPress={() => onOpenUpdateData("lhIncome")}
            >
              <View style={[flowStyles.moduleIconWrap, flowStyles.moduleIconOrange]}>
                <Ionicons name="trending-up-outline" size={22} color={colors.textOnPrimary} />
              </View>
              <Text style={flowStyles.moduleCardLabel}>Income{"\n"}Profile</Text>
            </Pressable>

            <Pressable
              style={[flowStyles.moduleCard, flowStyles.moduleCardPurple]}
              onPress={() => onOpenUpdateData("shgTracking")}
            >
              <View style={[flowStyles.moduleIconWrap, flowStyles.moduleIconPurple]}>
                <Ionicons name="navigate-outline" size={22} color={colors.textOnPrimary} />
              </View>
              <Text style={flowStyles.moduleCardLabel}>Tracking</Text>
            </Pressable>
          </View>
        </View>

        <View style={flowStyles.statusFooterCard}>
          <Pressable
            style={flowStyles.primarySaveBtn}
            onPress={() => onOpenUpdateData("technicalSupport")}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.textOnPrimary} />
            <Text style={flowStyles.primarySaveText}>Save</Text>
          </Pressable>
        </View>

        <Pressable style={flowStyles.statusBackBtn} onPress={onOpenShgMember}>
        <Ionicons name="arrow-back" size={14} color={colors.textOnPrimary} />
        <Text style={flowStyles.statusBackBtnText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  </View>
  );
}

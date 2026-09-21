import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../../../components/dashboard/TranslatedInputs";
import DropdownField from "../../../../components/dashboard/DropdownField";
import { pageStyles, neStyles, wrStyles } from "../../../../styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

export default function NewEnrolmentView() {
  const {
    renderAlertPopup,
    headerCrpId,
    headerCrpName,
    selectedCrpRecord,
    crpOptions,
    openCrpSelector,
    setOpenCrpSelector,
    setOpenGpSelector,
    setOpenVillageSelector,
    setSelectedCrpRegistrationId,
    setSelectedGpId,
    setSelectedVillageId,
    selectedGp,
    user,
    gpOptions,
    openGpSelector,
    selectedGpId,
    selectedVillage,
    villageOptions,
    openVillageSelector,
    onOpenShgMember,
    onOpenUpdateData,
    setShowDashboardAlerts,
    dashboardAlertCount,
    dashboardNotificationItems,
    activities,
    onBackToDashboard
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      {renderAlertPopup()}
      <View style={pageStyles.frame}>
      <View style={pageStyles.topRow}>
        <View style={pageStyles.imageCard}>
          <Text style={pageStyles.imageText}>CRP{"\n"}Image</Text>
        </View>
        <View style={pageStyles.infoCard}>
          <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
          <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
        </View>
      </View>


      <DropdownField
        label="CRP ID / Name:"
        value={selectedCrpRecord?.name || "Select CRP"}
        options={crpOptions}
        open={openCrpSelector}
        onToggle={() => {
          setOpenCrpSelector((prev) => !prev);
          setOpenGpSelector(false);
          setOpenVillageSelector(false);
        }}
        onSelect={(item) => {
          setSelectedCrpRegistrationId(String(item.id));
          setSelectedGpId("");
          setSelectedVillageId("");
          setOpenCrpSelector(false);
        }}
      />

      <DropdownField
        label="GP/VC Name:"
        value={selectedGp?.name || user.gpVcName || "Select GP/VC"}
        options={gpOptions}
        open={openGpSelector}
        onToggle={() => {
          setOpenGpSelector((prev) => !prev);
          setOpenVillageSelector(false);
        }}
        onSelect={(item) => {
          setSelectedGpId(item.id);
          setSelectedVillageId("");
          setOpenGpSelector(false);
        }}
      />
      <DropdownField
        label="Village Name:"
        value={selectedVillage?.name || user.villageName || "Select Village"}
        options={villageOptions}
        open={openVillageSelector}
        onToggle={() => {
          if (!selectedGpId) {
            return;
          }
          setOpenVillageSelector((prev) => !prev);
          setOpenGpSelector(false);
        }}
        onSelect={(item) => {
          setSelectedVillageId(item.id);
          setOpenVillageSelector(false);
        }}
      />

      <View style={neStyles.selectStrip}>
        <Text style={neStyles.selectText}>Select from below</Text>
      </View>

      <View style={neStyles.portionRow}>
        <Pressable style={neStyles.portionBtn} onPress={onOpenShgMember}>
          <Text style={neStyles.portionBtnText}>SHG{"\n"}Member</Text>
        </Pressable>
        <Pressable style={neStyles.portionBtn} onPress={() => onOpenUpdateData("lhCboActivity")}>
          <Text style={neStyles.portionBtnText}>PG/NFC/{"\n"}FPC/CHC</Text>
        </Pressable>
      </View>

      <Pressable style={pageStyles.dashboardInlineAlert} onPress={() => setShowDashboardAlerts(true)}>
        <View style={pageStyles.dashboardInlineAlertHeader}>
          <View style={pageStyles.dashboardInlineAlertBadge}>
            <Text style={pageStyles.dashboardInlineAlertBadgeText}>!</Text>
          </View>
          <View style={pageStyles.dashboardInlineAlertCopy}>
            <Text style={pageStyles.dashboardInlineAlertTitle}>Pending & Upcoming Notifications</Text>
            <Text style={pageStyles.dashboardInlineAlertSubtitle}>
              {dashboardAlertCount} item{dashboardAlertCount > 1 ? "s" : ""} need attention
            </Text>
          </View>
        </View>

        <View style={pageStyles.dashboardInlineAlertList}>
          {dashboardNotificationItems.map((item, index) => (
            <View key={`ne-inline-alert-${index}-${item}`} style={pageStyles.dashboardInlineAlertItem}>
              <View style={pageStyles.dashboardAlertDot} />
              <Text style={pageStyles.dashboardInlineAlertText}>{item}</Text>
            </View>
          ))}
        </View>
      </Pressable>

      <View style={neStyles.activityCard}>
        <Text style={neStyles.activityTitle}>Different Activities of the Concern CRP</Text>
        {activities.slice(0, 3).map((item) => (
          <Text key={item.id} style={neStyles.activityLine}>
            - {item.title} ({item.action})
          </Text>
        ))}
      </View>

      <Pressable style={wrStyles.backBtn} onPress={onBackToDashboard}>
        <Text style={wrStyles.backBtnText}>Back to Dashboard</Text>
      </Pressable>
    </View>
  </View>
  );
}

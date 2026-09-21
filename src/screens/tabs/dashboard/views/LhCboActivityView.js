import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import CycleDropdown from "@/components/dashboard/CycleDropdown";
import { pageStyles, lhcboStyles, chcEntStyles, wrStyles } from "@/styles/dashboardHomeStyles";
import { CHC_ACTIVITY_DISPLAY } from "@/constants/livelihoodOptions";
import { useDashboardContext } from "../DashboardContext";

export default function LhCboActivityView() {
  const {
    headerCrpId,
    headerCrpName,
    lhCboType,
    livelihoodCboTypeOptions,
    setLhCboType,
    selectedLhCboName,
    livelihoodCboNameOptions,
    setSelectedLhCboName,
    isChcEnterprisesMode,
    selectedLhCboActivity,
    livelihoodCboActivityOptions,
    setSelectedLhCboActivity,
    displayedLhCboActivity,
    activityCoordinates,
    handleUploadLhCboImage,
    setLhCboImageIndex,
    lhCboImages,
    activeLhCboImage,
    locationPromptRequired,
    distanceToMember,
    isWithin50Meters,
    chcEnterpriseName,
    setChcEnterpriseName,
    chcServices,
    setChcServices,
    checkRadiusDistance,
    isDistanceLoading,
    apiSavingKey,
    handleChcEnterprisesSaveAndNext,
    handleLhCboSaveAndNext,
    onOpenNewEnrolment
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, lhcboStyles.frame]}>
          <View style={pageStyles.topRow}>
            <View style={pageStyles.imageCard}>
              <Text style={pageStyles.imageText}>CRP{"\n"}Image</Text>
            </View>
            <View style={pageStyles.infoCard}>
              <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
              <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
            </View>
          </View>

          <View style={lhcboStyles.formCard}>
            <View style={lhcboStyles.formHeader}>
              <Text style={lhcboStyles.formEyebrow}>NFC / PG / IFC / CHC</Text>
              <Text style={lhcboStyles.formTitle}>Livelihood CBO Activity</Text>
              <Text style={lhcboStyles.formHint}>
                Select the livelihood collective, map the activity, and capture the latest field image.
              </Text>
            </View>

            <View style={lhcboStyles.row}>
              <Text style={lhcboStyles.label}>Type of Livelihood CBO</Text>
              <CycleDropdown
                value={lhCboType}
                options={livelihoodCboTypeOptions}
                style={lhcboStyles.dropdown}
                onChange={setLhCboType}
              />
            </View>

            <View style={lhcboStyles.row}>
              <Text style={lhcboStyles.label}>Name of the Livelihood CBO</Text>
              <CycleDropdown
                value={selectedLhCboName}
                options={livelihoodCboNameOptions}
                style={lhcboStyles.dropdown}
                onChange={setSelectedLhCboName}
              />
            </View>

            {!isChcEnterprisesMode ? (
              <View style={lhcboStyles.row}>
                <Text style={lhcboStyles.label}>Activity of the LH-CBO</Text>
                <CycleDropdown
                  value={selectedLhCboActivity}
                  options={livelihoodCboActivityOptions}
                  style={lhcboStyles.dropdown}
                  onChange={setSelectedLhCboActivity}
                />
              </View>
            ) : (
              <View style={chcEntStyles.fixedActivityRow}>
                <Text style={chcEntStyles.entLabel}>Activity of the LH-CBO</Text>
                <Text style={chcEntStyles.fixedActivityText}>{CHC_ACTIVITY_DISPLAY}</Text>
              </View>
            )}

            <View style={lhcboStyles.metaPanel}>
              <View style={lhcboStyles.metaChip}>
                <Text style={lhcboStyles.metaChipLabel}>Selected Type</Text>
                <Text style={lhcboStyles.metaChipValue}>{lhCboType || "Not selected"}</Text>
              </View>
              <View style={lhcboStyles.metaChip}>
                <Text style={lhcboStyles.metaChipLabel}>Activity</Text>
                <Text style={lhcboStyles.metaChipValue}>
                  {displayedLhCboActivity || "Not selected"}
                </Text>
              </View>
            </View>

            <View style={lhcboStyles.row}>
              <Text style={lhcboStyles.label}>Longitude of Activity*</Text>
              <TextInput
                style={lhcboStyles.input}
                editable={false}
                value={activityCoordinates ? activityCoordinates.longitude.toFixed(6) : "--"}
              />
            </View>

            <View style={lhcboStyles.row}>
              <Text style={lhcboStyles.label}>Latitude of Activity*</Text>
              <TextInput
                style={lhcboStyles.input}
                editable={false}
                value={activityCoordinates ? activityCoordinates.latitude.toFixed(6) : "--"}
              />
            </View>

            <View style={lhcboStyles.row}>
              <Text style={lhcboStyles.label}>Latest Image of the Activity*</Text>
              <Pressable style={lhcboStyles.uploadBtn} onPress={handleUploadLhCboImage}>
                <Text style={lhcboStyles.uploadBtnText}>Upload Image</Text>
              </Pressable>
            </View>

            <Text style={lhcboStyles.previewHeading}>Previous & Latest Uploaded Images</Text>
            <View style={lhcboStyles.previewRow}>
              <Pressable
                style={lhcboStyles.navBtn}
                onPress={() =>
                  setLhCboImageIndex((prev) =>
                    lhCboImages.length ? (prev - 1 + lhCboImages.length) % lhCboImages.length : 0
                  )
                }
              >
                <Text style={lhcboStyles.navBtnText}>{"<"}</Text>
              </Pressable>

              <View style={lhcboStyles.previewBox}>
                {activeLhCboImage ? (
                  <Image source={{ uri: activeLhCboImage }} style={lhcboStyles.previewImage} />
                ) : (
                  <Text style={lhcboStyles.previewText}>Images of Activities of the SHG Member</Text>
                )}
              </View>

              <Pressable
                style={lhcboStyles.navBtn}
                onPress={() =>
                  setLhCboImageIndex((prev) =>
                    lhCboImages.length ? (prev + 1) % lhCboImages.length : 0
                  )
                }
              >
                <Text style={lhcboStyles.navBtnText}>{">"}</Text>
              </Pressable>
            </View>

            <View style={lhcboStyles.radiusRow}>
              <View
                style={[
                  lhcboStyles.geoDot,
                  locationPromptRequired || distanceToMember === null
                    ? lhcboStyles.geoDotIdle
                    : isWithin50Meters
                    ? lhcboStyles.geoDotGreen
                    : lhcboStyles.geoDotRed
                ]}
              />
              <Text style={lhcboStyles.radiusText}>
                {locationPromptRequired
                  ? "Enable location permission for 50m radius check."
                  : distanceToMember === null
                  ? "If CRP reaches 50m radius, indicator turns green, else red."
                  : isWithin50Meters
                  ? `Within 50m (${distanceToMember}m) - GREEN`
                  : `Outside 50m (${distanceToMember}m) - RED`}
              </Text>
            </View>

            {isChcEnterprisesMode ? (
              <View style={chcEntStyles.enterpriseBanner}>
                <Text style={chcEntStyles.bannerIcon}>🏢</Text>
                <Text style={chcEntStyles.bannerTitle}>CHC Enterprises Mode</Text>
                <Text style={chcEntStyles.bannerHint}>Custom Hiring Center selected. Activity fixed as "Enterprises". Enter specific enterprise details below.</Text>
              </View>
            ) : null}

            {isChcEnterprisesMode ? (
              <>
                <View style={chcEntStyles.entFieldRow}>
                  <Text style={chcEntStyles.entLabel}>CHC Enterprises Name</Text>
                  <TextInput
                    style={chcEntStyles.entInput}
                    value={chcEnterpriseName}
                    onChangeText={setChcEnterpriseName}
                    placeholder="e.g. FarmTech Services Hub"
                    placeholderTextColor="#64748b"
                  />
                </View>
                <View style={chcEntStyles.entFieldRow}>
                  <Text style={chcEntStyles.entLabel}>Services Offered</Text>
                  <TextInput
                    style={chcEntStyles.entServicesInput}
                    value={chcServices}
                    onChangeText={setChcServices}
                    placeholder={"List services\n(Tractor rental, Ploughing, Seeding, Harvesting)"}
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </>
            ) : null}

            <View style={lhcboStyles.actionRow}>
              <Pressable style={lhcboStyles.checkBtn} onPress={() => checkRadiusDistance(false)}>
                <Text style={lhcboStyles.checkBtnText}>
                  {isDistanceLoading ? "Checking..." : "Check 50m Radius"}
                </Text>
              </Pressable>
              <Pressable
                style={lhcboStyles.saveBtn}
                disabled={Boolean(apiSavingKey)}
                onPress={isChcEnterprisesMode ? handleChcEnterprisesSaveAndNext : handleLhCboSaveAndNext}
              >
                <Text style={lhcboStyles.saveBtnText}>
                  {apiSavingKey === "chcEnterprisesActivityProfile" ? "Saving..." : "Save & Next"}
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={wrStyles.backBtn} onPress={onOpenNewEnrolment}>
            <Text style={wrStyles.backBtnText}>Back to Selection</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

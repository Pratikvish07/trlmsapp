import React from "react";
import { Image, Pressable, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import DropdownField from "@/components/dashboard/DropdownField";
import { pageStyles, smStyles, wrStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

export default function ShgMemberView() {
  const {
    headerCrpId,
    headerCrpName,
    shgName,
    shgNames,
    openShgDropdown,
    closeAllShgDropdowns,
    setOpenShgDropdown,
    setShgName,
    memberName,
    shgMembers,
    openMemberDropdown,
    setOpenMemberDropdown,
    setMemberName,
    activityType,
    activityTypes,
    openActivityDropdown,
    setOpenActivityDropdown,
    setActivityType,
    subCategory,
    subCategories,
    openSubCategoryDropdown,
    setOpenSubCategoryDropdown,
    setSubCategory,
    activityCoordinates,
    handleUploadImage,
    uploadedImageName,
    uploadedImageDate,
    uploadedImageUri,
    memberBelongsToLhCbo,
    setMemberBelongsToLhCbo,
    setLhCboName,
    lhCboName,
    locationPromptRequired,
    distanceToMember,
    isWithin50Meters,
    currentCrpLocation,
    checkRadiusDistance,
    isDistanceLoading,
    handleSaveAndNext,
    onBackToDashboard,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
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
          label="SHG Name:"
          icon="people-outline"
          value={shgName}
          options={shgNames}
          open={openShgDropdown}
          onToggle={() => {
            const next = !openShgDropdown;
            closeAllShgDropdowns();
            setOpenShgDropdown(next);
          }}
          onSelect={(item) => {
            setShgName(item);
            setOpenShgDropdown(false);
          }}
        />

        <DropdownField
          label="SHG Members Name:"
          icon="person-outline"
          value={memberName}
          options={shgMembers}
          open={openMemberDropdown}
          onToggle={() => {
            const next = !openMemberDropdown;
            closeAllShgDropdowns();
            setOpenMemberDropdown(next);
          }}
          onSelect={(item) => {
            setMemberName(item);
            setOpenMemberDropdown(false);
          }}
        />

          <DropdownField
            label="Select Livelihood Activity:"
            icon="briefcase-outline"
            value={activityType}
            options={activityTypes}
          open={openActivityDropdown}
          onToggle={() => {
            const next = !openActivityDropdown;
            closeAllShgDropdowns();
            setOpenActivityDropdown(next);
          }}
            onSelect={(item) => {
              setActivityType(item?.name || item || "");
              setOpenActivityDropdown(false);
            }}
          />

          <DropdownField
            label="Sub-Category:"
            icon="pricetag-outline"
            value={subCategory}
            options={subCategories}
          open={openSubCategoryDropdown}
          onToggle={() => {
            const next = !openSubCategoryDropdown;
            closeAllShgDropdowns();
            setOpenSubCategoryDropdown(next);
          }}
            onSelect={(item) => {
              setSubCategory(item?.name || item || "");
              setOpenSubCategoryDropdown(false);
            }}
          />

        <View style={smStyles.readonlyRow}>
          <Text style={smStyles.readonlyLabel}>Longitude of the Activity*:</Text>
          <Text style={smStyles.readonlyValue}>
            {activityCoordinates ? activityCoordinates.longitude.toFixed(6) : "--"}
          </Text>
        </View>
        <View style={smStyles.readonlyRow}>
          <Text style={smStyles.readonlyLabel}>Latitude of the Activity*:</Text>
          <Text style={smStyles.readonlyValue}>
            {activityCoordinates ? activityCoordinates.latitude.toFixed(6) : "--"}
          </Text>
        </View>
        <View style={smStyles.readonlyRow}>
          <Text style={smStyles.readonlyLabel}>Latest Image of the Activity*:</Text>
          <Pressable style={smStyles.uploadBtn} onPress={handleUploadImage}>
            <Text style={smStyles.uploadBtnText}>Upload Image</Text>
          </Pressable>
        </View>
        {uploadedImageName ? (
          <View style={smStyles.readonlyRow}>
            <Text style={smStyles.readonlyLabel}>Latest Uploaded:</Text>
            <Text style={smStyles.readonlyValue}>{uploadedImageName} ({uploadedImageDate})</Text>
          </View>
        ) : null}

        <View style={smStyles.previewCard}>
          <Text style={smStyles.previewTitle}>Previous & Latest Uploaded Images</Text>
          <View style={smStyles.previewBox}>
            {uploadedImageUri ? (
              <Image source={{ uri: uploadedImageUri }} style={smStyles.previewImage} />
            ) : (
              <Text style={smStyles.previewText}>
                Images of Activities of the SHG Member
              </Text>
            )}
          </View>
        </View>

        <View style={smStyles.readonlyRow}>
          <Text style={smStyles.readonlyLabel}>Member belongs to LH CBO:</Text>
          <Pressable
            style={[
              smStyles.lhIndicatorBtn,
              memberBelongsToLhCbo
                ? smStyles.lhIndicatorBtnOn
                : smStyles.lhIndicatorBtnOff
            ]}
            onPress={() => {
              setMemberBelongsToLhCbo((prev) => {
                const next = !prev;
                if (!next) {
                  setLhCboName("");
                }
                return next;
              });
            }}
          >
            <View
              style={[
                smStyles.dotToggle,
                memberBelongsToLhCbo ? smStyles.dotToggleOn : smStyles.dotToggleOff
              ]}
            />
            <Text
              style={[
                smStyles.lhIndicatorText,
                memberBelongsToLhCbo
                  ? smStyles.lhIndicatorTextOn
                  : smStyles.lhIndicatorTextOff
              ]}
            >
              {memberBelongsToLhCbo ? "ON" : "OFF"}
            </Text>
          </Pressable>
        </View>

        <View style={smStyles.readonlyRow}>
          <Text style={smStyles.readonlyLabel}>Name of the LH CBO:</Text>
          <TextInput
            value={lhCboName}
            onChangeText={setLhCboName}
            placeholder={memberBelongsToLhCbo ? "Type LH CBO name" : "Enable LH CBO first"}
            placeholderTextColor="#64748b"
            style={[
              smStyles.cboInput,
              !memberBelongsToLhCbo && smStyles.cboInputDisabled
            ]}
            editable={memberBelongsToLhCbo}
          />
        </View>

        <View style={smStyles.radiusRow}>
          <View
            style={[
              smStyles.radiusStatusIcon,
              locationPromptRequired || distanceToMember === null
                ? smStyles.radiusStatusIdle
                : isWithin50Meters
                  ? smStyles.radiusStatusGreen
                  : smStyles.radiusStatusRed
            ]}
          />
          <Text style={smStyles.radiusText}>
            {locationPromptRequired
              ? "Location permission is off. Enable location for SHG onboarding."
              : distanceToMember === null
              ? "Radius Status: Check distance to validate 50m rule"
              : isWithin50Meters
                ? `Within 50m (${distanceToMember}m) - GREEN`
                : `Outside 50m (${distanceToMember}m) - RED`}
          </Text>
        </View>
        {currentCrpLocation ? (
          <View style={smStyles.readonlyRow}>
            <Text style={smStyles.readonlyLabel}>Current CRP Location:</Text>
            <Text style={smStyles.readonlyValue}>
              {currentCrpLocation.latitude.toFixed(6)}, {currentCrpLocation.longitude.toFixed(6)}
            </Text>
          </View>
        ) : null}

        <View style={smStyles.bottomRow}>
          <Pressable style={smStyles.checkBtn} onPress={() => checkRadiusDistance(false)}>
            <Text style={smStyles.checkBtnText}>
              {isDistanceLoading ? "Checking..." : "Check 50m Radius"}
            </Text>
          </Pressable>
          <Pressable style={smStyles.saveBtn} onPress={handleSaveAndNext}>
            <Text style={smStyles.saveBtnText}>Save & Next</Text>
          </Pressable>
        </View>

        <Pressable style={wrStyles.backBtn} onPress={onBackToDashboard}>
          <Text style={wrStyles.backBtnText}>Back to Dashboard</Text>
        </Pressable>
        {renderResponsePopup()}
      </View>
    </View>
  );
}

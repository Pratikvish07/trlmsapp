import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/dashboard/TranslatedInputs";
import CycleDropdown from "@/components/dashboard/CycleDropdown";
import DateField from "@/components/dashboard/DateField";
import { pageStyles, nfStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

// No live endpoint exists for this field (Enterprise "Set-up Type");
// hardcoded to the two values the SRS specifies since it was
// previously an empty array (dead dropdown - nothing was selectable).
const SETUP_TYPE_OPTIONS = ["Homebased", "Commercial"];
const YES_NO_OPTIONS = ["Yes", "No"];
const MARKET_LINKED_OPTIONS = ["Local", "Block", "District", "State", "National"];

export default function LhActivityNonFarmView() {
  const {
    nonFarmEnterprise,
    setNonFarmEnterprise,
    openDatePicker,
    handleProfileSave,
    currentStatusView,
    renderResponsePopup
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, nfStyles.frame]}>
          <View style={nfStyles.titleWrap}>
            <Text style={nfStyles.title}>Activity Profile</Text>
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Enterprise Name:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.enterpriseName}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({ ...prev, enterpriseName: text }))
              }
              placeholder="Type"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Set-up Type:</Text>
            <CycleDropdown
              value={nonFarmEnterprise.setupType}
              options={SETUP_TYPE_OPTIONS}
              style={nfStyles.dropdown}
              onChange={(value) =>
                setNonFarmEnterprise((prev) => ({ ...prev, setupType: value }))
              }
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Enterprise Level:</Text>
            <View style={nfStyles.toggleWrap}>
              <Pressable
                style={[
                  nfStyles.toggleBtn,
                  nonFarmEnterprise.enterpriseLevel === "Primary" && nfStyles.toggleBtnActive
                ]}
                onPress={() =>
                  setNonFarmEnterprise((prev) => ({ ...prev, enterpriseLevel: "Primary" }))
                }
              >
                <Text style={nfStyles.toggleText}>Primary</Text>
              </Pressable>
              <Pressable
                style={[
                  nfStyles.toggleBtn,
                  nonFarmEnterprise.enterpriseLevel === "Secondary" && nfStyles.toggleBtnActive
                ]}
                onPress={() =>
                  setNonFarmEnterprise((prev) => ({ ...prev, enterpriseLevel: "Secondary" }))
                }
              >
                <Text style={nfStyles.toggleText}>Secondary</Text>
              </Pressable>
            </View>
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Signboard Mounted on Enterprise:</Text>
            <CycleDropdown
              value={nonFarmEnterprise.signboardMounted}
              options={YES_NO_OPTIONS}
              style={nfStyles.dropdown}
              onChange={(value) =>
                setNonFarmEnterprise((prev) => ({ ...prev, signboardMounted: value }))
              }
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Total Employment associated:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.totalEmployment}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({
                  ...prev,
                  totalEmployment: text.replace(/\D/g, "")
                }))
              }
              keyboardType="numeric"
              placeholder="Type"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Market Linked:</Text>
            <CycleDropdown
              value={nonFarmEnterprise.marketLinked}
              options={MARKET_LINKED_OPTIONS}
              style={nfStyles.dropdown}
              onChange={(value) =>
                setNonFarmEnterprise((prev) => ({ ...prev, marketLinked: value }))
              }
            />
          </View>

          <View style={nfStyles.complianceHeader}>
            <Text style={nfStyles.complianceTitle}>Legal Compliances</Text>
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>GST:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.gstNo}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({ ...prev, gstNo: text.toUpperCase() }))
              }
              placeholder="Number"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Renewal Date:</Text>
            <DateField
              value={nonFarmEnterprise.gstRenewalDate}
              placeholder="DD-MM-YY"
              onPress={() =>
                openDatePicker(
                  "nonFarm",
                  "gstRenewalDate",
                  "GST Renewal Date",
                  nonFarmEnterprise.gstRenewalDate
                )
              }
              style={nfStyles.dateTrigger}
              textStyle={nfStyles.dateTriggerText}
              placeholderStyle={nfStyles.datePlaceholderText}
              iconStyle={nfStyles.dateTriggerIcon}
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>PAN:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.panNo}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({ ...prev, panNo: text.toUpperCase() }))
              }
              placeholder="Number"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Renewal Date:</Text>
            <DateField
              value={nonFarmEnterprise.panRenewalDate}
              placeholder="DD-MM-YY"
              onPress={() =>
                openDatePicker(
                  "nonFarm",
                  "panRenewalDate",
                  "PAN Renewal Date",
                  nonFarmEnterprise.panRenewalDate
                )
              }
              style={nfStyles.dateTrigger}
              textStyle={nfStyles.dateTriggerText}
              placeholderStyle={nfStyles.datePlaceholderText}
              iconStyle={nfStyles.dateTriggerIcon}
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Udhyam:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.udhyamNo}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({ ...prev, udhyamNo: text.toUpperCase() }))
              }
              placeholder="Number"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Renewal Date:</Text>
            <DateField
              value={nonFarmEnterprise.udhyamRenewalDate}
              placeholder="DD-MM-YY"
              onPress={() =>
                openDatePicker(
                  "nonFarm",
                  "udhyamRenewalDate",
                  "Udhyam Renewal Date",
                  nonFarmEnterprise.udhyamRenewalDate
                )
              }
              style={nfStyles.dateTrigger}
              textStyle={nfStyles.dateTriggerText}
              placeholderStyle={nfStyles.datePlaceholderText}
              iconStyle={nfStyles.dateTriggerIcon}
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>FSSAI:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.fssaiNo}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({ ...prev, fssaiNo: text.toUpperCase() }))
              }
              placeholder="Number"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Renewal Date:</Text>
            <DateField
              value={nonFarmEnterprise.fssaiRenewalDate}
              placeholder="DD-MM-YY"
              onPress={() =>
                openDatePicker(
                  "nonFarm",
                  "fssaiRenewalDate",
                  "FSSAI Renewal Date",
                  nonFarmEnterprise.fssaiRenewalDate
                )
              }
              style={nfStyles.dateTrigger}
              textStyle={nfStyles.dateTriggerText}
              placeholderStyle={nfStyles.datePlaceholderText}
              iconStyle={nfStyles.dateTriggerIcon}
            />
          </View>

          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>TIN:</Text>
            <TextInput
              style={nfStyles.input}
              value={nonFarmEnterprise.tinNo}
              onChangeText={(text) =>
                setNonFarmEnterprise((prev) => ({ ...prev, tinNo: text.toUpperCase() }))
              }
              placeholder="Number"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={nfStyles.row}>
            <Text style={nfStyles.label}>Renewal Date:</Text>
            <DateField
              value={nonFarmEnterprise.tinRenewalDate}
              placeholder="DD-MM-YY"
              onPress={() =>
                openDatePicker(
                  "nonFarm",
                  "tinRenewalDate",
                  "TIN Renewal Date",
                  nonFarmEnterprise.tinRenewalDate
                )
              }
              style={nfStyles.dateTrigger}
              textStyle={nfStyles.dateTriggerText}
              placeholderStyle={nfStyles.datePlaceholderText}
              iconStyle={nfStyles.dateTriggerIcon}
            />
          </View>

          <Pressable
            style={nfStyles.saveBtn}
            onPress={() => {
              handleProfileSave("Non-Farm enterprise profile", nonFarmEnterprise, currentStatusView);
            }}
          >
            <Text style={nfStyles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
      {renderResponsePopup()}
    </View>
  );
}

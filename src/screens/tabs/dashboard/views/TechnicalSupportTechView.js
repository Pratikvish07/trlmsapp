import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/dashboard/TranslatedInputs";
import EditableSelect from "@/components/dashboard/EditableSelect";
import DateField from "@/components/dashboard/DateField";
import DatePickerInput from "@/components/dashboard/DatePickerInput";
import { pageStyles, tsDetailStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

const YES_NO_OPTIONS = ["Yes", "No"];

export default function TechnicalSupportTechView() {
  const {
    tradeRecords,
    trainingAgencyRecords,
    technicalSupportForm,
    setTechnicalSupportForm,
    openDatePicker,
    handleSaveTechnicalSupport,
    apiSavingKey,
    trainingDatePicker,
    closeTrainingDatePicker,
    setTrainingDatePicker,
    confirmTrainingDatePicker,
    renderResponsePopup
  } = useDashboardContext();

  const tradeOptions = tradeRecords.map((item) => item.name);
  const throughOptions = trainingAgencyRecords.map((item) => item.name);

  return (
    <View style={pageStyles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[pageStyles.frame, tsDetailStyles.frame]}>
          <View style={tsDetailStyles.heroCard}>
            <View style={tsDetailStyles.titleWrap}>
              <Text style={tsDetailStyles.title}>Technical Support</Text>
            </View>
            <Text style={tsDetailStyles.sectionType}>Training Details</Text>
            <Text style={tsDetailStyles.sectionHint}>
              Fill the member training support details below.
            </Text>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <Text style={tsDetailStyles.sectionTitle}>Skill Training</Text>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Having Skill Training</Text>
              <EditableSelect
                value={technicalSupportForm.havingSkillTraining}
                options={YES_NO_OPTIONS}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, havingSkillTraining: value }))
                }
                placeholder="Select or type"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>If Yes, Name of the Trade</Text>
              <EditableSelect
                value={technicalSupportForm.skillTrade}
                options={tradeOptions}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, skillTrade: value }))
                }
                placeholder="Select or type trade"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Date of Training</Text>
              <DateField
                value={technicalSupportForm.skillDate}
                placeholder="DD-MM-YY"
                onPress={() =>
                  openDatePicker(
                    "technicalSupport",
                    "skillDate",
                    "Skill Training Date",
                    technicalSupportForm.skillDate
                  )
                }
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Training Executed Through</Text>
              <EditableSelect
                value={technicalSupportForm.skillThrough}
                options={throughOptions}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, skillThrough: value }))
                }
                placeholder="Select or type source"
              />
            </View>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <Text style={tsDetailStyles.sectionTitle}>EDP Training</Text>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Having EDP Training</Text>
              <EditableSelect
                value={technicalSupportForm.havingEdpTraining}
                options={YES_NO_OPTIONS}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, havingEdpTraining: value }))
                }
                placeholder="Select or type"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>If Yes, Name of the Trade</Text>
              <EditableSelect
                value={technicalSupportForm.edpTrade}
                options={tradeOptions}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, edpTrade: value }))
                }
                placeholder="Select or type trade"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Date of Training</Text>
              <DateField
                value={technicalSupportForm.edpDate}
                placeholder="DD-MM-YY"
                onPress={() =>
                  openDatePicker(
                    "technicalSupport",
                    "edpDate",
                    "EDP Training Date",
                    technicalSupportForm.edpDate
                  )
                }
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Training Executed Through</Text>
              <EditableSelect
                value={technicalSupportForm.edpThrough}
                options={throughOptions}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, edpThrough: value }))
                }
                placeholder="Select or type source"
              />
            </View>
          </View>

          <View style={tsDetailStyles.sectionCard}>
            <Text style={tsDetailStyles.sectionTitle}>Training Requirement</Text>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Training Requirement</Text>
              <EditableSelect
                value={technicalSupportForm.trainingRequirement}
                options={YES_NO_OPTIONS}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, trainingRequirement: value }))
                }
                placeholder="Select or type"
              />
            </View>

            <View style={tsDetailStyles.fieldBlock}>
              <Text style={tsDetailStyles.label}>Training Required Trade</Text>
              <EditableSelect
                value={technicalSupportForm.trainingRequiredTrade}
                options={tradeOptions}
                onChange={(value) =>
                  setTechnicalSupportForm((prev) => ({ ...prev, trainingRequiredTrade: value }))
                }
                placeholder="Select or type trade"
              />
            </View>
          </View>

          <Pressable
            style={tsDetailStyles.saveBtn}
            onPress={handleSaveTechnicalSupport}
            disabled={apiSavingKey === "technicalSupport"}
          >
            <Text style={tsDetailStyles.saveBtnText}>
              {apiSavingKey === "technicalSupport" ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={trainingDatePicker.visible}
        onRequestClose={closeTrainingDatePicker}
      >
        <View style={tsDetailStyles.modalOverlay}>
          <View style={tsDetailStyles.modalCard}>
            <Text style={tsDetailStyles.modalTitle}>
              {trainingDatePicker.title || "Select Date"}
            </Text>
            <DatePickerInput
              value={trainingDatePicker.value}
              onChange={(text) =>
                setTrainingDatePicker((prev) => ({
                  ...prev,
                  value: text
                }))
              }
            />
            <View style={tsDetailStyles.modalActionRow}>
              <Pressable style={tsDetailStyles.modalSecondaryBtn} onPress={closeTrainingDatePicker}>
                <Text style={tsDetailStyles.modalSecondaryBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={tsDetailStyles.modalPrimaryBtn} onPress={confirmTrainingDatePicker}>
                <Text style={tsDetailStyles.modalPrimaryBtnText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {renderResponsePopup()}
    </View>
  );
}

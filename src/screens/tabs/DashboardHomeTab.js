import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCheckoutModal from "./PostCheckoutModal";
import { Image, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getCurrentLocation, calculateDistance } from "../../utils/geofence";
import {
  fetchActivities,
  fetchActivityTypes,
  fetchAllCrps,
  fetchCrpTypes,
  fetchGpsByBlock,
  fetchLandTypes,
  fetchMemberActivities,
  fetchProductionMaster,
  fetchSeasons,
  fetchShgMembersByVillage,
  fetchShgTrackingSupport,
  fetchSubCategoriesByActivity,
  fetchTradeOptions,
  fetchTrainingAgencyOptions,
  fetchUnitsOfArea,
  fetchVillagesByGp,
  submitActivityProfile,
  submitFinancialSupport,
  submitIncomeProfile,
  submitInvestmentProfile,
  submitLivelihoodAssignment,
  submitProductionMaster,
  submitShgTrackingMultipart,
  submitTechnicalSupport,
  submitTrainingAgency
} from "../../services/masterApi";
import { pageStyles, wrStyles, neStyles, smStyles, flowStyles, apStyles, nfStyles, tsCardStyles, tsDetailStyles, fsStyles, pastStyles, txnStyles, lhcboStyles, lhGuideStyles, lhcboStatusStyles, lhStyles, chcEntStyles } from "../../styles/dashboardHomeStyles";
import { Text, TextInput } from "../../components/dashboard/TranslatedInputs";
import DropdownField from "../../components/dashboard/DropdownField";
import CycleDropdown from "../../components/dashboard/CycleDropdown";
import DateField from "../../components/dashboard/DateField";
import DatePickerInput from "../../components/dashboard/DatePickerInput";
import EditableSelect from "../../components/dashboard/EditableSelect";
import {
  getMimeTypeFromUri,
  getVideoMimeTypeFromUri,
  firstOption,
  humanizeKey,
  formatIsoDateToDisplay,
  formatDisplayDateToIso,
  toNumberOrZero,
  toBooleanValue,
  findOptionIdByName,
  getLhCboTypeKey
} from "../../utils/dashboardFormatters";
import {
  FARM_UNIT_AREA_OPTIONS,
  FARM_TYPE_OPTIONS,
  FARM_SEASON_OPTIONS,
  FARM_LAND_OPTIONS,
  FARM_PRODUCTION_UNIT_OPTIONS,
  SUPPORT_SOURCE_OPTIONS,
  LIVELIHOOD_CBO_TYPE_OPTIONS,
  LIVELIHOOD_CBO_ACTIVITY_OPTIONS,
  CHC_ACTIVITY_VALUE,
  CHC_ACTIVITY_DISPLAY,
  LIVELIHOOD_CBO_NAME_OPTIONS
} from "../../constants/livelihoodOptions";
import { DashboardContextProvider } from "./dashboard/DashboardContext";
import WorkingReportView from "./dashboard/views/WorkingReportView";

// CRP ID / GP / Village / SHG / Member selection lived only in this
// component's React state, with no persistence - a page reload (common on
// Expo web) wiped it completely even though the app restores homeView and
// login session from AsyncStorage. That silently reset selectedAssignedMember
// to null after every reload, which is why screens guarded on it (Investment
// Profile, SHG Tracking) kept blocking with "No SHG member selected" right
// after a refresh, even when the user had already picked everything. This
// key persists that selection the same way APP_NAV_STORAGE_KEY in
// AppRouter.js already persists homeView/activeTab.
const DASHBOARD_SELECTION_STORAGE_KEY = "trlmDashboardSelectionState";

export default function DashboardHomeTab({
  user,
  dashboardMetrics,
  workingReport,
  setWorkingReport,
  onSubmitWorkingReport,
  assignedShgMembers = [],
  onLockAssignedShgLocation,
  onOpenWorkingReport,
  onOpenShgMember,
  onOpenLhCboActivity,
  onOpenNewEnrolment,
  onOpenUpdateData,
  alerts,
  activities,
  homeView,
  onBackToDashboard,
  showPostCheckoutModal,
  setShowPostCheckoutModal,
  onLogout
}) {
  // Fixed buggy early return - modal now rendered conditionally in JSX
  const reportGeofenceRadius = 150;
  const [apiAssignedShgMembers, setApiAssignedShgMembers] = useState([]);
  const [showCrpTypeMenu, setShowCrpTypeMenu] = useState(false);
  const [activityOptions, setActivityOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedCrpType, setSelectedCrpType] = useState(user.idType || "");
  // Master-data lists pulled live from the API instead of being hardcoded.
  // Each keeps a small static fallback (matching what the server actually
  // returns today) only for the brief window before the fetch resolves or
  // if the device is offline - not as the primary source of truth.
  const [crpTypeOptions, setCrpTypeOptions] = useState([]);
  const [landTypeOptions, setLandTypeOptions] = useState(["Tilla", "Low", "Plain"]);
  const [unitOfAreaOptions, setUnitOfAreaOptions] = useState(["Kani", "Gonda"]);
  const [seasonOptions, setSeasonOptions] = useState(["Rabi", "Kharif", "Summer", "Winter", "Rainy"]);
  const [livestockSubCategoryOptions, setLivestockSubCategoryOptions] = useState([]);
  const [fisherySubCategoryOptions, setFisherySubCategoryOptions] = useState([]);
  const [nonFarmSetupCategoryOptions, setNonFarmSetupCategoryOptions] = useState(
    ["Manufacturing", "Service", "Trading"]
  );
  const [memberActivityOptions, setMemberActivityOptions] = useState([]);
  // Full {id, name} records so Financial Support save can resolve the
  // numeric activityId the API requires - the plain-name options above
  // only carry the label the dropdown displays.
  const [memberActivityRecords, setMemberActivityRecords] = useState([]);
  // Full {id, name} records (not just display names) so the Activity
  // Profile payload can resolve unitId/seasonId/landTypeId - the API
  // requires the numeric id, not the label.
  const [unitOfAreaRecords, setUnitOfAreaRecords] = useState([]);
  const [seasonRecords, setSeasonRecords] = useState([]);
  const [landTypeRecords, setLandTypeRecords] = useState([]);
  const [tradeRecords, setTradeRecords] = useState([]);
  const [trainingAgencyRecords, setTrainingAgencyRecords] = useState([]);
  // Confirmed live via /api/activity-type/get-all: [{ActivityTypeId:1,
  // ActivityTypeName:"Seasonal"},{ActivityTypeId:2,ActivityTypeName:"Perennial"}].
  // Kept as a fallback matching the confirmed values in case this hasn't
  // loaded yet when a save happens.
  const [activityTypeRecords, setActivityTypeRecords] = useState([
    { id: 1, name: "Seasonal" },
    { id: 2, name: "Perennial" }
  ]);
  const [productionMasterOptions, setProductionMasterOptions] = useState([]);
  const effectiveAssignedShgMembers =
    apiAssignedShgMembers.length > 0 ? apiAssignedShgMembers : assignedShgMembers;
  const shgNames = Array.from(
    new Set(effectiveAssignedShgMembers.map((item) => item.shgName).filter(Boolean))
  );
  const activityTypes = activityOptions.length ? activityOptions : [{ id: 1, name: "Farm" }];
  const subCategories = subCategoryOptions.length ? subCategoryOptions : [{ id: 1, name: "Farm" }];
  const livelihoodCboTypeOptions = LIVELIHOOD_CBO_TYPE_OPTIONS;
  const livelihoodCboActivityOptions = LIVELIHOOD_CBO_ACTIVITY_OPTIONS;
  const [shgName, setShgName] = useState(firstOption(shgNames));
  const shgMembers = effectiveAssignedShgMembers
    .filter((item) => !shgName || item.shgName === shgName)
    .map((item) => item.memberName);
  const [memberName, setMemberName] = useState(firstOption(shgMembers));
  const [activityType, setActivityType] = useState(firstOption(activityTypes));
  const [subCategory, setSubCategory] = useState(firstOption(subCategories));
  const [openShgDropdown, setOpenShgDropdown] = useState(false);
  const [openMemberDropdown, setOpenMemberDropdown] = useState(false);
  const [openActivityDropdown, setOpenActivityDropdown] = useState(false);
  const [openSubCategoryDropdown, setOpenSubCategoryDropdown] = useState(false);
  const [lhCboType, setLhCboType] = useState(firstOption(LIVELIHOOD_CBO_TYPE_OPTIONS));
  const [selectedLhCboName, setSelectedLhCboName] = useState(
    firstOption(LIVELIHOOD_CBO_NAME_OPTIONS[firstOption(LIVELIHOOD_CBO_TYPE_OPTIONS)] || [])
  );
  const [selectedLhCboActivity, setSelectedLhCboActivity] = useState(
    firstOption(LIVELIHOOD_CBO_ACTIVITY_OPTIONS)
  );

  // Task: CHC IS Enterprises States
  const [isChcEnterprisesMode, setIsChcEnterprisesMode] = useState(false);
  const [chcEnterpriseName, setChcEnterpriseName] = useState("");
  const [chcServices, setChcServices] = useState("");

  const livelihoodCboNameOptions = LIVELIHOOD_CBO_NAME_OPTIONS[lhCboType] || [];
  const [lhCboImages, setLhCboImages] = useState([]);
  const [lhCboImageIndex, setLhCboImageIndex] = useState(0);
  const [memberBelongsToLhCbo, setMemberBelongsToLhCbo] = useState(false);
  const [lhCboName, setLhCboName] = useState("");
  const [distanceToMember, setDistanceToMember] = useState(null);
  const [isDistanceLoading, setIsDistanceLoading] = useState(false);
  const [locationPromptRequired, setLocationPromptRequired] = useState(false);
  const [currentCrpLocation, setCurrentCrpLocation] = useState(null);
  const [activityCoordinates, setActivityCoordinates] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [uploadedImageDate, setUploadedImageDate] = useState("");
  const [uploadedImageUri, setUploadedImageUri] = useState("");
  const [uploadedVideoName, setUploadedVideoName] = useState("");
  const [uploadedVideoDate, setUploadedVideoDate] = useState("");
  const [uploadedVideoUri, setUploadedVideoUri] = useState("");
  const [trackingRemarks, setTrackingRemarks] = useState("");
  const [trackingSubmitting, setTrackingSubmitting] = useState(false);
  const [apiSavingKey, setApiSavingKey] = useState("");
  const [supportStage, setSupportStage] = useState("");
  const [supportHistory, setSupportHistory] = useState(null);
  const [supportHistoryLoading, setSupportHistoryLoading] = useState(false);
  const [activityProfile, setActivityProfile] = useState({
    activityName: "",
    areaQuantity: "",
    areaUnit: "",
    activityMode: "",
    seasonality: "",
    period: "",
    landType: "",
    productionName: "",
    productionQty: "",
    productionUnit: "",
    totalLivestock: "",
    waterbodyArea: "",
    waterbodyType: ""
  });
  const [nonFarmEnterprise, setNonFarmEnterprise] = useState({
    enterpriseName: "",
    setupType: "",
    enterpriseLevel: "",
    signboardMounted: "",
    totalEmployment: "",
    marketLinked: "",
    gstNo: "",
    gstRenewalDate: "",
    panNo: "",
    panRenewalDate: "",
    udhyamNo: "",
    udhyamRenewalDate: "",
    fssaiNo: "",
    fssaiRenewalDate: "",
    tinNo: "",
    tinRenewalDate: ""
  });
  const [technicalSupportForm, setTechnicalSupportForm] = useState({
    havingSkillTraining: "",
    skillTrade: "",
    skillDate: "",
    skillThrough: "",
    havingEdpTraining: "",
    edpTrade: "",
    edpDate: "",
    edpThrough: "",
    trainingRequirement: "",
    trainingRequiredTrade: ""
  });
  const [trainingDatePicker, setTrainingDatePicker] = useState({
    visible: false,
    scope: "",
    field: "",
    title: "",
    value: ""
  });
  const [responsePopup, setResponsePopup] = useState({
    visible: false,
    badge: "Response",
    title: "",
    message: "",
    fields: [],
    nextView: "",
    imageUri: ""
  });
  const [pgActivityProfileForm, setPgActivityProfileForm] = useState({
    primaryCommodity: "",
    trainingGovernance: "",
    trainingBooks: "",
    businessPlanPrepared: "",
    businessPlanSubmitted: "",
    fundReceivedFromNrlm: "",
    booksMaintained: "",
    dailyBusinessRegister: "",
    memberLedger: "",
    memberPassbook: "",
    assetRegister: ""
  });
  const [nfcActivityProfileForm, setNfcActivityProfileForm] = useState({
    productActivityDetails: "",
    setUpCategory: "",
    machineryProcured: "",
    signboardMounted: "",
    totalEmploymentAssociated: "",
    marketLinked: "",
    gst: "",
    gstRenewalDate: "",
    pan: "",
    panRenewalDate: "",
    tradeLicense: "",
    tradeRenewalDate: "",
    fssai: "",
    fssaiRenewDate: "",
    monthlyProductionVolume: "",
    volumeUnit: "",
    productionShed: "",
    homeBasedProduction: ""
  });
  const [chcDetailForm, setChcDetailForm] = useState({
    districtName: "",
    blockName: "",
    gpVcName: "",
    villageOrganizationName: "",
    chcName: "",
    establishedDate: "",
    establishedThroughConvergence: "",
    departmentAndScheme: "",
    separateBankAccount: "",
    bankAccountNumber: "",
    bankName: "",
    bankBranchName: "",
    amountFromTrlm: "",
    amountFromDepartment: "",
    availableMachineries: "",
    chcManagerDeployed: "",
    chcManagerName: "",
    chcManagerContact: "",
    totalIncomeSinceInception: "",
    totalExpenditureSinceInception: "",
    netProfitOrLoss: "",
    cashInHand: "",
    cashAtBank: ""
  });
  const [lhCboFinancialForms, setLhCboFinancialForms] = useState({
    pg: {
      totalWorkingCapitalReceived: "",
      totalInfrastructureFundReceived: "",
      totalFundReceivedFromOtherSource: "",
      otherSourceDetails: "",
      totalRepaymentDone: "",
      balanceFundToBeRepaid: ""
    },
    nfc: {
      totalWorkingCapitalApproved: "",
      totalWorkingCapitalUsed: "",
      totalRepaymentDone: "",
      balanceFundToBeRepaid: ""
    },
    ifc: {
      totalWorkingCapitalApproved: "",
      totalWorkingCapitalUsed: "",
      totalShareMoneyUsed: "",
      balanceFund: ""
    },
    fpc: {
      totalWorkingCapitalApproved: "",
      totalWorkingCapitalUsed: "",
      totalShareMoneyUsed: "",
      balanceFund: ""
    }
  });
  const [lhCboIncomeForms, setLhCboIncomeForms] = useState({
    pg: {
      totalIncomeSinceLastYear: "",
      totalIncomeUpToLastMonth: "",
      totalRecurringExpenditureLastMonth: "",
      netProfitUpToLastMonth: ""
    },
    nfc: {
      totalIncomeSinceLastYear: "",
      totalIncomeUpToLastMonth: "",
      totalRecurringExpenditureLastMonth: "",
      netProfitUpToLastMonth: ""
    },
    ifc: {
      totalIncomeSinceLastYear: "",
      totalIncomeUpToLastMonth: "",
      totalRecurringExpenditureLastMonth: "",
      netProfitUpToLastMonth: ""
    },
    fpc: {
      totalIncomeSinceLastYear: "",
      totalIncomeUpToLastMonth: "",
      totalRecurringExpenditureLastMonth: "",
      netProfitUpToLastMonth: ""
    }
  });
  const [financialSupportForm, setFinancialSupportForm] = useState({
    activityOfMember: "",
    financialSupportRequired: false,
    loanCyclePreferred: ""
  });
  const [pastSupportForm, setPastSupportForm] = useState({
    topActivity: "",
    topAmount: "",
    topLoanThrough: "",
    bottomActivity: "",
    bottomAmount: "",
    bottomLoanThrough: "",
    interestRate: "",
    repaymentCompleted: "",
    transactionStatus: ""
  });
  const [transactionDetailsForm, setTransactionDetailsForm] = useState({
    presentMonthLoanRepaymentStatus: "",
    paymentDetailsBy: "",
    paymentSlipName: "",
    paymentSlipUri: "",
    paymentSlipType: "",
    principalPaid: "",
    interestPaid: "",
    totalPaid: ""
  });
  const [investmentProfile, setInvestmentProfile] = useState({
    totalInvestment: "",
    loanFromShg: "",
    loanFromBank: "",
    individualFinancing: "",
    ownContribution: "",
    csr: "",
    governmentGrant: "",
    otherSource: ""
  });
  const [incomeProfile, setIncomeProfile] = useState({
    totalIncomeLastYear: "",
    presentMonthIncome: "",
    futureProjection: "",
    month1: "",
    month2: "",
    month3: "",
    month4: "",
    month5: "",
    month6: ""
  });
  // Just the useState declaration lives here (order-independent); the
  // derived value and setter helper move below, after selectedAssignedMember
  // is declared, since they read its id.
  const [activityProfileIdByMember, setActivityProfileIdByMember] = useState({});

  // Graph page state
  const [graphType, setGraphType] = useState(null);
  const [graphImageFailed, setGraphImageFailed] = useState(false);
  const [gpOptions, setGpOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [selectedGpId, setSelectedGpId] = useState(user.gpId || "");
  const [selectedVillageId, setSelectedVillageId] = useState(user.villageId || "");
  const [openGpSelector, setOpenGpSelector] = useState(false);
  const [openVillageSelector, setOpenVillageSelector] = useState(false);
  const [crpOptions, setCrpOptions] = useState([]);
  const [selectedCrpRegistrationId, setSelectedCrpRegistrationId] = useState("");
  const [openCrpSelector, setOpenCrpSelector] = useState(false);

  // Restores the CRP/GP/Village/SHG/Member selection after a page reload -
  // see DASHBOARD_SELECTION_STORAGE_KEY comment above for why this exists.
  // selectionHydrated gates the persist effect below so it never fires with
  // blank initial state and overwrites a real saved selection before the
  // restore read completes.
  const [selectionHydrated, setSelectionHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(DASHBOARD_SELECTION_STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) {
          return;
        }
        const saved = JSON.parse(raw);
        if (saved.crpRegistrationId) {
          setSelectedCrpRegistrationId(saved.crpRegistrationId);
        }
        if (saved.gpId) {
          setSelectedGpId(saved.gpId);
        }
        if (saved.villageId) {
          setSelectedVillageId(saved.villageId);
        }
        if (saved.shgName) {
          setShgName(saved.shgName);
        }
        if (saved.memberName) {
          setMemberName(saved.memberName);
        }
        // lastActivityProfileId (Income Profile's FK to Activity Profile)
        // had the exact same reload-wipes-it bug as the member selection
        // above - activityProfileIdByMember was only ever in React state,
        // so a reload lost the link even though the Activity Profile
        // record still existed server-side (confirmed live via
        // GET /api/activity-profile/get/{id}). Restored the same way.
        if (saved.activityProfileIdByMember && typeof saved.activityProfileIdByMember === "object") {
          setActivityProfileIdByMember(saved.activityProfileIdByMember);
        }
      })
      .catch((error) => {
        console.warn("Unable to restore dashboard selection:", error);
      })
      .finally(() => {
        if (active) {
          setSelectionHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectionHydrated) {
      return;
    }

    AsyncStorage.setItem(
      DASHBOARD_SELECTION_STORAGE_KEY,
      JSON.stringify({
        crpRegistrationId: selectedCrpRegistrationId,
        gpId: selectedGpId,
        villageId: selectedVillageId,
        shgName,
        memberName,
        activityProfileIdByMember
      })
    ).catch((error) => {
      console.warn("Unable to save dashboard selection:", error);
    });
  }, [
    selectionHydrated,
    selectedCrpRegistrationId,
    selectedGpId,
    selectedVillageId,
    shgName,
    memberName,
    activityProfileIdByMember
  ]);

  const [showDashboardAlerts, setShowDashboardAlerts] = useState(false);
  const [hasAutoShownDashboardAlerts, setHasAutoShownDashboardAlerts] = useState(false);
  const dashboardNotificationItems = alerts.length
    ? alerts.map((item) => item.message).filter(Boolean)
    : [];
  const dashboardAlertCount = dashboardNotificationItems.length;
  const firstDashboardNotification =
    dashboardNotificationItems[0] || "No pending alerts";
  const dashboardInlineAlertMessage =
    dashboardNotificationItems.length > 0
      ? dashboardNotificationItems.join(" | ")
      : "No pending alerts";
  const selectedAssignedMember =
    effectiveAssignedShgMembers.find(
      (item) => item.shgName === shgName && item.memberName === memberName
    ) ||
    effectiveAssignedShgMembers.find((item) => item.memberName === memberName) ||
    effectiveAssignedShgMembers[0] ||
    null;
  const selectedShgName = selectedAssignedMember?.shgName || shgName || "-";
  const selectedMemberName = selectedAssignedMember?.memberName || memberName || "-";

  // Keyed by SHG member id - NOT a single flat value. A flat value was a
  // real bug: if the CRP saved SHG Member Details for one member, then
  // opened a DIFFERENT member's Activity Profile screen without redoing
  // that step for them, the app would silently reuse the first member's
  // LivelihoodId (a real, valid id - so it passed the "is this zero"
  // check) against the wrong member's record. That's the most likely
  // explanation for the FK error recurring after the first fix.
  const currentMemberKey = selectedAssignedMember?.id || "unassigned";
  const lastActivityProfileId = activityProfileIdByMember[currentMemberKey] || 0;
  const setLastActivityProfileId = (value) => {
    setActivityProfileIdByMember((prev) => ({ ...prev, [currentMemberKey]: value }));
  };

  const showResponsePopup = (title, message, nextView = "", badge = "Response") => {
    setResponsePopup({
      visible: true,
      badge,
      title,
      message,
      fields: [],
      nextView,
      imageUri: ""
    });
  };

  const showResponsePopupWithImage = (
    title,
    message,
    nextView = "",
    badge = "Response",
    imageUri = ""
  ) => {
    setResponsePopup({
      visible: true,
      badge,
      title,
      message,
      fields: [],
      nextView,
      imageUri
    });
  };

  const closeResponsePopup = () => {
    const nextView = responsePopup.nextView;

    setResponsePopup({
      visible: false,
      badge: "Response",
      title: "",
      message: "",
      fields: [],
      nextView: "",
      imageUri: ""
    });

    if (nextView) {
      onOpenUpdateData(nextView);
    }
  };
  // Web-safe replacement for Alert.alert (react-native-web Alert is a no-op).
  const showAppAlert = (title, message) => {
    showResponsePopup(title, message || "", "", "Alert");
  };



  const renderResponsePopup = () => {
    const isSaved = responsePopup.badge === "Saved";
    const iconCircleStyle = isSaved ? tsDetailStyles.modalIconCircleSaved : tsDetailStyles.modalIconCircleAlert;
    const iconTextStyle = isSaved ? tsDetailStyles.modalIconTextSaved : tsDetailStyles.modalIconTextAlert;
    const badgeChipStyle = isSaved ? tsDetailStyles.modalBadgeSaved : tsDetailStyles.modalBadgeAlert;
    const badgeTextStyle = isSaved ? tsDetailStyles.modalBadgeTextSaved : tsDetailStyles.modalBadgeTextAlert;

    return (
      <Modal
        animationType="fade"
        transparent
        visible={responsePopup.visible}
        onRequestClose={closeResponsePopup}
      >
        <View style={tsDetailStyles.modalOverlay}>
          <View style={tsDetailStyles.modalCard}>
            <View style={[tsDetailStyles.modalIconCircle, iconCircleStyle]}>
              <Text style={[tsDetailStyles.modalIconText, iconTextStyle]}>
                {isSaved ? "\u2713" : "!"}
              </Text>
            </View>
            <Text style={tsDetailStyles.modalTitle}>{responsePopup.title}</Text>
            <View style={[tsDetailStyles.modalBadge, badgeChipStyle]}>
              <Text style={[tsDetailStyles.modalBadgeText, badgeTextStyle]}>{responsePopup.badge}</Text>
            </View>

            <View style={tsDetailStyles.modalContentCard}>
              <ScrollView style={tsDetailStyles.modalScroll} showsVerticalScrollIndicator={false}>
                {responsePopup.imageUri ? (
                  <Image source={{ uri: responsePopup.imageUri }} style={tsDetailStyles.modalPreviewImage} />
                ) : null}

                {responsePopup.fields?.length ? (
                  responsePopup.fields.map((field, index) => (
                    <View
                      key={`${field.label}-${index}`}
                      style={[
                        tsDetailStyles.modalFieldRow,
                        index === responsePopup.fields.length - 1 && tsDetailStyles.modalFieldRowLast
                      ]}
                    >
                      <Text style={tsDetailStyles.modalFieldLabel}>{field.label}</Text>
                      <Text style={tsDetailStyles.modalFieldValue}>{field.value}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={tsDetailStyles.modalMessage}>{responsePopup.message}</Text>
                )}
              </ScrollView>
            </View>

            <Pressable style={tsDetailStyles.modalPrimaryBtnWide} onPress={closeResponsePopup}>
              <Text style={tsDetailStyles.modalPrimaryBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const buildSaveFields = (data) => {
    if (!data || typeof data !== "object") {
      return [];
    }

    return Object.entries(data)
      .filter(([, value]) => value !== "" && value !== null && value !== undefined)
      .map(([key, value]) => {
        const resolvedValue = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "boolean"
            ? value ? "Yes" : "No"
            : String(value);
        return { label: humanizeKey(key), value: resolvedValue };
      });
  };

  const buildSaveSummary = (data) => {
    if (!data || typeof data !== "object") {
      return "No values entered yet.";
    }

    const lines = Object.entries(data)
      .filter(([, value]) => value !== "" && value !== null && value !== undefined)
      .map(([key, value]) => {
        const resolvedValue = Array.isArray(value)
          ? value.join(", ")
          : typeof value === "boolean"
            ? value ? "Yes" : "No"
            : String(value);
        return `${humanizeKey(key)}: ${resolvedValue}`;
      });

    return lines.length ? lines.join("\n") : "No values entered yet.";
  };

  const showSavedDataPopup = (title, data, nextView = "") => {
    const fields = buildSaveFields(data);
    setResponsePopup({
      visible: true,
      badge: "Saved",
      title,
      message: fields.length ? "" : "No values entered yet.",
      fields,
      nextView,
      imageUri: activeLhCboImage || uploadedImageUri || ""
    });
  };

  const buildActivityProfilePayload = (profileType, data, extra = {}) => {
    const coordinates = activityCoordinates || currentCrpLocation;
    const cleanedData = data && typeof data === "object" ? data : {};

    return {
      profileType,
      activityProfileType: profileType,
      crpRegistrationId:
        selectedCrpRecord?.crpRegistrationId ||
        selectedCrpRecord?.id ||
        user.crpRegistrationId ||
        0,
      crpId: headerCrpId,
      crpName: headerCrpName,
      shgMemberId: selectedAssignedMember?.id || 0,
      memberId: selectedAssignedMember?.id || 0,
      memberName: selectedMemberName === "-" ? "" : selectedMemberName,
      shgName: selectedShgName === "-" ? "" : selectedShgName,
      lhCboType,
      lhCboTypeKey: selectedLhCboTypeKey,
      lhCboName: selectedLhCboName,
      lhCboActivity: displayedLhCboActivity,
      activity: displayedLhCboActivity,
      longitude: coordinates ? Number(coordinates.longitude) || 0 : 0,
      latitude: coordinates ? Number(coordinates.latitude) || 0 : 0,
      radiusValid: geoStatusVariant === "green" || isWithin50Meters,
      geoStatus: geoStatusVariant,
      submittedAt: new Date().toISOString(),
      data: cleanedData,
      ...cleanedData,
      ...extra
    };
  };

  const saveActivityProfile = async (title, data, nextView = "", options = {}) => {
    const saveKey = options.saveKey || title;

    if (apiSavingKey) {
      return;
    }

    try {
      setApiSavingKey(saveKey);
      const payload = buildActivityProfilePayload(
        options.profileType || title,
        data,
        options.extra
      );
      const response = await submitActivityProfile(payload);
      const savedRecord = Array.isArray(response) ? response[0] : response;
      const savedProfileId =
        savedRecord?.LivelihoodId ??
        savedRecord?.livelihoodId ??
        savedRecord?.activityProfileId ??
        savedRecord?.ActivityProfileId ??
        savedRecord?.id ??
        savedRecord?.Id ??
        null;
      if (savedProfileId !== null && savedProfileId !== undefined) {
        setLastActivityProfileId(Number(savedProfileId) || 0);
      }
      showSavedDataPopup(title, data, nextView);
    } catch (error) {
      showAppAlert(
        title,
        error.message || "Unable to save activity profile right now."
      );
    } finally {
      setApiSavingKey("");
    }
  };

  // Resolves a typed production name to a productionId from the master
  // list, creating it server-side via production-master/save if it isn't
  // there yet. /api/activity-profile/save rejects the whole request with
  // a 400 ("Productions field is required") if `productions` is missing
  // or its productionId can't resolve to a real record - this is what was
  // happening before (the payload didn't even have a `productions` array).
  const resolveProductionId = async (name) => {
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return 0;
    }

    const existing = productionMasterOptions.find(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      return Number(existing.id) || 0;
    }

    // Previously this silently returned 0 on any failure - which is
    // exactly why you got a confusing downstream FK error on productionId
    // instead of a clear message about production creation itself failing.
    // Now it throws, so the real reason surfaces in the Save alert.
    //
    // CONFIRMED via live swagger.json: /api/production-master/save takes
    // `id`/`name` as query-string params (same shape as submitTrainingAgency),
    // not a JSON body - the old {ProductionName} JSON body was always
    // ignored server-side, hence "The name field is required" every time.
    // The save response is a plain success message with no id in it, so the
    // new productionId has to be looked up afterward.
    //
    // /production-master/search came back empty right after a successful
    // save (confirmed live) - not reliable for a just-created row. Using
    // get-all instead, same as the initial options list is loaded with.
    await submitProductionMaster({ name: trimmedName });
    const matches = await fetchProductionMaster();
    const savedRecord =
      matches.find((item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase()) ||
      matches[0];
    const newId = savedRecord?.id ?? 0;
    if (!newId) {
      throw new Error(
        `Production "${trimmedName}" was saved but couldn't be found afterward in the list (got: ${JSON.stringify(matches)}).`
      );
    }
    setProductionMasterOptions((prev) => [...prev, { id: Number(newId), name: trimmedName }]);
    return Number(newId);
  };

  // Farm, Livestock, and Fishery Activity Profiles all clearly share one
  // schema server-side (activityId/area/unitId/activityTypeId/seasonId/
  // perennialValue/landTypeId/productions[]) - confirmed by the exact
  // payload you gave me. Livestock has no land/unit/season concept, so
  // those resolve to 0 for it; Fishery reuses unit/activityType but not
  // land type. `kind` picks which of the shared `activityProfile` state's
  // fields maps to "area".
  const buildFarmLivestockFisheryPayload = async (kind) => {
    const resolvedActivityId =
      activityTypes.find((item) => item.name === activityType)?.id || 0;

    const areaValue =
      kind === "livestock"
        ? activityProfile.totalLivestock
        : kind === "fishery"
          ? activityProfile.waterbodyArea
          : activityProfile.areaQuantity;

    const unitName = kind === "livestock" ? "" : activityProfile.areaUnit;
    const resolvedUnitId =
      unitOfAreaRecords.find((item) => item.name === unitName)?.id || 0;

    // CONFIRMED live via GET /api/activity-type/get-all:
    // [{ActivityTypeId:1,ActivityTypeName:"Seasonal"},{ActivityTypeId:2,
    // ActivityTypeName:"Perennial"}]. Resolved from the live-fetched list
    // now instead of a hardcoded map.
    const resolvedActivityTypeId =
      activityTypeRecords.find((item) => item.name === activityProfile.activityMode)?.id || 0;

    const resolvedSeasonId =
      activityProfile.activityMode === "Seasonal"
        ? seasonRecords.find((item) => item.name === activityProfile.seasonality)?.id || 0
        : 0;

    const resolvedLandTypeId =
      kind === "farm"
        ? landTypeRecords.find((item) => item.name === activityProfile.landType)?.id || 0
        : 0;

    const productionId = await resolveProductionId(activityProfile.productionName);

    const payload = {
      // CONFIRMED via your Swagger test: omitting this field entirely on
      // create succeeds and the server auto-generates + returns the real
      // id (`{"Message":"Inserted Successfully","Id":2}`). Every previous
      // theory about what value this needed (0, the /api/livelihood id)
      // was wrong - the fix was to not send the key at all.
      //
      // activityProfileId must be sent explicitly as null on create (per
      // your instruction) - not omitted, and not 0.
      activityProfileId: null,
      activityId: resolvedActivityId,
      area: Number(areaValue) || 0,
      activityTypeId: resolvedActivityTypeId,
      perennialValue: activityProfile.activityMode === "Perennial" ? String(activityProfile.period || "") : "",
      productions: [
        {
          productionId,
          productionQty: Number(activityProfile.productionQty) || 0,
          productionUnit: String(activityProfile.productionUnit || "")
        }
      ]
    };

    // CONFIRMED via your Swagger test: sending seasonId:0 for a Perennial
    // record hits the exact same FK error as activityProfileId:0 did.
    // Same fix, same lesson - when a field genuinely doesn't apply
    // (Season for Perennial; unitId/landTypeId for Livestock; landTypeId
    // for Fishery), omit the key entirely rather than sending 0. Applying
    // this to all three preemptively rather than waiting to hit the same
    // bug three more times on Livestock and Fishery saves.
    if (resolvedUnitId) {
      payload.unitId = resolvedUnitId;
    }
    if (resolvedSeasonId) {
      payload.seasonId = resolvedSeasonId;
    }
    if (resolvedLandTypeId) {
      payload.landTypeId = resolvedLandTypeId;
    }

    return payload;
  };

  const handleSaveFarmLivestockFisheryProfile = async (kind, title, nextView = "") => {
    if (apiSavingKey) {
      return;
    }

    if (!activityProfile.productionName?.trim()) {
      showAppAlert(title, "Enter the Name of the production before saving - the server requires it.");
      return;
    }

    const resolvedActivityId =
      activityTypes.find((item) => item.name === activityType)?.id || 0;
    if (!resolvedActivityId) {
      // This is the exact scenario in the FK-constraint error you hit in
      // Swagger: activityId 0 doesn't exist in the Activity table.
      // Catching it here instead of letting the server reject it.
      showAppAlert(
        title,
        "Select a Livelihood Activity first (Farm/Fishery/Livestock etc.) - the list may still be loading, try again in a moment."
      );
      return;
    }

    if (kind !== "livestock") {
      const unitName = activityProfile.areaUnit;
      const resolvedUnitId = unitOfAreaRecords.find((item) => item.name === unitName)?.id || 0;
      if (!resolvedUnitId) {
        showAppAlert(title, "Select a Unit of Area before saving.");
        return;
      }
    }

    if (kind === "farm") {
      const resolvedLandTypeId =
        landTypeRecords.find((item) => item.name === activityProfile.landType)?.id || 0;
      if (!resolvedLandTypeId) {
        showAppAlert(title, "Select a Type of Land before saving.");
        return;
      }
    }

    if (!activityProfile.activityMode) {
      showAppAlert(title, "Select whether the activity is Seasonal or Perennial before saving.");
      return;
    }

    if (activityProfile.activityMode === "Seasonal") {
      const resolvedSeasonId =
        seasonRecords.find((item) => item.name === activityProfile.seasonality)?.id || 0;
      if (!resolvedSeasonId) {
        showAppAlert(title, "Select a Season before saving.");
        return;
      }
    }

    if (!activityProfile.productionQty || Number(activityProfile.productionQty) <= 0) {
      showAppAlert(title, "Enter a Production Quantity greater than 0 before saving.");
      return;
    }

    if (!activityProfile.productionUnit) {
      showAppAlert(title, "Select a Production Unit before saving.");
      return;
    }

    try {
      setApiSavingKey(title);
      const payload = await buildFarmLivestockFisheryPayload(kind);
      const response = await submitActivityProfile(payload);
      // Same array-wrapping pattern confirmed on /api/livelihood
      // ([{"LivelihoodId":103}]) may well apply here too - unwrap
      // defensively rather than assuming a plain object.
      const savedRecord = Array.isArray(response) ? response[0] : response;
      const savedProfileId =
        savedRecord?.LivelihoodId ??
        savedRecord?.livelihoodId ??
        savedRecord?.activityProfileId ??
        savedRecord?.ActivityProfileId ??
        savedRecord?.id ??
        savedRecord?.Id ??
        null;
      if (savedProfileId !== null && savedProfileId !== undefined) {
        setLastActivityProfileId(Number(savedProfileId) || 0);
      }
      showSavedDataPopup(title, activityProfile, nextView);
    } catch (error) {
      showAppAlert(title, error.message || "Unable to save activity profile right now.");
    } finally {
      setApiSavingKey("");
    }
  };

  const handleSaveInvestmentProfile = async () => {
    if (apiSavingKey) {
      return;
    }

    if (!selectedAssignedMember) {
      console.log("[Investment profile] blocked - diagnostic state:", {
        selectedVillageId,
        shgName,
        memberName,
        effectiveAssignedShgMembersCount: effectiveAssignedShgMembers.length,
        effectiveAssignedShgMembers,
        shgNames,
        shgMembers
      });
      showAppAlert("Investment profile", "No SHG member selected for this investment profile.");
      return;
    }

    const toNumber = (value) => Number(value) || 0;
    const payload = {
      investmentProfileId: 0,
      shgMemberId: Number(selectedAssignedMember.id) || 0,
      totalInvestment: toNumber(investmentProfile.totalInvestment),
      loanFromSHG: toNumber(investmentProfile.loanFromShg),
      loanFromBank: toNumber(investmentProfile.loanFromBank),
      individualFinancing: toNumber(investmentProfile.individualFinancing),
      ownContribution: toNumber(investmentProfile.ownContribution),
      cef: toNumber(investmentProfile.csr),
      governmentGrant: toNumber(investmentProfile.governmentGrant),
      otherSource: toNumber(investmentProfile.otherSource)
    };

    try {
      setApiSavingKey("investmentProfile");
      await submitInvestmentProfile(payload);
      showSavedDataPopup("Investment profile", investmentProfile);
    } catch (error) {
      showAppAlert(
        "Investment profile",
        error.message || "Unable to save investment profile right now."
      );
    } finally {
      setApiSavingKey("");
    }
  };

  const handleSaveIncomeProfile = async () => {
    if (apiSavingKey) {
      return;
    }

    // Lesson learned the hard way on Activity Profile: activityProfileId:0
    // is a real, valid-looking id that triggers an FK violation, not a
    // harmless placeholder. Income Profile's activityProfileId is a
    // genuine FK to an already-created ActivityProfile row - if none
    // exists yet for this member, block here with a clear message instead
    // of letting the server throw a cryptic FK error.
    if (!lastActivityProfileId) {
      showAppAlert(
        "Income profile",
        "Save the Activity Profile for this member first - Income Profile needs its real id to link to."
      );
      return;
    }

    const toNumber = (value) => Number(value) || 0;
    const payload = {
      // CONFIRMED via live Swagger test: sending incomeProfileId:0 with a
      // reused activityProfileId got "Updated Successfully" against an
      // unexpected existing row, while incomeProfileId:null with a fresh
      // activityProfileId correctly inserted a new row with every field
      // (including totalIncomeLastYear) persisted right. null is what
      // signals "create new" to this endpoint - 0 does not.
      incomeProfileId: null,
      activityProfileId: lastActivityProfileId,
      totalIncomeLastYear: toNumber(incomeProfile.totalIncomeLastYear),
      presentMonthIncome: toNumber(incomeProfile.presentMonthIncome),
      futureProjection: toNumber(incomeProfile.futureProjection),
      month1Income: toNumber(incomeProfile.month1),
      month2Income: toNumber(incomeProfile.month2),
      month3Income: toNumber(incomeProfile.month3),
      month4Income: toNumber(incomeProfile.month4),
      month5Income: toNumber(incomeProfile.month5),
      month6Income: toNumber(incomeProfile.month6)
    };

    console.log("[Income Profile] submitting payload:", payload);

    try {
      setApiSavingKey("incomeProfile");
      const saveResponse = await submitIncomeProfile(payload);
      console.log("[Income Profile] server response:", saveResponse);
      showSavedDataPopup("Income profile", incomeProfile);
    } catch (error) {
      showAppAlert(
        "Income profile",
        error.message || "Unable to save income profile right now."
      );
    } finally {
      setApiSavingKey("");
    }
  };

  const buildFinancialSupportProjection = () => {
    if (!financialSupportForm.financialSupportRequired) {
      return "";
    }

    const cycleMatch = String(financialSupportForm.loanCyclePreferred || "").match(/(\d+)/);
    const cycleNumber = Number(cycleMatch?.[1] || 1);
    const principalMap = {
      1: 25000,
      2: 40000,
      3: 60000
    };
    const tenureMap = {
      1: 12,
      2: 18,
      3: 24
    };
    const principal = principalMap[cycleNumber] || 25000;
    const tenureMonths = tenureMap[cycleNumber] || 12;
    const roi = 8.75;
    const interestAmount = Number(((principal * roi * tenureMonths) / (12 * 100)).toFixed(2));
    const totalRepayable = Number((principal + interestAmount).toFixed(2));
    const monthlyInstallment = Number((totalRepayable / tenureMonths).toFixed(2));

    return [
      `Activity: ${financialSupportForm.activityOfMember || "-"}`,
      `Support Required: Yes`,
      `Preferred Cycle: ${financialSupportForm.loanCyclePreferred || "-"}`,
      "",
      `Loan Amount: Rs. ${principal}`,
      `Tenure for Returns: ${tenureMonths} months`,
      `ROI Fixed: ${roi}%`,
      `Interest Amount: Rs. ${interestAmount}`,
      `Total Repayable: Rs. ${totalRepayable}`,
      `Monthly Installment: Rs. ${monthlyInstallment}`
    ].join("\n");
  };

  // CONFIRMED via live Swagger test on trlm.pickitover.com: /api/financial-support/insert
  // takes {financialSupportId, shgMemberId, activityId, isFinancialSupportRequired,
  // loanCycleId} and returns {"Message":"Inserted Successfully","Id":17} - financialSupportId
  // is sent as null (not omitted, not 0) on create, same as activityProfileId elsewhere.
  const handleSaveFinancialSupport = async () => {
    if (apiSavingKey) {
      return;
    }

    if (!selectedAssignedMember) {
      showAppAlert("Financial Support", "No SHG member selected for this financial support record.");
      return;
    }

    if (!financialSupportForm.activityOfMember || !financialSupportForm.loanCyclePreferred) {
      showAppAlert(
        "Financial Support",
        "Select activity and loan cycle before saving."
      );
      return;
    }

    const resolvedActivityId =
      memberActivityRecords.find((item) => item.name === financialSupportForm.activityOfMember)?.id || 0;
    if (!resolvedActivityId) {
      showAppAlert("Financial Support", "Select a valid Activity of the Member before saving.");
      return;
    }

    const cycleMatch = String(financialSupportForm.loanCyclePreferred || "").match(/(\d+)/);
    const resolvedLoanCycleId = Number(cycleMatch?.[1]) || 0;

    const payload = {
      financialSupportId: null,
      shgMemberId: Number(selectedAssignedMember.id) || 0,
      activityId: resolvedActivityId,
      isFinancialSupportRequired: !!financialSupportForm.financialSupportRequired,
      loanCycleId: resolvedLoanCycleId
    };

    try {
      setApiSavingKey("financialSupport");
      await submitFinancialSupport(payload);
      const calculationSummary = buildFinancialSupportProjection();
      const enteredValuesSummary = buildSaveSummary(financialSupportForm);
      const popupMessage = calculationSummary
        ? `${calculationSummary}\n\nEntered Values\n${enteredValuesSummary}`
        : enteredValuesSummary;
      showResponsePopup("Saved", popupMessage, "technicalSupport");
    } catch (error) {
      showAppAlert(
        "Financial Support",
        error.message || "Unable to save financial support right now."
      );
    } finally {
      setApiSavingKey("");
    }
  };

  // technicalSupportForm.skillDate/edpDate are stored in DD-MM-YYYY display
  // format (see formatIsoDateToDisplay, used when the date picker confirms
  // a selection) - not ISO. new Date("16-09-2026") is not a format the JS
  // Date parser understands, so it silently produced Invalid Date here and
  // this always returned null regardless of what date was actually picked.
  // Confirmed live: the request payload showed skillTrainingDate/
  // edpTrainingDate as null even after selecting a real date, and the
  // saved record came back with both dates null. Converting back to ISO
  // via formatDisplayDateToIso first fixes it.
  const toIsoDateOrNull = (value) => {
    const isoValue = formatDisplayDateToIso(value);
    if (!isoValue) {
      return null;
    }
    const parsed = new Date(isoValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  };

  const handleSaveTechnicalSupport = async () => {
    if (apiSavingKey) {
      return;
    }

    // Trade/agency ids resolved from /api/trade/get-all and
    // /api/training-agency/get-all instead of hardcoded 0 - previously
    // whatever the user picked in these dropdowns was silently discarded
    // and the server always got 0 regardless of the selection.
    const resolveTradeId = (name) =>
      tradeRecords.find((item) => item.name === name)?.id || 0;
    const resolveAgencyId = (name) =>
      trainingAgencyRecords.find((item) => item.name === name)?.id || 0;

    const payload = {
      // null (not 0) signals "create new" - confirmed on income-profile/save
      // that an explicit 0 can be misread as an existing record's id.
      technicalSupportId: null,
      // shgMemberId comes from selectedAssignedMember, sourced from the SHG
      // Livelihood member API (fetchShgMembersByVillage) - same as SHG
      // Tracking and Income/Investment Profile.
      shgMemberId: selectedAssignedMember?.id || 0,
      hasSkillTraining: technicalSupportForm.havingSkillTraining === "Yes",
      skillTradeId: resolveTradeId(technicalSupportForm.skillTrade),
      skillTrainingDate: toIsoDateOrNull(technicalSupportForm.skillDate),
      skillAgencyId: resolveAgencyId(technicalSupportForm.skillThrough),
      hasEDPTraining: technicalSupportForm.havingEdpTraining === "Yes",
      edpTradeId: resolveTradeId(technicalSupportForm.edpTrade),
      edpTrainingDate: toIsoDateOrNull(technicalSupportForm.edpDate),
      edpAagencyId: resolveAgencyId(technicalSupportForm.edpThrough),
      trainingRequired: technicalSupportForm.trainingRequirement === "Yes",
      requiredTradeId: resolveTradeId(technicalSupportForm.trainingRequiredTrade)
    };

    try {
      setApiSavingKey("technicalSupport");
      await submitTechnicalSupport(payload);
      showSavedDataPopup("Technical support details", technicalSupportForm, "technicalSupport");
    } catch (error) {
      showAppAlert(
        "Technical support",
        error.message || "Unable to save technical support details right now."
      );
    } finally {
      setApiSavingKey("");
    }
  };

  const handleOpenTechnicalSupportModule = async (targetView, stageLabel = "") => {
    const meters = await checkRadiusDistance(false);
    const canProceed = meters !== null && meters <= 50;

    if (!canProceed) {
      showResponsePopup(
        "Geo Verification Required",
        "Enable location and get the green geo token before opening support modules."
      );
      return;
    }

    if (stageLabel) {
      setSupportStage(stageLabel);
    }
    onOpenUpdateData(targetView);
  };

  // CONFIRMED live via GET /api/shg-tracking/get_Support/{shgMemberId}:
  // {SHGMemberId, PastSupport:{Financial:[],Technical:[]}, PresentSupport:
  // {...}, SupportRequired:{...}} - one fetch backs all three segment
  // buttons, keyed by which one was tapped.
  const handleOpenSupportHistory = async (stageLabel) => {
    const meters = await checkRadiusDistance(false);
    const canProceed = meters !== null && meters <= 50;

    if (!canProceed) {
      showResponsePopup(
        "Geo Verification Required",
        "Enable location and get the green geo token before opening support modules."
      );
      return;
    }

    if (!selectedAssignedMember) {
      showAppAlert("Support History", "No SHG member selected.");
      return;
    }

    setSupportStage(stageLabel);

    try {
      setSupportHistoryLoading(true);
      const data = await fetchShgTrackingSupport(Number(selectedAssignedMember.id) || 0);
      setSupportHistory(data);
      onOpenUpdateData("technicalSupportHistory");
    } catch (error) {
      showAppAlert("Support History", error.message || "Unable to load support history right now.");
    } finally {
      setSupportHistoryLoading(false);
    }
  };

  const openDatePicker = (scope, field, title, currentValue = "") => {
    setTrainingDatePicker({
      visible: true,
      scope,
      field,
      title,
      value: formatDisplayDateToIso(currentValue)
    });
  };

  const closeTrainingDatePicker = () => {
    setTrainingDatePicker({
      visible: false,
      scope: "",
      field: "",
      title: "",
      value: ""
    });
  };

  const confirmTrainingDatePicker = () => {
    if (!trainingDatePicker.field || !trainingDatePicker.value) {
      closeTrainingDatePicker();
      return;
    }

    const displayDate = formatIsoDateToDisplay(trainingDatePicker.value);
    if (trainingDatePicker.scope === "technicalSupport") {
      setTechnicalSupportForm((prev) => ({
        ...prev,
        [trainingDatePicker.field]: displayDate
      }));
    }
    if (trainingDatePicker.scope === "nonFarm") {
      setNonFarmEnterprise((prev) => ({
        ...prev,
        [trainingDatePicker.field]: displayDate
      }));
    }
    closeTrainingDatePicker();
    showResponsePopup("Date Selected", `${trainingDatePicker.title}: ${displayDate}`);
  };

  const renderAlertPopup = () =>
    showDashboardAlerts ? (
      <View style={[pageStyles.alertPopupOverlay, { pointerEvents: "box-none" }]}>
        <Pressable
          style={pageStyles.alertPopupCard}
          onPress={() => setShowDashboardAlerts(false)}
        >
          <View style={pageStyles.dashboardAlertHeader}>
            <View style={pageStyles.dashboardAlertIconWrap}>
              <Text style={pageStyles.dashboardAlertIcon}>!</Text>
            </View>
            <View style={pageStyles.dashboardAlertCopy}>
              <Text style={pageStyles.dashboardAlertTitle}>Notifications</Text>
              <Text style={pageStyles.dashboardAlertHint}>{firstDashboardNotification}</Text>
            </View>
            <View style={pageStyles.dashboardAlertBadge}>
              <Text style={pageStyles.dashboardAlertBadgeText}>{dashboardAlertCount}</Text>
            </View>
          </View>
          <View style={pageStyles.dashboardAlertList}>
            {dashboardNotificationItems.map((item, index) => (
              <View key={`${item}-${index}`} style={pageStyles.dashboardAlertListRow}>
                <View style={pageStyles.dashboardAlertListDot} />
                <Text style={pageStyles.dashboardAlertListText}>{item}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </View>
    ) : null;

  const handleGraphPress = (type) => {
    setGraphType(type);
    setGraphImageFailed(false);
  };

  const closeGraphView = () => {
    setGraphType(null);
  };

  const graphData = useMemo(
    () => ({
      visits: {
        title: "visits",
        values:
          Array.isArray(dashboardMetrics.visitGraph) && dashboardMetrics.visitGraph.length
            ? dashboardMetrics.visitGraph
            : [0, 0, 0, 0, 0, 0, 0],
        color: "#3b67b8"
      },
      members: {
        title: "members",
        values: [
          Number(dashboardMetrics.shgMembersAssigned || 0),
          Number(dashboardMetrics.totalMembersVisited || 0),
          Number(dashboardMetrics.totalMembersVisitedToday || 0),
          Math.max(
            Number(dashboardMetrics.shgMembersAssigned || 0) -
              Number(dashboardMetrics.totalMembersVisited || 0),
            0
          )
        ],
        color: "#0f766e"
      },
      honorarium: {
        title: "honorarium",
        values: [
          Number(dashboardMetrics.honorariumReceived || 0),
          Number(dashboardMetrics.honorariumToBeClaimed || 0)
        ],
        color: "#f97316"
      }
    }),
    [
      dashboardMetrics.honorariumReceived,
      dashboardMetrics.honorariumToBeClaimed,
      dashboardMetrics.shgMembersAssigned,
      dashboardMetrics.totalMembersVisited,
      dashboardMetrics.totalMembersVisitedToday,
      dashboardMetrics.visitGraph
    ]
  );

  const pieMetaByType = useMemo(
    () => ({
      visits: {
        title: "Visit Distribution (Last 30 days)",
        unit: "visits",
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        values: [
          graphData.visits.values[0] + graphData.visits.values[1],
          graphData.visits.values[2] + graphData.visits.values[3],
          graphData.visits.values[4] + graphData.visits.values[5],
          graphData.visits.values[6]
        ],
        colors: ["#2563eb", "#0f766e", "#f97316", "#9333ea"]
      },
      members: {
        title: "SHG Member Coverage",
        unit: "members",
        labels: ["Assigned", "Visited", "Revisit", "Pending"],
        values: [
          Number(dashboardMetrics.shgMembersAssigned || 0),
          Number(dashboardMetrics.totalMembersVisited || 0),
          0,
          0
        ],
        colors: ["#1d4ed8", "#0891b2", "#16a34a", "#f59e0b"]
      },
      honorarium: {
        title: "Honorarium Composition",
        unit: "amount",
        labels: ["Received", "To be Claimed"],
        values: [
          Number(dashboardMetrics.honorariumReceived || 0),
          Number(dashboardMetrics.honorariumToBeClaimed || 0)
        ],
        colors: ["#f97316", "#22c55e"]
      }
    }),
    [
      dashboardMetrics.honorariumReceived,
      dashboardMetrics.honorariumToBeClaimed,
      dashboardMetrics.shgMembersAssigned,
      dashboardMetrics.totalMembersVisited,
      dashboardMetrics.totalMembersVisitedToday,
      graphData
    ]
  );

  const selectedPieMeta = graphType ? pieMetaByType[graphType] : null;
  const selectedPieTotal = selectedPieMeta
    ? selectedPieMeta.values.reduce((sum, current) => sum + Math.max(0, Number(current) || 0), 0)
    : 0;
  const selectedGraphMax = selectedPieMeta
    ? Math.max(...selectedPieMeta.values.map((value) => Math.max(0, Number(value) || 0)), 1)
    : 1;

  const isWithin50Meters = distanceToMember !== null && distanceToMember <= 50;
  const geoStatusVariant =
    locationPromptRequired || distanceToMember === null
      ? "idle"
      : isWithin50Meters
        ? "green"
        : "red";
  const selectedGp =
    gpOptions.find((item) => String(item.id) === String(selectedGpId)) || null;
  const selectedVillage =
    villageOptions.find((item) => String(item.id) === String(selectedVillageId)) || null;
  const selectedCrpRecord =
    crpOptions.find((item) => String(item.id) === String(selectedCrpRegistrationId)) || null;
  const headerCrpId = selectedCrpRecord?.crpId || user.identity || "-";
  const headerCrpName = selectedCrpRecord?.fullName || user.name || "-";
  const headerCrpInitials = String(headerCrpName || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "CR";
  const dashboardDateLabel = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const dashboardHighlights = [
    {
      key: "visits",
      label: "Field Visits",
      value: dashboardMetrics.totalVisits30,
      hint: "Last 30 days",
      tint: "#295fd6"
    },
    {
      key: "members",
      label: "Members Visited",
      value: dashboardMetrics.totalMembersVisited,
      hint: "Coverage till today",
      tint: "#0f766e"
    },
    {
      key: "claim",
      label: "To Be Claimed",
      value: dashboardMetrics.honorariumToBeClaimed,
      hint: "Current honorarium",
      tint: "#f97316"
    },
    {
      key: "received",
      label: "Last Received",
      value: dashboardMetrics.honorariumReceived || 0,
      hint: "Previous credit",
      tint: "#7c3aed"
    }
  ];
  const effectiveBlockId = selectedCrpRecord?.blockId || user.blockId || "";
  const normalizedSubCategory =
    subCategory === "Non-Farm" ? "NonFarm" : subCategory;
  const statusBySubCategory = {
    Farm: "lhStatusFarm",
    NonFarm: "lhStatusNonFarm",
    Livestock: "lhStatusLivestock",
    Fishery: "lhStatusFishery"
  };
  const activityBySubCategory = {
    Farm: "lhActivityFarm",
    NonFarm: "lhActivityNonFarm",
    Livestock: "lhActivityLivestock",
    Fishery: "lhActivityFishery"
  };
  const currentStatusView = statusBySubCategory[normalizedSubCategory] || "lhStatusFarm";
  const selectedLhCboTypeKey = getLhCboTypeKey(lhCboType);
  const lhCboStatusViewByType = {
    "Producer Group (PG)": "lhCboStatusPg",
    "Non-Farm Collective (NFC)": "lhCboStatusNfc",
    "Integrated Farming Cluster (IFC)": "lhCboStatusIfc",
    "Custom Hiring Center (CHC)": "lhCboStatusChc",
    "Farmer Producer Company (FPC)": "lhCboStatusFpc"
  };
  const selectedLhCboStatusView = lhCboStatusViewByType[lhCboType] || "lhCboStatusPg";
  const displayedLhCboActivity = isChcEnterprisesMode
    ? CHC_ACTIVITY_DISPLAY
    : selectedLhCboActivity;
  const activeLhCboImage =
    lhCboImages.length > 0 ? lhCboImages[Math.min(lhCboImageIndex, lhCboImages.length - 1)] : "";

  const checkRadiusDistance = async (silent = false) => {
    setIsDistanceLoading(true);
    setLocationPromptRequired(false);
    try {
      const current = await getCurrentLocation();
      if (!current) {
        setDistanceToMember(null);
        setCurrentCrpLocation(null);
        setLocationPromptRequired(true);
        if (!silent) {
          const locationHelp =
            Platform.OS === "web"
              ? "Allow browser location, ensure page is running in secure context (https/localhost), then tap Check 50m Radius again."
              : "Please enable device location permission and GPS, then tap Check 50m Radius again.";
          showAppAlert("Enable Location", locationHelp);
        }
        return null;
      }
      setCurrentCrpLocation(current);
      if (homeView === "workingReport" && selectedAssignedMember) {
        const hasLockedGeo =
          Number.isFinite(Number(selectedAssignedMember.latitude)) &&
          Number.isFinite(Number(selectedAssignedMember.longitude));

        if (!hasLockedGeo) {
          const lockedLocation = {
            latitude: current.latitude,
            longitude: current.longitude
          };

          setActivityCoordinates(lockedLocation);
          setDistanceToMember(0);
          onLockAssignedShgLocation?.(selectedAssignedMember.id, lockedLocation);
          if (!silent) {
            showAppAlert(
              "SHG Geolocation Locked",
              "Current device location has been locked for this assigned SHG. Next checks will compare against this point."
            );
          }
          return 0;
        }
      }
      if (!activityCoordinates) {
        const autoGeneratedLocation = {
          latitude: current.latitude,
          longitude: current.longitude
        };
        setActivityCoordinates(autoGeneratedLocation);
        setDistanceToMember(0);
        if (!silent) {
          showAppAlert(
            "Location Captured",
            "Longitude and latitude were auto-generated from current GPS location."
          );
        }
        return 0;
      }
      const meters = calculateDistance(
        current.latitude,
        current.longitude,
        activityCoordinates.latitude,
        activityCoordinates.longitude
      );
      const rounded = Math.round(meters);
      setDistanceToMember(rounded);
      return rounded;
    } finally {
      setIsDistanceLoading(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (!selectedAssignedMember) {
      showAppAlert("SHG Member Details", "Select an SHG member before saving.");
      return;
    }

    if (!uploadedImageUri) {
      showAppAlert("SHG Member Details", "Upload the latest activity image before saving.");
      return;
    }

    const meters = await checkRadiusDistance(false);
    if (meters === null) {
      showAppAlert(
        "Location Required",
        "Enable location and check radius before continuing."
      );
      return;
    }
    if (meters > 50) {
      showAppAlert(
        "Outside 50m Radius",
        `You are ${meters}m away. Move within 50m of the SHG member location to continue.`
      );
      return;
    }

    const selectedActivity = activityTypes.find((item) => item.name === activityType);
    const selectedSubCategory = subCategories.find((item) => item.name === subCategory);
    const coordinates = activityCoordinates || currentCrpLocation;

    if (!selectedActivity?.id) {
      showAppAlert("SHG Member Details", "Select a livelihood activity before saving.");
      return;
    }

    if (!selectedSubCategory?.id) {
      showAppAlert("SHG Member Details", "Select a sub-category before saving.");
      return;
    }

    if (!coordinates) {
      showAppAlert("SHG Member Details", "Capture location before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("MemberId", String(Number(selectedAssignedMember.id) || 0));
    formData.append("ActivityId", String(Number(selectedActivity.id) || 0));
    formData.append("SubCategoryId", String(Number(selectedSubCategory.id) || 0));
    formData.append("Longitude", String(Number(coordinates.longitude) || 0));
    formData.append("Latitude", String(Number(coordinates.latitude) || 0));
    formData.append("IsLH_CBO", String(Boolean(memberBelongsToLhCbo)));
    formData.append("LH_CBO_Name", memberBelongsToLhCbo ? String(lhCboName || "") : "");
    formData.append("RadiusValid", String(meters <= 50));

    try {
      if (Platform.OS === "web") {
        const imageResponse = await fetch(uploadedImageUri);
        const imageBlob = await imageResponse.blob();
        formData.append("Image", imageBlob, uploadedImageName || "livelihood-image.jpg");
      } else {
        formData.append("Image", {
          uri: uploadedImageUri,
          name: uploadedImageName || "livelihood-image.jpg",
          type: getMimeTypeFromUri(uploadedImageUri)
        });
      }

      const assignmentResponse = await submitLivelihoodAssignment(formData);
      // Confirmed via your Network tab: the server returns [{"LivelihoodId":103}]
      // - an ARRAY wrapping the object, not a plain object. My first attempt
      // checked assignmentResponse.LivelihoodId directly, which is always
      // undefined on an array - the real value is assignmentResponse[0].LivelihoodId.
      // This LivelihoodId is what activity-profile/save's `activityProfileId`
      // field must be set to (confirmed by the FK error - that column is a
      // foreign key back to this same Livelihood record).
      const assignmentRecord = Array.isArray(assignmentResponse)
        ? assignmentResponse[0]
        : assignmentResponse;
      const assignmentProfileId =
        assignmentRecord?.LivelihoodId ??
        assignmentRecord?.livelihoodId ??
        assignmentRecord?.activityProfileId ??
        assignmentRecord?.ActivityProfileId ??
        assignmentRecord?.id ??
        assignmentRecord?.Id ??
        null;
      if (assignmentProfileId !== null && assignmentProfileId !== undefined) {
        setLastActivityProfileId(Number(assignmentProfileId) || 0);
      }

      showSavedDataPopup(
        "SHG Member Details",
        {
          memberId: selectedAssignedMember.id,
          memberName: selectedAssignedMember.memberName,
          activityId: selectedActivity.id,
          activityName: selectedActivity.name,
          subCategoryId: selectedSubCategory.id,
          subCategoryName: selectedSubCategory.name,
          memberBelongsToLhCbo: memberBelongsToLhCbo ? "Yes" : "No",
          nameOfLhCbo: memberBelongsToLhCbo ? lhCboName || "Not provided" : "Not applicable",
          radiusStatus: `Within 50m (${meters}m)`,
          currentCrpLocation: `${Number(coordinates.latitude).toFixed(6)}, ${Number(coordinates.longitude).toFixed(6)}`
        },
        normalizedSubCategory === "Farm" ? "lhActivityFarm" : currentStatusView
      );
    } catch (error) {
      showAppAlert(
        "SHG Member Details",
        error.message || "Unable to save livelihood assignment right now."
      );
    }
  };

  const handleLhCboSaveAndNext = async () => {
    const meters = await checkRadiusDistance(false);
    if (meters === null) {
      showAppAlert(
        "Location Required",
        "Enable location and check radius before continuing."
      );
      return;
    }
    if (meters > 50) {
      showAppAlert(
        "Outside 50m Radius",
        `You are ${meters}m away. Move within 50m of the activity location to continue.`
      );
      return;
    }
    onOpenUpdateData(selectedLhCboStatusView);
  };

  const handleLhCboGuideSaveAndNext = () => {
    onOpenUpdateData(selectedLhCboStatusView);
  };

  // Task: CHC Enterprises Handler
  const handleChcEnterprisesSaveAndNext = async () => {
    if (!chcEnterpriseName.trim()) {
      showAppAlert("CHC Enterprises", "Enterprise name is required.");
      return;
    }
    if (!chcServices.trim()) {
      showAppAlert("CHC Enterprises", "Services offered are required.");
      return;
    }

    await saveActivityProfile(
      "CHC Enterprises",
      {
        enterpriseName: chcEnterpriseName,
        services: chcServices,
        activity: CHC_ACTIVITY_DISPLAY,
        lhCboType: lhCboType,
        lhCboName: selectedLhCboName
      },
      selectedLhCboStatusView,
      {
        profileType: "CHC Enterprises Activity Profile",
        saveKey: "chcEnterprisesActivityProfile"
      }
    );
  };


  const handleProfileSave = (title, data, nextView = "") => {
    saveActivityProfile(title, data, nextView, {
      saveKey: title
    });
  };

  const closeAllShgDropdowns = () => {
    setOpenShgDropdown(false);
    setOpenMemberDropdown(false);
    setOpenActivityDropdown(false);
    setOpenSubCategoryDropdown(false);
  };

  useEffect(() => {
    setActivityCoordinates(null);
    setDistanceToMember(null);
    setLocationPromptRequired(false);
    setCurrentCrpLocation(null);
  }, [memberName, homeView]);

  useEffect(() => {
    const hasSelectedShg = shgNames.some((item) => item === shgName);

    if ((!shgName || !hasSelectedShg) && shgNames.length > 0) {
      setShgName(shgNames[0]);
    }
  }, [shgName, shgNames]);

  useEffect(() => {
    const hasSelectedMember = shgMembers.some((item) => item === memberName);

    if ((!memberName || !hasSelectedMember) && shgMembers.length > 0) {
      setMemberName(shgMembers[0]);
    }
  }, [memberName, shgMembers]);

  useEffect(() => {
    if (!activityTypes.length) {
      return;
    }

    const hasSelectedActivity = activityTypes.some((item) => item.name === activityType);

    if (!activityType || !hasSelectedActivity) {
      setActivityType(activityTypes[0]?.name || "");
    }
  }, [activityType, activityTypes]);

  useEffect(() => {
    if (!subCategories.length) {
      return;
    }

    const hasSelectedSubCategory = subCategories.some((item) => item.name === subCategory);

    if (!subCategory || !hasSelectedSubCategory) {
      setSubCategory(subCategories[0]?.name || "");
    }
  }, [subCategory, subCategories]);

  useEffect(() => {
    if (!livelihoodCboTypeOptions.length) {
      return;
    }

    if (!livelihoodCboTypeOptions.includes(lhCboType)) {
      setLhCboType(livelihoodCboTypeOptions[0]);
    }
  }, [lhCboType, livelihoodCboTypeOptions]);

  useEffect(() => {
    if (!livelihoodCboNameOptions.length) {
      setSelectedLhCboName("");
      return;
    }

    if (!livelihoodCboNameOptions.includes(selectedLhCboName)) {
      setSelectedLhCboName(livelihoodCboNameOptions[0]);
    }
  }, [livelihoodCboNameOptions, selectedLhCboName]);

  useEffect(() => {
    if (!livelihoodCboActivityOptions.length) {
      return;
    }

    if (!livelihoodCboActivityOptions.includes(selectedLhCboActivity)) {
      setSelectedLhCboActivity(livelihoodCboActivityOptions[0]);
    }
  }, [livelihoodCboActivityOptions, selectedLhCboActivity]);

  // Task: CHC Enterprises Auto-trigger
  useEffect(() => {
    if (lhCboType === "Custom Hiring Center (CHC)") {
      setIsChcEnterprisesMode(true);
      setSelectedLhCboActivity(CHC_ACTIVITY_VALUE);
    } else {
      setIsChcEnterprisesMode(false);
      setChcEnterpriseName("");
      setChcServices("");
    }
  }, [lhCboType]);


  useEffect(() => {
    setActivityProfile((prev) => ({
      ...prev,
      activityName: activityType || prev.activityName,
      productionName: subCategory || prev.productionName
    }));
  }, [activityType, subCategory]);

  useEffect(() => {
    if (homeView !== "lhActivityFarm") {
      return;
    }

    setActivityProfile((prev) => ({
      ...prev,
      areaUnit: prev.areaUnit || FARM_UNIT_AREA_OPTIONS[0],
      activityMode: prev.activityMode || FARM_TYPE_OPTIONS[0],
      seasonality: prev.seasonality || FARM_SEASON_OPTIONS[0],
      landType: prev.landType || FARM_LAND_OPTIONS[0],
      productionUnit: prev.productionUnit || FARM_PRODUCTION_UNIT_OPTIONS[0]
    }));
  }, [homeView]);

  useEffect(() => {
    if (homeView !== "workingReport" || !selectedAssignedMember) {
      return;
    }

    const hasLockedGeo =
      Number.isFinite(Number(selectedAssignedMember.latitude)) &&
      Number.isFinite(Number(selectedAssignedMember.longitude));

    if (!hasLockedGeo) {
      setActivityCoordinates(null);
      return;
    }

    setActivityCoordinates({
      latitude: selectedAssignedMember.latitude,
      longitude: selectedAssignedMember.longitude
    });
  }, [homeView, selectedAssignedMember]);

  useEffect(() => {
    setSelectedGpId(user.gpId || "");
    setSelectedVillageId(user.villageId || "");
  }, [user.gpId, user.villageId]);

  useEffect(() => {
    if (!gpOptions.length) {
      return;
    }

    const hasSelectedGp = gpOptions.some((item) => String(item.id) === String(selectedGpId));

    if (!hasSelectedGp) {
      setSelectedGpId(String(gpOptions[0].id));
    }
  }, [gpOptions, selectedGpId]);

  useEffect(() => {
    if (!villageOptions.length) {
      return;
    }

    const hasSelectedVillage = villageOptions.some(
      (item) => String(item.id) === String(selectedVillageId)
    );

    if (!hasSelectedVillage) {
      setSelectedVillageId(String(villageOptions[0].id));
    }
  }, [selectedVillageId, villageOptions]);

  useEffect(() => {
    if (!selectedVillageId) {
      setApiAssignedShgMembers([]);
      return;
    }

    let active = true;

    async function loadShgMembers() {
      try {
        const payload = await fetchShgMembersByVillage(selectedVillageId);

        if (active) {
          setApiAssignedShgMembers(payload);
        }
      } catch (error) {
        if (active) {
          setApiAssignedShgMembers([]);
        }
      }
    }

    loadShgMembers();

    return () => {
      active = false;
    };
  }, [selectedVillageId]);

  useEffect(() => {
    let active = true;

    async function loadActivities() {
      try {
        const payload = await fetchActivities();

        if (active) {
          setActivityOptions(payload);
        }
      } catch (error) {
        if (active) {
          setActivityOptions([{ id: 1, name: "Farm" }]);
        }
      }
    }

    loadActivities();

    return () => {
      active = false;
    };
  }, []);

  // These four lists used to be hardcoded arrays. crpTypeOptions was
  // actually an empty array (a dead dropdown - "Type of CRP" on the
  // dashboard never showed anything), and the other three duplicated
  // values that are already live on the server, with no guarantee they'd
  // stay in sync if the backend adds/renames an option. Pulling them once
  // on mount fixes both problems; each keeps its previous hardcoded values
  // as a fallback only for the brief window before the fetch resolves.
  useEffect(() => {
    let active = true;

    async function loadStaticMasterLists() {
      const results = await Promise.allSettled([
        fetchCrpTypes(),
        fetchLandTypes(),
        fetchUnitsOfArea(),
        fetchSeasons(),
        fetchSubCategoriesByActivity(3), // Livestock
        fetchSubCategoriesByActivity(2), // Fishery Based
        fetchActivities(),
        fetchProductionMaster(),
        fetchActivityTypes(),
        fetchTradeOptions(),
        fetchTrainingAgencyOptions(),
        fetchMemberActivities()
      ]);

      if (!active) {
        return;
      }

      const [
        crpTypesRes,
        landTypesRes,
        unitsRes,
        seasonsRes,
        livestockRes,
        fisheryRes,
        activitiesRes,
        productionRes,
        activityTypesRes,
        tradeRes,
        trainingAgencyRes,
        memberActivityRes
      ] = results;

      if (crpTypesRes.status === "fulfilled" && crpTypesRes.value.length) {
        setCrpTypeOptions(crpTypesRes.value.map((item) => item.name));
      }
      if (landTypesRes.status === "fulfilled" && landTypesRes.value.length) {
        setLandTypeOptions(landTypesRes.value.map((item) => item.name));
        setLandTypeRecords(landTypesRes.value);
      }
      if (unitsRes.status === "fulfilled" && unitsRes.value.length) {
        setUnitOfAreaOptions(unitsRes.value.map((item) => item.name));
        setUnitOfAreaRecords(unitsRes.value);
      }
      if (seasonsRes.status === "fulfilled" && seasonsRes.value.length) {
        setSeasonOptions(seasonsRes.value.map((item) => item.name));
        setSeasonRecords(seasonsRes.value);
      }
      if (livestockRes.status === "fulfilled" && livestockRes.value.length) {
        setLivestockSubCategoryOptions(livestockRes.value.map((item) => item.name));
      }
      if (fisheryRes.status === "fulfilled" && fisheryRes.value.length) {
        setFisherySubCategoryOptions(fisheryRes.value.map((item) => item.name));
      }
      if (productionRes.status === "fulfilled") {
        setProductionMasterOptions(productionRes.value);
      }
      if (activityTypesRes.status === "fulfilled" && activityTypesRes.value.length) {
        setActivityTypeRecords(activityTypesRes.value);
      }
      if (tradeRes.status === "fulfilled" && tradeRes.value.length) {
        setTradeRecords(tradeRes.value);
      }
      if (trainingAgencyRes.status === "fulfilled" && trainingAgencyRes.value.length) {
        setTrainingAgencyRecords(trainingAgencyRes.value);
      }
      if (memberActivityRes.status === "fulfilled" && memberActivityRes.value.length) {
        setMemberActivityOptions(memberActivityRes.value.map((item) => item.name));
        setMemberActivityRecords(memberActivityRes.value);
      }
      if (activitiesRes.status === "fulfilled" && activitiesRes.value.length) {
        // "Non-Farm" category (CategoryId 2) activity names are exactly
        // the Non-Farm Collective "Set-up Category" options per the live
        // /api/activity data (Manufacturing / Service / Trading).
        const nonFarmNames = activitiesRes.value
          .filter((item) => String(item.categoryId ?? item.CategoryId) === "2")
          .map((item) => item.name);
        if (nonFarmNames.length) {
          setNonFarmSetupCategoryOptions(nonFarmNames);
        }
      }
    }

    loadStaticMasterLists();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const selectedActivity = activityTypes.find((item) => item.name === activityType);

    if (!selectedActivity?.id) {
      setSubCategoryOptions([{ id: 1, name: "Farm" }]);
      return;
    }

    let active = true;

    async function loadSubCategories() {
      try {
        const payload = await fetchSubCategoriesByActivity(selectedActivity.id);

        if (active) {
          setSubCategoryOptions(payload);
        }
      } catch (error) {
        if (active) {
          setSubCategoryOptions([{ id: 1, name: "Farm" }]);
        }
      }
    }

    loadSubCategories();

    return () => {
      active = false;
    };
  }, [activityType, activityTypes]);

  useEffect(() => {
    let active = true;

    async function loadCrpOptions() {
      try {
        const payload = await fetchAllCrps();
        if (!active) {
          return;
        }
        const approvedCrps = payload.filter((item) => Number(item.approvalStatus) === 1);
        // Only the logged-in CRP's own record should appear on this dashboard.
        const normalizedIdentity = String(user.identity || "").trim().toUpperCase();
        const ownCrpRecords = normalizedIdentity
          ? approvedCrps.filter(
              (item) =>
                String(item.crpId || "").trim().toUpperCase() === normalizedIdentity
            )
          : [];
        setCrpOptions(ownCrpRecords);
        if (!selectedCrpRegistrationId && ownCrpRecords.length > 0) {
          setSelectedCrpRegistrationId(String(ownCrpRecords[0].id));
        }
      } catch (error) {
        if (active) {
          setCrpOptions([]);
        }
      }
    }

    loadCrpOptions();

    return () => {
      active = false;
    };
  }, [selectedCrpRegistrationId, user.identity]);

  useEffect(() => {
    const shouldLoadGpOptions =
      homeView === "dashboard" || homeView === "newEnrolment";

    if (!shouldLoadGpOptions || !effectiveBlockId) {
      setGpOptions([]);
      return;
    }

    let active = true;

    async function loadGpOptions() {
      try {
        const payload = await fetchGpsByBlock(effectiveBlockId);
        if (active) {
          setGpOptions(payload);
        }
      } catch (error) {
        if (active) {
          setGpOptions([]);
        }
      }
    }

    loadGpOptions();

    return () => {
      active = false;
    };
  }, [effectiveBlockId, homeView]);

  useEffect(() => {
    const shouldLoadVillageOptions =
      homeView === "dashboard" || homeView === "newEnrolment";

    if (!shouldLoadVillageOptions || !selectedGpId) {
      setVillageOptions([]);
      return;
    }

    let active = true;

    async function loadVillageOptions() {
      try {
        const payload = await fetchVillagesByGp(selectedGpId);
        if (active) {
          setVillageOptions(payload);
        }
      } catch (error) {
        if (active) {
          setVillageOptions([]);
        }
      }
    }

    loadVillageOptions();

    return () => {
      active = false;
    };
  }, [homeView, selectedGpId]);

  useEffect(() => {
    if (homeView !== "shgMember" && homeView !== "lhCboActivity") {
      return undefined;
    }
    if (!activityCoordinates) {
      return undefined;
    }
    const timer = setInterval(() => {
      checkRadiusDistance(true);
    }, 8000);
    return () => clearInterval(timer);
  }, [homeView, memberName, activityCoordinates]);

  useEffect(() => {
    if (homeView !== "dashboard" || hasAutoShownDashboardAlerts || dashboardAlertCount === 0) {
      return;
    }

    setShowDashboardAlerts(true);
    setHasAutoShownDashboardAlerts(true);
  }, [dashboardAlertCount, hasAutoShownDashboardAlerts, homeView]);

  useEffect(() => {
    if (!showDashboardAlerts) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowDashboardAlerts(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showDashboardAlerts]);

  const handleUploadImage = (source = "library") => {
    const picker =
      source === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

    picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8
    })
      .then((result) => {
        if (result.canceled || !result.assets?.length) {
          return;
        }

        const asset = result.assets[0];
        const now = new Date();
        const imageDate = now.toISOString().slice(0, 10);

        setUploadedImageName(asset.fileName || "selected-image");
        setUploadedImageDate(imageDate);
        setUploadedImageUri(asset.uri || "");
        showResponsePopup(
          "Image Selected",
          `Selected: ${asset.fileName || "image"}`
        );
        })
        .catch((error) => {
          showResponsePopup("Upload Failed", error.message || "Unable to select image.");
        });
  };

  const handleUploadVideo = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 0.8
    })
      .then((result) => {
        if (result.canceled || !result.assets?.length) {
          return;
        }

        const asset = result.assets[0];
        const now = new Date();
        const videoDate = now.toISOString().slice(0, 10);

        setUploadedVideoName(asset.fileName || "selected-video");
        setUploadedVideoDate(videoDate);
        setUploadedVideoUri(asset.uri || "");
        showResponsePopup("Video Selected", `Selected: ${asset.fileName || "video"}`);
      })
      .catch((error) => {
        showResponsePopup("Upload Failed", error.message || "Unable to select video.");
      });
  };

  const handleUploadPaymentSlip = async () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,image/*";

      input.onchange = (event) => {
        const file = event.target?.files?.[0];
        if (!file) {
          return;
        }

        const fileType = file.type?.includes("pdf") ? "PDF" : "Image";
        setTransactionDetailsForm((prev) => ({
          ...prev,
          paymentSlipName: file.name || "payment-slip",
          paymentSlipUri: "",
          paymentSlipType: fileType
        }));
        showResponsePopup("Payment Slip Uploaded", `${fileType} selected: ${file.name}`);
      };

      input.click();
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      setTransactionDetailsForm((prev) => ({
        ...prev,
        paymentSlipName: asset.fileName || "payment-slip-image",
        paymentSlipUri: asset.uri || "",
        paymentSlipType: "Image"
      }));
      showResponsePopup("Payment Slip Uploaded", `Image selected: ${asset.fileName || "payment-slip-image"}`);
    } catch (error) {
      showResponsePopup("Upload Failed", error.message || "Unable to select payment slip.");
    }
  };

  const handleSubmitCrpTrackingReport = async () => {
    if (!selectedAssignedMember) {
      showAppAlert("Working Report", "No SHG member is assigned for reporting.");
      return;
    }
    if (!uploadedImageUri) {
      showAppAlert("Working Report", "Upload image is mandatory for daily reporting.");
      return;
    }
    if (!uploadedVideoUri) {
      showAppAlert("Working Report", "Upload video is mandatory for daily reporting.");
      return;
    }

    const meters = await checkRadiusDistance(false);
    if (meters === null) {
      showAppAlert("Working Report", "Enable location and match SHG geolocation before submission.");
      return;
    }
    if (meters > reportGeofenceRadius) {
      showAppAlert(
        "Outside 150m Radius",
        `Current location is ${meters}m away. Move within 150m of the assigned SHG location.`
      );
      return;
    }

    onSubmitWorkingReport({
      assignmentId: selectedAssignedMember.id,
      shgName: selectedAssignedMember.shgName,
      memberName: selectedAssignedMember.memberName,
      reportDate: new Date().toISOString().slice(0, 10),
      imageName: uploadedImageName,
      videoName: uploadedVideoName,
      distanceMeters: meters
    });
  };

  const handleSaveTrackedStatus = async (nextView = "technicalSupport") => {
    if (!selectedAssignedMember) {
      showAppAlert("Tracking", "No SHG member selected for tracking.");
      return;
    }

    if (!uploadedImageUri) {
      showAppAlert("Tracking", "Capture or upload a live image before saving.");
      return;
    }

    if (!uploadedVideoUri) {
      showAppAlert("Tracking", "Upload a video before saving.");
      return;
    }

    if (!trackingRemarks.trim()) {
      showAppAlert("Tracking", "Remarks are required before saving.");
      return;
    }

    const selectedActivity = activityTypes.find((item) => item.name === activityType);
    const selectedSubCategoryOption = subCategories.find((item) => item.name === subCategory);

    if (!selectedActivity?.id) {
      showAppAlert("Tracking", "Select a livelihood activity before saving tracking.");
      return;
    }

    if (!selectedSubCategoryOption?.id) {
      showAppAlert("Tracking", "Select a sub-category before saving tracking.");
      return;
    }

    const meters = await checkRadiusDistance(false);

    if (meters === null) {
      showAppAlert("Tracking", "Enable location and validate geolocation before saving.");
      return;
    }

    if (meters > 50) {
      showAppAlert(
        "Tracking",
        `Current location is ${meters}m away. Attendance will count only when the CRP matches the assigned SHG location.`
      );
      return;
    }

    const coordinates = activityCoordinates || currentCrpLocation;

    if (!coordinates) {
      showAppAlert("Tracking", "Capture location before saving tracking.");
      return;
    }

    const trackingDate = new Date().toISOString().slice(0, 10);
    // CRPRegistrationId comes strictly from the logged-in CRP's own session
    // (user.crpRegistrationId), not from selectedCrpRecord - that's a
    // separately browsed/selected CRP record used elsewhere in this screen
    // and isn't necessarily the CRP who is actually logged in and tracking.
    const resolvedCrpRegistrationId = user.crpRegistrationId || 0;

    // /api/shg-tracking/save's real request body is multipart/form-data
    // with binary Image/Video fields (confirmed live in Swagger) - not
    // JSON imagePath/videoPath strings. Field names here match that
    // Swagger form exactly: TrackingId, SHGMemberId, SHGName,
    // CRPRegistrationId, Latitude, Longitude, Image, Video, Remarks.
    //
    // TrackingId is sent empty (multipart/form-data has no literal null -
    // this is the equivalent of the incomeProfileId:null fix confirmed on
    // income-profile/save: an explicit 0 risked being read as "this is an
    // existing record" instead of "create new".
    // SHGMemberId/SHGName come from selectedAssignedMember, itself sourced
    // from the SHG Livelihood member API (fetchShgMembersByVillage) - not
    // typed or picked from anywhere else.
    const formData = new FormData();
    formData.append("TrackingId", "");
    formData.append("SHGMemberId", String(Number(selectedAssignedMember.id) || 0));
    formData.append("SHGName", String(selectedAssignedMember.shgName || ""));
    formData.append("CRPRegistrationId", String(Number(resolvedCrpRegistrationId) || 0));
    formData.append("Latitude", String(Number(coordinates.latitude) || 0));
    formData.append("Longitude", String(Number(coordinates.longitude) || 0));
    formData.append("Remarks", trackingRemarks.trim());

    console.log("[SHG Tracking] submitting with fields:", {
      TrackingId: "",
      SHGMemberId: Number(selectedAssignedMember.id) || 0,
      SHGName: selectedAssignedMember.shgName || "",
      CRPRegistrationId: Number(resolvedCrpRegistrationId) || 0,
      Latitude: Number(coordinates.latitude) || 0,
      Longitude: Number(coordinates.longitude) || 0,
      Remarks: trackingRemarks.trim(),
      uploadedImageUri,
      uploadedVideoUri
    });

    try {
      setTrackingSubmitting(true);

      if (Platform.OS === "web") {
        const imageResponse = await fetch(uploadedImageUri);
        const imageBlob = await imageResponse.blob();
        console.log("[SHG Tracking] image blob:", imageBlob.size, "bytes,", imageBlob.type);
        formData.append("Image", imageBlob, uploadedImageName || "tracking-image.jpg");

        const videoResponse = await fetch(uploadedVideoUri);
        const videoBlob = await videoResponse.blob();
        console.log("[SHG Tracking] video blob:", videoBlob.size, "bytes,", videoBlob.type);
        formData.append("Video", videoBlob, uploadedVideoName || "tracking-video.mp4");
      } else {
        formData.append("Image", {
          uri: uploadedImageUri,
          name: uploadedImageName || "tracking-image.jpg",
          type: getMimeTypeFromUri(uploadedImageUri)
        });
        formData.append("Video", {
          uri: uploadedVideoUri,
          name: uploadedVideoName || "tracking-video.mp4",
          type: getVideoMimeTypeFromUri(uploadedVideoUri)
        });
      }

      const saveResponse = await submitShgTrackingMultipart(formData);
      console.log("[SHG Tracking] server response:", saveResponse);

      onSubmitWorkingReport({
        assignmentId: selectedAssignedMember.id,
        shgName: selectedAssignedMember.shgName,
        memberName: selectedAssignedMember.memberName,
        reportDate: trackingDate,
        imageName: uploadedImageName || "captured-image",
        videoName: uploadedVideoName || "uploaded-video",
        distanceMeters: meters,
        remarks: trackingRemarks.trim()
      });

      showSavedDataPopup(
        "SHG Tracking",
        {
          shgMember: selectedAssignedMember.memberName,
          shgName: selectedAssignedMember.shgName,
          activityName: selectedActivity.name,
          subCategoryName: selectedSubCategoryOption.name,
          image: uploadedImageName || "captured-image",
          video: uploadedVideoName || "uploaded-video",
          distanceMeters: meters,
          remarks: trackingRemarks.trim()
        },
        nextView
      );
    } catch (error) {
      console.log("[SHG Tracking] save failed:", error);
      showAppAlert("Tracking", error.message || "Unable to submit SHG tracking right now.");
    } finally {
      setTrackingSubmitting(false);
    }
  };

  // /api/shg-tracking/geo, /upload-image and /upload-video were confirmed
  // (via live GET on trlm.pickitover.com) to accept a call and return a
  // success message without actually persisting latitude/longitude/
  // imagePath/videoPath against the tracking record - a server-side no-op.
  // Calling them from the app would show field users a false "success"
  // toast for data that never gets saved, so these three buttons stay
  // local-only (capture + preview) and the real submission happens once,
  // for real, through /api/shg-tracking/save in handleSaveTrackedStatus.
  const handleShgTrackingGeoCheck = async () => {
    const meters = await checkRadiusDistance(false);
    if (meters === null) {
      return;
    }

    showResponsePopup("Location Captured", `Location matched: ${meters}m from assigned SHG.`);
  };

  const handleShgTrackingImageUpload = (source = "library") => {
    const picker =
      source === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

    picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8
    })
      .then((result) => {
        if (result.canceled || !result.assets?.length) {
          return;
        }

        const asset = result.assets[0];
        const imageName = asset.fileName || "selected-image";

        setUploadedImageName(imageName);
        setUploadedImageDate(new Date().toISOString().slice(0, 10));
        setUploadedImageUri(asset.uri || "");
        showResponsePopup("Image Selected", `Selected: ${imageName}`);
      })
      .catch((error) => {
        showResponsePopup("Upload Failed", error.message || "Unable to select image.");
      });
  };

  const handleShgTrackingVideoUpload = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 0.8
    })
      .then((result) => {
        if (result.canceled || !result.assets?.length) {
          return;
        }

        const asset = result.assets[0];
        const videoName = asset.fileName || "selected-video";

        setUploadedVideoName(videoName);
        setUploadedVideoDate(new Date().toISOString().slice(0, 10));
        setUploadedVideoUri(asset.uri || "");
        showResponsePopup("Video Selected", `Selected: ${videoName}`);
      })
      .catch((error) => {
        showResponsePopup("Upload Failed", error.message || "Unable to select video.");
      });
  };

  const handleUploadLhCboImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8
    })
      .then((result) => {
        if (result.canceled || !result.assets?.length) {
          return;
        }

        const asset = result.assets[0];

        setLhCboImages((prev) => {
          const updated = [...prev, asset.uri || ""];
          setLhCboImageIndex(updated.length - 1);
          return updated;
        });
        showAppAlert("Image Uploaded", `Selected: ${asset.fileName || "image"}`);
      })
      .catch((error) => {
        showAppAlert("Upload Failed", error.message || "Unable to select image.");
      });
  };

  const dashboardContextValue = {
    user, dashboardMetrics, workingReport, setWorkingReport, onSubmitWorkingReport,
    assignedShgMembers, onLockAssignedShgLocation, onOpenWorkingReport, onOpenShgMember,
    onOpenLhCboActivity, onOpenNewEnrolment, onOpenUpdateData, alerts, activities, homeView,
    onBackToDashboard, showPostCheckoutModal, setShowPostCheckoutModal, onLogout,
    apiAssignedShgMembers, setApiAssignedShgMembers, showCrpTypeMenu, setShowCrpTypeMenu,
    activityOptions, setActivityOptions, subCategoryOptions, setSubCategoryOptions,
    selectedCrpType, setSelectedCrpType, crpTypeOptions, setCrpTypeOptions,
    landTypeOptions, setLandTypeOptions, unitOfAreaOptions, setUnitOfAreaOptions,
    seasonOptions, setSeasonOptions, livestockSubCategoryOptions, setLivestockSubCategoryOptions,
    fisherySubCategoryOptions, setFisherySubCategoryOptions,
    nonFarmSetupCategoryOptions, setNonFarmSetupCategoryOptions,
    memberActivityOptions, setMemberActivityOptions, memberActivityRecords, setMemberActivityRecords,
    unitOfAreaRecords, setUnitOfAreaRecords, seasonRecords, setSeasonRecords,
    landTypeRecords, setLandTypeRecords, tradeRecords, setTradeRecords,
    trainingAgencyRecords, setTrainingAgencyRecords, activityTypeRecords, setActivityTypeRecords,
    productionMasterOptions, setProductionMasterOptions,
    shgName, setShgName, memberName, setMemberName, activityType, setActivityType,
    subCategory, setSubCategory, openShgDropdown, setOpenShgDropdown,
    openMemberDropdown, setOpenMemberDropdown, openActivityDropdown, setOpenActivityDropdown,
    openSubCategoryDropdown, setOpenSubCategoryDropdown, lhCboType, setLhCboType,
    selectedLhCboName, setSelectedLhCboName, selectedLhCboActivity, setSelectedLhCboActivity,
    isChcEnterprisesMode, setIsChcEnterprisesMode, chcEnterpriseName, setChcEnterpriseName,
    chcServices, setChcServices, lhCboImages, setLhCboImages, lhCboImageIndex, setLhCboImageIndex,
    memberBelongsToLhCbo, setMemberBelongsToLhCbo, lhCboName, setLhCboName,
    distanceToMember, setDistanceToMember, isDistanceLoading, setIsDistanceLoading,
    locationPromptRequired, setLocationPromptRequired, currentCrpLocation, setCurrentCrpLocation,
    activityCoordinates, setActivityCoordinates, uploadedImageName, setUploadedImageName,
    uploadedImageDate, setUploadedImageDate, uploadedImageUri, setUploadedImageUri,
    uploadedVideoName, setUploadedVideoName, uploadedVideoDate, setUploadedVideoDate,
    uploadedVideoUri, setUploadedVideoUri, trackingRemarks, setTrackingRemarks,
    trackingSubmitting, setTrackingSubmitting, apiSavingKey, setApiSavingKey,
    supportStage, setSupportStage, supportHistory, setSupportHistory,
    supportHistoryLoading, setSupportHistoryLoading, activityProfile, setActivityProfile,
    nonFarmEnterprise, setNonFarmEnterprise, technicalSupportForm, setTechnicalSupportForm,
    trainingDatePicker, setTrainingDatePicker, responsePopup, setResponsePopup,
    pgActivityProfileForm, setPgActivityProfileForm, nfcActivityProfileForm, setNfcActivityProfileForm,
    chcDetailForm, setChcDetailForm, lhCboFinancialForms, setLhCboFinancialForms,
    lhCboIncomeForms, setLhCboIncomeForms, financialSupportForm, setFinancialSupportForm,
    pastSupportForm, setPastSupportForm, transactionDetailsForm, setTransactionDetailsForm,
    investmentProfile, setInvestmentProfile, incomeProfile, setIncomeProfile,
    activityProfileIdByMember, setActivityProfileIdByMember,
    graphType, setGraphType, graphImageFailed, setGraphImageFailed,
    gpOptions, setGpOptions, villageOptions, setVillageOptions,
    selectedGpId, setSelectedGpId, selectedVillageId, setSelectedVillageId,
    openGpSelector, setOpenGpSelector, openVillageSelector, setOpenVillageSelector,
    crpOptions, setCrpOptions, selectedCrpRegistrationId, setSelectedCrpRegistrationId,
    openCrpSelector, setOpenCrpSelector, selectionHydrated, setSelectionHydrated,
    showDashboardAlerts, setShowDashboardAlerts, hasAutoShownDashboardAlerts, setHasAutoShownDashboardAlerts,
    reportGeofenceRadius, effectiveAssignedShgMembers, shgNames, activityTypes, subCategories,
    livelihoodCboTypeOptions, livelihoodCboActivityOptions, shgMembers, livelihoodCboNameOptions,
    dashboardNotificationItems, dashboardAlertCount, firstDashboardNotification, dashboardInlineAlertMessage,
    selectedAssignedMember, selectedShgName, selectedMemberName, currentMemberKey,
    lastActivityProfileId, setLastActivityProfileId, showResponsePopup, showResponsePopupWithImage,
    closeResponsePopup, showAppAlert, renderResponsePopup, buildSaveFields, buildSaveSummary,
    showSavedDataPopup, buildActivityProfilePayload, saveActivityProfile, resolveProductionId,
    buildFarmLivestockFisheryPayload, handleSaveFarmLivestockFisheryProfile,
    handleSaveInvestmentProfile, handleSaveIncomeProfile, buildFinancialSupportProjection,
    handleSaveFinancialSupport, toIsoDateOrNull, handleSaveTechnicalSupport,
    handleOpenTechnicalSupportModule, handleOpenSupportHistory, openDatePicker,
    closeTrainingDatePicker, confirmTrainingDatePicker, renderAlertPopup, handleGraphPress,
    closeGraphView, graphData, pieMetaByType, selectedPieMeta, selectedPieTotal, selectedGraphMax,
    isWithin50Meters, geoStatusVariant, selectedGp, selectedVillage, selectedCrpRecord,
    headerCrpId, headerCrpName, headerCrpInitials, dashboardDateLabel, dashboardHighlights,
    effectiveBlockId, normalizedSubCategory, statusBySubCategory, activityBySubCategory,
    currentStatusView, selectedLhCboTypeKey, lhCboStatusViewByType, selectedLhCboStatusView,
    displayedLhCboActivity, activeLhCboImage, checkRadiusDistance, handleSaveAndNext,
    handleLhCboSaveAndNext, handleLhCboGuideSaveAndNext, handleChcEnterprisesSaveAndNext,
    handleProfileSave, closeAllShgDropdowns, handleUploadImage, handleUploadVideo,
    handleUploadPaymentSlip, handleSubmitCrpTrackingReport, handleSaveTrackedStatus,
    handleShgTrackingGeoCheck, handleShgTrackingImageUpload, handleShgTrackingVideoUpload,
    handleUploadLhCboImage
  };

  if (homeView === "workingReport") {
    return (
      <DashboardContextProvider value={dashboardContextValue}>
        <WorkingReportView />
      </DashboardContextProvider>
    );
  }

    if (homeView === "newEnrolment") {
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

  if (homeView === "shgMember") {
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

  if (graphType && selectedPieMeta) {
    return (
      <View style={pageStyles.screen}>
        <View style={pageStyles.bgGlowTop} />
        <View style={pageStyles.bgGlowBottom} />
        <View style={pageStyles.frame}>
          <View style={pageStyles.topRow}>
            <View style={pageStyles.imageCard}>
              <Text style={pageStyles.imageAvatarText}>{headerCrpInitials}</Text>
              <Text style={pageStyles.imageText}>CRP</Text>
            </View>
            <View style={pageStyles.infoCard}>
              <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
              <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
            </View>
          </View>

          <View style={pageStyles.graphPageCard}>
            <View style={pageStyles.graphPageHeader}>
              <View>
                <Text style={pageStyles.graphPageEyebrow}>Performance View</Text>
                <Text style={pageStyles.graphPageTitle}>{selectedPieMeta.title}</Text>
              </View>
              <View style={pageStyles.graphTotalBadge}>
                <Text style={pageStyles.graphTotalBadgeLabel}>Total</Text>
                <Text style={pageStyles.graphTotalBadgeValue}>{selectedPieTotal}</Text>
              </View>
            </View>

            <View style={pageStyles.graphSpotlightCard}>
              <Text style={pageStyles.graphSpotlightTitle}>Distribution Overview</Text>
              <View style={pageStyles.graphSpotlightBars}>
                {selectedPieMeta.labels.map((label, index) => {
                  const value = Math.max(0, Number(selectedPieMeta.values[index]) || 0);
                  const heightPercent = Math.max((value / selectedGraphMax) * 100, value > 0 ? 16 : 8);
                  return (
                    <View key={`spotlight-${graphType}-${label}`} style={pageStyles.graphSpotlightBarCol}>
                      <Text style={pageStyles.graphSpotlightValue}>{value}</Text>
                      <View style={pageStyles.graphSpotlightTrack}>
                        <View
                          style={[
                            pageStyles.graphSpotlightFill,
                            {
                              height: `${heightPercent}%`,
                              backgroundColor: selectedPieMeta.colors[index]
                            }
                          ]}
                        />
                      </View>
                      <Text style={pageStyles.graphSpotlightLabel}>{label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={pageStyles.legendWrap}>
              {selectedPieMeta.labels.map((label, index) => {
                const value = Math.max(0, Number(selectedPieMeta.values[index]) || 0);
                const share =
                  selectedPieTotal > 0 ? Math.round((value / selectedPieTotal) * 100) : 0;
                return (
                  <View key={`${graphType}-${label}`} style={pageStyles.legendCard}>
                    <View style={pageStyles.legendRow}>
                      <View
                        style={[
                          pageStyles.legendDot,
                          { backgroundColor: selectedPieMeta.colors[index] }
                        ]}
                      />
                      <Text style={pageStyles.legendLabel}>{label}</Text>
                      <Text style={pageStyles.legendValue}>
                        {value} ({share}%)
                      </Text>
                    </View>
                    <View style={pageStyles.legendProgressTrack}>
                      <View
                        style={[
                          pageStyles.legendProgressFill,
                          {
                            width: `${share}%`,
                            backgroundColor: selectedPieMeta.colors[index]
                          }
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            <Pressable style={pageStyles.backToDashboardBtn} onPress={closeGraphView}>
              <Text style={pageStyles.backToDashboardText}>Back to Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (
    homeView === "lhStatusFarm" ||
    homeView === "lhStatusNonFarm" ||
    homeView === "lhStatusLivestock" ||
    homeView === "lhStatusFishery"
  ) {
    const statusTitleMap = {
      lhStatusFarm: "SHG Member Farm-based Activity Status",
      lhStatusNonFarm: "SHG Member Non-Farm-based Activity Status",
      lhStatusLivestock: "SHG Member Livestock-based Activity Status",
      lhStatusFishery: "SHG Member Fishery-based Activity Status"
    };
    const statusToSubCategory = {
      lhStatusFarm: "Farm",
      lhStatusNonFarm: "NonFarm",
      lhStatusLivestock: "Livestock",
      lhStatusFishery: "Fishery"
    };
    const selectedSubCategory = statusToSubCategory[homeView] || "Farm";

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
              <Text style={flowStyles.statusTitle}>{statusTitleMap[homeView]}</Text>
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

    if (homeView === "shgTracking") {
      return (
        <View style={pageStyles.screen}>
          <View style={flowStyles.trackingShell}>
            <View style={flowStyles.trackingHero}>
              <View style={flowStyles.trackingTitleWrap}>
                <Text style={flowStyles.trackingHeroTitle}>SHG Tracking</Text>
              </View>
              <Text style={flowStyles.trackingEyebrow}>Field Verification</Text>
              <Text style={flowStyles.trackingHeroHint}>
                Validate geolocation, capture evidence, and submit the tracking update for this SHG member.
              </Text>
            </View>

            <View style={flowStyles.trackingMemberCard}>
              <View style={flowStyles.trackingMemberRow}>
                <Text style={flowStyles.trackingMemberLabel}>SHG Member</Text>
                <Text style={flowStyles.trackingMemberValue}>{selectedMemberName}</Text>
              </View>
              <View style={flowStyles.trackingMemberRow}>
                <Text style={flowStyles.trackingMemberLabel}>SHG Name</Text>
                <Text style={flowStyles.trackingMemberValue}>{selectedShgName}</Text>
              </View>
            </View>

            <View style={flowStyles.trackingStatusCard}>
              <Text style={flowStyles.trackingTitle}>SHG Tracking Under CRP</Text>
              <Text style={flowStyles.trackingHint}>
                Enable location, click or upload live image, upload video, add remarks, then save.
                Attendance counts only when assigned SHG geolocation matches.
              </Text>
              <View style={flowStyles.trackingActionRow}>
                <Pressable style={flowStyles.secondaryTrackBtn} onPress={handleShgTrackingGeoCheck}>
                  <Text style={flowStyles.secondaryTrackBtnText}>
                    {isDistanceLoading ? "Checking..." : "Enable / Match Geo"}
                  </Text>
                </Pressable>
                <Pressable style={flowStyles.secondaryTrackBtn} onPress={() => handleShgTrackingImageUpload("library")}>
                  <Text style={flowStyles.secondaryTrackBtnText}>Click / Upload Image</Text>
                </Pressable>
                <Pressable style={flowStyles.secondaryTrackBtn} onPress={handleShgTrackingVideoUpload}>
                  <Text style={flowStyles.secondaryTrackBtnText}>Upload Video</Text>
                </Pressable>
              </View>

              <View style={flowStyles.trackingStatusGrid}>
                <View style={flowStyles.trackingStatusPill}>
                  <Text style={flowStyles.trackingStatusLabel}>Image</Text>
                  <Text style={flowStyles.trackingStatusValue}>{uploadedImageName || "Pending"}</Text>
                </View>
                <View style={flowStyles.trackingStatusPill}>
                  <Text style={flowStyles.trackingStatusLabel}>Video</Text>
                  <Text style={flowStyles.trackingStatusValue}>{uploadedVideoName || "Pending"}</Text>
                </View>
                <View style={flowStyles.trackingStatusPill}>
                  <Text style={flowStyles.trackingStatusLabel}>Geo Status</Text>
                  <Text style={flowStyles.trackingStatusValue}>
                    {locationPromptRequired ? "Location off" : distanceToMember === null ? "Not checked" : `${distanceToMember}m matched`}
                  </Text>
                </View>
              </View>

              <TextInput
                style={flowStyles.remarksInput}
                value={trackingRemarks}
                onChangeText={setTrackingRemarks}
                placeholder="Add remarks"
                multiline
              />
            </View>

            <View style={flowStyles.trackingFooterCard}>
              <View style={flowStyles.trackingSaveRow}>
                <View
                  style={[
                    flowStyles.geoDot,
                    geoStatusVariant === "green"
                      ? flowStyles.geoDotGreen
                      : geoStatusVariant === "red"
                        ? flowStyles.geoDotRed
                        : flowStyles.geoDotIdle
                  ]}
                />
                <Pressable
                  style={[
                    flowStyles.primarySaveBtn,
                    trackingSubmitting && flowStyles.lockedButton
                  ]}
                  disabled={trackingSubmitting}
                  onPress={() => handleSaveTrackedStatus("technicalSupport")}
                >
                  <Text style={flowStyles.primarySaveText}>
                    {trackingSubmitting ? "Saving..." : "Save"}
                  </Text>
                </Pressable>
              </View>

              <Pressable style={flowStyles.statusBackBtn} onPress={() => onOpenUpdateData(currentStatusView)}>
                <Text style={flowStyles.statusBackBtnText}>Back</Text>
              </Pressable>
            </View>
            {renderResponsePopup()}
          </View>
        </View>
      );
    }

  if (homeView === "lhActivityFarm") {
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

  if (homeView === "lhActivityNonFarm") {
    // No live endpoint exists for this field (Enterprise "Set-up Type");
    // hardcoded to the two values the SRS specifies since it was
    // previously an empty array (dead dropdown - nothing was selectable).
    const setupTypeOptions = ["Homebased", "Commercial"];
    const yesNoOptions = ["Yes", "No"];
    const marketLinkedOptions = ["Local", "Block", "District", "State", "National"];

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
                options={setupTypeOptions}
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
                options={yesNoOptions}
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
                options={marketLinkedOptions}
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

  if (homeView === "lhActivityLivestock") {
    const activityNameOptions = livestockSubCategoryOptions;
    const productionOptions = ["Milk", "Egg", "Meat"];
    const productionUnitOptions = ["Litre", "KG", "Quintal", "Nos"];

    return (
      <View style={pageStyles.screen}>
        <View style={pageStyles.frame}>
          <Text style={flowStyles.formTitle}>Activity Profile - Livestock</Text>
          <View style={flowStyles.formRow}>
            <Text style={flowStyles.formLabel}>Name of the Activity:</Text>
            <CycleDropdown
              value={activityProfile.activityName}
              options={activityNameOptions}
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
              options={productionOptions}
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
              options={productionUnitOptions}
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

  if (homeView === "lhActivityFishery") {
    const activityNameOptions = fisherySubCategoryOptions;
    const areaTypeOptions = unitOfAreaOptions;
    const waterbodyTypeOptions = ["Seasonal", "Perennial", "Canal", "Pond"];
    const productionOptions = ["Fish", "Seed"];
    const productionUnitOptions = ["KG", "Quintal"];

    return (
      <View style={pageStyles.screen}>
        <View style={pageStyles.frame}>
          <Text style={flowStyles.formTitle}>Activity Profile - Fishery</Text>
          <View style={flowStyles.formRow}>
            <Text style={flowStyles.formLabel}>Name of the Activity:</Text>
            <CycleDropdown
              value={activityProfile.activityName}
              options={activityNameOptions}
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
              options={areaTypeOptions}
              onChange={(value) => setActivityProfile((prev) => ({ ...prev, areaUnit: value }))}
            />
          </View>
          <View style={flowStyles.formRow}>
            <Text style={flowStyles.formLabel}>Type of Activity:</Text>
            <CycleDropdown
              value={activityProfile.activityMode}
              options={["Rabi", "Kharif", "Summer", "Winter", "Rainy"]}
              onChange={(value) =>
                setActivityProfile((prev) => ({ ...prev, activityMode: value }))
              }
            />
          </View>
          <View style={flowStyles.formRow}>
            <Text style={flowStyles.formLabel}>Type of Waterbody:</Text>
            <CycleDropdown
              value={activityProfile.waterbodyType}
              options={waterbodyTypeOptions}
              onChange={(value) =>
                setActivityProfile((prev) => ({ ...prev, waterbodyType: value }))
              }
            />
          </View>
          <View style={flowStyles.formRow}>
            <Text style={flowStyles.formLabel}>Name of Production:</Text>
            <CycleDropdown
              value={activityProfile.productionName}
              options={productionOptions}
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
              options={productionUnitOptions}
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

  if (homeView === "lhInvestment") {
    const numericFields = [
      { key: "totalInvestment", label: "Total Investment" },
      { key: "loanFromShg", label: "Loan from SHG" },
      { key: "loanFromBank", label: "Loan from Bank" },
      { key: "individualFinancing", label: "Individual Financing" },
      { key: "ownContribution", label: "Own Contribution" },
      { key: "csr", label: "CSR" },
      { key: "governmentGrant", label: "Government Grant" },
      { key: "otherSource", label: "Other Source" }
    ];

    return (
      <View style={pageStyles.screen}>
        <View style={flowStyles.investmentShell}>
          <View style={flowStyles.investmentHero}>
            <View style={flowStyles.investmentTitleWrap}>
              <Text style={flowStyles.investmentTitle}>Investment Profile</Text>
            </View>
            <Text style={flowStyles.investmentEyebrow}>Livelihood Finance</Text>
            <Text style={flowStyles.investmentHint}>
              Capture the current investment details for this livelihood activity.
            </Text>
          </View>

          <View style={flowStyles.investmentCard}>
            {numericFields.map((item) => (
            <View style={flowStyles.investmentFieldRow} key={item.key}>
              <Text style={flowStyles.investmentFieldLabel}>{item.label}</Text>
              <TextInput
                style={flowStyles.investmentInput}
                value={investmentProfile[item.key]}
                onChangeText={(text) =>
                  setInvestmentProfile((prev) => ({
                    ...prev,
                    [item.key]: text.replace(/[^\d.]/g, "")
                  }))
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
              />
            </View>
          ))}

            <View style={flowStyles.investmentActionRow}>
              <Pressable
                style={flowStyles.investmentSaveBtn}
                onPress={handleSaveInvestmentProfile}
                disabled={apiSavingKey === "investmentProfile"}
              >
                <Text style={flowStyles.investmentSaveBtnText}>
                  {apiSavingKey === "investmentProfile" ? "Saving..." : "Save"}
                </Text>
              </Pressable>
              <Pressable
                style={flowStyles.investmentBackBtn}
                onPress={() => onOpenUpdateData(currentStatusView)}
              >
                <Text style={flowStyles.investmentBackBtnText}>Back to Status</Text>
              </Pressable>
            </View>
          </View>
        </View>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "lhIncome") {
    const monthRows = ["month1", "month2", "month3", "month4", "month5", "month6"];
    const incomeFields = [
      { key: "totalIncomeLastYear", label: "Total Income Since last year" },
      { key: "presentMonthIncome", label: "Present Month Income" },
      { key: "futureProjection", label: "Future Projection (Next Six Month)" }
    ];

    return (
      <View style={pageStyles.screen}>
        <View style={flowStyles.investmentShell}>
          <View style={flowStyles.investmentHero}>
            <View style={flowStyles.investmentTitleWrap}>
              <Text style={flowStyles.investmentTitle}>Income Profile</Text>
            </View>
            <Text style={flowStyles.investmentEyebrow}>Income Tracking</Text>
            <Text style={flowStyles.investmentHint}>
              Capture the latest and projected income details for this activity.
            </Text>
          </View>

          <View style={flowStyles.investmentCard}>
            {incomeFields.map((item) => (
              <View style={flowStyles.investmentFieldRow} key={item.key}>
                <Text style={flowStyles.investmentFieldLabel}>{item.label}</Text>
                <TextInput
                  style={flowStyles.investmentInput}
                  value={incomeProfile[item.key]}
                  onChangeText={(text) =>
                    setIncomeProfile((prev) => ({
                      ...prev,
                      [item.key]: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}

            {monthRows.map((monthKey, index) => (
              <View style={flowStyles.investmentFieldRow} key={monthKey}>
                <Text style={flowStyles.investmentFieldLabel}>Month {index + 1} Actual Income</Text>
                <TextInput
                  style={flowStyles.investmentInput}
                  value={incomeProfile[monthKey]}
                  onChangeText={(text) =>
                    setIncomeProfile((prev) => ({
                      ...prev,
                      [monthKey]: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
            ))}

            <View style={flowStyles.investmentActionRow}>
              <Pressable
                style={flowStyles.investmentSaveBtn}
                onPress={handleSaveIncomeProfile}
                disabled={apiSavingKey === "incomeProfile"}
              >
                <Text style={flowStyles.investmentSaveBtnText}>
                  {apiSavingKey === "incomeProfile" ? "Saving..." : "Save"}
                </Text>
              </Pressable>
              <Pressable
                style={flowStyles.investmentBackBtn}
                onPress={() => onOpenUpdateData(currentStatusView)}
              >
                <Text style={flowStyles.investmentBackBtnText}>Back to Status</Text>
              </Pressable>
            </View>
          </View>
        </View>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "lhCboActivity") {
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

  if (homeView === "lhCboStatusGuide") {
    const selectedRuleTextByType = {
      "Producer Group (PG)":
        "- If Producers Group Activity is selected, further details will be shown on Page 1B.8A",
      "Non-Farm Collective (NFC)":
        "- If Non-Farm Collective Activity is selected, further details will be shown on Page 1B.8B",
      "Integrated Farming Cluster (IFC)":
        "- If Integrated Farming Cluster Activity is selected, further details will be shown on Page 1B.8C",
      "Custom Hiring Center (CHC)":
        "- If Custom Hiring Center Activity is selected, further details will be shown on Page 1B.8D",
      "Farmer Producer Company (FPC)":
        "- If Farmer Producer Company Activity is selected, further details will be shown on Page 1B.8E"
    };
    const selectedRuleText =
      selectedRuleTextByType[lhCboType] || selectedRuleTextByType["Producer Group (PG)"];

    return (
      <View style={pageStyles.screen}>
        <View style={[pageStyles.frame, lhGuideStyles.frame]}>
          <View style={lhGuideStyles.headerCard}>
            <Text style={lhGuideStyles.headerLine}>LH CBO Name: {selectedLhCboName}</Text>
            <Text style={lhGuideStyles.headerLine}>GP/VC Name: {user.gpVcName || "-"}</Text>
          </View>

          <View style={lhGuideStyles.formCard}>
            <View style={lhGuideStyles.dropdownRow}>
              <Text style={lhGuideStyles.dropdownLabel}>Livelihood Activity:</Text>
              <View style={lhGuideStyles.dropdownValueBox}>
                <Text style={lhGuideStyles.dropdownValue}>{displayedLhCboActivity}</Text>
                {isChcEnterprisesMode ? null : (
                  <Text style={lhGuideStyles.dropdownArrow}>v</Text>
                )}
              </View>
            </View>
            <View style={lhGuideStyles.dropdownRow}>
              <Text style={lhGuideStyles.dropdownLabel}>Category:</Text>
              <View style={lhGuideStyles.dropdownValueBox}>
                <Text style={lhGuideStyles.dropdownValue}>{lhCboType}</Text>
                <Text style={lhGuideStyles.dropdownArrow}>v</Text>
              </View>
            </View>

            <View style={lhGuideStyles.rulesCard}>
              <Text style={[lhGuideStyles.ruleLine, lhGuideStyles.ruleLineActive]}>
                {selectedRuleText}
              </Text>
            </View>

              <View style={lhGuideStyles.footerRow}>
                <View
                  style={[
                    lhGuideStyles.geoDot,
                    geoStatusVariant === "green"
                      ? lhGuideStyles.geoDotGreen
                      : geoStatusVariant === "red"
                        ? lhGuideStyles.geoDotRed
                        : lhGuideStyles.geoDotIdle
                  ]}
                />
                <Pressable style={lhGuideStyles.saveBtn} onPress={handleLhCboGuideSaveAndNext}>
                  <Text style={lhGuideStyles.saveBtnText}>Save & Next</Text>
                </Pressable>
            </View>
          </View>

          <Pressable style={lhGuideStyles.backBtn} onPress={() => onOpenUpdateData("lhCboActivity")}>
            <Text style={lhGuideStyles.backBtnText}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (
    homeView === "lhCboStatusPg" ||
    homeView === "lhCboStatusNfc" ||
    homeView === "lhCboStatusIfc" ||
    homeView === "lhCboStatusChc" ||
    homeView === "lhCboStatusFpc"
  ) {
    const isChcView = homeView === "lhCboStatusChc";
    const titleMetaMap = {
      lhCboStatusPg: { page: "Page:1B.8A", red: "Producer Group", tail: " Activity Status" },
      lhCboStatusNfc: { page: "", red: "", tail: "" },
      lhCboStatusIfc: {
        page: "Page:1B.8C",
        red: "Integrated Farming Cluster",
        tail: " Activity Status"
      },
      lhCboStatusChc: {
        page: "Page:1B.8D",
        red: "Custom Hiring Center",
        tail: " Activity Status"
      },
      lhCboStatusFpc: {
        page: "Page:1B.8E",
        red: "Farmer Producer Company",
        tail: " Activity Status"
      }
    };
    const headerNameMap = {
      lhCboStatusPg: "PG Name",
      lhCboStatusNfc: "NFC Name",
      lhCboStatusIfc: "IFC Name",
      lhCboStatusChc: "CHC Name",
      lhCboStatusFpc: "FPC Name"
    };
    const buttonLabelMap = {
      lhCboStatusPg: ["Activity Profile", "Financial Status", "Income\nStatus"],
      lhCboStatusNfc: ["Activity Profile", "Financial Status", "Income\nStatus"],
      lhCboStatusIfc: ["Activity Profile", "Financial Status", "Income\nStatus"],
      lhCboStatusFpc: ["Activity Profile", "Financial Status", "Income\nStatus"]
    };
    const activityRouteMap = {
      lhCboStatusPg: "lhCboPgActivityProfile",
      lhCboStatusNfc: "lhCboNfcActivityProfile",
      lhCboStatusIfc: "",
      lhCboStatusFpc: ""
    };

    return (
      <View style={pageStyles.screen}>
        <View style={[pageStyles.frame, lhcboStatusStyles.frame]}>
          {homeView !== "lhCboStatusPg" && homeView !== "lhCboStatusNfc" ? (
            <Text style={lhcboStatusStyles.titleText}>
              <Text style={lhcboStatusStyles.titlePage}>{titleMetaMap[homeView].page} </Text>
              <Text style={lhcboStatusStyles.titleRed}>{titleMetaMap[homeView].red}</Text>
              <Text style={lhcboStatusStyles.titlePage}>{titleMetaMap[homeView].tail}</Text>
            </Text>
          ) : null}
          <View style={lhcboStatusStyles.headerCard}>
            <Text style={lhcboStatusStyles.headerLine}>
              {headerNameMap[homeView]}: {selectedLhCboName}
            </Text>
            <Text style={lhcboStatusStyles.headerLine}>GP/VC Name: {user.gpVcName || "-"}</Text>
          </View>

          <View style={lhcboStatusStyles.contentCard}>
            {isChcView ? (
              <View style={lhcboStatusStyles.chcDetailsWrap}>
                <View style={tsDetailStyles.sectionCard}>
                  <Text style={tsDetailStyles.sectionTitle}>Custom Hiring Center Details</Text>
                  {[
                    ["districtName", "Name of the District"],
                    ["blockName", "Name of the Block"],
                    ["gpVcName", "Name of the GP/VC"],
                    ["villageOrganizationName", "Name of the Village Organization"],
                    ["chcName", "Name of the CHC"],
                    ["establishedDate", "Date of CHC established"],
                    ["establishedThroughConvergence", "CHC establishment through convergence (Y/N)"],
                    ["departmentAndScheme", "If Yes, Name of Department and Scheme"],
                    ["separateBankAccount", "Having Separate Bank Account (Y/N)"],
                    ["bankAccountNumber", "CHC Bank Account Number"],
                    ["bankName", "Name of the Bank"],
                    ["bankBranchName", "Name of the Bank Branch"],
                    ["amountFromTrlm", "Amount received from TRLM"],
                    ["amountFromDepartment", "Amount received from line Department"],
                    ["availableMachineries", "Available machineries"],
                    ["chcManagerDeployed", "CHC Manager deployed (Y/N)"],
                    ["chcManagerName", "Name of the CHC Manager"],
                    ["chcManagerContact", "Contact No of the CHC Manager"],
                    ["totalIncomeSinceInception", "Total Income (since inception)"],
                    ["totalExpenditureSinceInception", "Total Expenditure (since inception)"],
                    ["netProfitOrLoss", "Net Profit / Loss"],
                    ["cashInHand", "Cash in Hand"],
                    ["cashAtBank", "Cash at Bank"]
                  ].map(([key, label]) => (
                    <View key={key} style={tsDetailStyles.fieldBlock}>
                      <Text style={tsDetailStyles.label}>{label}</Text>
                      <TextInput
                        style={tsDetailStyles.selectInput}
                        value={chcDetailForm[key]}
                        onChangeText={(text) =>
                          setChcDetailForm((prev) => ({
                            ...prev,
                            [key]: text
                          }))
                        }
                        placeholder={label}
                        placeholderTextColor="#64748b"
                      />
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={lhcboStatusStyles.buttonStack}>
                <Pressable
                  style={lhcboStatusStyles.blockBtn}
                  onPress={() => {
                    if (!activityRouteMap[homeView]) {
                      showResponsePopup(
                        "Activity Profile",
                        "This type does not have a separate activity-profile page in the current flow."
                      );
                      return;
                    }
                    onOpenUpdateData(activityRouteMap[homeView]);
                  }}
                >
                  <Text style={lhcboStatusStyles.blockBtnText}>{buttonLabelMap[homeView][0]}</Text>
                </Pressable>
                <Pressable
                  style={lhcboStatusStyles.blockBtn}
                  onPress={() => onOpenUpdateData("lhCboFinancialStatus")}
                >
                  <Text style={lhcboStatusStyles.blockBtnText}>{buttonLabelMap[homeView][1]}</Text>
                </Pressable>
                <Pressable
                  style={lhcboStatusStyles.blockBtn}
                  onPress={() => onOpenUpdateData("lhCboIncomeStatus")}
                >
                  <Text style={lhcboStatusStyles.blockBtnText}>{buttonLabelMap[homeView][2]}</Text>
                </Pressable>
              </View>
            )}

            <View style={lhcboStatusStyles.footerRow}>
              <View
                style={[
                  lhcboStatusStyles.geoDot,
                  geoStatusVariant === "green"
                    ? lhcboStatusStyles.geoDotGreen
                    : geoStatusVariant === "red"
                      ? lhcboStatusStyles.geoDotRed
                      : lhcboStatusStyles.geoDotIdle
                ]}
              />
              <Pressable
                style={lhcboStatusStyles.saveBtn}
                disabled={Boolean(apiSavingKey)}
                onPress={() => {
                  if (isChcView) {
                    saveActivityProfile(
                      "Custom Hiring Center Activity Profile",
                      chcDetailForm,
                      "technicalSupportTech",
                      {
                        profileType: "Custom Hiring Center Activity Profile",
                        saveKey: "chcActivityProfile"
                      }
                    );
                    return;
                  }

                  showSavedDataPopup(
                    `${titleMetaMap[homeView].red} status`,
                    {
                      name: selectedLhCboName,
                      gpVcName: user.gpVcName || "-",
                      activity: displayedLhCboActivity,
                      category: lhCboType,
                      geoStatus: geoStatusVariant
                    },
                    "technicalSupportTech"
                  );
                }}
              >
                <Text style={lhcboStatusStyles.saveBtnText}>
                  {apiSavingKey === "chcActivityProfile" ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
          {renderResponsePopup()}
        </View>
      </View>
    );
  }

  if (homeView === "lhCboPgActivityProfile") {
    const yesNoOptions = ["Yes", "No"];
    const commodityOptions = activityOptions.map((item) => item.name).filter(Boolean);
    const pgFields = [
      ["trainingGovernance", "Training received on PG Governance & Management"],
      ["trainingBooks", "Training received on PG books on records"],
      ["businessPlanPrepared", "Whether a Business Plan has been prepared"],
      ["businessPlanSubmitted", "Whether Business Plan has been submitted for financial support from NRLM"],
      ["fundReceivedFromNrlm", "Whether any fund has been received from NRLM"],
      ["booksMaintained", "Whether PG maintaining books of records"],
      ["dailyBusinessRegister", "Whether PG maintaining Daily Business Register"],
      ["memberLedger", "Whether PG maintaining Member Ledger"],
      ["memberPassbook", "Whether PG maintaining Member Passbook"],
      ["assetRegister", "Whether PG maintaining Asset Register"]
    ];

    return (
      <View style={pageStyles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[pageStyles.frame, tsDetailStyles.frame]}>
            <View style={tsDetailStyles.heroCard}>
              <View style={tsDetailStyles.titleWrap}>
                <Text style={tsDetailStyles.title}>Activity Profile</Text>
              </View>
              <Text style={tsDetailStyles.sectionType}>Producer Group</Text>
              <Text style={tsDetailStyles.sectionHint}>
                Capture the producer group activity profile and governance readiness details.
              </Text>
            </View>

            <View style={tsDetailStyles.sectionCard}>
              <View style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>Primary Commodity of the PG</Text>
                <EditableSelect
                  value={pgActivityProfileForm.primaryCommodity}
                  options={commodityOptions}
                  onChange={(value) =>
                    setPgActivityProfileForm((prev) => ({ ...prev, primaryCommodity: value }))
                  }
                  placeholder="Select or type commodity"
                />
              </View>

              {pgFields.map(([key, label]) => (
                <View key={key} style={tsDetailStyles.fieldBlock}>
                  <Text style={tsDetailStyles.label}>{label}</Text>
                  <EditableSelect
                    value={pgActivityProfileForm[key]}
                    options={yesNoOptions}
                    onChange={(value) =>
                      setPgActivityProfileForm((prev) => ({ ...prev, [key]: value }))
                    }
                    placeholder="Select Yes / No"
                  />
                </View>
              ))}

              <Pressable
                style={tsDetailStyles.modalPrimaryBtnWide}
                disabled={Boolean(apiSavingKey)}
                onPress={() =>
                  saveActivityProfile(
                    "Producer Group Activity Profile",
                    pgActivityProfileForm,
                    selectedLhCboStatusView,
                    {
                      profileType: "Producer Group Activity Profile",
                      saveKey: "pgActivityProfile"
                    }
                  )
                }
              >
                <Text style={tsDetailStyles.modalPrimaryBtnText}>
                  {apiSavingKey === "pgActivityProfile" ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "lhCboNfcActivityProfile") {
    const yesNoOptions = ["Yes", "No"];
    const setUpCategoryOptions = nonFarmSetupCategoryOptions;
    const volumeUnitOptions = ["KG", "Unit", "Litre", "Piece"];

    return (
      <View style={pageStyles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[pageStyles.frame, tsDetailStyles.frame]}>
            <View style={tsDetailStyles.heroCard}>
              <View style={tsDetailStyles.titleWrap}>
                <Text style={tsDetailStyles.title}>Activity Profile</Text>
              </View>
              <Text style={tsDetailStyles.sectionType}>Non-Farm Collective</Text>
              <Text style={tsDetailStyles.sectionHint}>
                Record product details, compliances, and monthly production information.
              </Text>
            </View>

            <View style={tsDetailStyles.sectionCard}>
              <View style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>Product / Activity Details</Text>
                <TextInput
                  style={tsDetailStyles.selectInput}
                  value={nfcActivityProfileForm.productActivityDetails}
                  onChangeText={(text) =>
                    setNfcActivityProfileForm((prev) => ({ ...prev, productActivityDetails: text }))
                  }
                  placeholder="Enter product or activity details"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>Set-up Category</Text>
                <EditableSelect
                  value={nfcActivityProfileForm.setUpCategory}
                  options={setUpCategoryOptions}
                  onChange={(value) =>
                    setNfcActivityProfileForm((prev) => ({ ...prev, setUpCategory: value }))
                  }
                  placeholder="Select category"
                />
              </View>
              {[
                ["machineryProcured", "Machinery Procured"],
                ["signboardMounted", "Signboard Mounted on Enterprise"],
                ["marketLinked", "Market Linked"],
                ["productionShed", "Production Shed"],
                ["homeBasedProduction", "Home-based Production"]
              ].map(([key, label]) => (
                <View key={key} style={tsDetailStyles.fieldBlock}>
                  <Text style={tsDetailStyles.label}>{label}</Text>
                  <EditableSelect
                    value={nfcActivityProfileForm[key]}
                    options={yesNoOptions}
                    onChange={(value) =>
                      setNfcActivityProfileForm((prev) => ({ ...prev, [key]: value }))
                    }
                    placeholder="Select Yes / No"
                  />
                </View>
              ))}
              <View style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>Total Employment associated</Text>
                <TextInput
                  style={tsDetailStyles.selectInput}
                  value={nfcActivityProfileForm.totalEmploymentAssociated}
                  onChangeText={(text) =>
                    setNfcActivityProfileForm((prev) => ({
                      ...prev,
                      totalEmploymentAssociated: text.replace(/[^\d]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="Enter number"
                  placeholderTextColor="#64748b"
                />
              </View>
              {[
                ["gst", "GST"],
                ["gstRenewalDate", "GST Renewal Date"],
                ["pan", "PAN"],
                ["panRenewalDate", "PAN Renewal Date"],
                ["tradeLicense", "Trade License"],
                ["tradeRenewalDate", "Trade Renewal Date"],
                ["fssai", "FSSAI"],
                ["fssaiRenewDate", "FSSAI Renewal Date"]
              ].map(([key, label]) => (
                <View key={key} style={tsDetailStyles.fieldBlock}>
                  <Text style={tsDetailStyles.label}>{label}</Text>
                  <TextInput
                    style={tsDetailStyles.selectInput}
                    value={nfcActivityProfileForm[key]}
                    onChangeText={(text) =>
                      setNfcActivityProfileForm((prev) => ({ ...prev, [key]: text }))
                    }
                    placeholder={label}
                    placeholderTextColor="#64748b"
                  />
                </View>
              ))}
              <View style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>Monthly Production Volume</Text>
                <TextInput
                  style={tsDetailStyles.selectInput}
                  value={nfcActivityProfileForm.monthlyProductionVolume}
                  onChangeText={(text) =>
                    setNfcActivityProfileForm((prev) => ({
                      ...prev,
                      monthlyProductionVolume: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={tsDetailStyles.fieldBlock}>
                <Text style={tsDetailStyles.label}>Volume Unit</Text>
                <EditableSelect
                  value={nfcActivityProfileForm.volumeUnit}
                  options={volumeUnitOptions}
                  onChange={(value) =>
                    setNfcActivityProfileForm((prev) => ({ ...prev, volumeUnit: value }))
                  }
                  placeholder="Select unit"
                />
              </View>

              <Pressable
                style={tsDetailStyles.modalPrimaryBtnWide}
                disabled={Boolean(apiSavingKey)}
                onPress={() =>
                  saveActivityProfile(
                    "Non-Farm Collective Activity Profile",
                    nfcActivityProfileForm,
                    selectedLhCboStatusView,
                    {
                      profileType: "Non-Farm Collective Activity Profile",
                      saveKey: "nfcActivityProfile"
                    }
                  )
                }
              >
                <Text style={tsDetailStyles.modalPrimaryBtnText}>
                  {apiSavingKey === "nfcActivityProfile" ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "lhCboFinancialStatus") {
    const financialMetaByType = {
      pg: {
        title: "Financial Status",
        subtitle: "Producer Group",
        fields: [
          ["totalWorkingCapitalReceived", "Total Working Capital Received"],
          ["totalInfrastructureFundReceived", "Total Infrastructure Fund Received"],
          ["totalFundReceivedFromOtherSource", "Total Fund received from Other Source"],
          ["otherSourceDetails", "Other Source Details"],
          ["totalRepaymentDone", "Total Repayment done as on reporting Month"],
          ["balanceFundToBeRepaid", "Balance Fund to be repaid"]
        ]
      },
      nfc: {
        title: "Financial Status",
        subtitle: "Non-Farm Collective",
        fields: [
          ["totalWorkingCapitalApproved", "Total Working Capital Approved"],
          ["totalWorkingCapitalUsed", "Total Working Capital Used"],
          ["totalRepaymentDone", "Total Repayment done as on reporting Month"],
          ["balanceFundToBeRepaid", "Balance Fund to be repaid"]
        ]
      },
      ifc: {
        title: "Financial Status",
        subtitle: "Integrated Farming Cluster",
        fields: [
          ["totalWorkingCapitalApproved", "Total Working Capital Approved"],
          ["totalWorkingCapitalUsed", "Total Working Capital Used"],
          ["totalShareMoneyUsed", "Total Share Money Used"],
          ["balanceFund", "Balance Fund"]
        ]
      },
      fpc: {
        title: "Loan Status",
        subtitle: "Farmer Producer Company",
        fields: [
          ["totalWorkingCapitalApproved", "Total Working Capital Approved"],
          ["totalWorkingCapitalUsed", "Total Working Capital Used"],
          ["totalShareMoneyUsed", "Total Share Money Used"],
          ["balanceFund", "Balance Fund"]
        ]
      }
    };
    const financialMeta = financialMetaByType[selectedLhCboTypeKey] || financialMetaByType.pg;
    const activeFinancialForm = lhCboFinancialForms[selectedLhCboTypeKey] || lhCboFinancialForms.pg;

    return (
      <View style={pageStyles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[pageStyles.frame, tsDetailStyles.frame]}>
            <View style={tsDetailStyles.heroCard}>
              <View style={tsDetailStyles.titleWrap}>
                <Text style={tsDetailStyles.title}>{financialMeta.title}</Text>
              </View>
              <Text style={tsDetailStyles.sectionType}>{financialMeta.subtitle}</Text>
              <Text style={tsDetailStyles.sectionHint}>
                Enter the financial values and save to review them in the response popup.
              </Text>
            </View>
            <View style={tsDetailStyles.sectionCard}>
              {financialMeta.fields.map(([key, label]) => (
                <View key={key} style={tsDetailStyles.fieldBlock}>
                  <Text style={tsDetailStyles.label}>{label}</Text>
                  <TextInput
                    style={tsDetailStyles.selectInput}
                    value={activeFinancialForm[key]}
                    onChangeText={(text) =>
                      setLhCboFinancialForms((prev) => ({
                        ...prev,
                        [selectedLhCboTypeKey]: {
                          ...prev[selectedLhCboTypeKey],
                          [key]: key.toLowerCase().includes("detail") ? text : text.replace(/[^\d.]/g, "")
                        }
                      }))
                    }
                    keyboardType={key.toLowerCase().includes("detail") ? "default" : "numeric"}
                    placeholder={label}
                    placeholderTextColor="#64748b"
                  />
                </View>
              ))}
              <Pressable
                style={tsDetailStyles.modalPrimaryBtnWide}
                onPress={() =>
                  showSavedDataPopup(`${financialMeta.subtitle} ${financialMeta.title}`, activeFinancialForm, selectedLhCboStatusView)
                }
              >
                <Text style={tsDetailStyles.modalPrimaryBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "lhCboIncomeStatus") {
    const incomeTitleByType = {
      pg: "Income Status - Producer Group",
      nfc: "Income Status - Non-Farm Collective",
      ifc: "Income Status - Integrated Farming Cluster",
      fpc: "Income Status - Farmer Producer Company"
    };
    const activeIncomeForm = lhCboIncomeForms[selectedLhCboTypeKey] || lhCboIncomeForms.pg;

    return (
      <View style={pageStyles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[pageStyles.frame, tsDetailStyles.frame]}>
            <View style={tsDetailStyles.heroCard}>
              <View style={tsDetailStyles.titleWrap}>
                <Text style={tsDetailStyles.title}>Income Status</Text>
              </View>
              <Text style={tsDetailStyles.sectionType}>{incomeTitleByType[selectedLhCboTypeKey] || incomeTitleByType.pg}</Text>
              <Text style={tsDetailStyles.sectionHint}>
                Save the latest income and expenditure numbers for the selected livelihood CBO.
              </Text>
            </View>
            <View style={tsDetailStyles.sectionCard}>
              {[
                ["totalIncomeSinceLastYear", "Total Income Since last year"],
                ["totalIncomeUpToLastMonth", "Total Income incurred up to last Month"],
                ["totalRecurringExpenditureLastMonth", "Total Recurring expenditure on last month"],
                ["netProfitUpToLastMonth", "Net Profit incurred up to last month"]
              ].map(([key, label]) => (
                <View key={key} style={tsDetailStyles.fieldBlock}>
                  <Text style={tsDetailStyles.label}>{label}</Text>
                  <TextInput
                    style={tsDetailStyles.selectInput}
                    value={activeIncomeForm[key]}
                    onChangeText={(text) =>
                      setLhCboIncomeForms((prev) => ({
                        ...prev,
                        [selectedLhCboTypeKey]: {
                          ...prev[selectedLhCboTypeKey],
                          [key]: text.replace(/[^\d.]/g, "")
                        }
                      }))
                    }
                    keyboardType="numeric"
                    placeholder={label}
                    placeholderTextColor="#64748b"
                  />
                </View>
              ))}
              <Pressable
                style={tsDetailStyles.modalPrimaryBtnWide}
                onPress={() =>
                  showSavedDataPopup("Income Status", activeIncomeForm, selectedLhCboStatusView)
                }
              >
                <Text style={tsDetailStyles.modalPrimaryBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "technicalSupport") {
    return (
      <View style={pageStyles.screen}>
        <View style={tsCardStyles.frame}>
          <View style={tsCardStyles.heroCard}>
            <View style={tsCardStyles.titleWrap}>
              <Text style={tsCardStyles.title}>Support Status</Text>
            </View>
            <Text style={tsCardStyles.sectionType}>Geo Locked Access</Text>
            <Text style={tsCardStyles.sectionHint}>
              Enable geolocation first. Only when the token turns green can you open support modules.
            </Text>
          </View>

          <View style={tsCardStyles.memberCard}>
            <View style={tsCardStyles.memberRow}>
              <Text style={tsCardStyles.memberLabel}>SHG Member</Text>
              <Text style={tsCardStyles.memberValue}>{selectedMemberName}</Text>
            </View>
            <View style={tsCardStyles.memberRow}>
              <Text style={tsCardStyles.memberLabel}>SHG Name</Text>
              <Text style={tsCardStyles.memberValue}>{selectedShgName}</Text>
            </View>
          </View>

          <View style={tsCardStyles.geoCard}>
            <View style={tsCardStyles.geoHeaderRow}>
              <View
                style={[
                  tsCardStyles.geoDot,
                  geoStatusVariant === "green"
                    ? tsCardStyles.geoDotGreen
                    : geoStatusVariant === "red"
                      ? tsCardStyles.geoDotRed
                      : tsCardStyles.geoDotIdle
                ]}
              />
              <View style={tsCardStyles.geoCopy}>
                <Text style={tsCardStyles.geoTitle}>Geo Access Token</Text>
                <Text style={tsCardStyles.geoHint}>
                  {geoStatusVariant === "green"
                    ? "Verified. You can proceed to support modules."
                    : geoStatusVariant === "red"
                      ? "Location mismatch. Verify again near the assigned SHG."
                      : "Verification pending. Enable location to continue."}
                </Text>
              </View>
            </View>

            <Pressable style={tsCardStyles.geoActionBtn} onPress={() => checkRadiusDistance(false)}>
              <Text style={tsCardStyles.geoActionBtnText}>
                {isDistanceLoading ? "Checking Geo..." : "Enable / Match Geo"}
              </Text>
            </Pressable>
          </View>

          <View style={tsCardStyles.moduleCard}>
            <Pressable
              style={[
                tsCardStyles.mainButton,
                geoStatusVariant !== "green" && tsCardStyles.lockedButton
              ]}
              onPress={() => handleOpenTechnicalSupportModule("technicalSupportTech")}
            >
              <Text style={tsCardStyles.mainButtonText}>Technical Support{"\n"}Details</Text>
            </Pressable>
            <Pressable
              style={[
                tsCardStyles.mainButton,
                geoStatusVariant !== "green" && tsCardStyles.lockedButton
              ]}
              onPress={() => handleOpenTechnicalSupportModule("technicalSupportFinancial")}
            >
              <Text style={tsCardStyles.mainButtonText}>Financial Support{"\n"}Details</Text>
            </Pressable>

            <View style={tsCardStyles.segmentRow}>
              {["Past Supports", "Present Support", "Support Required"].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    tsCardStyles.segmentBtn,
                    supportStage === item && tsCardStyles.segmentBtnActive,
                    geoStatusVariant !== "green" && tsCardStyles.lockedButton
                  ]}
                  onPress={() => handleOpenSupportHistory(item)}
                  disabled={supportHistoryLoading}
                >
                  <Text style={tsCardStyles.segmentBtnText}>
                    {item === "Past Supports"
                      ? "Past\nSupports"
                      : item === "Present Support"
                        ? "Present\nSupport"
                        : "Support\nRequired"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={tsCardStyles.footerCard}>
            <Pressable
              style={tsCardStyles.saveBtn}
              onPress={() => {
                if (geoStatusVariant !== "green") {
                  showResponsePopup(
                    "Geo Verification Required",
                    "Get the green geo token before proceeding from this screen."
                  );
                  return;
                }
                showSavedDataPopup(
                  "Technical support status",
                  {
                    shgMember: selectedMemberName,
                    shgName: selectedShgName,
                    geoToken: geoStatusVariant,
                    supportStage
                  },
                  "shgMember"
                );
              }}
            >
              <Text style={tsCardStyles.saveBtnText}>Save</Text>
            </Pressable>
          </View>
          {renderResponsePopup()}
        </View>
      </View>
    );
  }

  if (homeView === "technicalSupportTech") {
    const yesNoOptions = ["Yes", "No"];
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
                  options={yesNoOptions}
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
                  options={yesNoOptions}
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
                  options={yesNoOptions}
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

  if (homeView === "technicalSupportFinancial") {
    const activityOptions = memberActivityOptions;
    const loanCycleOptions = ["Cycle 1", "Cycle 2", "Cycle 3"];

    return (
      <View style={pageStyles.screen}>
        <View style={flowStyles.investmentShell}>
          <View style={flowStyles.investmentHero}>
            <View style={flowStyles.investmentTitleWrap}>
              <Text style={flowStyles.investmentTitle}>Financial Support</Text>
            </View>
            <Text style={flowStyles.investmentEyebrow}>Loan Assessment</Text>
            <Text style={flowStyles.investmentHint}>
              Select the support requirement and preferred cycle to view the loan projection.
            </Text>
          </View>

          <View style={fsStyles.card}>
            <View style={fsStyles.fieldBlock}>
              <Text style={fsStyles.fieldLabel}>Activity of the Member</Text>
              <EditableSelect
                value={financialSupportForm.activityOfMember}
                options={activityOptions}
                onChange={(value) =>
                  setFinancialSupportForm((prev) => ({ ...prev, activityOfMember: value }))
                }
                placeholder="Select or type activity"
                inputStyle={fsStyles.cardInput}
              />
            </View>

            <View style={fsStyles.fieldBlock}>
              <Text style={fsStyles.fieldLabel}>Financial Support Required</Text>
              <View style={fsStyles.togglePillRow}>
                <Pressable
                  style={[
                    fsStyles.togglePill,
                    financialSupportForm.financialSupportRequired && fsStyles.togglePillActive
                  ]}
                  onPress={() =>
                    setFinancialSupportForm((prev) => ({
                      ...prev,
                      financialSupportRequired: true
                    }))
                  }
                >
                  <Text
                    style={[
                      fsStyles.togglePillText,
                      financialSupportForm.financialSupportRequired && fsStyles.togglePillTextActive
                    ]}
                  >
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    fsStyles.togglePill,
                    !financialSupportForm.financialSupportRequired && fsStyles.togglePillActive
                  ]}
                  onPress={() =>
                    setFinancialSupportForm((prev) => ({
                      ...prev,
                      financialSupportRequired: false
                    }))
                  }
                >
                  <Text
                    style={[
                      fsStyles.togglePillText,
                      !financialSupportForm.financialSupportRequired && fsStyles.togglePillTextActive
                    ]}
                  >
                    No
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={fsStyles.fieldBlock}>
              <Text style={fsStyles.fieldLabel}>Loan Cycle of Support Preferred</Text>
              <EditableSelect
                value={financialSupportForm.loanCyclePreferred}
                options={loanCycleOptions}
                onChange={(value) =>
                  setFinancialSupportForm((prev) => ({ ...prev, loanCyclePreferred: value }))
                }
                placeholder="Select or type cycle"
                inputStyle={fsStyles.cardInput}
              />
            </View>

            <View style={fsStyles.actionRow}>
              <Pressable
                style={[
                  fsStyles.popupActionBtn,
                  !financialSupportForm.financialSupportRequired && fsStyles.popupActionBtnDisabled
                ]}
                onPress={() => {
                  if (!financialSupportForm.financialSupportRequired) {
                    return;
                  }
                  if (!financialSupportForm.activityOfMember || !financialSupportForm.loanCyclePreferred) {
                    showResponsePopup(
                      "Incomplete Details",
                      "Select activity and loan cycle before viewing the loan projection."
                    );
                    return;
                  }
                  showResponsePopup("Loan Projection", buildFinancialSupportProjection());
                }}
              >
                <Text style={fsStyles.popupActionBtnText}>Loan Projection</Text>
              </Pressable>
              <Pressable
                style={fsStyles.saveActionBtn}
                onPress={handleSaveFinancialSupport}
                disabled={apiSavingKey === "financialSupport"}
              >
                <Text style={fsStyles.saveActionBtnText}>
                  {apiSavingKey === "financialSupport" ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "technicalSupportHistory") {
    const stageKeyByLabel = {
      "Past Supports": "PastSupport",
      "Present Support": "PresentSupport",
      "Support Required": "SupportRequired"
    };
    const stageKey = stageKeyByLabel[supportStage] || "PastSupport";
    const stageData = supportHistory?.[stageKey] || {};
    const financialEntries = Array.isArray(stageData.Financial) ? stageData.Financial : [];
    const technicalEntries = Array.isArray(stageData.Technical) ? stageData.Technical : [];

    const resolveActivityName = (activityId) =>
      memberActivityRecords.find((item) => String(item.id) === String(activityId))?.name ||
      `Activity #${activityId}`;

    const formatSupportDate = (value) => {
      const parsed = value ? new Date(value) : null;
      return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : "-";
    };

    return (
      <View style={pageStyles.screen}>
        <View style={flowStyles.investmentShell}>
          <View style={flowStyles.investmentHero}>
            <View style={flowStyles.investmentTitleWrap}>
              <Text style={flowStyles.investmentTitle}>{supportStage || "Support History"}</Text>
            </View>
            <Text style={flowStyles.investmentEyebrow}>Technical Support</Text>
            <Text style={flowStyles.investmentHint}>
              Live records from the server for {selectedMemberName}.
            </Text>
          </View>

          <View style={fsStyles.card}>
            <Text style={fsStyles.fieldLabel}>Financial Support</Text>
            {financialEntries.length === 0 ? (
              <Text style={fsStyles.fieldLabel}>No records yet.</Text>
            ) : (
              financialEntries.map((entry, index) => (
                <View key={entry.FinancialSupportId ?? index} style={fsStyles.fieldBlock}>
                  <Text style={fsStyles.fieldLabel}>{resolveActivityName(entry.ActivityId)}</Text>
                  <Text>
                    Support Required: {entry.IsFinancialSupportRequired ? "Yes" : "No"}
                    {"\n"}
                    Loan Cycle: {entry.LoanCycleName || entry.LoanCycleId || "-"}
                    {"\n"}
                    Saved On: {formatSupportDate(entry.CreatedDate)}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={fsStyles.card}>
            <Text style={fsStyles.fieldLabel}>Technical Support</Text>
            {technicalEntries.length === 0 ? (
              <Text style={fsStyles.fieldLabel}>No records yet.</Text>
            ) : (
              technicalEntries.map((entry, index) => (
                <View key={entry.TechnicalSupportId ?? index} style={fsStyles.fieldBlock}>
                  <Text style={fsStyles.fieldLabel}>{resolveActivityName(entry.ActivityId)}</Text>
                  <Text>Saved On: {formatSupportDate(entry.CreatedDate)}</Text>
                </View>
              ))
            )}
          </View>

          <Pressable
            style={fsStyles.saveActionBtn}
            onPress={() => onOpenUpdateData("technicalSupport")}
          >
            <Text style={fsStyles.saveActionBtnText}>Back</Text>
          </Pressable>
        </View>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "technicalSupportPast") {
    const activityOptions = memberActivityOptions;
    const sourceOptions = SUPPORT_SOURCE_OPTIONS;
    const rateOptions = ["8", "10", "12", "14"];
    const statusOptions = ["Pending", "Completed"];
    const topBalance = Math.max(
      (Number(pastSupportForm.topAmount) || 0) - (Number(pastSupportForm.repaymentCompleted) || 0),
      0
    );

    return (
      <View style={pageStyles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={flowStyles.investmentShell}>
            <View style={flowStyles.investmentHero}>
              <View style={flowStyles.investmentTitleWrap}>
                <Text style={flowStyles.investmentTitle}>Past Support</Text>
              </View>
              <Text style={flowStyles.investmentEyebrow}>Loan History</Text>
              <Text style={flowStyles.investmentHint}>
                Review earlier financial support details and repayment status for this member.
              </Text>
            </View>

            <View style={pastStyles.sectionCard}>
              <Text style={pastStyles.sectionTitle}>Previous Support Snapshot</Text>

              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Financial Support Taken on LH Activity</Text>
                <EditableSelect
                  value={pastSupportForm.topActivity}
                  options={activityOptions}
                  onChange={(value) => setPastSupportForm((prev) => ({ ...prev, topActivity: value }))}
                  placeholder="Select or type activity"
                  inputStyle={pastStyles.cardInput}
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Amount of Loan Taken</Text>
                <TextInput
                  style={pastStyles.cardInput}
                  value={pastSupportForm.topAmount}
                  onChangeText={(text) =>
                    setPastSupportForm((prev) => ({ ...prev, topAmount: text.replace(/[^\d.]/g, "") }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>SHG Loan taken through</Text>
                <EditableSelect
                  value={pastSupportForm.topLoanThrough}
                  options={sourceOptions}
                  onChange={(value) =>
                    setPastSupportForm((prev) => ({ ...prev, topLoanThrough: value }))
                  }
                  placeholder="Select or type source"
                  inputStyle={pastStyles.cardInput}
                />
              </View>
            </View>

            <View style={pastStyles.sectionCard}>
              <Text style={pastStyles.sectionTitle}>Repayment & Transaction Status</Text>

              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Financial Support Taken on LH Activity</Text>
                <EditableSelect
                  value={pastSupportForm.bottomActivity}
                  options={activityOptions}
                  onChange={(value) =>
                    setPastSupportForm((prev) => ({ ...prev, bottomActivity: value }))
                  }
                  placeholder="Select or type activity"
                  inputStyle={pastStyles.cardInput}
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Amount of Loan Taken</Text>
                <TextInput
                  style={pastStyles.cardInput}
                  value={pastSupportForm.bottomAmount}
                  onChangeText={(text) =>
                    setPastSupportForm((prev) => ({ ...prev, bottomAmount: text.replace(/[^\d.]/g, "") }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>SHG Loan taken through</Text>
                <EditableSelect
                  value={pastSupportForm.bottomLoanThrough}
                  options={sourceOptions}
                  onChange={(value) =>
                    setPastSupportForm((prev) => ({ ...prev, bottomLoanThrough: value }))
                  }
                  placeholder="Select or type source"
                  inputStyle={pastStyles.cardInput}
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Rate of Interest</Text>
                <EditableSelect
                  value={pastSupportForm.interestRate}
                  options={rateOptions}
                  onChange={(value) => setPastSupportForm((prev) => ({ ...prev, interestRate: value }))}
                  placeholder="Select or type rate"
                  inputStyle={pastStyles.cardInput}
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Repayment Completed</Text>
                <TextInput
                  style={pastStyles.cardInput}
                  value={pastSupportForm.repaymentCompleted}
                  onChangeText={(text) =>
                    setPastSupportForm((prev) => ({
                      ...prev,
                      repaymentCompleted: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Balance Amount</Text>
                <TextInput style={pastStyles.cardInputReadOnly} value={`${topBalance}`} editable={false} />
              </View>
              <View style={pastStyles.fieldBlock}>
                <Text style={pastStyles.fieldLabel}>Transaction Status</Text>
                <EditableSelect
                  value={pastSupportForm.transactionStatus}
                  options={statusOptions}
                  onChange={(value) =>
                    setPastSupportForm((prev) => ({ ...prev, transactionStatus: value }))
                  }
                  placeholder="Select or type status"
                  inputStyle={pastStyles.cardInput}
                />
              </View>

              <View style={pastStyles.actionRow}>
                <Pressable
                  style={pastStyles.linkBtn}
                  onPress={() => onOpenUpdateData("technicalSupportTransaction")}
                >
                  <Text style={pastStyles.linkBtnText}>Transaction Details</Text>
                </Pressable>
                <Pressable
                  style={pastStyles.saveBtn}
                  onPress={() => {
                    showSavedDataPopup("Past support details", pastSupportForm, "technicalSupport");
                  }}
                >
                  <Text style={pastStyles.saveBtnText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
        {renderResponsePopup()}
      </View>
    );
  }

  if (homeView === "technicalSupportTransaction") {
    const paymentByOptions = ["SHG", "VO", "CLF", "Bank"];
    const principalDue = Number(pastSupportForm.bottomAmount) || 0;
    const interestDue = Number(((principalDue * (Number(pastSupportForm.interestRate) || 0)) / 100).toFixed(2));
    const totalDue = Number((principalDue + interestDue).toFixed(2));
    const monthName = new Date().toLocaleString("en-US", { month: "short" });
    const outstandingAmount = Math.max(
      totalDue - ((Number(transactionDetailsForm.principalPaid) || 0) + (Number(transactionDetailsForm.interestPaid) || 0)),
      0
    ).toFixed(2);

    return (
      <View style={pageStyles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={flowStyles.investmentShell}>
            <View style={flowStyles.investmentHero}>
              <View style={flowStyles.investmentTitleWrap}>
                <Text style={flowStyles.investmentTitle}>Transaction Details</Text>
              </View>
              <Text style={flowStyles.investmentEyebrow}>Repayment Record</Text>
              <Text style={flowStyles.investmentHint}>
                Capture monthly repayment, upload the payment slip, and review the outstanding amount.
              </Text>
            </View>

            <View style={txnStyles.sectionCard}>
              <Text style={txnStyles.sectionTitle}>Payment Entry</Text>

              <View style={txnStyles.fieldBlock}>
                <Text style={txnStyles.fieldLabel}>Present Month Loan Repayment Status</Text>
                <TextInput
                  style={txnStyles.cardInput}
                  value={transactionDetailsForm.presentMonthLoanRepaymentStatus}
                  onChangeText={(text) =>
                    setTransactionDetailsForm((prev) => ({
                      ...prev,
                      presentMonthLoanRepaymentStatus: text
                    }))
                  }
                  placeholder="Auto (Present Month)"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={txnStyles.fieldBlock}>
                <Text style={txnStyles.fieldLabel}>Payment Details of Loan Taken By</Text>
                <EditableSelect
                  value={transactionDetailsForm.paymentDetailsBy}
                  options={paymentByOptions}
                  onChange={(value) =>
                    setTransactionDetailsForm((prev) => ({ ...prev, paymentDetailsBy: value }))
                  }
                  placeholder="Select or type payment source"
                  inputStyle={txnStyles.cardInput}
                />
              </View>

              <View style={txnStyles.fieldBlock}>
                <Text style={txnStyles.fieldLabel}>Upload Payment Slip (PDF / Image)</Text>
                <View style={txnStyles.uploadRow}>
                  <Pressable style={txnStyles.uploadBtn} onPress={handleUploadPaymentSlip}>
                    <Text style={txnStyles.uploadBtnText}>Upload Slip</Text>
                  </Pressable>
                  <View style={txnStyles.uploadMetaCard}>
                    <Text style={txnStyles.uploadMetaLabel}>
                      {transactionDetailsForm.paymentSlipType || "Pending"}
                    </Text>
                    <Text style={txnStyles.uploadMetaValue}>
                      {transactionDetailsForm.paymentSlipName || "No file selected"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={txnStyles.metricsGrid}>
                <View style={txnStyles.metricCard}>
                  <Text style={txnStyles.metricLabel}>Principal Due</Text>
                  <Text style={txnStyles.metricValue}>{principalDue}</Text>
                </View>
                <View style={txnStyles.metricCard}>
                  <Text style={txnStyles.metricLabel}>Interest Due</Text>
                  <Text style={txnStyles.metricValue}>{interestDue}</Text>
                </View>
                <View style={txnStyles.metricCard}>
                  <Text style={txnStyles.metricLabel}>Total Due</Text>
                  <Text style={txnStyles.metricValue}>{totalDue}</Text>
                </View>
              </View>

              <View style={txnStyles.fieldBlock}>
                <Text style={txnStyles.fieldLabel}>Principal (Amount Paid)</Text>
                <TextInput
                  style={txnStyles.cardInput}
                  value={transactionDetailsForm.principalPaid}
                  onChangeText={(text) =>
                    setTransactionDetailsForm((prev) => ({
                      ...prev,
                      principalPaid: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={txnStyles.fieldBlock}>
                <Text style={txnStyles.fieldLabel}>Interest (Amount Paid)</Text>
                <TextInput
                  style={txnStyles.cardInput}
                  value={transactionDetailsForm.interestPaid}
                  onChangeText={(text) =>
                    setTransactionDetailsForm((prev) => ({
                      ...prev,
                      interestPaid: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
              <View style={txnStyles.fieldBlock}>
                <Text style={txnStyles.fieldLabel}>Total (Amount Paid)</Text>
                <TextInput
                  style={txnStyles.cardInput}
                  value={transactionDetailsForm.totalPaid}
                  onChangeText={(text) =>
                    setTransactionDetailsForm((prev) => ({
                      ...prev,
                      totalPaid: text.replace(/[^\d.]/g, "")
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            <View style={txnStyles.sectionCard}>
              <Text style={txnStyles.sectionTitle}>Month-wise Repayment Status</Text>
              <View style={txnStyles.summaryCard}>
                <View style={txnStyles.summaryRow}>
                  <Text style={txnStyles.summaryLabel}>Month</Text>
                  <Text style={txnStyles.summaryValue}>{monthName}</Text>
                </View>
                <View style={txnStyles.summaryRow}>
                  <Text style={txnStyles.summaryLabel}>Principal to be Paid</Text>
                  <Text style={txnStyles.summaryValue}>{principalDue}</Text>
                </View>
                <View style={txnStyles.summaryRow}>
                  <Text style={txnStyles.summaryLabel}>Interest to be Paid</Text>
                  <Text style={txnStyles.summaryValue}>{interestDue}</Text>
                </View>
                <View style={txnStyles.summaryRow}>
                  <Text style={txnStyles.summaryLabel}>Principal Paid</Text>
                  <Text style={txnStyles.summaryValue}>{transactionDetailsForm.principalPaid || "0"}</Text>
                </View>
                <View style={txnStyles.summaryRow}>
                  <Text style={txnStyles.summaryLabel}>Interest Paid</Text>
                  <Text style={txnStyles.summaryValue}>{transactionDetailsForm.interestPaid || "0"}</Text>
                </View>
                <View style={txnStyles.summaryRow}>
                  <Text style={txnStyles.summaryLabel}>Outstanding</Text>
                  <Text style={txnStyles.summaryValue}>{outstandingAmount}</Text>
                </View>
              </View>

              <View style={txnStyles.actionRow}>
                <Pressable
                  style={txnStyles.saveBtn}
                  onPress={() => {
                    showSavedDataPopup("Transaction details", transactionDetailsForm, "technicalSupportPast");
                  }}
                >
                  <Text style={txnStyles.saveBtnText}>Save</Text>
                </Pressable>
                <Pressable
                  style={txnStyles.backBtn}
                  onPress={() => onOpenUpdateData("technicalSupportPast")}
                >
                  <Text style={txnStyles.backBtnText}>Back</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
        {renderResponsePopup()}
      </View>
    );
  }

  return (
    <View style={pageStyles.screen}>
      <View style={pageStyles.bgGlowTop} />
      <View style={pageStyles.bgGlowBottom} />
      <View style={pageStyles.frame}>
        <View style={pageStyles.topRow}>
          <View style={pageStyles.imageCard}>
            <Text style={pageStyles.imageAvatarText}>{headerCrpInitials}</Text>
            <Text style={pageStyles.imageText}>CRP</Text>
          </View>
          <View style={pageStyles.infoCard}>
            <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
            <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
          </View>
        </View>

        <View style={pageStyles.dropdownWrap}>
          <Pressable
            style={pageStyles.dropdownTrigger}
            onPress={() => setShowCrpTypeMenu((prev) => !prev)}
          >
            <Text style={pageStyles.dropdownText}>Type of CRP: {selectedCrpType}</Text>
            <Text style={pageStyles.dropdownArrow}>{showCrpTypeMenu ? "^" : "v"}</Text>
          </Pressable>
          {showCrpTypeMenu ? (
            <View style={pageStyles.dropdownMenu}>
              {crpTypeOptions.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    pageStyles.dropdownItem,
                    selectedCrpType === item && pageStyles.dropdownItemActive
                  ]}
                  onPress={() => {
                    setSelectedCrpType(item);
                    setShowCrpTypeMenu(false);
                  }}
                >
                  <Text
                    style={[
                      pageStyles.dropdownItemText,
                      selectedCrpType === item && pageStyles.dropdownItemTextActive
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {renderAlertPopup()}

        <View style={pageStyles.dashboardCard}>
          <View style={pageStyles.dashboardHeadingRow}>
            <View>
              <Text style={pageStyles.dashboardEyebrow}>Live Performance</Text>
              <Text style={pageStyles.dashboardTitle}>Dashboard</Text>
            </View>
            <View style={pageStyles.dashboardDateBadge}>
              <Text style={pageStyles.dashboardDateLabel}>{dashboardDateLabel}</Text>
            </View>
          </View>

          <View style={pageStyles.metricGrid}>
            {dashboardHighlights.map((item) => (
              <View key={item.key} style={pageStyles.metricStatCard}>
                <View style={[pageStyles.metricAccent, { backgroundColor: item.tint }]} />
                <Text style={pageStyles.metricStatLabel}>{item.label}</Text>
                <Text style={pageStyles.metricStatValue}>{item.value}</Text>
                <Text style={pageStyles.metricStatHint}>{item.hint}</Text>
              </View>
            ))}
          </View>

          <View style={pageStyles.dashboardGraphStrip}>
            <View style={pageStyles.dashboardGraphStripCopy}>
              <Text style={pageStyles.dashboardGraphStripTitle}>Insights & Trends</Text>
              <Text style={pageStyles.dashboardGraphStripHint}>
                Open visual summaries for visits, member coverage, and honorarium.
              </Text>
            </View>
            <View style={pageStyles.dashboardGraphStripActions}>
              <Pressable style={pageStyles.graphPill} onPress={() => handleGraphPress("visits")}>
                <Text style={pageStyles.graphText}>Visits</Text>
              </Pressable>
              <Pressable style={[pageStyles.graphPill, pageStyles.graphPillTeal]} onPress={() => handleGraphPress("members")}>
                <Text style={pageStyles.graphText}>Members</Text>
              </Pressable>
              <Pressable style={[pageStyles.graphPill, pageStyles.graphPillOrange]} onPress={() => handleGraphPress("honorarium")}>
                <Text style={pageStyles.graphText}>Honorarium</Text>
              </Pressable>
            </View>
          </View>

          <View style={pageStyles.submitActionRow}>
            <Pressable style={pageStyles.graphActionBtn} onPress={() => handleGraphPress("visits")}>
              <Text style={pageStyles.graphActionBtnText}>Open Graphs</Text>
            </Pressable>
            <Pressable style={pageStyles.submitActionBtn} onPress={onOpenWorkingReport}>
              <Text style={pageStyles.submitActionBtnText}>Submit</Text>
            </Pressable>
          </View>

          <View style={pageStyles.dashboardInlineAlert}>
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
                <View key={`inline-alert-${index}-${item}`} style={pageStyles.dashboardInlineAlertItem}>
                  <View style={pageStyles.dashboardAlertDot} />
                  <Text style={pageStyles.dashboardInlineAlertText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={pageStyles.dashboardActivityPanel}>
            <Text style={pageStyles.dashboardActivityTitle}>Different Activities of the Concern CRP</Text>
            {activities.length ? (
              activities.slice(0, 3).map((item) => (
                <Text key={item.id} style={pageStyles.dashboardActivityLine}>
                  - {item.title}
                </Text>
              ))
            ) : (
              <Text style={pageStyles.dashboardActivityEmpty}>Daily visit reports will appear here.</Text>
            )}
          </View>
        </View>

        <View style={pageStyles.quickActionsCard}>
          <Text style={pageStyles.quickActionsTitle}>Quick Actions</Text>
          <View style={pageStyles.actionsRow}>
            <Pressable style={[pageStyles.actionBtnMuted, pageStyles.actionBtnAmber]} onPress={onOpenNewEnrolment}>
              <Text style={pageStyles.actionTextMuted}>New{"\n"}Enrolment</Text>
            </Pressable>
            <Pressable style={pageStyles.actionBtnPrimary} onPress={onOpenShgMember}>
              <Text style={pageStyles.actionTextPrimary}>SHG{"\n"}Member</Text>
            </Pressable>
            <Pressable style={[pageStyles.actionBtnMuted, pageStyles.actionBtnSlate]} onPress={onOpenUpdateData}>
              <Text style={pageStyles.actionTextMuted}>Update Data</Text>
            </Pressable>
          </View>
        </View>

        <PostCheckoutModal
          visible={showPostCheckoutModal}
          onClose={() => setShowPostCheckoutModal(false)}
          onLogout={onLogout}
        />
      </View>
    </View>
  );
}
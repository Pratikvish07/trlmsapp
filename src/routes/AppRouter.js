import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/BottomNav";
import TrlmHeader from "../components/TrlmHeader";
import DashboardHomeTab from "../screens/tabs/DashboardHomeTab.js";
import ProfileTab from "../screens/tabs/ProfileTab";
import LanguageScreen from "../screens/LanguageScreen";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import { I18nProvider } from "../i18n/I18nProvider";
import { detectBrowserLanguage, persistLanguage, readStoredLanguage } from "../i18n/config";
import { getLanguageCode, translateText } from "../i18n/translations";
import styles from "../styles/appStyles";
import {
  detectRole,
  isAadhaarValid,
  isContactValid,
  isEmailValid,
  isLokosValid,
  isPasswordStrong
} from "../utils/appCalculations";
import { getCurrentLocation } from "../utils/geofence";
import {
  clearAuthToken,
  decodeJwtToken,
  fetchAllCrps,
  fetchGpsByBlock,
  fetchVillagesByGp,
  isTokenExpired,
  loginUser,
  setAuthToken,
  submitCrpSignup,
  submitCrpAttendanceCheckIn
} from "../services/masterApi";
import {
  loginSuccess,
  setAuthError,
  logout,
  signupStart,
  signupSuccess,
  signupFailure,
  clearSignupError,
  setLanguage
} from "../store/authSlice";

const USER_STORAGE_KEY = "trlmUserProfile";
const USER_DIRECTORY_KEY = "trlmUserProfilesByIdentity";
const APP_NAV_STORAGE_KEY = "trlmAppNavState";
const CHECKIN_STORAGE_KEY = "trlmCheckInState";
// Must match DASHBOARD_SELECTION_STORAGE_KEY in DashboardHomeTab.js - kept
// as a literal here rather than a shared import to avoid a cross-file
// constant just for a storage key string. Cleared on logout below so a new
// CRP logging in on the same device never inherits the previous CRP's
// selected village/SHG/member.
const DASHBOARD_SELECTION_STORAGE_KEY = "trlmDashboardSelectionState";
const EMPTY_SESSION_INFO = {
  isActive: false,
  loginAt: "",
  logoutAt: "",
  elapsedSeconds: 0
};
const EMPTY_CHECKIN_INFO = {
  isCheckedIn: false,
  checkInAt: "",
  checkOutAt: "",
  currentDate: "",
  latitude: null,
  longitude: null,
  accuracy: 0,
  geoEnabled: false
};

// react-native's Alert.alert is a documented no-op on react-native-web -
// it silently does nothing visible in a browser. This file relies on it in
// 29 places (every login/signup/check-in error and confirmation), which
// means essentially none of those messages have ever actually appeared on
// screen when running on web - they fired, the underlying logic ran (e.g.
// routing back to login), but the user never saw why. Falls back to the
// browser's native window.alert on web; unchanged native behavior on
// iOS/Android.
function showAlert(title, message) {
  if (Platform.OS === "web" && typeof window !== "undefined" && window.alert) {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatFriendlyDate(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatFriendlyTime(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

export default function AppRouter() {
  const [step, setStep] = useState("splash");
  const [postSplashStep, setPostSplashStep] = useState("login");
  const [activeTab, setActiveTab] = useState("Home");
  const [homeView, setHomeView] = useState("dashboard");
  const [appHydrated, setAppHydrated] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [checkInSubmitting, setCheckInSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({
    idType: "",
    identity: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    uid: "",
    lokosId: "",
    district: "",
    districtId: "",
    block: "",
    blockId: "",
    gpId: "",
    villageId: "",
    gpVc: [],
    villages: [],
    password: "",
    confirmPassword: "",
    contactNo: "",
    email: "",
    categoryId: "",
    crpTypeId: "",
    shgId: "",
    pictureFile: ""
  });

  const [user, setUser] = useState({
    identity: "",
    crpRegistrationId: "",
    role: "",
    name: "",
    block: "",
    blockId: "",
    gpId: "",
    villageId: "",
    gpVcName: "",
    villageName: "",
    language: ""
  });

  const [workingReport, setWorkingReport] = useState({
    amountReceived: "",
    lastReceivedDate: new Date().toISOString().slice(0, 10),
    submitted: false
  });

  const [alerts, setAlerts] = useState([]);
  const [assignedShgMembers, setAssignedShgMembers] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(EMPTY_SESSION_INFO);
  const [checkInInfo, setCheckInInfo] = useState({
    ...EMPTY_CHECKIN_INFO,
    currentDate: getTodayIsoDate()
  });
  const [showPostCheckoutModal, setShowPostCheckoutModal] = useState(false);
  const dispatch = useDispatch();
  const signupStatus = useSelector((state) => state.auth.signupStatus);
  const signupError = useSelector((state) => state.auth.signupError);
  const language = useSelector((state) => state.auth.language);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [savedLanguage, savedUserProfile, savedNavState, savedCheckInState] = await Promise.all([
          readStoredLanguage(),
          AsyncStorage.getItem(USER_STORAGE_KEY),
          AsyncStorage.getItem(APP_NAV_STORAGE_KEY),
          AsyncStorage.getItem(CHECKIN_STORAGE_KEY)
        ]);
        const todayIso = getTodayIsoDate();
        const parsedNavState = savedNavState ? JSON.parse(savedNavState) : null;
        const parsedCheckInState = savedCheckInState
          ? JSON.parse(savedCheckInState)
          : null;

        dispatch(setLanguage(savedLanguage || detectBrowserLanguage()));

        if (savedUserProfile) {
          const parsedUserProfile = JSON.parse(savedUserProfile);
          setUser((prev) => ({
            ...prev,
            ...parsedUserProfile
          }));
          if (parsedUserProfile?.token && !isTokenExpired(parsedUserProfile.token)) {
            setAuthToken(parsedUserProfile.token);
          } else if (parsedUserProfile?.token) {
            // Stored session token has expired - drop it so the next API
            // call doesn't silently fail; the user will be routed through
            // login again instead of hitting confusing 401s mid-session.
            clearAuthToken();
          }
          if (parsedUserProfile?.sessionActive && parsedUserProfile?.sessionStartedAt) {
            const loginTime = new Date(parsedUserProfile.sessionStartedAt).getTime();
            setSessionInfo({
              isActive: true,
              loginAt: parsedUserProfile.sessionStartedAt,
              logoutAt: "",
              elapsedSeconds: Math.max(0, Math.floor((Date.now() - loginTime) / 1000))
            });
          }
        }

        if (parsedNavState?.activeTab) {
          setActiveTab(parsedNavState.activeTab);
        }

        if (parsedNavState?.homeView) {
          setHomeView(parsedNavState.homeView);
        }

        const hasActiveCheckIn =
          parsedCheckInState?.currentDate === todayIso &&
          parsedCheckInState?.isCheckedIn &&
          !parsedCheckInState?.checkOutAt;

        const normalizedCheckInState = hasActiveCheckIn
          ? parsedCheckInState
          : {
              ...EMPTY_CHECKIN_INFO,
              currentDate: todayIso
            };

        setCheckInInfo(normalizedCheckInState);

        const savedStep = parsedNavState?.step;
        if (hasActiveCheckIn) {
          if (savedStep === "dashboard" && savedUserProfile) {
            setPostSplashStep("dashboard");
          } else if (savedStep === "login") {
            setPostSplashStep("login");
          } else if (savedStep === "language") {
            setPostSplashStep("language");
          } else {
            setPostSplashStep(savedUserProfile ? "login" : "language");
          }
        } else {
          setPostSplashStep("login");
        }
      } catch (error) {
        console.error("Error loading saved app preferences:", error);
      } finally {
        setAppHydrated(true);
      }
    };

    loadPreferences();
  }, [dispatch]);

  useEffect(() => {
    if (!appHydrated || step !== "splash") {
      return undefined;
    }

    const timer = setTimeout(() => setStep(postSplashStep), 1800);
    return () => clearTimeout(timer);
  }, [appHydrated, postSplashStep, step]);

  useEffect(() => {
    if (!appHydrated) {
      return;
    }

    AsyncStorage.setItem(
      APP_NAV_STORAGE_KEY,
      JSON.stringify({
        step: step === "splash" ? postSplashStep : step,
        activeTab,
        homeView
      })
    ).catch((error) => {
      console.error("Error saving app navigation state:", error);
    });
  }, [activeTab, appHydrated, homeView, postSplashStep, step]);

  useEffect(() => {
    if (!appHydrated) {
      return;
    }

    AsyncStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(checkInInfo)).catch((error) => {
      console.error("Error saving check-in state:", error);
    });
  }, [appHydrated, checkInInfo]);

  useEffect(() => {
    if (!sessionInfo.isActive || !sessionInfo.loginAt) {
      return undefined;
    }

    const timer = setInterval(() => {
      const loginTime = new Date(sessionInfo.loginAt).getTime();
      setSessionInfo((prev) => ({
        ...prev,
        elapsedSeconds: Math.max(0, Math.floor((Date.now() - loginTime) / 1000))
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionInfo.isActive, sessionInfo.loginAt]);

  const persistUserProfile = async (profile) => {
    try {
      const identityKey = String(profile?.identity || "").trim().toUpperCase();
      const existingDirectoryRaw = await AsyncStorage.getItem(USER_DIRECTORY_KEY);
      const existingDirectory = existingDirectoryRaw
        ? JSON.parse(existingDirectoryRaw)
        : {};
      const updatedDirectory = identityKey
        ? {
            ...existingDirectory,
            [identityKey]: profile
          }
        : existingDirectory;

      await Promise.all([
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile)),
        AsyncStorage.setItem(USER_DIRECTORY_KEY, JSON.stringify(updatedDirectory))
      ]);
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const getStoredProfileByIdentity = async (identity) => {
    try {
      const identityKey = String(identity || "").trim().toUpperCase();
      if (!identityKey) {
        return null;
      }

      const existingDirectoryRaw = await AsyncStorage.getItem(USER_DIRECTORY_KEY);
      const existingDirectory = existingDirectoryRaw
        ? JSON.parse(existingDirectoryRaw)
        : {};

      return existingDirectory?.[identityKey] || null;
    } catch (error) {
      console.error("Error loading stored user profile:", error);
      return null;
    }
  };

  const handleSetLanguage = useCallback(
    async (selectedLanguage) => {
      const normalizedLanguage = getLanguageCode(selectedLanguage);
      dispatch(setLanguage(normalizedLanguage));
      try {
        await persistLanguage(normalizedLanguage);
      } catch (error) {
        console.error("Error saving language:", error);
      }
    },
    [dispatch]
  );
  const [pendingApprovalCrpId, setPendingApprovalCrpId] = useState("");
  const [signupApiModal, setSignupApiModal] = useState({
    visible: false,
    title: "",
    message: "",
    status: "",
    crpId: ""
  });

  const [activities, setActivities] = useState([]);

  const t = useCallback((text) => translateText(language, text), [language]);
  const formatSessionDuration = (totalSeconds) => {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };
  const extractCrpId = (value) => {
    const text = typeof value === "string" ? value : "";
    const match = text.match(/CRP-\d+/i);
    return match ? match[0].toUpperCase() : "";
  };

  const unwrapAuthPayload = (payload) => {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return payload;
    }

    if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
      return payload.data;
    }

    if (payload.result && typeof payload.result === "object" && !Array.isArray(payload.result)) {
      return payload.result;
    }

    if (payload.user && typeof payload.user === "object" && !Array.isArray(payload.user)) {
      return payload.user;
    }

    return payload;
  };

  const extractIdentity = (payload, fallbackIdentity) => {
    const resolvedPayload = unwrapAuthPayload(payload);
    const message = typeof payload?.message === "string" ? payload.message : "";

    return (
      resolvedPayload?.crpId ||
      resolvedPayload?.CRPId ||
      resolvedPayload?.masterId ||
      resolvedPayload?.MasterId ||
      resolvedPayload?.userId ||
      resolvedPayload?.UserId ||
      resolvedPayload?.id ||
      resolvedPayload?.Id ||
      extractCrpId(message) ||
      fallbackIdentity
    );
  };

  const extractEntityId = (payload, keys = []) =>
    keys
      .map((key) => unwrapAuthPayload(payload)?.[key])
      .find((value) => value !== undefined && value !== null && value !== "");

  const resolveMappedName = async (loader, parentId, targetId) => {
    if (!parentId || !targetId) {
      return "";
    }

    try {
      const options = await loader(parentId);
      const matched = options.find(
        (item) => String(item.id) === String(targetId)
      );
      return matched?.name || "";
    } catch (error) {
      console.warn("Unable to resolve mapped name:", error);
      return "";
    }
  };

  const isApprovalPendingStatus = (payload) => {
    const resolvedPayload = unwrapAuthPayload(payload);

    if (resolvedPayload?.token) {
      return false;
    }

    const rawApprovalStatus =
      resolvedPayload?.approvalStatus ?? resolvedPayload?.ApprovalStatus;
    if (rawApprovalStatus !== undefined && rawApprovalStatus !== null && rawApprovalStatus !== "") {
      return Number(rawApprovalStatus) === 0;
    }

    const statusText = String(
      resolvedPayload?.status ||
      resolvedPayload?.approvalStatus ||
      payload?.message ||
      ""
    ).toLowerCase();

    return (
      statusText.includes("pending") ||
      statusText.includes("awaiting approval") ||
      statusText.includes("under review")
    );
  };

  const dashboardMetrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const activitiesInLast30Days = activities.filter((item) => {
      if (!item.reportDate) {
        return false;
      }

      const reportDate = new Date(item.reportDate);
      return !Number.isNaN(reportDate.getTime()) && reportDate >= thirtyDaysAgo;
    });
    const totalVisits30 = activitiesInLast30Days.length;
    const totalMembersVisited = new Set(
      activities.map((item) => item.memberName).filter(Boolean)
    ).size;
    const attendanceDays = new Set(
      activities.map((item) => item.reportDate).filter(Boolean)
    ).size;
    const totalMembersVisitedToday = new Set(
      activities
        .filter((item) => item.reportDate === today)
        .map((item) => item.memberName)
        .filter(Boolean)
    ).size;
    const visitGraph = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateKey = date.toISOString().slice(0, 10);

      return activitiesInLast30Days.filter((item) => item.reportDate === dateKey).length;
    });

    return {
      totalVisits30,
      totalMembersVisited,
      totalMembersVisitedToday,
      attendanceDays,
      honorariumToBeClaimed: 0,
      shgMembersAssigned: assignedShgMembers.length,
      honorariumReceived: Number(workingReport.amountReceived) || 0,
      visitGraph,
      activityGraph: []
    };
  }, [activities, assignedShgMembers.length, workingReport.amountReceived]);

  const onLogin = async () => {
    if (!loginForm.identity || !loginForm.password) {
      showAlert(t("Login error"), t("Please enter Master ID/CRP ID and Password."));
      return;
    }

    if (
      pendingApprovalCrpId &&
      loginForm.identity.trim().toUpperCase() === pendingApprovalCrpId.toUpperCase()
    ) {
      showAlert(
        t("Approval pending"),
        t("Your CRP registration is submitted, but admin approval is still pending. Please wait for approval before logging in.")
      );
      return;
    }

    const selectedIdType = loginForm.idType || "CRP ID";
    if (selectedIdType !== "CRP ID") {
      showAlert(
        t("Login error"),
        t("Master ID login API is not connected yet. Please use CRP ID for now.")
      );
      return;
    }

    const identity = loginForm.identity.trim();
    const payload = {
      crpId: identity,
      passwordHash: loginForm.password
    };

    try {
      setLoginSubmitting(true);
      dispatch(setAuthError(""));
      const response = await loginUser(payload);
      const authPayload = unwrapAuthPayload(response);
      // The API only ever returns { token }. Everything else the app used
      // to guess (role, user id) actually lives in that JWT's claims -
      // decode it once up front so the guesswork below only kicks in for
      // whatever the token itself doesn't carry.
      const tokenClaims = decodeJwtToken(authPayload?.token);

      if (isApprovalPendingStatus(response)) {
        showAlert(
          t("Approval pending"),
          t("Your account is still waiting for approval. Please try again after approval is completed.")
        );
        return;
      }

      const resolvedIdentity = extractIdentity(response, identity);
      const storedProfile = await getStoredProfileByIdentity(resolvedIdentity);
      const resolvedRole =
        authPayload?.role ||
        authPayload?.userRole ||
        authPayload?.designation ||
        tokenClaims?.role ||
        detectRole(resolvedIdentity);
      const resolvedName =
        authPayload?.fullName ||
        authPayload?.FullName ||
        storedProfile?.name ||
        user.name ||
        authPayload?.name ||
        authPayload?.userName ||
        identity;
      const token = typeof authPayload?.token === "string" ? authPayload.token : "";
      if (token) {
        setAuthToken(token);
      }

      // Re-introduced after confirming (via a manually-pasted token in
      // Swagger) that this endpoint works fine and returns full profile
      // data - villageId, blockId, gpId, crpRegistrationId - none of
      // which the login response itself ever includes. The earlier 401
      // that led to removing this was most likely a timing issue (this
      // call now runs strictly after setAuthToken above, never before),
      // not a genuine permissions block. Still wrapped in try/catch and
      // still non-blocking: if it fails for any reason, login proceeds
      // with whatever the existing fallbacks below can resolve.
      let directoryRecord = null;
      try {
        const allCrps = await fetchAllCrps();
        const normalizedIdentity = String(resolvedIdentity || "").trim().toUpperCase();
        directoryRecord =
          allCrps.find(
            (item) => String(item.crpId || "").trim().toUpperCase() === normalizedIdentity
          ) || null;
      } catch (error) {
        console.warn("Unable to load CRP directory record:", error);
      }

      const resolvedBlock =
        authPayload?.block ||
        authPayload?.blockName ||
        directoryRecord?.blockName ||
        storedProfile?.block ||
        user.block ||
        tokenClaims?.block ||
        "";
      const resolvedBlockId =
        extractEntityId(response, ["blockId", "BlockId"]) || directoryRecord?.blockId || "";
      const resolvedGpId =
        extractEntityId(response, ["gpId", "GPId"]) || directoryRecord?.gpId || "";
      const resolvedVillageId =
        extractEntityId(response, ["villageId", "VillageId"]) || directoryRecord?.villageId || "";
      const tokenUserId = Number(tokenClaims?.userId);
      const resolvedCrpRegistrationId =
        extractEntityId(response, [
          "crpRegistrationId",
          "CrpRegistrationId",
          "CRPRegistrationId"
        ]) ||
        directoryRecord?.crpRegistrationId ||
        storedProfile?.crpRegistrationId ||
        (tokenUserId > 0 ? tokenUserId : "");
      const fallbackGpName =
        authPayload?.gpVcName ||
        authPayload?.gpName ||
        authPayload?.GPName ||
        directoryRecord?.gpName ||
        storedProfile?.gpVcName ||
        user.gpVcName ||
        "";
      const fallbackVillageName =
        authPayload?.villageName ||
        authPayload?.VillageName ||
        authPayload?.village ||
        directoryRecord?.villageName ||
        storedProfile?.villageName ||
        user.villageName ||
        "";
      const [resolvedGpName, resolvedVillageName] = await Promise.all([
        fallbackGpName
          ? Promise.resolve(fallbackGpName)
          : resolveMappedName(fetchGpsByBlock, resolvedBlockId, resolvedGpId),
        fallbackVillageName
          ? Promise.resolve(fallbackVillageName)
          : resolveMappedName(fetchVillagesByGp, resolvedGpId, resolvedVillageId)
      ]);

      const nextUser = {
        identity: resolvedIdentity,
        crpRegistrationId: resolvedCrpRegistrationId,
        role: resolvedRole,
        name: resolvedName,
        block: resolvedBlock,
        blockId: resolvedBlockId || storedProfile?.blockId || user.blockId || "",
        gpId: resolvedGpId || storedProfile?.gpId || user.gpId || "",
        villageId: resolvedVillageId || storedProfile?.villageId || user.villageId || "",
        gpVcName: resolvedGpName,
        villageName: resolvedVillageName,
        language,
        token
      };
      const loginAt = new Date().toISOString();
      const nextSessionInfo = {
        isActive: true,
        loginAt,
        logoutAt: "",
        elapsedSeconds: 0
      };
      const userWithSession = {
        ...nextUser,
        sessionStartedAt: loginAt,
        sessionEndedAt: "",
        lastSessionDurationSeconds: 0,
        lastSessionDurationLabel: formatSessionDuration(0),
        sessionActive: true
      };

      setAuthToken(token);
      setSessionInfo(nextSessionInfo);
      setUser(userWithSession);
      persistUserProfile(userWithSession);
      dispatch(
        loginSuccess({
          crpId: resolvedIdentity,
          role: resolvedRole,
          token
        })
      );

      setActiveTab("Home");
      setHomeView("dashboard");
      if (
        checkInInfo.isCheckedIn &&
        !checkInInfo.checkOutAt &&
        checkInInfo.currentDate === getTodayIsoDate()
      ) {
        setPostSplashStep("dashboard");
        setStep("dashboard");
      } else {
        setPostSplashStep("attendanceGate");
        setStep("attendanceGate");
      }
    } catch (error) {
      dispatch(setAuthError(error.message || t("Unable to login right now.")));
      showAlert(t("Login error"), error.message || t("Unable to login right now."));
    } finally {
      setLoginSubmitting(false);
    }
  };

  const onSignup = async (generatedCrpId, currentLocation) => {
    dispatch(clearSignupError());
    if (!signupForm.name.trim()) {
      showAlert(t("Validation"), t("Name is required."));
      return;
    }

    if (!isAadhaarValid(signupForm.uid)) {
      showAlert(t("Validation"), t("UID (Aadhaar ID) must be exactly 12 digits."));
      return;
    }

    if (!isLokosValid(signupForm.lokosId)) {
      showAlert(t("Validation"), t("LokOS ID must be exactly 12 digits."));
      return;
    }

    if (!signupForm.district || !signupForm.block) {
      showAlert(t("Validation"), t("Select District and Block."));
      return;
    }

    if (signupForm.gpVc.length === 0 || signupForm.villages.length === 0) {
      showAlert(t("Validation"), t("Select GP/VC and Village Covered."));
      return;
    }

    if (!isPasswordStrong(signupForm.password)) {
      showAlert(t("Validation"), t("Password must include upper, lower, number, and special character (example: Aa@1)."));
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      showAlert(t("Validation"), t("Password and Confirm Password do not match."));
      return;
    }

    if (!isContactValid(signupForm.contactNo)) {
      showAlert(t("Validation"), t("Contact number must be 10 digits (+91)."));
      return;
    }

    if (!isEmailValid(signupForm.email)) {
      showAlert(t("Validation"), t("Enter a valid Email ID."));
      return;
    }

    if (!signupForm.categoryId) {
      showAlert(t("Validation"), t("Category ID is required."));
      return;
    }

    if (!signupForm.crpTypeId) {
      showAlert(t("Validation"), t("Select CRP Type."));
      return;
    }

    if (!signupForm.pictureFile) {
      showAlert(t("Validation"), t("Please select a profile photo."));
      return;
    }

    const payload = {
      fullName: String(signupForm.name?.trim() || ""),
      aadhaarNo: String(signupForm.uid?.trim() || ""),
      lokOSId: String(signupForm.lokosId?.trim() || ""),
      districtId: Number(signupForm.districtId) || 0,
      districtName: String(signupForm.district || ""),
      villageId: Number(signupForm.villageId) || 0,
      blockId: Number(signupForm.blockId) || 0,
      contactNo: String(signupForm.contactNo || ""),
      emailId: String(signupForm.email?.trim().toLowerCase() || ""),
      password: String(signupForm.password || ""),
      categoryId: Number(signupForm.categoryId) || 0,
      crpTypeId: Number(signupForm.crpTypeId) || 0,
      shgId: Number(signupForm.shgId) || 0,
      picturePath: String(signupForm.pictureFile || ""),
      latitude: Number(currentLocation?.latitude) || 0,
      longitude: Number(currentLocation?.longitude) || 0
    };

    const signupDebugPayload = {
      ...payload
    };

    console.log("CRP signup payload:", signupDebugPayload);

    try {
      dispatch(signupStart());
      const response = await submitCrpSignup(payload);
      console.log("CRP signup response:", response);
      const responseMessage =
        typeof response === "string"
          ? response
          : response?.message ||
            response?.status ||
            response?.title ||
            response?.details ||
            "Going for Block Staff Approval";
      const createdIdentity =
        response?.crpId ||
        response?.CRPId ||
        response?.id ||
        response?.Id ||
        extractCrpId(responseMessage) ||
        generatedCrpId;
      const createdCrpRegistrationId =
        response?.crpRegistrationId ||
        response?.CrpRegistrationId ||
        response?.CRPRegistrationId ||
        "";

      const nextUser = {
        identity: createdIdentity,
        crpRegistrationId: createdCrpRegistrationId,
        idType: "CRP ID",
        role: "CRP",
        name: signupForm.name,
        block: signupForm.block,
        blockId: signupForm.blockId,
        gpId: signupForm.gpId,
        villageId: signupForm.villageId,
        gpVcName: signupForm.gpVc.join(", "),
        villageName: signupForm.villages.join(", "),
        language
      };

      setUser(nextUser);
      persistUserProfile(nextUser);

      setPendingApprovalCrpId(createdIdentity);
      setLoginForm((prev) => ({
        ...prev,
        idType: "CRP ID",
        identity: createdIdentity,
        password: ""
      }));

      const signupSuccessMessage =
        extractCrpId(responseMessage)
          ? `${t("Generated CRP ID")}: ${createdIdentity}\n${t("Please wait for admin approval before logging in.")}`
          : responseMessage;

      dispatch(signupSuccess({ crpId: createdIdentity, message: signupSuccessMessage }));
      setSignupApiModal({
        visible: true,
        title: t("Signup Successful"),
        message: t("Your registration has been sent for approval."),
        status: "success",
        crpId: createdIdentity
      });
      setHomeView("dashboard");
      setActiveTab("Home");
      setStep("login");
      setPostSplashStep("login");
    } catch (error) {
      const errorMessage = error.message || t("Unable to create CRP ID.");
      dispatch(signupFailure(errorMessage));
      setSignupApiModal({
        visible: true,
        title: t("Signup Failed"),
        message: errorMessage,
        status: "error",
        crpId: ""
      });
    }
  };

  const onSubmitWorkingReport = (reportPayload) => {
    if (!reportPayload?.assignmentId || !reportPayload?.reportDate) {
      showAlert(t("Working Report"), t("Unable to submit working report right now."));
      return;
    }

    const alreadyReported = activities.some(
      (item) =>
        item.assignmentId === reportPayload.assignmentId &&
        item.reportDate === reportPayload.reportDate
    );

    if (alreadyReported) {
      showAlert(
        t("Working Report"),
        t("Attendance for this SHG member is already counted for today.")
      );
      return;
    }

    const assignment = assignedShgMembers.find(
      (item) => item.id === reportPayload.assignmentId
    );
    const nextActivity = {
      id: `ACT-${Date.now()}`,
      title: assignment
        ? `${assignment.shgName} - ${assignment.memberName}`
        : "CRP Field Visit",
      action: "Daily report submitted",
      membersVisited: 1,
      assignmentId: reportPayload.assignmentId,
      shgName: reportPayload.shgName,
      memberName: reportPayload.memberName,
      reportDate: reportPayload.reportDate,
      imageName: reportPayload.imageName,
      videoName: reportPayload.videoName,
      distanceMeters: reportPayload.distanceMeters,
      remarks: reportPayload.remarks || ""
    };

    setActivities((prev) => [nextActivity, ...prev].slice(0, 30));
    setWorkingReport((prev) => ({
      ...prev,
      lastReceivedDate: reportPayload.reportDate,
      submitted: true
    }));
    setAlerts((prev) => prev.filter((item) => item.id !== "ALT-3"));
    showAlert(
      t("Working Report"),
      t("Working report submitted successfully. Attendance has been counted for today.")
    );
  };

  const onOpenWorkingReport = () => {
    setHomeView("workingReport");
    setActiveTab("Home");
  };

  const onLockAssignedShgLocation = (assignmentId, coords) => {
    if (!assignmentId || !coords) {
      return;
    }

    setAssignedShgMembers((prev) =>
      prev.map((item) =>
        item.id === assignmentId
          ? {
              ...item,
              latitude: Number(coords.latitude),
              longitude: Number(coords.longitude)
            }
          : item
      )
    );
  };

  const onOpenNewEnrolment = () => {
    setHomeView("newEnrolment");
    setActiveTab("Home");
  };

  const onOpenShgMember = () => {
    setHomeView("shgMember");
    setActiveTab("Home");
  };

  const onOpenLhCboActivity = (targetView = "lhCboActivity") => {
    setHomeView(targetView);
    setActiveTab("Home");
  };

  const onOpenUpdateData = (targetView = "dashboard") => {
    setHomeView(targetView);
    setActiveTab("Home");
  };

  const resolveNextStepAfterCheckIn = () => {
    if (user?.identity && (sessionInfo.isActive || user?.sessionActive)) {
      return "dashboard";
    }
    return "language";
  };

  const handleEnableGeoLocation = async () => {
    if (geoLoading) {
      return;
    }

    setGeoLoading(true);

    try {
      const currentLocation = await getCurrentLocation();

      if (!currentLocation) {
        throw new Error(
          t("Unable to read your current location. Please enable GPS and try again.")
        );
      }

      const latitude = Number(currentLocation.latitude);
      const longitude = Number(currentLocation.longitude);
      const accuracy = Number(currentLocation.accuracy || 0);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error(t("Invalid GPS coordinates received. Please try again."));
      }

      setCheckInInfo((prev) => ({
        ...prev,
        currentDate: getTodayIsoDate(),
        latitude,
        longitude,
        accuracy,
        geoEnabled: true
      }));

      showAlert(
        t("Location enabled"),
        `${t("Geo location is enabled.")}\n\n${t("Accuracy")}: ${Math.round(
          accuracy
        )} m\n${t("Latitude")}: ${latitude.toFixed(6)}\n${t(
          "Longitude"
        )}: ${longitude.toFixed(6)}`
      );
    } catch (error) {
      console.error("Geo location error:", error);

      showAlert(
        t("Location required"),
        error?.message || t("Unable to read your current location right now.")
      );
    } finally {
      setGeoLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (checkInSubmitting) {
      return;
    }

    if (checkInInfo.isCheckedIn && !checkInInfo.checkOutAt) {
      showAlert(
        t("Already Checked In"),
        t("You are already checked in for today.")
      );
      return;
    }

    if (!checkInInfo.geoEnabled) {
      showAlert(
        t("Check In blocked"),
        t("Enable geo location before checking in.")
      );
      return;
    }

    const token = user?.token || "";
    const crpRegistrationId = Number(user?.crpRegistrationId);

    // Traced through both the fresh-login and app-restore code paths and
    // both correctly carry the token into user.token, so this "Auth
    // required" alert firing right after a successful login doesn't yet
    // have a confirmed cause. Logging the actual state here instead of
    // guessing a fourth time - check the Console tab (not Network) next
    // time this fires and send the exact output.
    console.log("Check-in guard snapshot:", {
      hasToken: Boolean(token),
      tokenPreview: token ? `${token.slice(0, 12)}...` : "(empty)",
      crpRegistrationId,
      rawCrpRegistrationId: user?.crpRegistrationId,
      userIdentity: user?.identity,
      sessionActive: sessionInfo?.isActive
    });

    if (!token) {
      showAlert(
        t("Authentication required"),
        t("Your login session has expired. Please login again.")
      );
      setStep("login");
      setPostSplashStep("login");
      return;
    }

    if (!Number.isFinite(crpRegistrationId) || crpRegistrationId <= 0) {
      showAlert(
        t("Check In blocked"),
        t("Unable to find CRP registration ID for attendance. Please login again.")
      );
      setStep("login");
      setPostSplashStep("login");
      return;
    }

    setCheckInSubmitting(true);

    try {
      const currentLocation = await getCurrentLocation();

      if (!currentLocation) {
        throw new Error(
          t("Unable to get your current location. Please make sure GPS is enabled and try again.")
        );
      }

      const latitude = Number(currentLocation.latitude);
      const longitude = Number(currentLocation.longitude);
      const accuracy = Number(currentLocation.accuracy || 0);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error(t("Invalid GPS coordinates. Please try again."));
      }

      // The real 100m gate stays exactly as-is for the actual mobile app -
      // this only widens it on web (desktop browsers have no GPS chip and
      // rely on WiFi/IP positioning, which is often 50-200m regardless of
      // how good the signal is - that's a hardware limit, not a bug).
      // Native iOS/Android builds (Platform.OS !== "web") are never
      // affected by this and keep the strict 100m requirement.
      const maxAccuracyMeters = Platform.OS === "web" ? 500 : 100;

      if (accuracy > maxAccuracyMeters) {
        showAlert(
          t("GPS accuracy is low"),
          `${t("Your current GPS accuracy is")} ${Math.round(accuracy)}m.\n\n${t(
            "Please move to an open area and try again."
          )}`
        );
        return;
      }

      const checkInAt = new Date().toISOString();
      const payload = {
        CRPRegistrationId: crpRegistrationId,
        crpRegistrationId,
        crpId: String(user?.identity || "").trim(),
        latitude,
        longitude,
        accuracy,
        checkInAt
      };

      const response = await submitCrpAttendanceCheckIn(payload);
      console.log("CRP CHECK-IN RESPONSE:", response);

      setCheckInInfo((prev) => ({
        ...prev,
        isCheckedIn: true,
        checkInAt,
        checkOutAt: "",
        currentDate: getTodayIsoDate(),
        latitude,
        longitude,
        accuracy,
        geoEnabled: true
      }));

      showAlert(
        t("Check In Successful"),
        `${t("Attendance check-in completed successfully.")}\n\n${t(
          "Time"
        )}: ${formatFriendlyTime(checkInAt)}`
      );

      const nextStep = resolveNextStepAfterCheckIn();

      setPostSplashStep(nextStep);
      setStep(nextStep);
    } catch (error) {
      console.error("CRP CHECK-IN FAILED:", error);

      setCheckInInfo((prev) => ({
        ...prev,
        isCheckedIn: false
      }));

      showAlert(
        t("Check In Failed"),
        error?.message ||
          t("Unable to complete attendance check-in. Please try again.")
      );
    } finally {
      setCheckInSubmitting(false);
    }
  };

  const handleCheckOut = ({ onComplete } = {}) => {
    const checkoutAt = new Date().toISOString();

    setCheckInInfo((prev) => ({
      ...EMPTY_CHECKIN_INFO,
      currentDate: getTodayIsoDate(),
      checkInAt: prev.checkInAt,
      checkOutAt: checkoutAt
    }));
    setShowPostCheckoutModal(true);

    if (typeof onComplete === "function") {
      onComplete(checkoutAt);
    } else {
      setPostSplashStep("login");
      setStep("login");
      setShowPostCheckoutModal(false);
    }
  };

  const completeLogout = async (checkoutAtOverride = "") => {
    const logoutAt = checkoutAtOverride || new Date().toISOString();
    const loginTime = sessionInfo.loginAt
      ? new Date(sessionInfo.loginAt).getTime()
      : Date.now();
    const elapsedSeconds = Math.max(
      0,
      Math.floor((new Date(logoutAt).getTime() - loginTime) / 1000)
    );
    const finalUserProfile = {
      ...user,
      sessionStartedAt: sessionInfo.loginAt || "",
      sessionEndedAt: logoutAt,
      lastSessionDurationSeconds: elapsedSeconds,
      lastSessionDurationLabel: formatSessionDuration(elapsedSeconds),
      sessionActive: false
    };

    setSessionInfo({
      isActive: false,
      loginAt: sessionInfo.loginAt || "",
      logoutAt,
      elapsedSeconds
    });
    setUser(finalUserProfile);

    clearAuthToken();
    dispatch(logout());
    try {
      await persistUserProfile(finalUserProfile);
      await AsyncStorage.multiRemove([
        USER_STORAGE_KEY,
        APP_NAV_STORAGE_KEY,
        DASHBOARD_SELECTION_STORAGE_KEY
      ]);
    } catch (error) {
      console.error("Error clearing user profile:", error);
    }
    setStep("login");
    setPostSplashStep("login");
    setHomeView("dashboard");
    setActiveTab("Home");
    setShowPostCheckoutModal(false);
  };

  const onLogout = () => {
    const needsCheckout = checkInInfo.isCheckedIn && !checkInInfo.checkOutAt;

    if (needsCheckout) {
      handleCheckOut({
        onComplete: async (checkoutAt) => {
          await completeLogout(checkoutAt);
        }
      });
      return;
    }

    completeLogout();
  };

  const todayLabel = formatFriendlyDate(checkInInfo.currentDate || getTodayIsoDate());
  const checkInStatusLabel = checkInInfo.isCheckedIn && !checkInInfo.checkOutAt
    ? "Checked In"
    : "Pending Check In";
  const checkInBadgeTone = checkInInfo.isCheckedIn && !checkInInfo.checkOutAt
    ? styles.sessionStatusBadgeSuccess
    : styles.sessionStatusBadgePending;

  return (
    <I18nProvider language={language} onChangeLanguage={handleSetLanguage}>
      <SafeAreaView style={styles.safe}>
      {step === "splash" ? <SplashScreen /> : null}

      {step === "attendanceGate" ? (
        <ScrollView
          style={styles.sessionGateScreen}
          contentContainerStyle={styles.sessionGateContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sessionGateHero}>
            <Text style={styles.sessionGateEyebrow}>{t("Attendance")}</Text>
            <Text style={styles.sessionGateTitle}>{t("Start field session")}</Text>
            <Text style={styles.sessionGateHint}>
              {t("Enable geo location and check in before using Livelihood Tracker.")}
            </Text>
          </View>

          <View style={styles.sessionGateCard}>
            <View style={styles.sessionGateRow}>
              <Text style={styles.sessionGateLabel}>{t("Date")}</Text>
              <Text style={styles.sessionGateValue}>{todayLabel}</Text>
            </View>
            <View style={styles.sessionGateRow}>
              <Text style={styles.sessionGateLabel}>{t("Geo location")}</Text>
              <Text style={styles.sessionGateValue}>
                {checkInInfo.geoEnabled ? t("Enabled") : t("Not enabled")}
              </Text>
            </View>
            <View style={styles.sessionGateRow}>
              <Text style={styles.sessionGateLabel}>{t("Status")}</Text>
              <Text style={styles.sessionGateValue}>{t(checkInStatusLabel)}</Text>
            </View>
            <View style={styles.sessionGateRow}>
              <Text style={styles.sessionGateLabel}>{t("Coordinates")}</Text>
              <Text style={styles.sessionGateValue}>
                {checkInInfo.latitude !== null && checkInInfo.longitude !== null
                  ? `${Number(checkInInfo.latitude).toFixed(6)}, ${Number(checkInInfo.longitude).toFixed(6)}`
                  : "--"}
              </Text>
            </View>

            <View style={styles.sessionGateActionRow}>
              <Pressable
                style={styles.sessionGateGhostButton}
                onPress={handleEnableGeoLocation}
                disabled={geoLoading || checkInSubmitting}
              >
                {geoLoading ? (
                  <ActivityIndicator color="#1d4ed8" />
                ) : (
                  <Text style={styles.sessionGateGhostButtonText}>
                    {t("Enable Geo Location")}
                  </Text>
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.sessionGatePrimaryButton,
                  (!checkInInfo.geoEnabled || checkInSubmitting) &&
                    styles.sessionGateButtonDisabled
                ]}
                onPress={handleCheckIn}
                disabled={!checkInInfo.geoEnabled || checkInSubmitting}
              >
                {checkInSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.sessionGatePrimaryButtonText}>
                    {t("Check In")}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      ) : null}

      {step === "language" ? (
        <LanguageScreen
          language={language}
          setLanguage={handleSetLanguage}
          onContinue={() => setStep("login")}
        />
      ) : null}

      {step === "login" ? (
      <LoginScreen
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          onLogin={onLogin}
          signupForm={signupForm}
          setSignupForm={setSignupForm}
          onSignup={onSignup}
          signupStatus={signupStatus}
          signupError={signupError}
          loginSubmitting={loginSubmitting}
          signupApiModal={signupApiModal}
          onCloseSignupApiModal={() =>
            setSignupApiModal({
              visible: false,
              title: "",
              message: "",
              status: "",
              crpId: ""
            })
          }
        />
      ) : null}

      {step === "dashboard" ? (
        <View style={styles.dashboardWrap}>
          <View style={[styles.dashboardGlowTop, { pointerEvents: "none" }]} />
          <View style={[styles.dashboardGlowBottom, { pointerEvents: "none" }]} />
          <View style={styles.dashboardContentShell}>
            <View style={styles.dashboardHeaderWrap}>
              <TrlmHeader
                title={activeTab === "Profile" ? "Profile" : "Dashboard"}
                subtitle={checkInInfo.isCheckedIn && !checkInInfo.checkOutAt
                  ? `${todayLabel}`
                  : "Complete Check In to continue."}
                badge={checkInInfo.isCheckedIn && !checkInInfo.checkOutAt ? "Checked In" : "Check In Required"}
                onLogout={onLogout}
                showLogout
                compact
              />

              <View style={styles.sessionStripCard}>
                <View style={styles.sessionStripCopy}>
                  <Text style={styles.sessionStripTitle}>Attendance</Text>
                  <Text style={styles.sessionStripHint}>
                    {checkInInfo.isCheckedIn && !checkInInfo.checkOutAt
                      ? "Session active"
                      : "Enable geo and check in."}
                  </Text>
                </View>
                <View style={styles.sessionStripActions}>
                  <View style={[styles.sessionStatusBadge, checkInBadgeTone]}>
                    <Text style={styles.sessionStatusBadgeText}>{checkInStatusLabel}</Text>
                  </View>
                  {checkInInfo.isCheckedIn && !checkInInfo.checkOutAt ? (
                    <Pressable style={styles.sessionStripButton} onPress={() => handleCheckOut()}>
                      <Text style={styles.sessionStripButtonText}>Check Out</Text>
                    </Pressable>
                  ) : (
                    <Pressable style={styles.sessionStripButton} onPress={() => setStep("attendanceGate")}>
                      <Text style={styles.sessionStripButtonText}>Check In</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.screenPad}>
              {activeTab === "Home" ? (
                <DashboardHomeTab
                  user={user}
                  dashboardMetrics={dashboardMetrics}
                  workingReport={workingReport}
                  setWorkingReport={setWorkingReport}
                  onSubmitWorkingReport={onSubmitWorkingReport}
                  assignedShgMembers={assignedShgMembers}
                  onLockAssignedShgLocation={onLockAssignedShgLocation}
                  onOpenWorkingReport={onOpenWorkingReport}
                  onOpenShgMember={onOpenShgMember}
                  onOpenLhCboActivity={onOpenLhCboActivity}
                  onOpenNewEnrolment={onOpenNewEnrolment}
                  onOpenUpdateData={onOpenUpdateData}
                  alerts={alerts}
                  activities={activities}
                  homeView={homeView}
                  onBackToDashboard={() => setHomeView("dashboard")}
                  showPostCheckoutModal={showPostCheckoutModal}
                  setShowPostCheckoutModal={setShowPostCheckoutModal}
                  onLogout={onLogout}
                />
              ) : null}
              {activeTab === "Profile" ? (
                <ProfileTab user={user} sessionInfo={sessionInfo} onLogout={onLogout} />
              ) : null}
            </ScrollView>
          </View>
          <BottomNav active={activeTab} setActive={setActiveTab} currentLanguage={language} onLanguageChange={handleSetLanguage} />
        </View>
      ) : null}
      </SafeAreaView>
    </I18nProvider>
  );
}
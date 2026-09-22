import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../i18n/I18nProvider";
import { colors } from "../styles/theme";
import { LANGUAGE_OPTIONS, getLanguageCode, getLanguageNativeName } from "../i18n/translations";
import {
  fetchBlocksByDistrict,
  fetchCategories,
  fetchCrpTypes,
  fetchDistricts,
  fetchGpsByBlock,
  fetchVillagesByGp
} from "../services/masterApi";
import styles from "../styles/loginScreenStyles";
import {
  generateCrpId,
  isAadhaarValid,
  isContactValid,
  isEmailValid,
  isLokosValid,
  isPasswordStrong
} from "../utils/appCalculations";
import { getCurrentLocation } from "../utils/geofence";
import { showAlert } from "../utils/showAlert";

const EMPTY_ARRAY = [];
const ID_TYPE_OPTIONS = ["CRP ID", "Master ID"];

function Field({ label, required = false, helper, children }) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
      {helper ? <Text style={styles.helperText}>{helper}</Text> : null}
    </View>
  );
}

function IconInput({ icon, isPassword = false, style, ...inputProps }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={styles.loginInputIconWrap}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} style={styles.loginInputIcon} />
      <TextInput
        style={[styles.loginInput, styles.loginInputWithIcon, isPassword && styles.loginInputWithEye, style]}
        secureTextEntry={isPassword ? !revealed : inputProps.secureTextEntry}
        {...inputProps}
      />
      {isPassword ? (
        <Pressable
          style={styles.loginInputEyeBtn}
          onPress={() => setRevealed((prev) => !prev)}
          hitSlop={8}
        >
          <Ionicons
            name={revealed ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function OptionSelector({
  selectorKey,
  options,
  selectedId,
  onSelect,
  emptyText,
  disabled = false,
  placeholder,
  openDropdown,
  setOpenDropdown
}) {
  const selectedItem = options.find(
    (item) => String(item.id) === String(selectedId)
  );
  const isOpen = openDropdown === selectorKey;

  if (disabled) {
    return (
      <View style={styles.dropdownDisabled}>
        <Text style={styles.dropdownDisabledText}>{emptyText}</Text>
      </View>
    );
  }

  if (!options.length) {
    return (
      <View style={styles.dropdownDisabled}>
        <Text style={styles.dropdownDisabledText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.dropdownWrap}>
      <Pressable
        style={[styles.dropdownTrigger, isOpen && styles.dropdownTriggerOpen]}
        onPress={() => setOpenDropdown(isOpen ? "" : selectorKey)}
      >
        <Text
          style={[
            styles.dropdownTriggerText,
            !selectedItem && styles.dropdownPlaceholder
          ]}
        >
          {selectedItem?.name || placeholder}
        </Text>
        <Text style={styles.dropdownChevron}>{isOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {isOpen ? (
        <View style={styles.dropdownMenu}>
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            style={styles.dropdownScroll}
          >
            {options.map((item) => {
              const isActive = String(item.id) === String(selectedId);
              return (
                <Pressable
                  key={`${item.id}-${item.name}`}
                  style={[styles.dropdownOption, isActive && styles.dropdownOptionActive]}
                  onPress={() => {
                    onSelect(item);
                    setOpenDropdown("");
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      isActive && styles.dropdownOptionTextActive
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

export default function LoginScreen({
  loginForm,
  setLoginForm,
  onLogin,
  signupForm,
  setSignupForm,
  onSignup,
  signupStatus,
  signupError,
  loginSubmitting = false,
  signupApiModal,
  onCloseSignupApiModal
}) {
  const { t, language, setLanguage } = useI18n();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const currentLanguageCode = getLanguageCode(language);
  const [mode, setMode] = useState("login");
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [gps, setGps] = useState([]);
  const [villages, setVillages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [crpTypes, setCrpTypes] = useState([]);
  const [mastersLoading, setMastersLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [locationState, setLocationState] = useState({
    loading: false,
    coords: null
  });
  const floatAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const signupSubmitting = signupStatus === "loading";
  const signupApiStatus = signupApiModal?.status || "";
  const signupApiIsSuccess = signupApiStatus === "success";
  const signupApiTitle =
    signupApiModal?.title ||
    (signupApiIsSuccess ? "Signup Successful" : "Signup Update");
  const signupApiMessage =
    signupApiModal?.message ||
    (signupApiIsSuccess
      ? "Your registration has been sent for approval."
      : "Please check the details and try again.");

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2600,
            useNativeDriver: true
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2600,
            useNativeDriver: true
          })
        ])
      )
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [cardAnim, floatAnim]);

  useEffect(() => {
    if (mode !== "signup") {
      return;
    }

    let active = true;

    async function loadSignupMasters() {
      try {
        setMastersLoading(true);
        const [districtData, categoryData, typeData] = await Promise.all([
          fetchDistricts(),
          fetchCategories(),
          fetchCrpTypes()
        ]);

        if (!active) {
          return;
        }

        setDistricts(districtData);
        setCategories(categoryData);
        setCrpTypes(typeData);
      } catch (error) {
        if (active) {
          setCategories([]);
          setCrpTypes([]);
          showAlert(
            t("Signup data"),
            error.message || t("Unable to load signup master data.")
          );
        }
      } finally {
        if (active) {
          setMastersLoading(false);
        }
      }
    }

    loadSignupMasters();

    return () => {
      active = false;
    };
  }, [mode, t]);

  useEffect(() => {
    if (!signupForm.districtId) {
      setBlocks([]);
      return;
    }

    let active = true;

    async function loadBlocks() {
      try {
        const payload = await fetchBlocksByDistrict(signupForm.districtId);
        if (active) {
          setBlocks(payload);
        }
      } catch (error) {
        if (active) {
          showAlert(t("Signup data"), error.message || t("Unable to load blocks."));
        }
      }
    }

    loadBlocks();

    return () => {
      active = false;
    };
  }, [signupForm.districtId, t]);

  useEffect(() => {
    if (!signupForm.blockId) {
      setGps([]);
      return;
    }

    let active = true;

    async function loadGps() {
      try {
        const payload = await fetchGpsByBlock(signupForm.blockId);
        if (active) {
          setGps(payload);
        }
      } catch (error) {
        if (active) {
          showAlert(
            t("Signup data"),
            error.message || t("Unable to load Gram Panchayat / VC list.")
          );
        }
      }
    }

    loadGps();

    return () => {
      active = false;
    };
  }, [signupForm.blockId, t]);

  useEffect(() => {
    if (!signupForm.gpId) {
      setVillages([]);
      return;
    }

    let active = true;

    async function loadVillages() {
      try {
        const payload = await fetchVillagesByGp(signupForm.gpId);
        if (active) {
          setVillages(payload);
        }
      } catch (error) {
        if (active) {
          showAlert(
            t("Signup data"),
            error.message || t("Unable to load villages.")
          );
        }
      }
    }

    loadVillages();

    return () => {
      active = false;
    };
  }, [signupForm.gpId, t]);

  const generatedCrpId = useMemo(
    () =>
      generateCrpId({
        district: signupForm.district,
        block: signupForm.block,
        name: signupForm.name
      }),
    [signupForm.block, signupForm.district, signupForm.name]
  );

  const updateSignup = (patch) => {
    setSignupForm((prev) => ({
      ...prev,
      ...patch
    }));
  };

  const selectDistrict = (item) => {
    updateSignup({
      district: item.name,
      districtId: item.id,
      block: "",
      blockId: "",
      gpId: "",
      villageId: "",
      gpVc: EMPTY_ARRAY,
      villages: EMPTY_ARRAY
    });
    setOpenDropdown("");
    setBlocks([]);
    setGps([]);
    setVillages([]);
  };

  const selectBlock = (item) => {
    updateSignup({
      block: item.name,
      blockId: item.id,
      gpId: "",
      villageId: "",
      gpVc: EMPTY_ARRAY,
      villages: EMPTY_ARRAY
    });
    setOpenDropdown("");
    setGps([]);
    setVillages([]);
  };

  const selectGp = (item) => {
    updateSignup({
      gpId: item.id,
      gpVc: [item.name],
      villageId: "",
      villages: EMPTY_ARRAY
    });
    setOpenDropdown("");
    setVillages([]);
  };

  const selectVillage = (item) => {
    updateSignup({
      villageId: item.id,
      villages: [item.name]
    });
    setOpenDropdown("");
  };

  const selectCrpType = (item) => {
    updateSignup({
      crpTypeId: String(item.id)
    });
    setOpenDropdown("");
  };

  const selectCategory = (item) => {
    updateSignup({
      categoryId: String(item.id)
    });
    setOpenDropdown("");
  };

  const pickProfilePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        showAlert(
          t("Permission needed"),
          t("Photo library permission is required to select a profile photo.")
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8
      });

      if (!result.canceled && result.assets?.length) {
        updateSignup({
          pictureFile: result.assets[0].uri
        });
      }
    } catch (error) {
      showAlert(
        t("Photo selection"),
        error.message || t("Unable to select profile photo.")
      );
    }
  };

  const captureLocation = async () => {
    try {
      setLocationState((prev) => ({ ...prev, loading: true }));
      const coords = await getCurrentLocation();
      if (!coords) {
        showAlert(
          t("Location"),
          t("Unable to capture current location. You can still continue and submit 0,0 coordinates.")
        );
      }
      setLocationState({
        loading: false,
        coords
      });
    } catch (error) {
      setLocationState({
        loading: false,
        coords: null
      });
      showAlert(
        t("Location"),
        error.message || t("Unable to capture current location.")
      );
    }
  };

  const handleSignup = async () => {
    await onSignup(generatedCrpId, locationState.coords);
  };

  return (
    <View style={styles.loginContainer}>
      <Modal
        visible={Boolean(signupApiModal?.visible)}
        transparent
        animationType="fade"
        onRequestClose={onCloseSignupApiModal}
      >
        <View style={styles.responseModalOverlay}>
          <View style={styles.responseModalCard}>
            <View
              style={[
                styles.responseStatusIcon,
                signupApiIsSuccess
                  ? styles.responseStatusIconSuccess
                  : styles.responseStatusIconError
              ]}
            >
              <Ionicons
                name={signupApiIsSuccess ? "checkmark" : "alert"}
                size={28}
                color={signupApiIsSuccess ? colors.success : colors.error}
              />
            </View>
            <Text style={styles.responseModalTitle}>{signupApiTitle}</Text>
            <Text style={styles.responseModalMessage}>{signupApiMessage}</Text>
            {signupApiModal?.crpId ? (
              <View style={styles.responseIdBox}>
                <Text style={styles.responseIdLabel}>Your CRP ID</Text>
                <Text style={styles.responseIdValue}>{signupApiModal.crpId}</Text>
              </View>
            ) : null}
            {signupApiIsSuccess ? (
              <Text style={styles.responseModalHint}>
                Please wait for admin approval. After approval, you can log in with this CRP ID.
              </Text>
            ) : null}
            <Pressable style={styles.loginButton} onPress={onCloseSignupApiModal}>
              <Text style={styles.loginButtonText}>
                {signupApiIsSuccess ? "Go to Login" : "OK"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Animated.View
        style={[
          styles.authGlowPrimary,
          { pointerEvents: "none" },
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -14]
                })
              }
            ]
          }
        ]}
      />
      <Animated.View
        style={[
          styles.authGlowSecondary,
          { pointerEvents: "none" },
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 18]
                })
              }
            ]
          }
        ]}
      />
      <ScrollView
        style={styles.signupScrollView}
        contentContainerStyle={styles.loginFormArea}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginTopBar}>
          <Pressable
            style={styles.loginLanguageSwitcherButton}
            onPress={() => setShowLanguageMenu((prev) => !prev)}
          >
            <Text style={styles.loginLanguageSwitcherText}>
              {getLanguageNativeName(currentLanguageCode)}
            </Text>
          </Pressable>
        </View>

        {showLanguageMenu ? (
          <View style={styles.loginLanguageMenuPopup}>
            {LANGUAGE_OPTIONS.map((item) => {
              const activeLanguage = item.code === currentLanguageCode;
              return (
                <Pressable
                  key={item.code}
                  style={[styles.languageMenuItem, activeLanguage && styles.languageMenuItemActive]}
                  onPress={() => {
                    setShowLanguageMenu(false);
                    setLanguage(item.code);
                  }}
                >
                  <Text style={[styles.languageMenuText, activeLanguage && styles.languageMenuTextActive]}>
                    {item.nativeName}
                  </Text>
                  <Text style={[styles.languageMenuHint, activeLanguage && styles.languageMenuTextActive]}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Animated.View
          style={{
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0]
                })
              }
            ]
          }}
        >
        <View style={styles.loginUnifiedCard}>
        <View style={styles.loginCardAccentBar} />
        <View style={styles.loginHeroBand}>
          <View style={styles.loginHeroBadge}>
            <Ionicons name="shield-checkmark-outline" size={26} color={colors.textOnPrimary} />
          </View>
          <Text style={styles.loginWelcomeTitle}>
            {mode === "login" ? t("Welcome Back") : t("Create Your Account")}
          </Text>
          <Text style={styles.loginWelcomeSubtitle}>
            {mode === "login"
              ? t("Sign in to continue your fieldwork")
              : t("Register as a Community Resource Person")}
          </Text>
        </View>
        <View style={styles.loginTabContainer}>
          {["login", "signup"].map((item) => {
            const active = mode === item;
            return (
              <Pressable
                key={item}
                style={[styles.loginTab, active && styles.loginTabActive]}
                onPress={() => setMode(item)}
              >
                <Text
                  style={[styles.loginTabText, active && styles.loginTabTextActive]}
                >
                  {item === "login" ? t("Log-In") : t("Sign-up")}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {mode === "login" ? (
          <View style={[styles.loginCard, styles.loginCardGlass]}>
            <Field label={t("Identity Type")} required>
              <View style={styles.loginIdTypeRow}>
                {ID_TYPE_OPTIONS.map((item) => {
                  const active = (loginForm.idType || "CRP ID") === item;
                  return (
                    <Pressable
                      key={item}
                      style={[styles.loginIdPill, active && styles.loginIdPillActive]}
                      onPress={() =>
                        setLoginForm((prev) => ({
                          ...prev,
                          idType: item
                        }))
                      }
                    >
                      <Ionicons
                        name="card-outline"
                        size={14}
                        color={active ? colors.textOnPrimary : colors.textSecondary}
                        style={styles.loginIdPillIcon}
                      />
                      <Text
                        style={[
                          styles.loginIdPillText,
                          active && styles.loginIdPillTextActive
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>

            <Field
              label={t("CRP ID / Master ID")}
              required
              helper={t("Enter the ID matching the type selected above")}
            >
              <IconInput
                icon="person-outline"
                placeholder={t("Enter ID")}
                value={loginForm.identity}
                autoCapitalize="characters"
                onChangeText={(value) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    identity: value
                  }))
                }
              />
            </Field>

            <Field label={t("Password")} required>
              <IconInput
                icon="lock-closed-outline"
                isPassword
                placeholder={t("Password")}
                value={loginForm.password}
                onChangeText={(value) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: value
                  }))
                }
              />
            </Field>

            <Pressable
              style={styles.loginButton}
              onPress={onLogin}
              disabled={loginSubmitting}
            >
              {loginSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>{t("Log-In")}</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.textOnPrimary} />
                </>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={[styles.loginCard, styles.loginCardGlass]}>
            <View style={styles.formSectionCard}>
            <Text style={styles.signupSectionTitle}>{t("Personal Details")}</Text>

            <Field label={t("Full Name")} required>
              <TextInput
                style={styles.loginInput}
                placeholder={t("Enter full name")}
                value={signupForm.name}
                onChangeText={(value) => updateSignup({ name: value })}
              />
            </Field>

            <View style={styles.signupRow}>
              <View style={styles.signupHalfInput}>
                <Field
                  label={t("Aadhaar No")}
                  required
                  helper={t("As printed on your Aadhaar card")}
                >
                  <TextInput
                    style={styles.loginInput}
                    placeholder="12 digits"
                    keyboardType="numeric"
                    maxLength={12}
                    value={signupForm.uid}
                    onChangeText={(value) =>
                      updateSignup({ uid: value.replace(/[^0-9]/g, "") })
                    }
                  />
                  {signupForm.uid ? (
                    <View style={styles.signupValidIndicator}>
                      <Text
                        style={[
                          styles.signupValidText,
                          isAadhaarValid(signupForm.uid)
                            ? styles.validText
                            : styles.invalidText
                        ]}
                      >
                        {isAadhaarValid(signupForm.uid)
                          ? t("Valid Aadhaar")
                          : t("Aadhaar must be 12 digits")}
                      </Text>
                    </View>
                  ) : null}
                </Field>
              </View>

              <View style={styles.signupHalfInput}>
                <Field
                  label={t("LokOS ID")}
                  required
                  helper={t("Given to you by your project office")}
                >
                  <TextInput
                    style={styles.loginInput}
                    placeholder="12 digits"
                    keyboardType="numeric"
                    maxLength={12}
                    value={signupForm.lokosId}
                    onChangeText={(value) =>
                      updateSignup({ lokosId: value.replace(/[^0-9]/g, "") })
                    }
                  />
                  {signupForm.lokosId ? (
                    <View style={styles.signupValidIndicator}>
                      <Text
                        style={[
                          styles.signupValidText,
                          isLokosValid(signupForm.lokosId)
                            ? styles.validText
                            : styles.invalidText
                        ]}
                      >
                        {isLokosValid(signupForm.lokosId)
                          ? t("Valid LokOS ID")
                          : t("LokOS ID must be 12 digits")}
                      </Text>
                    </View>
                  ) : null}
                </Field>
              </View>
            </View>
            </View>

            <View style={styles.formSectionCard}>
            <Text style={styles.signupSectionTitle}>{t("Location Mapping")}</Text>

            {mastersLoading ? <ActivityIndicator color="#1e3a8a" /> : null}

            <Field label={t("District")} required>
              <OptionSelector
                selectorKey="district"
                options={districts}
                selectedId={signupForm.districtId}
                onSelect={selectDistrict}
                emptyText={t("No districts available")}
                placeholder={t("Select district")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            </Field>

            <Field label={t("Block")} required>
              <OptionSelector
                selectorKey="block"
                options={blocks}
                selectedId={signupForm.blockId}
                onSelect={selectBlock}
                emptyText={t("Select district first")}
                disabled={!signupForm.districtId}
                placeholder={t("Select block")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            </Field>

            <Field label={t("GP / VC")} required>
              <OptionSelector
                selectorKey="gp"
                options={gps}
                selectedId={signupForm.gpId}
                onSelect={selectGp}
                emptyText={t("Select block first")}
                disabled={!signupForm.blockId}
                placeholder={t("Select GP / VC")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            </Field>

            <Field label={t("Village")} required>
              <OptionSelector
                selectorKey="village"
                options={villages}
                selectedId={signupForm.villageId}
                onSelect={selectVillage}
                emptyText={t("Select GP / VC first")}
                disabled={!signupForm.gpId}
                placeholder={t("Select village")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            </Field>
            </View>

            <View style={styles.formSectionCard}>
            <Text style={styles.signupSectionTitle}>{t("Contact & Access")}</Text>

            <View style={styles.signupRow}>
              <View style={styles.signupHalfInput}>
                <Field
                  label={t("Contact No")}
                  required
                  helper={t("10-digit mobile number, without +91")}
                >
                  <TextInput
                    style={styles.loginInput}
                    placeholder="10 digits"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={signupForm.contactNo}
                    onChangeText={(value) =>
                      updateSignup({ contactNo: value.replace(/[^0-9]/g, "") })
                    }
                  />
                  {signupForm.contactNo ? (
                    <View style={styles.signupValidIndicator}>
                      <Text
                        style={[
                          styles.signupValidText,
                          isContactValid(signupForm.contactNo)
                            ? styles.validText
                            : styles.invalidText
                        ]}
                      >
                        {isContactValid(signupForm.contactNo)
                          ? t("Valid contact number")
                          : t("Contact number must be 10 digits")}
                      </Text>
                    </View>
                  ) : null}
                </Field>
              </View>

              <View style={styles.signupHalfInput}>
                <Field label={t("Email ID")} required>
                  <TextInput
                    style={styles.loginInput}
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={signupForm.email}
                    onChangeText={(value) => updateSignup({ email: value.trim() })}
                  />
                  {signupForm.email ? (
                    <View style={styles.signupValidIndicator}>
                      <Text
                        style={[
                          styles.signupValidText,
                          isEmailValid(signupForm.email)
                            ? styles.validText
                            : styles.invalidText
                        ]}
                      >
                        {isEmailValid(signupForm.email)
                          ? t("Valid email")
                          : t("Enter a valid email")}
                      </Text>
                    </View>
                  ) : null}
                </Field>
              </View>
            </View>

            <Field label={t("CRP Type")} required>
              <OptionSelector
                selectorKey="crpType"
                options={crpTypes}
                selectedId={signupForm.crpTypeId}
                onSelect={selectCrpType}
                emptyText={t("No CRP types available")}
                placeholder={t("Select CRP type")}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            </Field>

            <View style={styles.signupRow}>
              <View style={styles.signupHalfInput}>
                <Field label={t("Categories")} required>
                  <OptionSelector
                    selectorKey="category"
                    options={categories}
                    selectedId={signupForm.categoryId}
                    onSelect={selectCategory}
                    emptyText={t("No categories available")}
                    placeholder={t("Select categories")}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                  />
                </Field>
              </View>
            </View>

            <View style={styles.signupRow}>
              <View style={styles.signupHalfInput}>
                <Field
                  label={t("Password")}
                  required
                  helper={t("Include an uppercase letter, a lowercase letter, a number, and a special character")}
                >
                  <TextInput
                    style={styles.loginInput}
                    placeholder={t("Set password")}
                    secureTextEntry
                    value={signupForm.password}
                    onChangeText={(value) => updateSignup({ password: value })}
                  />
                  {signupForm.password ? (
                    <View style={styles.signupValidIndicator}>
                      <Text
                        style={[
                          styles.signupValidText,
                          isPasswordStrong(signupForm.password)
                            ? styles.validText
                            : styles.invalidText
                        ]}
                      >
                        {isPasswordStrong(signupForm.password)
                          ? t("Strong password")
                          : t("Use upper, lower, number, and special character")}
                      </Text>
                    </View>
                  ) : null}
                </Field>
              </View>

              <View style={styles.signupHalfInput}>
                <Field label={t("Confirm Password")} required>
                  <TextInput
                    style={styles.loginInput}
                    placeholder={t("Re-enter password")}
                    secureTextEntry
                    value={signupForm.confirmPassword}
                    onChangeText={(value) => updateSignup({ confirmPassword: value })}
                  />
                  {signupForm.confirmPassword ? (
                    <View style={styles.signupValidIndicator}>
                      <Text
                        style={[
                          styles.signupValidText,
                          signupForm.confirmPassword === signupForm.password
                            ? styles.validText
                            : styles.invalidText
                        ]}
                      >
                        {signupForm.confirmPassword === signupForm.password
                          ? t("Passwords match")
                          : t("Passwords do not match")}
                      </Text>
                    </View>
                  ) : null}
                </Field>
              </View>
            </View>
            </View>

            <View style={styles.formSectionCard}>
            <Text style={styles.signupSectionTitle}>{t("Evidence & GPS")}</Text>

            <Field
              label={t("Profile Photo")}
              required
              helper={
                signupForm.pictureFile
                  ? signupForm.pictureFile
                  : t("Upload a photo for picturePath")
              }
            >
              <Pressable style={styles.secondaryBtn} onPress={pickProfilePhoto}>
                <Text style={styles.secondaryBtnText}>
                  {signupForm.pictureFile ? t("Change Photo") : t("Select Photo")}
                </Text>
              </Pressable>
            </Field>

            <Field
              label={t("Current Coordinates")}
              helper={
                locationState.coords
                  ? `${locationState.coords.latitude.toFixed(6)}, ${locationState.coords.longitude.toFixed(6)}`
                  : t("Latitude and longitude will default to 0 if not captured.")
              }
            >
              <Pressable style={styles.secondaryBtn} onPress={captureLocation}>
                {locationState.loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <Text style={styles.secondaryBtnText}>{t("Capture Location")}</Text>
                )}
              </Pressable>
            </Field>
            </View>

            {signupError ? (
              <View style={styles.processNoteBox}>
                <Text style={styles.processNoteText}>{signupError}</Text>
              </View>
            ) : null}

            <Pressable
              style={styles.loginButton}
              onPress={handleSignup}
              disabled={signupSubmitting}
            >
              {signupSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>{t("Sign-up")}</Text>
              )}
            </Pressable>
          </View>
        )}
        </View>
        </Animated.View>

        <View style={styles.loginFooterBrand}>
          <Text style={styles.loginFooterBrandText}>Tripura Rural Livelihood Mission</Text>
          <Text style={styles.loginFooterVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

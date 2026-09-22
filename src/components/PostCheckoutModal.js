import React from "react";
import { Modal, Pressable, Text as RNText, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "./PrimaryButton";
import { useTranslatedValue } from "../i18n/I18nProvider";
import styles from "../styles/appStyles";
import { colors } from "../styles/theme";

function Text({ children, ...props }) {
  const plainText =
    typeof children === "string" || typeof children === "number" ? String(children) : "";
  const translated = useTranslatedValue(plainText);
  const resolvedChildren =
    plainText && typeof translated === "string" && translated.trim() ? translated : children;

  return <RNText {...props}>{resolvedChildren}</RNText>;
}

export default function PostCheckoutModal({ visible, onClose, onLogout }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.responseModalOverlay} onPress={onClose}>
        <Pressable style={styles.responseModalCard} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.responseStatusIcon, styles.responseStatusIconSuccess]}>
            <Ionicons name="checkmark" size={28} color={colors.success} />
          </View>
          <Text style={styles.responseModalTitle}>Session Check-Out Complete</Text>
          <Text style={styles.responseModalMessage}>
            Your field session for today has been successfully checked out.
            {"\n\n"}End your session with logout or continue working.
          </Text>
          <View style={[styles.sessionGateActionRow, { width: "100%" }]}>
            <Pressable style={styles.sessionGateGhostButton} onPress={onClose}>
              <Text style={styles.sessionGateGhostButtonText}>Continue Session</Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <PrimaryButton label="Logout Now" onPress={onLogout} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

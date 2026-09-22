import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./TranslatedInputs";
import { smStyles } from "@/styles/dashboardHomeStyles";
import { colors } from "@/styles/theme";

export default function DropdownField({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
  icon = "list-outline"
}) {
  const normalizedOptions = options.map((item) =>
    typeof item === "string"
      ? { id: item, name: item, rawValue: item }
      : { id: item.id, name: item.name, rawValue: item }
  );

  return (
    <View style={smStyles.fieldRow}>
      <Text style={smStyles.fieldLabel}>{label}</Text>
      <Pressable
        style={[smStyles.dropdownTrigger, open && smStyles.dropdownTriggerOpen]}
        onPress={onToggle}
      >
        <Ionicons name={icon} size={16} color={colors.textSecondary} style={smStyles.dropdownIcon} />
        <Text style={smStyles.dropdownTriggerText}>{value}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textSecondary}
        />
      </Pressable>
      {open ? (
        <View style={smStyles.dropdownMenu}>
          {normalizedOptions.length ? (
            normalizedOptions.map((item) => (
              <Pressable
                key={`${item.id}-${item.name}`}
                style={[smStyles.dropdownItem, value === item.name && smStyles.dropdownItemActive]}
                onPress={() => onSelect(item.rawValue)}
              >
                <Text
                  style={[
                    smStyles.dropdownItemText,
                    value === item.name && smStyles.dropdownItemTextActive
                  ]}
                >
                  {item.name}
                </Text>
                {value === item.name ? (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                ) : null}
              </Pressable>
            ))
          ) : (
            <Text style={smStyles.dropdownItemText}>No options available yet</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

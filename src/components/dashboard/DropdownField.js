import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "./TranslatedInputs";
import { smStyles } from "../../styles/dashboardHomeStyles";

export default function DropdownField({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect
}) {
  const normalizedOptions = options.map((item) =>
    typeof item === "string"
      ? { id: item, name: item, rawValue: item }
      : { id: item.id, name: item.name, rawValue: item }
  );

  return (
    <View style={smStyles.fieldRow}>
      <Text style={smStyles.fieldLabel}>{label}</Text>
      <Pressable style={smStyles.dropdownTrigger} onPress={onToggle}>
        <Text style={smStyles.dropdownTriggerText}>{value}</Text>
        <Text style={smStyles.dropdownArrow}>{open ? "^" : "v"}</Text>
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

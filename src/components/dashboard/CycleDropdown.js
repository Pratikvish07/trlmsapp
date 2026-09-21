import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "./TranslatedInputs";
import { flowStyles } from "@/styles/dashboardHomeStyles";

export default function CycleDropdown({ value, options, onChange, style }) {
  const [open, setOpen] = useState(false);
  const normalizedOptions = options.map((item) =>
    typeof item === "string" ? item : item?.name || item?.label || ""
  ).filter(Boolean);
  const displayValue = typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";

  // If nothing has been explicitly picked yet, this used to just show
  // blank and leave the underlying state as "" until the user manually
  // opened the dropdown. That's how Season silently resolved to 0 in the
  // Activity Profile payload even though the real season list loaded
  // fine - the field looked selectable but nothing had actually been
  // written into state. Auto-selecting the first option here fixes this
  // for every dropdown built on this shared component, not just Season.
  useEffect(() => {
    if (!displayValue && normalizedOptions.length > 0) {
      onChange(normalizedOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayValue, normalizedOptions.join("|")]);

  return (
    <View style={flowStyles.ddWrap}>
      <Pressable
        style={[flowStyles.ddBox, style]}
        disabled={normalizedOptions.length === 0}
        onPress={() => {
          if (!normalizedOptions.length) {
            return;
          }
          setOpen((prev) => !prev);
        }}
      >
        <Text style={flowStyles.ddText}>{displayValue}</Text>
        <Text style={flowStyles.ddArrow}>{open ? "^" : "v"}</Text>
      </Pressable>

      {open ? (
        <View style={flowStyles.ddMenu}>
          <ScrollView nestedScrollEnabled style={flowStyles.ddScroll}>
            {normalizedOptions.map((option) => {
              const active = option === value;

              return (
                <Pressable
                  key={option}
                  style={[flowStyles.ddOption, active && flowStyles.ddOptionActive]}
                  onPress={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[flowStyles.ddOptionText, active && flowStyles.ddOptionTextActive]}
                  >
                    {option}
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

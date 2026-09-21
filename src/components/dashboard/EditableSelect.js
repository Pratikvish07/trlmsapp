import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "./TranslatedInputs";
import { tsDetailStyles } from "@/styles/dashboardHomeStyles";

export default function EditableSelect({ value, options, onChange, placeholder, inputStyle }) {
  const [open, setOpen] = useState(false);
  const normalizedOptions = options.map((item) =>
    typeof item === "string" ? item : item?.name || item?.label || ""
  ).filter(Boolean);
  const filteredOptions = normalizedOptions.filter((item) =>
    !value ? true : item.toLowerCase().includes(String(value).toLowerCase())
  );

  return (
    <View style={tsDetailStyles.selectWrap}>
      <TextInput
        style={[tsDetailStyles.selectInput, inputStyle]}
        value={value}
        onFocus={() => setOpen(true)}
        onChangeText={(text) => {
          onChange(text);
          setOpen(true);
        }}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
      />
      <Pressable style={tsDetailStyles.selectChevronWrap} onPress={() => setOpen((prev) => !prev)}>
        <Text style={tsDetailStyles.selectChevron}>{open ? "^" : "v"}</Text>
      </Pressable>

      {open && filteredOptions.length ? (
        <View style={tsDetailStyles.selectMenu}>
          <ScrollView nestedScrollEnabled style={tsDetailStyles.selectScroll}>
            {filteredOptions.map((option) => (
              <Pressable
                key={option}
                style={tsDetailStyles.selectOption}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <Text style={tsDetailStyles.selectOptionText}>{option}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
      {open && !filteredOptions.length ? (
        <View style={tsDetailStyles.selectMenu}>
          <Text style={tsDetailStyles.selectEmptyText}>
            {normalizedOptions.length
              ? "No matching options - check the spelling or try a different search"
              : "No options available yet"}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

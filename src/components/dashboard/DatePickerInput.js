import React from "react";
import { Platform } from "react-native";
import { TextInput } from "./TranslatedInputs";
import { tsDetailStyles } from "@/styles/dashboardHomeStyles";

export default function DatePickerInput({ value, onChange }) {
  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          minHeight: "48px",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          color: "#111827",
          fontSize: "14px",
          padding: "12px",
          outline: "none",
          boxSizing: "border-box"
        }}
      />
    );
  }

  return (
    <TextInput
      style={tsDetailStyles.modalDateInput}
      value={value}
      onChangeText={onChange}
      placeholder="YYYY-MM-DD"
      placeholderTextColor="#94a3b8"
    />
  );
}

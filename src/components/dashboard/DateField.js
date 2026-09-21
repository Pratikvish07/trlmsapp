import React from "react";
import { Pressable } from "react-native";
import { Text } from "./TranslatedInputs";
import { tsDetailStyles } from "@/styles/dashboardHomeStyles";

export default function DateField({ value, placeholder, onPress, style, textStyle, placeholderStyle, iconStyle }) {
  return (
    <Pressable style={[tsDetailStyles.dateTrigger, style]} onPress={onPress}>
      <Text
        style={[
          tsDetailStyles.dateTriggerText,
          textStyle,
          !value && tsDetailStyles.datePlaceholderText,
          !value && placeholderStyle
        ]}
      >
        {value || placeholder}
      </Text>
      <Text style={[tsDetailStyles.dateTriggerIcon, iconStyle]}>Cal</Text>
    </Pressable>
  );
}

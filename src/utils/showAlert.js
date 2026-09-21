import { Alert, Platform } from "react-native";

// react-native's Alert.alert is a documented no-op on react-native-web - it
// silently does nothing visible in a browser. Falls back to the browser's
// native window.alert on web; unchanged native behavior on iOS/Android.
export function showAlert(title, message) {
  if (Platform.OS === "web" && typeof window !== "undefined" && window.alert) {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

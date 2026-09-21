import React from "react";
import { Provider } from "react-redux";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import AppRouter from "./src/routes/AppRouter";
import SplashScreen from "./src/screens/SplashScreen";
import { store } from "./src/store";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

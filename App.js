import React from "react";
import { Provider } from "react-redux";
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
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

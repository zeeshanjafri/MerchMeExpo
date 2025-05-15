import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as BebasNeue from "@expo-google-fonts/bebas-neue";
import * as Inter from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular: BebasNeue.BebasNeue_400Regular,
    Inter_400Regular: Inter.Inter_400Regular,
    Inter_700Bold: Inter.Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { RouteProvider } from "@/context/RouteContext";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RouteProvider>
        <SafeScreen>
          <Slot />
        </SafeScreen>
        <StatusBar style="dark" />
      </RouteProvider>
    </ClerkProvider>
  );
}

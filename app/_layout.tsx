import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PathsProvider } from "../src/state/PathsContext";
import { colors } from "../src/ui/theme";

export default function RootLayout() {
  return (
    <PathsProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "noevoe", headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ title: "New path" }} />
        <Stack.Screen name="paths" options={{ title: "Your paths" }} />
        <Stack.Screen name="path" options={{ title: "noevoe", headerBackVisible: false }} />
        <Stack.Screen name="capability/[id]" options={{ title: "Capability" }} />
        <Stack.Screen name="lesson/[id]" options={{ title: "Lesson" }} />
      </Stack>
    </PathsProvider>
  );
}

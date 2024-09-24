import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { View } from "react-native";
import Home from "../(tabs)/home";
import LoginScreen from "../../components/LoginScreen";
import { Stack } from "expo-router";

export default function Page() {
  const { user } = useUser();

  return (
    <View>
      <SignedIn>
        <Stack>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SignedIn>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </View>
  );
}

import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View } from "react-native";
import React, { useCallback, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/home", signInAttempt.createdSessionId);
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        style={{
          marginBottom: 10,
          width: "100%",
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: "#152565",
          padding: 10,
        }}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{
          marginBottom: 10,
          width: "100%",
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: "#152565",
          padding: 10,
        }}
      />

      <View
        style={{
          marginTop: 10,
          width: "100%",
          backgroundColor: Colors.primary,
        }}
      >
        <Button title="Sign In" onPress={onSignInPress} color="#152565" />
      </View>

      <View style={{ flexDirection: "row", marginTop: 10, gap: 5 }}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={{ color: "#152565", fontWeight: "bold" }}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

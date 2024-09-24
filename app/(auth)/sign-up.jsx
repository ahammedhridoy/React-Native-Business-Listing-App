import * as React from "react";
import { TextInput, Button, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/home");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
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
            <Button title="Sign Up" onPress={onSignUpPress} color="#152565" />
          </View>
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button
            title="Verify Email"
            color="#152565"
            onPress={onPressVerify}
          />
        </>
      )}
    </View>
  );
}

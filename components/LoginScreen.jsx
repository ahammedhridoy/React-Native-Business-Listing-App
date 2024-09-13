import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const LoginScreen = () => {
  const user = useAuth();
  if (user) {
    return <Redirect href="/home" />;
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: Colors.primary,
        }}
      >
        Business Directory APP
      </Text>

      <Text>Find your favourite business near you</Text>

      <Link
        href="/sign-in"
        style={{
          marginTop: 20,
          color: "#fff",
          width: 300,
          textAlign: "center",
          padding: 10,
          borderRadius: 5,
          backgroundColor: Colors.primary,
        }}
      >
        <Text>Let's Get Started</Text>
      </Link>
    </View>
  );
};

export default LoginScreen;

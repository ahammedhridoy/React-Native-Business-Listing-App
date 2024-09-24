import { View, Text, Image } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Link, Redirect } from "expo-router";
import { useAuth, isSignedIn, useUser } from "@clerk/clerk-expo";

const LoginScreen = () => {
  const { user } = useUser();
  if (user) return <Redirect href="/home" />;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: "95%", marginHorizontal: 10, marginVertical: 10 }}>
        <Image
          source={require("../assets/images/sell.jpg")}
          style={{
            width: "100%",
            height: 200,
            padding: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: Colors.primary,
          }}
        />
      </View>

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: Colors.primary,
        }}
      >
        Buy Sell APP
      </Text>

      <Text>Find your favourite products near you</Text>

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

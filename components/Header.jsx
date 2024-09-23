import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";

const Header = () => {
  const { user } = useUser();
  const userName = user.emailAddresses[0].emailAddress.split("@")[0];
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }}
        />
        <View>
          <Text style={{ fontWeight: "bold", color: "white" }}>{userName}</Text>
        </View>
      </View>

      {/* <SearchBar /> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
          margin: 10,
          borderRadius: 10,
          gap: 5,
        }}
      >
        <FontAwesome name="search" size={24} color={Colors.primary} />
        <TextInput placeholder="Search" style={{ flex: 1, fontSize: 18 }} />
      </View>
    </View>
  );
};

export default Header;

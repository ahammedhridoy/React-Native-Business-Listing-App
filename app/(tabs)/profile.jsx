import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

const Explore = () => {
  const router = useRouter();
  const { user } = useUser();
  const userName = user?.emailAddresses[0].emailAddress.split("@")[0];
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  //     Action button
  const actionButton = [
    {
      id: 1,
      name: "Add Product",
      icon: require("../../assets/images/add.png"),
      path: `/business/add-business`,
    },
    {
      id: 2,
      name: "My Products",
      icon: require("../../assets/images/online-analytical.png"),
      path: `/business/my-business`,
    },
    {
      id: 3,
      name: "Share App",
      icon: require("../../assets/images/share-p.png"),
      path: `share`,
    },
    {
      id: 4,
      name: "Logout",
      icon: require("../../assets/images/logout.png"),
      path: `logout`,
    },
  ];

  // Onpress share
  const onPressAction = (item) => {
    if (item?.path === "logout") {
      signOut();
      router.push("/");
      return;
    }
    if (item?.path === "share") {
      Share.share({
        message: "Download App from Playstore",
      });
      return;
    }
    router.push(item?.path);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        justifyContent="center"
        style={{
          backgroundColor: "#0a7ea4",
          height: "100%",
        }}
      >
        <Text
          style={{
            color: "white",
            margin: 10,
            fontSize: 24,
            fontWeight: "bold",
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 10,
          }}
        >
          Profile
        </Text>

        {/* Profile intro */}
        <View
          style={{
            alignItems: "center",
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            margin: 10,
          }}
        >
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 50,
              margin: 10,
              borderColor: Colors.primary,
              borderWidth: 2,
            }}
          />
          <Text
            style={{ fontWeight: "bold", color: Colors.primary, fontSize: 20 }}
          >
            {userName}
          </Text>
          <Text
            style={{ fontWeight: "bold", color: Colors.primary }}
          >{`${userName}@gmail.com`}</Text>
        </View>

        {/* Action buttons */}
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            refreshing={loading}
            justifyContent="center"
            style={{
              backgroundColor: "white",
              padding: 20,
              margin: 10,
              borderRadius: 10,
            }}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={actionButton}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  margin: 10,
                  flex: 1,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: Colors.primary,
                  gap: 10,
                  padding: 10,
                }}
              >
                <TouchableOpacity onPress={() => onPressAction(item)}>
                  <View
                    style={{
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={item?.icon}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: Colors.primary,
                        fontWeight: "bold",
                        flex: 1,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          ></FlatList>
        </SafeAreaView>

        <Text
          style={{
            alignItems: "center",
            color: "white",
            justifyContent: "center",
            fontSize: 20,
            margin: 10,
            textAlign: "center",
          }}
        >
          Developed By Ashik Hridoy
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;

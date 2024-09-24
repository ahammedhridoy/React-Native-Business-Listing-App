import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const Explore = () => {
  const router = useRouter();
  const [business, setBusiness] = useState([]);

  const getBusiness = async () => {
    try {
      setBusiness([]);

      const q = query(collection(db, "BusinessList"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setBusiness((prev) => [
          ...prev,
          {
            id: doc.id,
            ...doc.data(),
          },
        ]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <View style={{ backgroundColor: "#0a7ea4", height: "100%" }}>
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
        Explore More
      </Text>

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

      {/* Popular Business */}
      <ScrollView nestedScrollEnabled={true}>
        <FlatList
          data={business}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`businessdetails/${item.id}`)}
            >
              <View
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                }}
              >
                <Image
                  source={{ uri: item?.imageUrl }}
                  style={{
                    width: "100%",
                    height: 150,
                    backgroundColor: "white",
                    borderRadius: 5,
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: 20,
                      fontWeight: "bold",
                      marginTop: 5,
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: 20,
                      fontWeight: "bold",
                      marginTop: 5,
                    }}
                  >
                    ${item.price}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "grey",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 5,
                  }}
                >
                  {item.address}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/7656/7656139.png",
                      }}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ color: "grey" }}>4.5</Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 5,
                      marginTop: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{item.category}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default Explore;

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "./../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const AddBusiness = () => {
  const { user } = useUser();
  const emailAddress = user?.emailAddresses[0].emailAddress.split("@")[0];
  const [business, setBusiness] = useState([]);
  const router = useRouter();

  //   Get business

  const getBusiness = async () => {
    try {
      setBusiness([]); // Clear previous business data

      // Create a query to search for businesses by email
      const q = query(
        collection(db, "BusinessList"),
        where("email", "==", emailAddress + "@gmail.com")
      );

      // Fetch documents matching the query
      const querySnapshot = await getDocs(q);

      // Update the business state with the fetched data
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
      console.error("Error fetching businesses:", error);
    }
  };

  useEffect(() => {
    getBusiness();
  }, [emailAddress + "@gmail.com"]);

  return (
    <ScrollView
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
        My Products
      </Text>

      {/*  business  */}

      <View style={{ padding: 20 }}>
        <FlatList
          data={business}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`businessdetails/${item.id}`)}
            >
              <View
                style={{
                  padding: 10,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={{ uri: item?.imageUrl }}
                  style={{
                    width: 300,
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
      </View>
    </ScrollView>
  );
};

export default AddBusiness;

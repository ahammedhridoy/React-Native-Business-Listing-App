import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { where } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "@/constants/Colors";

const Category = () => {
  const { category } = useLocalSearchParams();
  const [business, setBusiness] = useState([]);

  const getBusiness = async () => {
    try {
      setBusiness([]);

      const q = query(
        collection(db, "BusinessList"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      // Update the sliders state
      setBusiness((prev) => [
        ...prev,
        ...querySnapshot.docs.map((doc) => doc.data()),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#0a7ea4" }}>
      {business.length === 0 ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: "85vh",
          }}
        >
          <Text
            style={{ color: Colors.primary, fontWeight: "bold", fontSize: 20 }}
          >
            No Business Found
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ padding: 10 }}
          data={business}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => console.log(item)}>
              <View
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: "100%",
                    height: 150,
                    backgroundColor: "white",
                    borderRadius: 5,
                  }}
                />

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
      )}
    </ScrollView>
  );
};

export default Category;

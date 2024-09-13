import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { db } from "../config/FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "expo-router";

const Category = () => {
  const [category, setCategory] = useState([]);
  const router = useRouter();

  const getCategory = async () => {
    try {
      setCategory([]);

      const q = query(collection(db, "Category"));
      const querySnapshot = await getDocs(q);

      // Update the sliders state
      setCategory((prev) => [
        ...prev,
        ...querySnapshot.docs.map((doc) => doc.data()),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "white",
            margin: 20,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          #Category
        </Text>
        <Text
          style={{
            color: "white",
            margin: 20,
            fontSize: 14,
            fontWeight: "bold",
            color: Colors.primary,
          }}
        >
          View ALL
        </Text>
      </View>

      {/* Category */}
      <FlatList
        data={category}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push("/businesslist/" + item.name)}
          >
            <View style={{ alignItems: "center", margin: 10 }}>
              <Image
                source={{ uri: item.icon }}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 25,
                }}
              />

              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Category;

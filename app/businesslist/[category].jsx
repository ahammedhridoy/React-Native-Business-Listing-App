import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { where } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "@/constants/Colors";

const Category = () => {
  const { category } = useLocalSearchParams();
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getBusiness = async () => {
    try {
      setLoading(true); // Start loading
      setBusiness([]);

      const q = query(
        collection(db, "BusinessList"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      setBusiness((prev) => [
        ...prev,
        ...querySnapshot.docs.map((doc) => ({
          id: doc?.id,
          ...doc.data(),
        })),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#0a7ea4" }}>
      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            display: "flex",
          }}
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            animating={true}
            hidesWhenStopped={true}
            style={{ marginTop: "100%" }}
          />
        </View>
      ) : business.length === 0 ? (
        // Show "No Business Found" if no data and not loading
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
        <ScrollView nestedScrollEnabled={true}>
          <FlatList
            refreshing={loading}
            onRefresh={getBusiness}
            style={{ padding: 10 }}
            data={business}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/businessdetails/${item.id}`)}
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
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default Category;

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../config/FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [business, setBusiness] = useState([]);
  const router = useRouter();

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

  const getSlider = async () => {
    try {
      setSliders([]);

      const q = query(collection(db, "Slider"));
      const querySnapshot = await getDocs(q);

      setSliders((prev) => [
        ...prev,
        ...querySnapshot.docs.map((doc) => doc.data()),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSlider();
  }, []);

  return (
    <View>
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
        Recommend For You
      </Text>

      <ScrollView nestedScrollEnabled={true}>
        <FlatList
          data={business}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => router.push(`businessdetails/${item.id}`)}
            >
              <Image
                source={{ uri: item?.imageUrl }}
                style={{
                  width: 300,
                  height: 150,
                  margin: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "white",
                }}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default Slider;

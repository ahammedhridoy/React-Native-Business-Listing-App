import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../config/FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

const Slider = () => {
  const [sliders, setSliders] = useState([]);

  const getSlider = async () => {
    try {
      setSliders([]);

      const q = query(collection(db, "Slider"));
      const querySnapshot = await getDocs(q);

      // Update the sliders state
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
        style={{ color: "white", margin: 20, fontSize: 24, fontWeight: "bold" }}
      >
        #Recommend For You
      </Text>

      <FlatList
        data={sliders}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 300, height: 150, margin: 10, borderRadius: 10 }}
          />
        )}
      />
    </View>
  );
};

export default Slider;

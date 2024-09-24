import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header";
import Slider from "../../components/Slider";
import Category from "../../components/Category";
import PopularBusiness from "../../components/PopularBusiness";

const Home = () => {
  const [loading, setLoading] = useState(false);
  return (
    <ScrollView
      style={{
        height: "100%",
        backgroundColor: "#0a7ea4",
      }}
    >
      <View>
        {/* Header */}
        <Header />

        {/* Slider */}
        <Slider />

        {/* Category */}
        <Category />

        {/* Popular */}
        <PopularBusiness />
      </View>
    </ScrollView>
  );
};

export default Home;

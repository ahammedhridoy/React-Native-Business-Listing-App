import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput,
  ToastAndroid,
  Share,
  Linking,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Rating } from "react-native-ratings";
import { useUser } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";

const BusinessId = () => {
  const { businessid } = useLocalSearchParams();
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [reviews, setReviews] = useState(0);
  const [userInput, setUserInput] = useState("");
  const { user } = useUser();
  const userName = user?.emailAddresses[0].emailAddress.split("@")[0];
  const userEmail = user?.emailAddresses[0].emailAddress.split("@")[0];
  const [modalVisible, setModalVisible] = useState(false);

  //     Action button
  const actionButton = [
    {
      id: 1,
      name: "Call",
      icon: require("../../assets/images/telephone.png"),
      url: `tel:${business?.contact}`,
    },
    {
      id: 2,
      name: "Location",
      icon: require("../../assets/images/google-maps.png"),
      url: `${business?.location}`,
    },
    {
      id: 3,
      name: "Website",
      icon: require("../../assets/images/web.png"),
      url: `${business?.website}`,
    },
    {
      id: 4,
      name: "Share",
      icon: require("../../assets/images/share.png"),
      url: `${business?.website}`,
    },
  ];

  // Onpress share
  const onPressShare = (item) => {
    if (item?.name === "Share") {
      Share.share({
        message: `Check out ${business?.name} on ${item?.url} \n ${business?.address}`,
      });
      return;
    }
    Linking.openURL(item?.url);
  };

  //   Submit review
  const handleSubmit = async () => {
    try {
      if (!userInput) {
        alert("Please write a review");
        return;
      }
      const docRef = doc(db, "BusinessList", business?.id);
      await updateDoc(docRef, {
        reviews: arrayUnion({
          id: user?.id,
          name: userName,
          email: userEmail + "@gmail.com",
          rating: reviews,
          comment: userInput,
          date: new Date().toLocaleDateString(),
        }),
      });

      setUserInput("");
      setReviews(0);
      ToastAndroid.show("Review submitted successfully", ToastAndroid.TOP);
    } catch (error) {
      console.log(error);
    }
  };

  //   Get business
  const getBusiness = async () => {
    try {
      setLoading(true);
      setBusiness([]);

      const docRef = doc(db, "BusinessList", businessid);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusiness({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Business
  const deleteBusiness = async (id, email) => {
    try {
      console.log(id, email);
      if (email !== userEmail + "@gmail.com") {
        Alert.alert("Error", "You are not authorized to delete this business");
        return;
      }
      await deleteDoc(doc(db, "BusinessList", id));

      router.back();
      ToastAndroid.show("Business deleted successfully", ToastAndroid.TOP);
    } catch (error) {
      console.log(error);
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
      ) : (
        <View>
          {/* Image */}
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ position: "absolute", top: 30, left: 10, zIndex: 10 }}
            >
              <Ionicons
                name="arrow-back-circle"
                size={40}
                color="white"
                style={{ position: "absolute", zIndex: 10 }}
              />
            </TouchableOpacity>
            <Image
              source={{ uri: business?.imageUrl }}
              style={{ width: "100%", height: 300 }}
            />
          </View>

          {/* Details */}
          <View
            style={{
              padding: 20,
              backgroundColor: "white",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              marginTop: -40,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {business?.name}
              </Text>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                ${business?.price}
              </Text>
              <Text style={{ color: "grey", fontSize: 16 }}>
                {business?.address}
              </Text>
            </View>
            {business?.email === userEmail + "@gmail.com" && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <AntDesign
                  style={{ color: "red" }}
                  name="delete"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Modal */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={{ marginTop: 300 }}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Do you want to delete this business?
                  </Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        deleteBusiness(business?.id, business?.email)
                      }
                      style={{
                        backgroundColor: "red",
                        borderRadius: 20,
                        padding: 10,
                      }}
                    >
                      <Text style={{ color: "white", backgroundColor: "red" }}>
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          {/* Action buttons */}
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              onRefresh={getBusiness}
              refreshing={loading}
              style={{ backgroundColor: "white", paddingHorizontal: 20 }}
              contentContainerStyle={{ gap: 10 }}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              numColumns={4}
              data={actionButton}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "white",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => onPressShare(item)}>
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
                        style={{ color: Colors.primary, fontWeight: "bold" }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            ></FlatList>
          </ScrollView>

          {/* About */}
          <View style={{ padding: 20, backgroundColor: "white" }}>
            <Text
              style={{
                color: Colors.primary,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              About
            </Text>
            <Text style={{ color: "grey", fontSize: 16, lineHeight: 25 }}>
              {business?.about}
            </Text>
          </View>

          {/* Reviews */}
          <View style={{ padding: 20, backgroundColor: "white" }}>
            <Text
              style={{
                color: Colors.primary,
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Review
            </Text>

            <Rating
              showRating={false}
              onFinishRating={(reviews) => setReviews(reviews)}
              style={{ paddingVertical: 10 }}
            />

            <TextInput
              value={reviews}
              onChangeText={(userInput) => setUserInput(userInput)}
              placeholder="Write a review"
              style={{
                borderWidth: 1,
                borderColor: Colors.primary,
                borderRadius: 5,
                padding: 10,
                width: "100%",
                height: 100,
                marginTop: 10,
                textAlignVertical: "top",
              }}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display reviews */}

          <View style={{ padding: 20, backgroundColor: "white" }}></View>
          {business?.reviews?.map((item, index) => (
            <View
              key={index}
              style={{
                padding: 10,
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBlockColor: Colors.primary,
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    margin: 10,
                  }}
                />
                <View style={{ gap: 5 }}>
                  <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
                    {userName}
                  </Text>
                  <Rating
                    imageSize={20}
                    ratingCount={item?.rating}
                    style={{ alignItems: "flex-start" }}
                  />
                  <Text style={{ color: "grey" }}>{item?.comment}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: Colors.primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default BusinessId;

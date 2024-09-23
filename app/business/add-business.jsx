import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db, storage } from "../../config/FirebaseConfig";
import { Colors } from "./../../constants/Colors";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";

const AddBusiness = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const navigation = useNavigation();
  const { user } = useUser();
  const userName = user.emailAddresses[0].emailAddress.split("@")[0];

  // Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Business",
      headerShown: true,
    });
  }, [navigation]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //   Get categories
  const getCategory = async () => {
    try {
      setCategory([]);

      const q = query(collection(db, "Category"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setCategory((prev) => [
          ...prev,
          {
            label: doc.data().name,
            value: doc.data().name,
          },
        ]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onAddBusiness = async () => {
    try {
      const filename = Date.now().toString() + ".jpg";
      const resp = await fetch(image);
      const blob = await resp.blob();

      const imageRef = ref(storage, "businessapp/" + filename);

      uploadBytes(imageRef, blob)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
        })
        .then((resp) => {
          getDownloadURL(imageRef).then(async (downloadUrl) => {
            console.log(downloadUrl);
            saveBusiness(downloadUrl);
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const saveBusiness = async (imageUrl) => {
    try {
      if (!selectedCategory || !name || !about || !address || !contact) {
        ToastAndroid.show("All fields are required", ToastAndroid.TOP);
        return;
      }
      await setDoc(doc(db, "BusinessList", Date.now().toString()), {
        name,
        about,
        address,
        contact,
        website,
        imageUrl: imageUrl,
        category: selectedCategory,
        userName: userName,
        email: userName + "@gmail.com",
        location,
      });
      setName("");
      setAbout("");
      setAddress("");
      setContact("");
      setWebsite("");
      setSelectedCategory(null);
      setImage(null);

      ToastAndroid.show("Business added successfully", ToastAndroid.TOP);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Something went wrong", ToastAndroid.TOP);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: "#0a7ea4",
        height: "100%",
      }}
    >
      <Text
        style={{ color: "white", margin: 20, fontSize: 24, fontWeight: "bold" }}
      >
        Add New Business
      </Text>

      {/* Add business form */}

      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => onPickImage()}>
          {!image ? (
            <Image
              source={require("../../assets/images/camera.png")}
              style={{
                width: 100,
                height: 100,
              }}
            />
          ) : (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
              }}
            />
          )}
        </TouchableOpacity>

        <View>
          <TextInput
            autoCapitalize="none"
            placeholder="Name"
            placeholderTextColor={"white"}
            onChangeText={(name) => setName(name)}
            style={{
              marginBottom: 10,
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              color: "white",
              marginVertical: 10,
              borderRadius: 5,
            }}
          />

          <TextInput
            onChangeText={(about) => setAbout(about)}
            autoCapitalize="none"
            multiline
            placeholder="About"
            placeholderTextColor={"white"}
            style={{
              marginBottom: 10,
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              color: "white",
              marginVertical: 10,
              height: 100,
              textAlignVertical: "top",
              borderRadius: 5,
            }}
          />

          <TextInput
            autoCapitalize="none"
            onChangeText={(address) => setAddress(address)}
            placeholder="Address"
            placeholderTextColor={"white"}
            style={{
              marginBottom: 10,
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              color: "white",
              marginVertical: 10,
              borderRadius: 5,
            }}
          />

          <TextInput
            autoCapitalize="none"
            onChangeText={(location) => setLocation(location)}
            placeholder="Location of business (Google Maps Link)"
            placeholderTextColor={"white"}
            style={{
              marginBottom: 10,
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              color: "white",
              marginVertical: 10,
              borderRadius: 5,
            }}
          />

          <View
            style={{
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              color: "white",
              marginVertical: 10,
              borderRadius: 5,
            }}
          >
            <RNPickerSelect
              activeItemStyle={{ color: Colors.primary }}
              onValueChange={(value) => setSelectedCategory(value)}
              items={category}
            />
          </View>

          <TextInput
            autoCapitalize="none"
            onChangeText={(contact) => setContact(contact)}
            placeholder="Contact"
            placeholderTextColor={"white"}
            style={{
              marginBottom: 10,
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              color: "white",
              marginVertical: 10,
              borderRadius: 5,
            }}
          />

          <TextInput
            autoCapitalize="none"
            placeholder="Website"
            onChangeText={(website) => setWebsite(website)}
            placeholderTextColor={"white"}
            style={{
              marginBottom: 10,
              width: "100%",
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              color: "white",
              marginVertical: 10,
              borderRadius: 5,
            }}
          />

          <TouchableOpacity
            onPress={() => onAddBusiness()}
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
              Add Business
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddBusiness;

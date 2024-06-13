import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';
import Toast, { BaseToast } from 'react-native-toast-message';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: "AIzaSyCA7wBoQgyALz623_kZIPjaExG3ojba86U",
  authDomain: "cityride2-c66ec.firebaseapp.com",
  projectId: "cityride2-c66ec",
  storageBucket: "cityride2-c66ec.appspot.com",
  messagingSenderId: "692339334559",
  appId: "1:692339334559:web:9de6f6a4df5936bb2271aa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#06c58e', backgroundColor: "#06c58e", borderRadius: 12, marginBottom: 20 }}
      text1Style={{
        fontSize: 15,
        color: "#fff",
        textAlign: "center"
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#E3AB12', backgroundColor: "#E3AB12", borderRadius: 12, marginBottom: 20 }}
      text1Style={{
        fontSize: 15,
        color: "#fff",
        textAlign: "center"
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#FF3333', backgroundColor: "#FF3333", borderRadius: 12, marginBottom: 20 }}
      text1Style={{
        fontSize: 15,
        color: "#fff",
        textAlign: "center"
      }}
    />
  )
};

export default function Details({ route }) {
  const [driverPhoneNumber, setDriverPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loaderModal, setLoaderModal] = useState(false);
  const navigation = useNavigation();

  const { passengerId } = route.params;

  const onSubmit = async () => {
    if (!driverPhoneNumber || !vehicleNumber) {
      Toast.show({
        type: 'info',
        text1: 'All fields are required'
      });
      return;
    }

    setLoaderModal(true);
    try {
      const driverId = auth.currentUser.uid; // Get the authenticated user's ID
      await setDoc(doc(db, "driversdata", driverId), {
        passengerId,
        driverId,
        driverPhoneNumber,
        vehicleNumber
      });

      Toast.show({
        type: 'success',
        text1: 'Driver details saved'
      });

    } catch (error) {
      console.error("Error adding document: ", error);
      Toast.show({
        type: 'error',
        text1: 'Error saving driver details'
      });
    } finally {
      setLoaderModal(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingLeft: "5.5%", paddingRight: "5.5%" }}>
      <StatusBar backgroundColor={"#000"} style="light" />
      <Modal isVisible={loaderModal} style={{ justifyContent: "center", alignItems: "center" }} useNativeDriver={true}>
        <StatusBar backgroundColor={"#000000"} style="light" />
        <View style={{ backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
          <Image
            style={{
              height: 200,
              resizeMode: "contain"
            }}
            source={require("../assets/loader.gif")}
          />
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 52, paddingTop: "7%" }}>
        <Text style={{ color: "#222", fontSize: 24 }}>
          Enter Driver Details
        </Text>
        <Text style={{ color: "#222", marginTop: 74, fontSize: 14, marginBottom: 20 }}>
          Please make sure all the required fields are properly filled.
        </Text>
        <Text style={{ color: "#222", marginTop: 20, fontSize: 15, marginLeft: 2 }}>
          Driver Phone Number
        </Text>
        <View style={{ width: "100%", height: 45, marginTop: 8, borderWidth: 2, borderColor: "#E3E3E3", backgroundColor: "#fff", borderRadius: 7, justifyContent: "center", alignSelf: "center", paddingLeft: 13, paddingRight: 13 }}>
          <TextInput
            style={{
              width: "100%",
              color: "#222",
              fontSize: 16,
            }}
            value={driverPhoneNumber}
            placeholder={"Enter Driver Phone Number"}
            placeholderTextColor={"#9E9E9E"}
            onChangeText={(text) => setDriverPhoneNumber(text)}
            returnKeyType="next"
          />
        </View>
        <Text style={{ color: "#222", marginTop: 20, fontSize: 15, marginLeft: 2 }}>
          Vehicle Number
        </Text>
        <View style={{ width: "100%", height: 50, marginTop: 8, flexDirection: "row", backgroundColor: "#fff", borderRadius: 7, alignSelf: "center", paddingLeft: 13, paddingRight: 13, borderWidth: 2, borderColor: "#E3E3E3", }}>
          <TextInput
            style={{
              width: "100%",
              color: "#222",
              fontSize: 16,
            }}
            value={vehicleNumber}
            placeholder={"Enter Vehicle Number"}
            placeholderTextColor={"#9E9E9E"}
            onChangeText={(text) => setVehicleNumber(text)}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          onPress={onSubmit}
          style={{
            backgroundColor: "#000",
            marginTop: 20,
            width: "100%",
            height: 45,
            borderRadius: 7,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, }}>
            Save Driver Details
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 45,
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 12,
    paddingLeft: 13
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#9E9E9E",
    marginLeft: -6
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#222"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

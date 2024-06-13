import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, where, query } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import Toast, { BaseToast } from 'react-native-toast-message';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA7wBoQgyALz623_kZIPjaExG3ojba86U",
  authDomain: "cityride2-c66ec.firebaseapp.com",
  projectId: "cityride2-c66ec",
  storageBucket: "cityride2-c66ec.appspot.com",
  messagingSenderId: "692339334559",
  appId: "1:692339334559:web:9de6f6a4df5936bb2271aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Toast configuration
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
      style={{ borderLeftColor: '#FF6347', backgroundColor: "#FF6347", borderRadius: 12, marginBottom: 20 }}
      text1Style={{
        fontSize: 15,
        color: "#fff",
        textAlign: "center"
      }}
    />
  )
};

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drivers: [],
    };
  }

  componentDidMount() {
    this.getMatchedDrivers();
  }

  getMatchedDrivers = async () => {
    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'User not authenticated'
      });
      return;
    }

    try {
      // Query to get all rides associated with the current user (passenger)
      const ridesQuery = query(collection(db, "rides"), where("passengerId", "==", user.uid));
      const ridesSnapshot = await getDocs(ridesQuery);

      if (ridesSnapshot.empty) {
        console.log("No rides found for this passenger");
        Toast.show({
          type: 'info',
          text1: 'No rides found for this passenger'
        });
        return;
      }

      // Extract all driverIds from the rides
      const driverIds = ridesSnapshot.docs.map(doc => doc.data().driverId);
      console.log("Driver IDs:", driverIds); // Log driver IDs

      if (driverIds.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No drivers found for this passenger'
        });
        return;
      }

      // Query to get all drivers that match the driverIds
      const driversQuery = query(collection(db, "driversdata"), where("driverId", "in", driverIds));
      const driversSnapshot = await getDocs(driversQuery);

      if (driversSnapshot.empty) {
        console.log("No matching drivers found");
        Toast.show({
          type: 'info',
          text1: 'No matching drivers found'
        });
        return;
      }

      // Collect the matched drivers' data
      let matchedDrivers = [];
      driversSnapshot.forEach(doc => {
        matchedDrivers.push({ id: doc.id, ...doc.data() });
      });

      console.log("Matched Drivers data fetched:", matchedDrivers); // Log matched drivers data
      this.setState({ drivers: matchedDrivers });

    } catch (error) {
      console.error("Error getting documents: ", error);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch driver data'
      });
    }
  };

  render() {
    const { drivers } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', padding: "5.5%" }}>
        <StatusBar backgroundColor="#000" style="light" />
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20, paddingTop: "7%" }}>
          <Text style={{ color: "#222", fontSize: 24, marginBottom: 20 }}>
            Drivers List
          </Text>
          {drivers.length === 0 ? (
            <Text style={{ color: "#666", fontSize: 16, textAlign: "center" }}>No drivers found</Text>
          ) : (
            drivers.map((driver) => (
              <View key={driver.id} style={styles.driverContainer}>
                <Text style={styles.driverText}>Phone Number: {driver.driverPhoneNumber}</Text>
                <Text style={styles.driverText}>Vehicle Number: {driver.vehicleNumber}</Text>
              </View>
            ))
          )}
          <Toast position="bottom" visibilityTime={3000} config={toastConfig} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  driverContainer: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  driverText: {
    color: "#333",
    fontSize: 16
  }
});

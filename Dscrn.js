import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { collection, query, where, getDocs,getDoc, getFirestore, doc, updateDoc } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
      style={{ borderLeftColor: '#06c58e', backgroundColor: "#06c58e", borderRadius: 12, marginBottom: 65, width: "90%" }}
      text1Style={{
        fontSize: 15,
        color: "#fff",
        textAlign: "center"
      }}
    />
  )
};

export default class Dscrn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      currentUser: null,
    };
  }

  async componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: null });
      }
    });
    this.getRidesData();
  }

  getRidesData = async () => {
    Toast.show({
      type: 'success',
      text1: 'Please wait, refreshing data'
    });
    let data = {};
    let firebaseData = [];
    const q = query(collection(db, "rides"), where("isRideAccepted", "==", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data = { id: doc.id, ...doc.data() }; // Include document ID
      firebaseData.push(data);
    });
    this.setState({ rides: firebaseData });
  }

  acceptRide = async (rideId, passengerId) => {
    const { currentUser } = this.state;
    if (!currentUser) {
      Toast.show({
        type: 'error',
        text1: 'User not authenticated'
      });
      return;
    }
  
    try {
      const rideRef = doc(db, "rides", rideId);
      const rideDoc = await getDoc(rideRef);
  
      if (rideDoc.exists()) {
        await updateDoc(rideRef, {
          isRideAccepted: true,
          driverId: currentUser.uid, // Store the current user's ID as the driverId
        });
    
        // Update state to reflect the accepted ride
        this.setState(prevState => ({
          rides: prevState.rides.map(ride => {
            if (ride.id === rideId) {
              return { ...ride, isRideAccepted: true };
            } else {
              return ride;
            }
          })
        }));
    
        // Navigate to the Details screen after state update
        this.props.navigation.navigate('Details', { passengerId });
    
        Toast.show({
          type: 'success',
          text1: 'Ride accepted successfully!'
        });
      } else {
        console.error("No such ride document!");
        Toast.show({
          type: 'error',
          text1: 'Ride not found'
        });
      }
  
    } catch (error) {
      console.error("Error accepting ride: ", error);
      Toast.show({
        type: 'error',
        text1: 'Error accepting ride'
      });
    }
  };
  
  render() {
    let { rides } = this.state;
    return (
      <View style={{ backgroundColor: "#fff", padding: "4%", flex: 1, paddingTop: "6%" }}>
        <StatusBar backgroundColor={"#000"} style="light" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 15, marginBottom: 25 }}>
            <Text style={{ color: "#222", fontSize: 22, marginTop: 22 }}>Active Ride Requests</Text>
          </View>
          {
            rides.length > 0 ?
              <View style={{ marginTop: "2%", marginBottom: 75, paddingLeft: 10, paddingRight: 10 }}>
                {
                  rides.map((item, key) => (
                    <View 
                      style={{ borderWidth: 1, borderColor: "#f4c430", backgroundColor: "#FFF5D5", padding: 15, marginBottom: 7, borderRadius: 7 }} 
                      key={key}
                    >
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ width: "85%" }}>
                          <Text style={{ fontSize: 15, color: "#222" }}>{item.pickupLocation} to {item.dropLocation}</Text>
                          <Text style={{ fontSize: 12, color: "#222", marginTop: 3 }}>{item.date}</Text>
                        </View>
                        <AntDesign name="rightcircle" size={27} color="green" />
                      </View>
                      {!item.isRideAccepted && (
                        <TouchableOpacity 
                          style={{ marginTop: 10, backgroundColor: "#06c58e", padding: 10, borderRadius: 5, alignItems: "center" }}
                          onPress={() => this.acceptRide(item.id, item.passengerId)} // Pass passengerId here
                        >
                          <Text style={{ color: "#fff", fontSize: 15 }}>Accept Ride</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                }
              </View>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Text style={{ color: "#222", fontSize: 18 }}>No active ride requests</Text>
              </View>
          }
        </ScrollView>
        <Toast position="bottom" visibilityTime={2000} config={toastConfig} />
        <BottomBar navigation={this.props.navigation} />
      </View>
    );
  }
}

const BottomBar = ({ navigation }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="home" size={24} color="black" />
        <Text style={[styles.iconText, { color: 'black' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Driver')}>
        <Ionicons name="person" size={24} color="black" />
        <Text style={[styles.iconText, { color: 'black' }]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Image } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

// Initialize Firebase with the provided configuration
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
const auth = getAuth();

const Profile = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const profileDoc = doc(db, 'driverprofiles', user.uid);
        const profileSnapshot = await getDoc(profileDoc);
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          setName(profileData.name || '');
          setPhoneNumber(profileData.phoneNumber || '');
          setVehicleNumber(profileData.vehicleNumber || '');
        }
      }
    } catch (error) {
      console.error('Error fetching profile: ', error);
    }
  };

  const saveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const profileDoc = doc(db, 'driverprofiles', user.uid);
        const profileData = {
          name: name,
          phoneNumber: phoneNumber,
          vehicleNumber: vehicleNumber
        };
        await setDoc(profileDoc, profileData);
        setShowNotification(true);
        setEditMode(true); // Enable edit mode after saving
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving profile details: ', error);
      Alert.alert('Error', 'Failed to save profile. Please try again later.');
    }
  };

  const handleLogout = () => {
    // Perform logout action here
    navigation.navigate('LoginPage'); // Navigate to the login page
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('../assets/profile.png')} style={styles.profileImage} />
      </View>
      <Text style={styles.heading}>Profile Details</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          editable={editMode}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={editMode}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your vehicle number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          editable={editMode}
        />
      </View>
      {showNotification && <Text style={styles.notification}>Profile saved successfully!</Text>}
      <Button
        title={editMode ? "Tap to edit profile" : "Tap to edit Profile"}
        onPress={saveProfile}
        style={styles.button}
      />
      <View style={styles.logoutButtonContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    width: 100,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  notification: {
    color: 'green',
    marginTop: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  button: {
    marginBottom: 30,
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
});

export default Profile;

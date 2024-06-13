import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Image, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, query, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// Initialize Firebase with the provided configuration
const firebaseConfig = {
  // Your Firebase config
  apiKey: "AIzaSyCA7wBoQgyALz623_kZIPjaExG3ojba86U",
  authDomain: "cityride2-c66ec.firebaseapp.com",
  projectId: "cityride2-c66ec",
  storageBucket: "cityride2-c66ec.appspot.com",
  messagingSenderId: "692339334559",
  appId: "1:692339334559:web:9de6f6a4df5936bb2271aa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(); // Initialize Firebase Auth

const PassengerMenu = () => {
  const navigation = useNavigation(); // Access navigation object
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser; // Get the current user
      if (user) {
        // Fetch the profile associated with the current user
        const profileDoc = doc(db, 'passengerprofiles', user.uid);
        const profileSnapshot = await getDoc(profileDoc);
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          setName(profileData.name || '');
          setPhoneNumber(profileData.phoneNumber || '');
        }
      }
    } catch (error) {
      console.error('Error fetching profile: ', error);
    }
  };

  const saveProfile = async () => {
    try {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const profileDoc = doc(db, 'passengerprofiles', user.uid);
        const profileData = {
          name: name,
          phoneNumber: phoneNumber,
        };
        // Save the profile data with the user's UID as the document ID
        await setDoc(profileDoc, profileData); // Use setDoc instead of setDoc
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
    // For example, you can navigate to the login page
    navigation.navigate('LoginPage'); // Make sure to import 'navigation' from props or context
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
      {showNotification && <Text style={styles.notification}>Profile saved successfully!</Text>}
      <View style={styles.buttonContainer}>
        <Button
          title={editMode ? "Tap to edit Profile" : "Tap to edit  Profile"}
          onPress={saveProfile}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default PassengerMenu;

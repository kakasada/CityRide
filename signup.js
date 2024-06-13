import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const auth = getAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);

const Colors = {
  primary: "#ffffff",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  brand: "#6D28D9",
  green: "#10B981",
};
const { primary, tertiary, darkLight, brand, green } = Colors;

const StatusBarHeight = Constants.statusBarHeight;

const StyledContainer = styled.View`
  flex: 1;
  padding-top: ${StatusBarHeight + 20}px;
  padding-horizontal: 20px;
  background-color: ${primary};
`;
const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  margin-top: 20px;
`;
const PageTitle = styled.Text`
  font-size: 30px;
  text-align:center;
  font-weight: bold;
  color: ${tertiary};
  padding: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
`;
const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 25px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;
const StyledFormAreas = styled.View`
  width: 90%;
`;
const StyledTextInput = styled.View`
  background-color: ${primary};
  padding: 11px;
  border-radius: 5px;
  font-size: 15px;
  height: 45px;
  margin-bottom: 30px;
  color: ${tertiary};
  border: 1px solid ${darkLight};
  flex-direction: row;
  align-items: center;
  position: relative; /* Needed for absolute positioning */
`;
const TextInputField = styled.TextInput`
  flex: 1;
  padding-left: 18px;
  color: ${tertiary}; /* Ensure text color matches the overall theme */
`;
const VisibilityToggle = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
`;
const PasswordIcon = styled(Octicons)`
  color: ${tertiary};
`;
const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${green};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
`;
const ButtonText = styled.Text`
  color: ${primary};
  font-size: 20px;
`;
const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`;
const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;
const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${tertiary};
  font-size: 15px;
`;
const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
const TextLinkContent = styled.Text`
  color: ${brand};
  font-size: 15px;
`;

const Signup = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const navigation = useNavigation();

  const toggleVisibility = (field) => {
    if (field === 'password') {
      setHidePassword((prevState) => !prevState);
    } else if (field === 'confirmPassword') {
      setHideConfirmPassword((prevState) => !prevState);
    }
  };

  const handleSignup = async (values) => {
    try {
      // Check if the password meets the criteria
      if (values.password.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }

      // Step 1: Create user authentication
      const authCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
  
      // Step 2: Add user data to Firestore
      await addDoc(collection(db, 'users'), {
        Name: values.fullName,
        Email: values.email,
        Password: values.password, // This should be securely hashed and not stored directly
      });
      
      console.log('User added and authenticated successfully!');
      
      // Navigate to the login screen
      navigation.navigate('Intro');
    } catch (error) {
      console.error("Error during signup and data storing:", error);
    }
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>CityRide</PageTitle>
        <SubTitle>Account Signup</SubTitle>
        <Formik
          initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
          onSubmit={handleSignup}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormAreas>
              <StyledTextInput>
                <Octicons name="person" size={20} color={tertiary} />
                <TextInputField
                  placeholder="Full Name"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
              </StyledTextInput>
              <StyledTextInput>
                <Octicons name="mail" size={20} color={tertiary} />
                <TextInputField
                  placeholder="Email"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
              </StyledTextInput>
              <StyledTextInput>
                <Octicons name="lock" size={20} color={tertiary} />
                <TextInputField
                  placeholder="Password"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                />
                <VisibilityToggle onPress={() => toggleVisibility('password')}>
                  <PasswordIcon
                    name={hidePassword ? 'eye-closed' : 'eye'}
                    size={20}
                  />
                </VisibilityToggle>
              </StyledTextInput>
              <StyledTextInput>
                <Octicons name="lock" size={20} color={tertiary} />
                <TextInputField
                  placeholder="Confirm Password"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hideConfirmPassword}
                />
                <VisibilityToggle onPress={() => toggleVisibility('confirmPassword')}>
                  <PasswordIcon
                    name={hideConfirmPassword ? 'eye-closed' : 'eye'}
                    size={20}
                  />
                </VisibilityToggle>
              </StyledTextInput>
              <StyledButton onPress={handleSubmit}>
                <ButtonText>Signup</ButtonText>
              </StyledButton>
              <Line />
              <ExtraView>
                <ExtraText>Already have an account? </ExtraText>
                <TextLink onPress={() => navigation.navigate('LoginPage')}>
                  <TextLinkContent>Login</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFormAreas>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Signup;

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
  red: "#EF4444",
};
const { primary, tertiary, darkLight, brand, green, red } = Colors;

const StatusBarHeight = Constants.statusBarHeight;

const StyledContainer = styled.View`
  flex: 1;
  padding-top: ${StatusBarHeight}px;
  background-color: ${primary};
`;
const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  padding: 20px;
   margin-top: 90px;
`;
const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${"#000000"};
  padding: 10px;
`;
const SubTitle = styled.Text`
  font-size: 14px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${"#000000"};
`;
const StyledFormAreas = styled.View`
  width: 100%;
`;
const StyledTextInputContainer = styled.View`
  margin-bottom: 30px;
  position: relative;
`;
const StyledTextInput = styled.TextInput`
  background-color: ${primary};
  padding: 10px;
  padding-left: 40px;
  border-radius: 5px;
  font-size: 12px;
  height: 45px;
  color: ${tertiary};
  border: 1px solid ${darkLight};
  margin-left: 15px; /* Add margin to the left */
`;
const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  margin-left: 10px;
`;
const LeftIcon = styled.View`
  position: absolute;
  z-index: 1;
  left: 21px;
  top: 50%;
  margin-top: -3px;
`;
const RightIcon = styled.TouchableOpacity`
  margin-left: 280px;
  margin-top: -30px;
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
const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${red};
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
  color: ${"#000000"};
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

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const navigation = useNavigation();

  const handleSubmit = async (values) => {
    try {
      // Call Firebase Authentication method for signing in
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // Navigate to the next screen upon successful login
      navigation.navigate('Intro');
    } catch (error) {
      console.error('Login Error:', error.message);
      // Handle login error (e.g., display error message to user)
    }
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>CityRide</PageTitle>
        <SubTitle>Login to your account</SubTitle>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormAreas>
              <StyledTextInputContainer>
                <LeftIcon>
                  <Octicons name="mail" size={23} color={tertiary} />
                </LeftIcon>
                <StyledInputLabel>Email</StyledInputLabel>
                <StyledTextInput
                  placeholder="Your email address"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
              </StyledTextInputContainer>
              <StyledTextInputContainer>
                <LeftIcon>
                  <Octicons name="lock" size={27} color={tertiary} />
                </LeftIcon>
                <StyledInputLabel>Password</StyledInputLabel>
                <StyledTextInput
                  placeholder="Enter your password"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                />
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                  <Octicons
                    name={hidePassword ? 'eye-closed' : 'eye'}
                    size={20}
                    color={tertiary}
                  />
                </RightIcon>
              </StyledTextInputContainer>
              <MsgBox>...</MsgBox>
              <StyledButton onPress={handleSubmit}>
                <ButtonText>Login</ButtonText>
              </StyledButton>
              <Line />
              <ExtraView>
                <ExtraText>Don't have an account already? </ExtraText>
                <TextLink onPress={() => navigation.navigate('Signup')}>
                  <TextLinkContent>Signup</TextLinkContent>
                </TextLink>
              </ExtraView>
            </StyledFormAreas>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Login;

// SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate the image
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
  
    animate();

    // Simulate loading process and navigate to the login page
    const timer = setTimeout(() => {
      navigation.replace('LoginPage');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation, scaleValue]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/splsh.png')}
        style={[styles.logo, { transform: [{ scale: scaleValue }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Change to your preferred background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // Adjust the image size as needed
    borderRadius: 100, // Make the image round
  },
});

export default SplashScreen;

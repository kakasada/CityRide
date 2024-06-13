// screens/ProfilePage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfilePage = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user.phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#666',
  },
});

export default ProfilePage;

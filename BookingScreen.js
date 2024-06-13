import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const BookingScreen = ({ navigation }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [selectingLocation, setSelectingLocation] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropCoordinates, setDropCoordinates] = useState(null);
  const [rideRequested, setRideRequested] = useState(false);

  const handleMapPress = async (event) => {
    if (!event.nativeEvent.coordinate) {
      return; // Exit early if coordinate is null
    }

    // Update pickup or drop location based on the selectingLocation state
    if (selectingLocation === 'pickup') {
      setPickupCoordinates(event.nativeEvent.coordinate);
      setPickupLocation('Pickup Location');
    } else if (selectingLocation === 'drop') {
      setDropCoordinates(event.nativeEvent.coordinate);
      setDropLocation('Drop Location');
    }
  };

  const handleChooseOnMap = (locationType) => {
    // Set the selectingLocation state to the chosen location type
    setSelectingLocation(locationType);
  };

  const handleRequestRide = () => {
    // Implement logic to request a ride
    // For example, you can set rideRequested to true
    setRideRequested(true);
  };

  const handleCancelRide = () => {
    // Implement logic to cancel the ride
    // For example, you can reset pickup and drop locations and coordinates
    setPickupLocation('');
    setDropLocation('');
    setPickupCoordinates(null);
    setDropCoordinates(null);
    setRideRequested(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 25.6747, // Latitude of Kohima, Nagaland
            longitude: 94.1100, // Longitude of Kohima, Nagaland
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          onPress={handleMapPress} // Handle map press event
        >
          {/* Marker for the chosen location */}
          {pickupCoordinates && (
            <Marker coordinate={pickupCoordinates} title={"Pickup Location"} pinColor={'green'} />
          )}
          {dropCoordinates && (
            <Marker coordinate={dropCoordinates} title={"Drop Location"} pinColor={'red'} />
          )}

          {/* Polyline to connect pickup and drop locations */}
          {pickupCoordinates && dropCoordinates && (
            <Polyline
              coordinates={[pickupCoordinates, dropCoordinates]}
              strokeColor="#0000FF"
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      {/* Full Line Separator */}
      <View style={styles.fullLine} />

      {/* Text Inputs for Pickup Location, Drop Location */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.mapButton} onPress={() => handleChooseOnMap('pickup')}>
          <Text style={styles.buttonText}>Choose Pickup on Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={() => handleChooseOnMap('drop')}>
          <Text style={styles.buttonText}>Choose Drop on Map</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter Pickup Location"
          value={pickupLocation}
          onChangeText={text => setPickupLocation(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Drop Location"
          value={dropLocation}
          onChangeText={text => setDropLocation(text)}
        />
      </View>

      {/* Text display for ride request */}
      {rideRequested && (
        <View style={styles.requestDisplay}>
          <Text style={styles.requestText}>Ride Requested Successfully!</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Button for Request Ride */}
      {!rideRequested && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRequestRide}>
            <Text style={styles.buttonText}>Request Ride</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fullLine: {
    height: 1,
    backgroundColor: 'black',
  },
  inputContainer: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  requestDisplay: {
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  requestText: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookingScreen;

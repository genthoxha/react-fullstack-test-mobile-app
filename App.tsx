import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView, Platform,
} from 'react-native';
import * as Location from 'expo-location';
import Button from './components/Button';
import { Checkpoint, CheckpointCard } from './components/Checkpoint';
import axios from 'axios';

export default function App() {
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | undefined
  >(undefined);
  const [activeCheckpoint, setActiveCheckpoint] = React.useState<{
    id: number;
    active: boolean;
  }>({ id: 0, active: false });
  const [distance, setDistance] = React.useState<number>();

  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [allCheckpoints, setCheckpoints] = React.useState<Checkpoint[]>([]);

  const handleLocationAccess = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    setErrorMsg(undefined);
    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setLoading(false);
  };

  const showCheckpoints = async () => {
    const checkpointsResult: {
      data: { checkpoints: Checkpoint[] };
    } = await axios.get('http://192.168.0.107:3333/checkpoints');
    checkpointsResult.data.checkpoints.forEach((singleCheckpoint) => {
      setCheckpoints((oldData) => [...oldData, singleCheckpoint]);
    });
  };

  const getDistanceBetweenCheckpointAndCurrentLocation = async (id: number) => {
    setActiveCheckpoint({
      id,
      active: true,
    })
    const distanceResult: {
      data: { userDistance: string };
    } = await axios.post(
      'http://192.168.0.107:3333/user-distances/calculate-distance',
      {
        checkpointId: id,
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
    );
    setDistance(parseInt(distanceResult.data.userDistance));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Button title="Check your location" onPress={handleLocationAccess} />
        {loading && <ActivityIndicator size="large" color="#f39fff" />}
        {(errorMsg != undefined && <Text>{errorMsg}</Text>) ||
          (!loading && location?.latitude && (
            <View style={styles.section}>
              <Text style={styles.text}>Latitude: {location?.latitude}</Text>
              <Text style={styles.text}>Longitude: {location?.longitude}</Text>
            </View>
          ))}
      </View>
      { location?.longitude && (
          <View style={[styles.section, {marginTop: 30 }]}>
            <Button title="Show checkpoints" onPress={showCheckpoints} />
          </View>
      )}
      <View style={styles.checkpointsContainer}>
        {allCheckpoints.map(({ id, latitude, longitude }, key) => (
          <CheckpointCard
            key={key}
            onPress={() => getDistanceBetweenCheckpointAndCurrentLocation(id)}
            id={id}
            latitude={latitude}
            longitude={longitude}
            active={activeCheckpoint.active && activeCheckpoint.id === key + 1}
          />
        ))}
      </View>
      {distance && (
          <View style={[styles.section, {marginTop: 50}]}>
            {distance && (
                <Text style={styles.result}>
                  Distance: {(Math.round(distance * 100) / 100).toFixed(2)} km
                </Text>
            )}
          </View>
      )}
      <StatusBar />
    </ScrollView>
  );
}

const stylesByPlatform = Platform.select({
  ios: { fontFamily: 'Roboto' },
  android: { },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    backgroundColor: '#1e041b',
  },
  button: {
    borderRadius: 10,
    height: 40,
    width: 250,
  },
  section: {
    marginTop: 10,
    padding: 20,
    textAlign: 'left',
    borderWidth: 1,
    borderColor: '#f39fff',
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
  },
  checkpointsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  result: {
    textAlign: 'center',
    fontSize: 30,
    color: '#f39fff',
    ...stylesByPlatform,
    fontWeight: 'normal',
  },
});

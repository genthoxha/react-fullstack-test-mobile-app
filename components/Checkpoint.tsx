import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';

export interface Checkpoint {
  id: number;
  latitude: string;
  longitude: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  onPress?: any;
}

export const CheckpointCard: React.FC<
  Checkpoint & { children?: ReactNode }
> = ({ id, latitude, longitude, active, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        active
          ? [styles.container, { backgroundColor: '#3a1b37' }]
          : styles.container
      }
    >
      <Text style={styles.checkpointId}>Checkpoint: {id}</Text>
      <Text style={styles.text}>Lat: {latitude}</Text>
      <Text style={styles.text}>Lng: {longitude}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    fontSize: 18,
    borderRadius: 10,
    color: '#8e818d',
    borderLeftWidth: 1,
    padding: 10,
  },
  checkpointId: {
    color: '#f39fff',
  },
  text: {
    color: '#8e818d',
    fontSize: 12,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface Props {
  text: string;
  title: string;
}

export default function AudioPlayer({ text, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (playing) {
      Speech.stop();
      setPlaying(false);
    } else {
      setLoading(true);
      try {
        Speech.speak(text, {
          language: 'de-DE',
          rate: 0.9,
          pitch: 1.0,
          onStart: () => {
            setLoading(false);
            setPlaying(true);
          },
          onDone: () => setPlaying(false),
          onStopped: () => setPlaying(false),
          onError: () => {
            setLoading(false);
            setPlaying(false);
          },
        });
      } catch {
        setLoading(false);
        setPlaying(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.button} onPress={handleToggle} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name={playing ? 'stop-circle' : 'play-circle'} size={32} color="#fff" />
        )}
        <Text style={styles.buttonText}>{playing ? 'Stopp' : 'Abspielen'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90d9',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'flex-start',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

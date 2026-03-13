import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  progress: number; // 0 to 1
  label?: string;
  color?: string;
}

export default function ProgressBar({ progress, label, color = '#4a90d9' }: Props) {
  const pct = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.percent}>{Math.round(pct * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  track: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  percent: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 2,
  },
});

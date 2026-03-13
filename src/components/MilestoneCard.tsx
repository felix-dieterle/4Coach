import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Milestone } from '../types';

interface Props {
  milestone: Milestone;
}

export default function MilestoneCard({ milestone }: Props) {
  return (
    <View style={[styles.card, milestone.isAchieved && styles.achieved]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={milestone.isAchieved ? 'trophy' : 'trophy-outline'}
          size={24}
          color={milestone.isAchieved ? '#f5a623' : '#999'}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !milestone.isAchieved && styles.pending]}>
          {milestone.title}
        </Text>
        <Text style={styles.description}>{milestone.description}</Text>
        {milestone.achievedAt && (
          <Text style={styles.date}>
            Erreicht: {new Date(milestone.achievedAt).toLocaleDateString('de-DE')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  achieved: {
    opacity: 1,
    borderColor: '#f5a623',
    backgroundColor: '#fffdf0',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  pending: {
    color: '#999',
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#4a90d9',
    marginTop: 4,
  },
});

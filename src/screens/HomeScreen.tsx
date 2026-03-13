import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { state } = useAppContext();
  const { userGoal, sessions, isLoading } = state;

  const completedSessions = sessions.filter((s) => s.completed);
  const pendingHomework = sessions
    .filter((s) => s.completed && !s.homework.completed)
    .slice(0, 3);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90d9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Willkommen zurück!</Text>
        <Text style={styles.subtitle}>Ihr persönlicher Coaching-Assistent</Text>
      </View>

      {/* Goal Card */}
      {userGoal ? (
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Ionicons name="flag" size={20} color="#4a90d9" />
            <Text style={styles.goalLabel}>Ihr Ziel</Text>
          </View>
          <Text style={styles.goalTitle}>{userGoal.title}</Text>
          <Text style={styles.goalDesc}>{userGoal.description}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.noGoalCard}
          onPress={() => navigation.navigate('Einstellungen')}
        >
          <Ionicons name="add-circle-outline" size={32} color="#4a90d9" />
          <Text style={styles.noGoalText}>Ziel festlegen</Text>
          <Text style={styles.noGoalSub}>Tippen Sie hier, um Ihr Coaching-Ziel einzustellen</Text>
        </TouchableOpacity>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedSessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingHomework.length}</Text>
          <Text style={styles.statLabel}>Offene HAs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{state.milestones.filter((m) => m.isAchieved).length}</Text>
          <Text style={styles.statLabel}>Meilensteine</Text>
        </View>
      </View>

      {/* Start Session Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Session')}
      >
        <Ionicons name="play-circle" size={24} color="#fff" />
        <Text style={styles.startButtonText}>Session starten</Text>
      </TouchableOpacity>

      {/* Pending Homework */}
      {pendingHomework.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offene Hausaufgaben</Text>
          {pendingHomework.map((s) => (
            <View key={s.id} style={styles.hwItem}>
              <Ionicons name="book-outline" size={18} color="#e07b39" />
              <Text style={styles.hwText} numberOfLines={2}>
                {s.homework.description}
              </Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate('Hausaufgaben')}>
            <Text style={styles.moreLink}>Alle anzeigen →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20 },
  greeting: { fontSize: 26, fontWeight: '800', color: '#1e3a5f' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90d9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  goalLabel: { fontSize: 12, color: '#4a90d9', fontWeight: '700', textTransform: 'uppercase' },
  goalTitle: { fontSize: 17, fontWeight: '700', color: '#1e3a5f', marginBottom: 4 },
  goalDesc: { fontSize: 14, color: '#555', lineHeight: 20 },
  noGoalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a90d9',
    borderStyle: 'dashed',
  },
  noGoalText: { fontSize: 16, fontWeight: '700', color: '#1e3a5f', marginTop: 8 },
  noGoalSub: { fontSize: 13, color: '#888', marginTop: 4, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#1e3a5f' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  startButton: {
    backgroundColor: '#1e3a5f',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#1e3a5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  section: { marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a5f', marginBottom: 10 },
  hwItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  hwText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
  moreLink: { fontSize: 13, color: '#4a90d9', fontWeight: '600', marginTop: 4 },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import MilestoneCard from '../components/MilestoneCard';
import ProgressBar from '../components/ProgressBar';

export default function ProgressScreen() {
  const { state } = useAppContext();
  const { sessions, milestones } = state;

  const completedSessions = sessions.filter((s) => s.completed);
  const completedHomework = sessions.filter((s) => s.homework.completed).length;
  const totalHomework = sessions.filter((s) => s.completed).length;
  const hwProgress = totalHomework > 0 ? completedHomework / totalHomework : 0;

  // Calculate learning streak (consecutive days with sessions)
  const streakDays = (() => {
    if (completedSessions.length === 0) return 0;
    const sorted = [...completedSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const diff =
        (new Date(sorted[i].date).getTime() - new Date(sorted[i + 1].date).getTime()) /
        (1000 * 60 * 60 * 24);
      if (diff <= 7) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Fortschritt</Text>

      {/* Stats overview */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-done-circle" size={28} color="#4a90d9" />
          <Text style={styles.statNum}>{completedSessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={28} color="#e07b39" />
          <Text style={styles.statNum}>{streakDays}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="trophy" size={28} color="#f5a623" />
          <Text style={styles.statNum}>{milestones.filter((m) => m.isAchieved).length}</Text>
          <Text style={styles.statLabel}>Erfolge</Text>
        </View>
      </View>

      {/* Progress bars */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fortschrittsübersicht</Text>
        <ProgressBar
          progress={Math.min(completedSessions.length / 10, 1)}
          label="Sessions (Ziel: 10)"
          color="#4a90d9"
        />
        <ProgressBar progress={hwProgress} label="Hausaufgaben abgeschlossen" color="#4caf50" />
        <ProgressBar
          progress={Math.min(milestones.filter((m) => m.isAchieved).length / 5, 1)}
          label="Meilensteine (Ziel: 5)"
          color="#f5a623"
        />
      </View>

      {/* Milestones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meilensteine</Text>
        {milestones.length === 0 ? (
          <View style={styles.emptyMilestones}>
            <Ionicons name="trophy-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              Absolvieren Sie Sessions, um Meilensteine freizuschalten!
            </Text>
          </View>
        ) : (
          milestones.map((m) => <MilestoneCard key={m.id} milestone={m} />)
        )}
      </View>

      {/* Session history */}
      {completedSessions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session-Verlauf</Text>
          {completedSessions
            .slice()
            .reverse()
            .slice(0, 5)
            .map((s, i) => (
              <View key={s.id} style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>
                    {new Date(s.date).toLocaleDateString('de-DE', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                  <Text style={styles.historyTopic}>{s.topic}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={18} color="#4caf50" />
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 24, fontWeight: '800', color: '#1e3a5f', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statNum: { fontSize: 26, fontWeight: '800', color: '#1e3a5f', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a5f', marginBottom: 12 },
  emptyMilestones: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { fontSize: 14, color: '#bbb', textAlign: 'center', marginTop: 8 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4a90d9' },
  historyContent: { flex: 1 },
  historyDate: { fontSize: 12, color: '#888' },
  historyTopic: { fontSize: 14, fontWeight: '600', color: '#333' },
});

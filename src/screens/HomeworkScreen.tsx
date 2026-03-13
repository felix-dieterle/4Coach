import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function HomeworkScreen() {
  const { state, completeHomework } = useAppContext();

  const sessionsWithHw = state.sessions
    .filter((s) => s.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleComplete = (sessionId: string) => {
    Alert.alert(
      'Hausaufgabe abschließen',
      'Haben Sie die Hausaufgabe erledigt?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Ja, abgeschlossen!',
          onPress: () => completeHomework(sessionId),
        },
      ]
    );
  };

  if (sessionsWithHw.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="book-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>Keine Hausaufgaben</Text>
        <Text style={styles.emptyText}>
          Starten Sie eine Session, um Hausaufgaben zu erhalten.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Hausaufgaben</Text>
      {sessionsWithHw.map((session) => {
        const { homework } = session;
        const isOverdue = !homework.completed && new Date(homework.dueDate) < new Date();
        return (
          <View
            key={session.id}
            style={[styles.card, homework.completed && styles.completedCard]}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name={homework.completed ? 'checkmark-circle' : isOverdue ? 'alert-circle' : 'time-outline'}
                size={20}
                color={homework.completed ? '#4caf50' : isOverdue ? '#f44336' : '#e07b39'}
              />
              <Text style={styles.sessionDate}>
                {new Date(session.date).toLocaleDateString('de-DE')}
              </Text>
              <Text style={styles.sessionTopic}>{session.topic}</Text>
            </View>
            <Text style={[styles.hwDescription, homework.completed && styles.completedText]}>
              {homework.description}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.dueDate, isOverdue && !homework.completed && styles.overdueDate]}>
                Fällig: {new Date(homework.dueDate).toLocaleDateString('de-DE')}
              </Text>
              {!homework.completed && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleComplete(session.id)}
                >
                  <Text style={styles.completeButtonText}>Erledigt</Text>
                </TouchableOpacity>
              )}
              {homework.completed && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓ Erledigt</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 24, fontWeight: '800', color: '#1e3a5f', marginBottom: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#999', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#bbb', textAlign: 'center', marginTop: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  completedCard: { opacity: 0.7 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  sessionDate: { fontSize: 12, color: '#888' },
  sessionTopic: { fontSize: 12, color: '#4a90d9', fontWeight: '600', flex: 1, textAlign: 'right' },
  hwDescription: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 12 },
  completedText: { color: '#999', textDecorationLine: 'line-through' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dueDate: { fontSize: 12, color: '#888' },
  overdueDate: { color: '#f44336', fontWeight: '600' },
  completeButton: {
    backgroundColor: '#4a90d9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  completeButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  completedBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  completedBadgeText: { color: '#4caf50', fontSize: 12, fontWeight: '600' },
});

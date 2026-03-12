import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AudioPlayer from '../components/AudioPlayer';
import QuestionCard from '../components/QuestionCard';
import { fetchNewsForTopic } from '../services/newsService';
import {
  generateNewsAudio,
  generateQuestions,
  generateLearningAudio,
  generateHomework,
} from '../services/aiService';
import { Session, Question } from '../types';

type Phase = 'intro' | 'news' | 'questions' | 'learning' | 'done';

export default function SessionScreen() {
  const { state, createSession, updateSession } = useAppContext();
  const [phase, setPhase] = useState<Phase>('intro');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

  const topic = state.userGoal?.title ?? 'Persönlichkeitsentwicklung';

  const startSession = async () => {
    setLoading(true);
    try {
      const previousChallenges = state.sessions
        .slice(-3)
        .map((s) => s.homework.description);

      const [newsAudio, questions, learningAudio, homework] = await Promise.all([
        fetchNewsForTopic(topic).then((items) => generateNewsAudio(topic, items)),
        generateQuestions(topic, previousChallenges),
        generateLearningAudio(
          topic,
          `${state.sessions.length} abgeschlossene Sessions`
        ),
        generateHomework(topic, `Session ${state.sessions.length + 1}`),
      ]);

      const newSession: Session = {
        id: `session-${Date.now()}`,
        date: new Date().toISOString(),
        topic,
        newsAudio,
        learningAudio,
        questions,
        homework,
        completed: false,
      };

      await createSession(newSession);
      setSession(newSession);
      setPhase('news');
    } catch (err) {
      Alert.alert('Fehler', 'Session konnte nicht gestartet werden. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!session) return;
    const q = session.questions[currentQuestionIndex];
    const updated: Question = { ...q, userAnswer: answer };
    const newAnswered = [...answeredQuestions, updated];
    setAnsweredQuestions(newAnswered);

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered - update session and move to learning phase
      const updatedSession: Session = {
        ...session,
        questions: newAnswered,
      };
      setSession(updatedSession);
      updateSession(updatedSession);
      setPhase('learning');
    }
  };

  const completeSession = async () => {
    if (!session) return;
    const completed: Session = { ...session, completed: true };
    setSession(completed);
    await updateSession(completed);
    setPhase('done');
  };

  // Intro phase
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="headset" size={64} color="#4a90d9" />
          <Text style={styles.title}>Neue Session</Text>
          <Text style={styles.topicBadge}>{topic}</Text>
          <Text style={styles.description}>
            Ihre personalisierte Coaching-Session wird vorbereitet. Sie enthält:
          </Text>
          <View style={styles.phaseList}>
            {['📰 News-Update zu Ihrem Thema', '❓ Wissensfragen', '📚 Lerninhalt', '📝 Hausaufgabe'].map((item) => (
              <Text key={item} style={styles.phaseItem}>{item}</Text>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={startSession} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Session starten</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // News phase
  if (phase === 'news' && session?.newsAudio) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.phaseContent}>
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseLabel}>Phase 1 von 3</Text>
          <Text style={styles.phaseTitle}>📰 News-Update</Text>
        </View>
        <AudioPlayer text={session.newsAudio.text} title={session.newsAudio.title} />
        <View style={styles.textCard}>
          <Text style={styles.contentText}>{session.newsAudio.text}</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setPhase('questions')}>
          <Text style={styles.primaryButtonText}>Weiter zu den Fragen</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Questions phase
  if (phase === 'questions' && session) {
    const q = session.questions[currentQuestionIndex];
    const isAnswered = answeredQuestions.some((a) => a.id === q.id);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.phaseContent}>
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseLabel}>Phase 2 von 3</Text>
          <Text style={styles.phaseTitle}>❓ Frage {currentQuestionIndex + 1} / {session.questions.length}</Text>
        </View>
        <QuestionCard
          question={isAnswered ? { ...q, userAnswer: answeredQuestions.find((a) => a.id === q.id)?.userAnswer } : q}
          onAnswer={handleAnswer}
          showResult={isAnswered}
        />
      </ScrollView>
    );
  }

  // Learning phase
  if (phase === 'learning' && session?.learningAudio) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.phaseContent}>
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseLabel}>Phase 3 von 3</Text>
          <Text style={styles.phaseTitle}>📚 Lern-Audio</Text>
        </View>
        <AudioPlayer text={session.learningAudio.text} title={session.learningAudio.title} />
        <View style={styles.textCard}>
          <Text style={styles.contentText}>{session.learningAudio.text}</Text>
        </View>
        <View style={styles.hwPreview}>
          <Text style={styles.hwPreviewLabel}>📝 Ihre Hausaufgabe:</Text>
          <Text style={styles.hwPreviewText}>{session.homework.description}</Text>
          <Text style={styles.hwDue}>
            Fällig: {new Date(session.homework.dueDate).toLocaleDateString('de-DE')}
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={completeSession}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Session abschließen</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Done phase
  if (phase === 'done') {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="checkmark-circle" size={80} color="#4caf50" />
          <Text style={styles.title}>Gut gemacht!</Text>
          <Text style={styles.description}>
            Sie haben Ihre Session erfolgreich abgeschlossen. Vergessen Sie nicht, Ihre Hausaufgabe zu erledigen!
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setPhase('intro')}>
            <Text style={styles.primaryButtonText}>Neue Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#4a90d9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e3a5f', marginTop: 16, textAlign: 'center' },
  topicBadge: {
    backgroundColor: '#4a90d9',
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 8,
  },
  description: { fontSize: 15, color: '#555', textAlign: 'center', marginVertical: 12, lineHeight: 22 },
  phaseList: { alignSelf: 'stretch', marginBottom: 24 },
  phaseItem: { fontSize: 15, color: '#333', paddingVertical: 4, paddingHorizontal: 8 },
  primaryButton: {
    backgroundColor: '#1e3a5f',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    marginTop: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  phaseContent: { padding: 16, paddingBottom: 32 },
  phaseHeader: { marginBottom: 16 },
  phaseLabel: { fontSize: 12, color: '#4a90d9', fontWeight: '700', textTransform: 'uppercase' },
  phaseTitle: { fontSize: 22, fontWeight: '800', color: '#1e3a5f', marginTop: 4 },
  textCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contentText: { fontSize: 15, color: '#333', lineHeight: 24 },
  hwPreview: {
    backgroundColor: '#fff8e8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f5a623',
  },
  hwPreviewLabel: { fontSize: 13, fontWeight: '700', color: '#e07b39', marginBottom: 6 },
  hwPreviewText: { fontSize: 14, color: '#333', lineHeight: 20 },
  hwDue: { fontSize: 12, color: '#888', marginTop: 8 },
});

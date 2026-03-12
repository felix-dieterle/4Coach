import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../types';

interface Props {
  question: Question;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
}

export default function QuestionCard({ question, onAnswer, showResult }: Props) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim());
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question.text}</Text>
      {!showResult ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ihre Antwort..."
            placeholderTextColor="#999"
            value={answer}
            onChangeText={setAnswer}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, !answer.trim() && styles.disabled]}
            onPress={handleSubmit}
            disabled={!answer.trim()}
          >
            <Text style={styles.buttonText}>Antworten</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.userAnswerLabel}>Ihre Antwort:</Text>
          <Text style={styles.userAnswer}>{question.userAnswer}</Text>
          {question.answer && (
            <>
              <Text style={styles.sampleAnswerLabel}>Beispiel-Antwort:</Text>
              <Text style={styles.sampleAnswer}>{question.answer}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: 12,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4a90d9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 8,
  },
  userAnswerLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  userAnswer: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 6,
  },
  sampleAnswerLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  sampleAnswer: {
    fontSize: 14,
    color: '#2d6a2d',
    backgroundColor: '#f0fff0',
    padding: 8,
    borderRadius: 6,
  },
});

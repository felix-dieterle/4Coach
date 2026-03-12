import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { UserGoal } from '../types';
import { requestPermissions, scheduleWeeklySession, cancelAll } from '../services/notificationService';
import Constants from 'expo-constants';

const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export default function SettingsScreen() {
  const { state, setUserGoal } = useAppContext();
  const [title, setTitle] = useState(state.userGoal?.title ?? '');
  const [description, setDescription] = useState(state.userGoal?.description ?? '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1); // Monday
  const [selectedHour, setSelectedHour] = useState(9);
  const [saving, setSaving] = useState(false);

  const handleSaveGoal = async () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Titel für Ihr Ziel ein.');
      return;
    }
    setSaving(true);
    try {
      const goal: UserGoal = {
        id: state.userGoal?.id ?? `goal-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        createdAt: state.userGoal?.createdAt ?? new Date().toISOString(),
      };
      await setUserGoal(goal);
      Alert.alert('Gespeichert', 'Ihr Coaching-Ziel wurde erfolgreich gespeichert.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Berechtigung verweigert',
          'Bitte aktivieren Sie Benachrichtigungen in den App-Einstellungen.'
        );
        return;
      }
      await scheduleWeeklySession(selectedDay, selectedHour);
    } else {
      await cancelAll();
    }
    setNotificationsEnabled(enabled);
  };

  const handleDayChange = async (day: number) => {
    setSelectedDay(day);
    if (notificationsEnabled) {
      await scheduleWeeklySession(day, selectedHour);
    }
  };

  const handleHourChange = async (hour: number) => {
    setSelectedHour(hour);
    if (notificationsEnabled) {
      await scheduleWeeklySession(selectedDay, hour);
    }
  };

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Einstellungen</Text>

      {/* Goal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="flag" size={16} color="#1e3a5f" /> Coaching-Ziel
        </Text>
        <Text style={styles.fieldLabel}>Thema / Titel</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="z.B. Führungskompetenz, Zeitmanagement..."
          placeholderTextColor="#aaa"
        />
        <Text style={styles.fieldLabel}>Beschreibung</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Beschreiben Sie Ihr Ziel genauer..."
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSaveGoal}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Wird gespeichert...' : 'Ziel speichern'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="notifications" size={16} color="#1e3a5f" /> Erinnerungen
        </Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Wöchentliche Session-Erinnerung</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#ccc', true: '#4a90d9' }}
            thumbColor="#fff"
          />
        </View>
        {notificationsEnabled && (
          <>
            <Text style={styles.fieldLabel}>Wochentag</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dayPicker}>
                {DAYS.map((day, i) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayButton, selectedDay === i && styles.selectedDay]}
                    onPress={() => handleDayChange(i)}
                  >
                    <Text style={[styles.dayText, selectedDay === i && styles.selectedDayText]}>
                      {day.substring(0, 2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.fieldLabel}>Uhrzeit: {selectedHour}:00 Uhr</Text>
            <View style={styles.hourPicker}>
              {[7, 8, 9, 10, 12, 17, 18, 19, 20].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.hourButton, selectedHour === h && styles.selectedHour]}
                  onPress={() => handleHourChange(h)}
                >
                  <Text style={[styles.hourText, selectedHour === h && styles.selectedHourText]}>
                    {h}:00
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {/* API Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="key" size={16} color="#1e3a5f" /> API-Konfiguration
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Einrichtung der API-Schlüssel</Text>
          <Text style={styles.infoText}>
            Erstellen Sie eine <Text style={styles.code}>.env</Text> Datei im Projektverzeichnis:
          </Text>
          <Text style={styles.codeBlock}>
            {'EXPO_PUBLIC_OPENAI_API_KEY=sk-...\nEXPO_PUBLIC_NEWS_API_KEY=...'}
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.link}>openai.com</Text> für den OpenAI-Schlüssel{'\n'}
            • <Text style={styles.link}>newsapi.org</Text> für den News-Schlüssel{'\n'}
            {'  '}(kostenlos bis 100 Anfragen/Tag)
          </Text>
          <Text style={styles.infoNote}>
            Ohne API-Schlüssel werden Beispieldaten verwendet.
          </Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="information-circle" size={16} color="#1e3a5f" /> App-Info
        </Text>
        <Text style={styles.appInfo}>4Coach v{appVersion}</Text>
        <Text style={styles.appInfoSub}>Personalisierter Audio-Coaching-Assistent</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: '800', color: '#1e3a5f', marginBottom: 16 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e3a5f', marginBottom: 14 },
  fieldLabel: { fontSize: 13, color: '#666', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#1e3a5f',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: { backgroundColor: '#aaa' },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { fontSize: 14, color: '#333', flex: 1 },
  dayPicker: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDay: { backgroundColor: '#4a90d9', borderColor: '#4a90d9' },
  dayText: { fontSize: 12, color: '#555' },
  selectedDayText: { color: '#fff', fontWeight: '700' },
  hourPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  hourButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedHour: { backgroundColor: '#4a90d9', borderColor: '#4a90d9' },
  hourText: { fontSize: 13, color: '#555' },
  selectedHourText: { color: '#fff', fontWeight: '700' },
  infoBox: { backgroundColor: '#f0f4ff', borderRadius: 10, padding: 14 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1e3a5f', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 8 },
  code: { fontFamily: 'monospace', backgroundColor: '#dde4f0', color: '#1e3a5f' },
  codeBlock: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#1e3a5f',
    color: '#8fb3e8',
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
  },
  link: { color: '#4a90d9', fontWeight: '600' },
  infoNote: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 4 },
  appInfo: { fontSize: 15, fontWeight: '700', color: '#333' },
  appInfoSub: { fontSize: 13, color: '#888', marginTop: 4 },
});

# 4Coach
KI-basiertes Coaching-Audio-Tool

## Übersicht

**4Coach** ist eine personalisierte Audio-Coaching-App für Android, die wöchentliche Coaching-Sessions mit KI-generierten Inhalten anbietet.

### Kernfunktionen

- 📰 **News-Update**: KI-gestützte Zusammenfassung aktueller Nachrichten zum gewählten Thema
- ❓ **Fragen-Session**: Automatisierte Wissensfragen basierend auf Ihrem Fortschritt
- 📚 **Lern-Audio**: KI-generierte Lerninhalte, angepasst an Ihren Fortschritt
- 📝 **Hausaufgabe**: Individuelle wöchentliche Aufgaben nach jeder Session
- 🔔 **Erinnerungen**: Automatische Push-Benachrichtigungen für Sessions und Aufgaben
- 📊 **Fortschrittsübersicht**: Visualisierung Ihrer Meilensteine und Lernhistorie

## Technologie

- **React Native** (Expo) mit TypeScript
- **OpenAI GPT-4o-mini** für KI-generierte Inhalte
- **News API** für aktuelle Nachrichten
- **expo-speech** für Text-zu-Sprache
- **expo-notifications** für Push-Benachrichtigungen
- **AsyncStorage** für lokale Datenpersistenz

## Einrichtung

### Voraussetzungen

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go App auf Android-Gerät oder Emulator

### Installation

```bash
# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env bearbeiten und API-Schlüssel eintragen
```

### API-Schlüssel

Tragen Sie Ihre API-Schlüssel in der `.env` Datei ein:

```env
# OpenAI API Key - https://platform.openai.com/api-keys
EXPO_PUBLIC_OPENAI_API_KEY=sk-...

# News API Key - https://newsapi.org (kostenlos bis 100 Anfragen/Tag)
EXPO_PUBLIC_NEWS_API_KEY=...
```

> **Hinweis:** Die App funktioniert auch ohne API-Schlüssel mit Beispieldaten.

### Starten

```bash
# Entwicklungsserver starten
npx expo start

# Direkt auf Android starten
npx expo start --android
```

## Projektstruktur

```
src/
├── navigation/        # React Navigation (Bottom Tabs)
├── screens/           # App-Screens (Home, Session, Hausaufgaben, Fortschritt, Einstellungen)
├── components/        # Wiederverwendbare Komponenten (AudioPlayer, QuestionCard, ...)
├── services/          # API-Services (KI, News, Audio, Benachrichtigungen, Storage)
├── context/           # Globales State Management (AppContext)
└── types/             # TypeScript-Typdefinitionen
```


import { AudioContent, Question, Homework } from '../types';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const API_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('NO_API_KEY');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

// Generates a coaching-style news summary audio content
export async function generateNewsAudio(
  topic: string,
  newsItems: string[]
): Promise<AudioContent> {
  try {
    const newsList = newsItems.slice(0, 5).join('\n- ');
    const prompt = `Du bist ein professioneller Coach. Fasse die folgenden Neuigkeiten zum Thema "${topic}" in einem motivierenden, coaching-orientierten Audio-Skript auf Deutsch zusammen (max. 150 Wörter). Sei präzise und inspirierend.\n\nNeuigkeiten:\n- ${newsList}`;
    const text = await callOpenAI(prompt);
    return {
      id: `news-${Date.now()}`,
      title: `News-Update: ${topic}`,
      text: text.trim(),
    };
  } catch {
    // Fallback mock content when API key is missing or request fails
    return {
      id: `news-${Date.now()}`,
      title: `News-Update: ${topic}`,
      text: `Willkommen zu Ihrem persönlichen News-Update über ${topic}. Heute gibt es spannende Entwicklungen in diesem Bereich. Als Coach empfehle ich Ihnen, diese Trends aufmerksam zu verfolgen und aktiv in Ihre Lernstrategie zu integrieren. Bleiben Sie neugierig und offen für neue Erkenntnisse!`,
    };
  }
}

// Generates knowledge-check questions based on the topic and past challenges
export async function generateQuestions(
  topic: string,
  previousChallenges: string[]
): Promise<Question[]> {
  try {
    const challenges = previousChallenges.length > 0
      ? previousChallenges.join(', ')
      : 'keine bisherigen Herausforderungen';
    const prompt = `Erstelle 3 Wissensfragen auf Deutsch zum Thema "${topic}" für einen Coaching-Klienten. Bisherige Herausforderungen: ${challenges}. Gib die Antworten als JSON-Array zurück mit dem Format: [{"text": "Frage", "answer": "Antwort"}]. Nur das JSON-Array, kein weiterer Text.`;
    const raw = await callOpenAI(prompt);
    const parsed = JSON.parse(raw) as Array<{ text: string; answer: string }>;
    return parsed.map((q, i) => ({
      id: `q-${Date.now()}-${i}`,
      text: q.text,
      answer: q.answer,
    }));
  } catch {
    // Fallback mock questions
    return [
      {
        id: `q-${Date.now()}-0`,
        text: `Was ist Ihr wichtigstes Lernziel im Bereich ${topic}?`,
        answer: 'Kontinuierliches Lernen und Verbesserung der Fähigkeiten.',
      },
      {
        id: `q-${Date.now()}-1`,
        text: `Welche Strategie hilft Ihnen am meisten beim Thema ${topic}?`,
        answer: 'Regelmäßige Praxis und Reflexion.',
      },
      {
        id: `q-${Date.now()}-2`,
        text: `Wie messen Sie Ihren Fortschritt bei ${topic}?`,
        answer: 'Durch messbare Ziele und regelmäßige Selbsteinschätzung.',
      },
    ];
  }
}

// Generates personalized learning audio content based on progress
export async function generateLearningAudio(
  topic: string,
  userProgress: string
): Promise<AudioContent> {
  try {
    const prompt = `Du bist ein persönlicher Coach. Erstelle einen motivierenden Lerninhalt auf Deutsch zum Thema "${topic}" (max. 200 Wörter). Fortschritt des Nutzers: ${userProgress}. Passe den Inhalt an den aktuellen Fortschritt an und gib konkrete Tipps.`;
    const text = await callOpenAI(prompt);
    return {
      id: `learn-${Date.now()}`,
      title: `Lern-Audio: ${topic}`,
      text: text.trim(),
    };
  } catch {
    // Fallback mock learning content
    return {
      id: `learn-${Date.now()}`,
      title: `Lern-Audio: ${topic}`,
      text: `Herzlich willkommen zu Ihrer Lerneinheit über ${topic}. Basierend auf Ihrem bisherigen Fortschritt haben Sie bereits wichtige Grundlagen aufgebaut. In dieser Einheit konzentrieren wir uns auf die Vertiefung Ihres Wissens. Denken Sie daran: Wachstum entsteht außerhalb der Komfortzone. Setzen Sie sich kleine, erreichbare Ziele und feiern Sie jeden Fortschritt. Ihr Engagement und Ihre Ausdauer sind Ihre größten Stärken!`,
    };
  }
}

// Generates an individual homework task based on the session
export async function generateHomework(
  topic: string,
  sessionSummary: string
): Promise<Homework> {
  try {
    const prompt = `Als Coach: Erstelle eine konkrete Hausaufgabe auf Deutsch für einen Klienten zum Thema "${topic}". Session-Zusammenfassung: ${sessionSummary}. Gib nur eine kurze, umsetzbare Aufgabe (1-2 Sätze) zurück, die innerhalb einer Woche erledigt werden kann.`;
    const description = await callOpenAI(prompt);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return {
      id: `hw-${Date.now()}`,
      description: description.trim(),
      completed: false,
      dueDate: dueDate.toISOString(),
    };
  } catch {
    // Fallback mock homework
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return {
      id: `hw-${Date.now()}`,
      description: `Verbringen Sie täglich 15 Minuten damit, das Gelernte über ${topic} zu reflektieren und notieren Sie drei neue Erkenntnisse.`,
      completed: false,
      dueDate: dueDate.toISOString(),
    };
  }
}

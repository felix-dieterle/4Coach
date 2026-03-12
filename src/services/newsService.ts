const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY ?? '';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// Mock news data used as fallback when no API key is configured
const MOCK_NEWS: Record<string, string[]> = {
  default: [
    'Neue Studien zeigen: Regelmäßiges Lernen verbessert die kognitive Leistungsfähigkeit erheblich.',
    'Experten empfehlen: Mikro-Lerneinheiten von 15-20 Minuten sind besonders effektiv.',
    'Forschung bestätigt: Coaching steigert die Produktivität um bis zu 70 Prozent.',
    'Trend: Personalisierte Lernpfade werden immer beliebter in der Weiterbildung.',
    'Studie: Menschen mit klaren Zielen erreichen 43% häufiger ihre Vorsätze.',
  ],
};

export async function fetchNewsForTopic(topic: string): Promise<string[]> {
  if (!NEWS_API_KEY) {
    // Return mock news when no API key is set
    return MOCK_NEWS.default.map((item) => `[${topic}] ${item}`);
  }

  try {
    const url = `${NEWS_API_URL}?q=${encodeURIComponent(topic)}&language=de&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    const articles = data.articles as Array<{ title: string; description?: string }>;
    return articles.map(
      (a) => `${a.title}${a.description ? ` - ${a.description}` : ''}`
    );
  } catch {
    return MOCK_NEWS.default.map((item) => `[${topic}] ${item}`);
  }
}

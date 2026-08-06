import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { offlineAnalyzeSentence, DICTIONARY_DATABASE } from './src/lib/pitchAnalyzer';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily/safely if GEMINI_API_KEY is available
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==================== API ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', aiEnabled: !!process.env.GEMINI_API_KEY });
});

// Analyze Japanese Pitch Accent Endpoint
app.post('/api/analyze', async (req, res) => {
  const { text, breakOnSpaces } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    res.status(400).json({ error: 'Japanese text is required.' });
    return;
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are an expert Japanese linguist and phonetics system specializing in Standard Tokyo Pitch Accent (東京方言アクセント).
Analyze the following Japanese text sentence or words: "${text.trim()}".
Break down the text into words/morae tokens with high accuracy, indicating Tokyo pitch accent rules (Heiban [0], Atamadaka [1], Nakadaka [N], Odaka [N], Particle, or Punctuation).

For each mora, assign its pitch pattern:
- "low": Pitch is low
- "high": Pitch is high
- "drop": Pitch is high AND drops immediately after this mora (the accent nucleus / アクセント核)

Also provide:
1. Katakana/Hiragana reading for each word.
2. Hepburn Romaji for each word.
3. Natural English sentence translation.
4. Accent position number (0 for Heiban, 1 for Atamadaka, or index N for Nakadaka/Odaka drop point).

Return JSON matching the schema precisely.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translation: {
                type: Type.STRING,
                description: 'Natural English translation of the sentence',
              },
              romaji: {
                type: Type.STRING,
                description: 'Full sentence romaji',
              },
              reading: {
                type: Type.STRING,
                description: 'Full sentence katakana/hiragana reading',
              },
              tokens: {
                type: Type.ARRAY,
                description: 'Array of word tokens or punctuation in sequence',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    surface: {
                      type: Type.STRING,
                      description: 'Original surface representation (kanji or kana)',
                    },
                    reading: {
                      type: Type.STRING,
                      description: 'Katakana/Hiragana reading for this token',
                    },
                    romaji: {
                      type: Type.STRING,
                      description: 'Romaji for this token',
                    },
                    accentType: {
                      type: Type.STRING,
                      description: 'Accent category: Heiban, Atamadaka, Nakadaka, Odaka, Particle, or Punctuation',
                    },
                    accentPosition: {
                      type: Type.INTEGER,
                      description: 'Accent position (0=Heiban, 1=Atamadaka, N=mora index of drop point)',
                    },
                    isPunctuation: {
                      type: Type.BOOLEAN,
                      description: 'True if token is punctuation like 、？！。',
                    },
                    morae: {
                      type: Type.ARRAY,
                      description: 'Mora level pitch breakdown for this token',
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          mora: {
                            type: Type.STRING,
                            description: 'Single mora character or kanji character represented',
                          },
                          pitch: {
                            type: Type.STRING,
                            description: 'Pitch state: "high", "low", or "drop"',
                          },
                        },
                        required: ['mora', 'pitch'],
                      },
                    },
                  },
                  required: ['surface', 'reading', 'romaji', 'accentType', 'accentPosition', 'morae'],
                },
              },
            },
            required: ['translation', 'romaji', 'reading', 'tokens'],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.json({
          originalText: text,
          tokens: parsed.tokens,
          translation: parsed.translation,
          romaji: parsed.romaji,
          reading: parsed.reading,
          aiPowered: true,
        });
        return;
      }
    } catch (err) {
      console.error('Gemini API pitch analysis failed, falling back to local engine:', err);
    }
  }

  // Offline / Fallback execution
  const fallback = offlineAnalyzeSentence(text, breakOnSpaces);
  res.json({
    originalText: text,
    tokens: fallback.tokens,
    translation: fallback.translation,
    romaji: fallback.tokens.map(t => t.romaji).join(' '),
    reading: fallback.tokens.map(t => t.reading).join(''),
    aiPowered: false,
  });
});

// Dictionary Search API Endpoint
app.get('/api/dictionary/search', async (req, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();

  if (!query) {
    res.json({ results: DICTIONARY_DATABASE });
    return;
  }

  const localFiltered = DICTIONARY_DATABASE.filter(
    item =>
      item.word.toLowerCase().includes(query) ||
      item.reading.toLowerCase().includes(query) ||
      item.romaji.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query)
  );

  res.json({ results: localFiltered });
});

// ==================== SERVER / VITE STARTUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kotonoha Pitch Accent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

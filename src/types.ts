export type PitchType = 'high' | 'low' | 'drop';

export type AccentCategory = 'Heiban' | 'Atamadaka' | 'Nakadaka' | 'Odaka' | 'Punctuation' | 'Particle';

export interface Mora {
  mora: string;
  pitch: PitchType;
}

export interface Token {
  surface: string;
  reading: string;
  romaji: string;
  accentType: AccentCategory;
  accentPosition: number; // 0 = Heiban, 1 = Atamadaka, >1 = Nakadaka or Odaka
  morae: Mora[];
  isPunctuation?: boolean;
  explanation?: string;
}

export interface AnalysisResult {
  originalText: string;
  tokens: Token[];
  translation: string;
  romaji: string;
  reading: string;
  aiPowered?: boolean;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  pos: string;
  accentType: AccentCategory;
  accentPosition: number;
  morae: Mora[];
  exampleSentence: string;
  exampleTranslation: string;
  pitchCategoryNote?: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  translation: string;
  timestamp: number;
  result: AnalysisResult;
}

export interface QuizQuestion {
  id: string;
  kanji: string;
  reading: string;
  meaning: string;
  correctType: AccentCategory;
  options: {
    type: AccentCategory;
    morae: Mora[];
    label: string;
  }[];
  explanation: string;
}

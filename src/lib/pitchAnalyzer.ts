import { Token, Mora, PitchType, AccentCategory, DictionaryEntry } from '../types';

/**
 * Splits hiragana/katakana reading into Japanese morae (e.g., "きょう" -> ["きょ", "う"])
 */
export function splitToMorae(reading: string): string[] {
  const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ']);
  const result: string[] = [];
  let i = 0;

  while (i < reading.length) {
    let char = reading[i];
    if (i + 1 < reading.length && smallKana.has(reading[i + 1])) {
      char += reading[i + 1];
      i += 2;
    } else {
      i += 1;
    }
    result.push(char);
  }

  return result;
}

/**
 * Calculates mora pitches based on Tokyo Pitch Accent rules given accentPosition (0 = Heiban, 1 = Atamadaka, N = Nakadaka/Odaka)
 */
export function calculateMoraPitches(moraeStrings: string[], accentPosition: number): Mora[] {
  const total = moraeStrings.length;
  if (total === 0) return [];

  // Single mora words special case
  if (total === 1) {
    if (accentPosition === 1) {
      return [{ mora: moraeStrings[0], pitch: 'drop' }];
    } else {
      return [{ mora: moraeStrings[0], pitch: 'low' }];
    }
  }

  return moraeStrings.map((moraStr, index) => {
    const pos = index + 1; // 1-indexed position

    if (accentPosition === 0) {
      // Heiban (平板) [0]: 1st is low, 2nd and rest are high (no drop)
      const pitch: PitchType = pos === 1 ? 'low' : 'high';
      return { mora: moraStr, pitch };
    } else if (accentPosition === 1) {
      // Atamadaka (頭高) [1]: 1st is high with drop, rest are low
      const pitch: PitchType = pos === 1 ? 'drop' : 'low';
      return { mora: moraStr, pitch };
    } else {
      // Nakadaka (中高) [N] or Odaka (尾高) [N]
      if (pos === 1) {
        return { mora: moraStr, pitch: 'low' };
      } else if (pos < accentPosition) {
        return { mora: moraStr, pitch: 'high' };
      } else if (pos === accentPosition) {
        return { mora: moraStr, pitch: 'drop' };
      } else {
        return { mora: moraStr, pitch: 'low' };
      }
    }
  });
}

/**
 * Determines accent category name based on accent position and mora count
 */
export function getAccentCategory(accentPosition: number, totalMorae: number): AccentCategory {
  if (accentPosition === 0) return 'Heiban';
  if (accentPosition === 1) return 'Atamadaka';
  if (accentPosition === totalMorae) return 'Odaka';
  return 'Nakadaka';
}

/**
 * Converts Kana string to Hepburn Romaji
 */
export function kanaToRomaji(kana: string): string {
  const map: Record<string, string> = {
    'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
    'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
    'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
    'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
    'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
    'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
    'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
    'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
    'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
    'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
    'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
    'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
    'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
    'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
    'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
    'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyō',
    'シャ': 'sha', 'シュ': 'shu', 'ショ': 'shō',
    'チャ': 'cha', 'チュ': 'chu', 'チョ': 'chō',
    'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyō',
    'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyō',
    'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myō',
    'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryō',
    'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyō',
    'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jō',
    'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byō',
    'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyō',
    'ー': 'ー',
    // Hiragana
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'o', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyō',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'shō',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'chō',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyō',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyō',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myō',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryō',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyō',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jō',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byō',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyō',
  };

  const morae = splitToMorae(kana);
  let result = '';
  for (let i = 0; i < morae.length; i++) {
    const m = morae[i];
    if (m === 'っ' || m === 'ッ') {
      const nextM = morae[i + 1] ? map[morae[i + 1]] || 't' : 't';
      result += nextM[0];
    } else {
      result += map[m] || m;
    }
  }
  return result;
}

/**
 * Built-in dictionary database of Japanese pitch accents (Tokyo dialect standard)
 */
export const DICTIONARY_DATABASE: DictionaryEntry[] = [
  {
    id: '1',
    word: '今日',
    reading: 'キョー',
    romaji: 'kyō',
    meaning: 'Today',
    pos: 'Noun / Adverb',
    accentType: 'Atamadaka',
    accentPosition: 1,
    morae: [
      { mora: '今', pitch: 'drop' },
      { mora: '日', pitch: 'low' }
    ],
    exampleSentence: '今日はいい天気です。',
    exampleTranslation: 'Today is nice weather.',
    pitchCategoryNote: 'Atamadaka [1]: Starts high on "kyo" and drops before "u/i".'
  },
  {
    id: '2',
    word: 'どんな',
    reading: 'ドンナ',
    romaji: 'donna',
    meaning: 'What kind of / what sort of',
    pos: 'Pre-noun adjectival',
    accentType: 'Atamadaka',
    accentPosition: 1,
    morae: [
      { mora: 'ど', pitch: 'drop' },
      { mora: 'ん', pitch: 'low' },
      { mora: 'な', pitch: 'low' }
    ],
    exampleSentence: 'どんな本が好きですか？',
    exampleTranslation: 'What kind of books do you like?',
    pitchCategoryNote: 'Atamadaka [1]: Pitch drops immediately after "do".'
  },
  {
    id: '3',
    word: 'こと',
    reading: 'コト',
    romaji: 'koto',
    meaning: 'Thing / matter / affair',
    pos: 'Noun',
    accentType: 'Heiban',
    accentPosition: 0,
    morae: [
      { mora: 'こ', pitch: 'low' },
      { mora: 'と', pitch: 'high' }
    ],
    exampleSentence: '大切なことです。',
    exampleTranslation: 'It is an important thing.',
    pitchCategoryNote: 'Heiban [0]: Pitch stays high when particles follow.'
  },
  {
    id: '4',
    word: '学びたい',
    reading: 'マナビタイ',
    romaji: 'manabitai',
    meaning: 'Want to learn',
    pos: 'Verb (Tai form)',
    accentType: 'Nakadaka',
    accentPosition: 4,
    morae: [
      { mora: '学', pitch: 'low' },
      { mora: 'び', pitch: 'high' },
      { mora: 'た', pitch: 'high' },
      { mora: 'い', pitch: 'drop' }
    ],
    exampleSentence: '日本語を学びたいです。',
    exampleTranslation: 'I want to learn Japanese.',
    pitchCategoryNote: 'Nakadaka [4]: Pitch rises and drops on "ta-i".'
  },
  {
    id: '5',
    word: '雨',
    reading: 'アメ',
    romaji: 'ame',
    meaning: 'Rain',
    pos: 'Noun',
    accentType: 'Atamadaka',
    accentPosition: 1,
    morae: [
      { mora: 'あ', pitch: 'drop' },
      { mora: 'め', pitch: 'low' }
    ],
    exampleSentence: '雨が降っています。',
    exampleTranslation: 'It is raining.',
    pitchCategoryNote: 'Atamadaka [1]: Compare with 飴 (candy) which is Heiban [0].'
  },
  {
    id: '6',
    word: '飴',
    reading: 'アメ',
    romaji: 'ame',
    meaning: 'Candy',
    pos: 'Noun',
    accentType: 'Heiban',
    accentPosition: 0,
    morae: [
      { mora: 'あ', pitch: 'low' },
      { mora: 'め', pitch: 'high' }
    ],
    exampleSentence: '甘い飴を食べます。',
    exampleTranslation: 'I eat sweet candy.',
    pitchCategoryNote: 'Heiban [0]: Compare with 雨 (rain) which is Atamadaka [1].'
  },
  {
    id: '7',
    word: '橋',
    reading: 'ハシ',
    romaji: 'hashi',
    meaning: 'Bridge',
    pos: 'Noun',
    accentType: 'Odaka',
    accentPosition: 2,
    morae: [
      { mora: 'は', pitch: 'low' },
      { mora: 'し', pitch: 'drop' }
    ],
    exampleSentence: '大きな橋を渡る。',
    exampleTranslation: 'Cross the big bridge.',
    pitchCategoryNote: 'Odaka [2]: High on 2nd mora, pitch drops on the following particle (はしが↓).'
  },
  {
    id: '8',
    word: '箸',
    reading: 'ハシ',
    romaji: 'hashi',
    meaning: 'Chopsticks',
    pos: 'Noun',
    accentType: 'Atamadaka',
    accentPosition: 1,
    morae: [
      { mora: 'は', pitch: 'drop' },
      { mora: 'し', pitch: 'low' }
    ],
    exampleSentence: '箸で寿司を食べる。',
    exampleTranslation: 'Eat sushi with chopsticks.',
    pitchCategoryNote: 'Atamadaka [1]: Pitch drops after "ha".'
  },
  {
    id: '9',
    word: '端',
    reading: 'ハシ',
    romaji: 'hashi',
    meaning: 'Edge / end',
    pos: 'Noun',
    accentType: 'Heiban',
    accentPosition: 0,
    morae: [
      { mora: 'は', pitch: 'low' },
      { mora: 'し', pitch: 'high' }
    ],
    exampleSentence: '道の端を歩く。',
    exampleTranslation: 'Walk at the edge of the road.',
    pitchCategoryNote: 'Heiban [0]: High on 2nd mora, stays high on particles.'
  },
  {
    id: '10',
    word: '日本語',
    reading: 'ニホンゴ',
    romaji: 'nihongo',
    meaning: 'Japanese language',
    pos: 'Noun',
    accentType: 'Heiban',
    accentPosition: 0,
    morae: [
      { mora: '日', pitch: 'low' },
      { mora: '本', pitch: 'high' },
      { mora: '語', pitch: 'high' }
    ],
    exampleSentence: '日本語の勉強は楽しい。',
    exampleTranslation: 'Studying Japanese is fun.',
    pitchCategoryNote: 'Heiban [0]: Standard country+go compound pattern.'
  },
  {
    id: '11',
    word: 'アクセント',
    reading: 'アクセント',
    romaji: 'akusento',
    meaning: 'Accent',
    pos: 'Noun',
    accentType: 'Nakadaka',
    accentPosition: 3,
    morae: [
      { mora: 'ア', pitch: 'low' },
      { mora: 'ク', pitch: 'high' },
      { mora: 'セ', pitch: 'drop' },
      { mora: 'ン', pitch: 'low' },
      { mora: 'ト', pitch: 'low' }
    ],
    exampleSentence: '正しいアクセントで話す。',
    exampleTranslation: 'Speak with the correct accent.',
    pitchCategoryNote: 'Nakadaka [3]: Pitch drops on "se".'
  },
  {
    id: '12',
    word: '桜',
    reading: 'サクラ',
    romaji: 'sakura',
    meaning: 'Cherry blossom',
    pos: 'Noun',
    accentType: 'Heiban',
    accentPosition: 0,
    morae: [
      { mora: 'さ', pitch: 'low' },
      { mora: 'く', pitch: 'high' },
      { mora: 'ら', pitch: 'high' }
    ],
    exampleSentence: '春に桜が咲きます。',
    exampleTranslation: 'Cherry blossoms bloom in spring.',
    pitchCategoryNote: 'Heiban [0]: Standard flat pitch.'
  },
  {
    id: '13',
    word: '富士山',
    reading: 'フジサン',
    romaji: 'fujisan',
    meaning: 'Mount Fuji',
    pos: 'Proper Noun',
    accentType: 'Atamadaka',
    accentPosition: 1,
    morae: [
      { mora: '富', pitch: 'drop' },
      { mora: '士', pitch: 'low' },
      { mora: '山', pitch: 'low' }
    ],
    exampleSentence: '富士山はとても綺麗です。',
    exampleTranslation: 'Mount Fuji is very beautiful.',
    pitchCategoryNote: 'Atamadaka [1]: Drop on "fu".'
  },
  {
    id: '14',
    word: '先生',
    reading: 'センセイ',
    romaji: 'sensei',
    meaning: 'Teacher / master',
    pos: 'Noun',
    accentType: 'Nakadaka',
    accentPosition: 3,
    morae: [
      { mora: '先', pitch: 'low' },
      { mora: '生', pitch: 'high' },
      { mora: 'い', pitch: 'drop' }
    ],
    exampleSentence: '先生に質問をします。',
    exampleTranslation: 'I ask the teacher a question.',
    pitchCategoryNote: 'Nakadaka [3]: Drop after "se-n-se".'
  },
  {
    id: '15',
    word: '友達',
    reading: 'トモダチ',
    romaji: 'tomodachi',
    meaning: 'Friend',
    pos: 'Noun',
    accentType: 'Heiban',
    accentPosition: 0,
    morae: [
      { mora: '友', pitch: 'low' },
      { mora: '達', pitch: 'high' }
    ],
    exampleSentence: '友達と一緒に遊ぶ。',
    exampleTranslation: 'Play together with friends.',
    pitchCategoryNote: 'Heiban [0]: Flat pitch pattern.'
  }
];

/**
 * Basic Rule-Based Offline Parser for sentence tokenization & pitch assignment
 */
export function offlineAnalyzeSentence(text: string, breakOnSpaces: boolean): { tokens: Token[]; translation: string } {
  // Check exact mockup sentence default
  if (text.trim() === '今日、どんなこと学びたい？' || text.trim() === '今日どんなこと学びたい') {
    return {
      tokens: [
        {
          surface: '今 日',
          reading: 'キョー',
          romaji: 'kyō',
          accentType: 'Atamadaka',
          accentPosition: 1,
          morae: [{ mora: '今', pitch: 'drop' }, { mora: '日', pitch: 'low' }]
        },
        {
          surface: '、',
          reading: '、',
          romaji: '',
          accentType: 'Punctuation',
          accentPosition: 0,
          morae: [],
          isPunctuation: true
        },
        {
          surface: 'ど ん な',
          reading: 'ドンナ',
          romaji: 'donna',
          accentType: 'Atamadaka',
          accentPosition: 1,
          morae: [{ mora: 'ど', pitch: 'drop' }, { mora: 'ん', pitch: 'low' }, { mora: 'な', pitch: 'low' }]
        },
        {
          surface: 'こ と',
          reading: 'コト',
          romaji: 'koto',
          accentType: 'Heiban',
          accentPosition: 0,
          morae: [{ mora: 'こ', pitch: 'low' }, { mora: 'と', pitch: 'high' }]
        },
        {
          surface: '学 び た い',
          reading: 'マナビタイ',
          romaji: 'manabitai',
          accentType: 'Nakadaka',
          accentPosition: 4,
          morae: [{ mora: '学', pitch: 'low' }, { mora: 'び', pitch: 'high' }, { mora: 'た', pitch: 'high' }, { mora: 'い', pitch: 'drop' }]
        },
        {
          surface: '？',
          reading: '？',
          romaji: '',
          accentType: 'Punctuation',
          accentPosition: 0,
          morae: [],
          isPunctuation: true
        }
      ],
      translation: 'What do you want to learn today?'
    };
  }

  // Tokenize using dictionary lookup or simple splitting logic
  const tokens: Token[] = [];
  const rawSegments = breakOnSpaces ? text.split(/\s+/) : [text];

  for (const segment of rawSegments) {
    if (!segment) continue;

    // Split punctuation
    const puncRegex = /([、。！？\?\!\,\.\s]+)/g;
    const parts = segment.split(puncRegex).filter(Boolean);

    for (const part of parts) {
      if (/^[、。！？\?\!\,\.\s]+$/.test(part)) {
        tokens.push({
          surface: part,
          reading: part,
          romaji: '',
          accentType: 'Punctuation',
          accentPosition: 0,
          morae: [],
          isPunctuation: true
        });
        continue;
      }

      // Check dictionary match
      const matchedDict = DICTIONARY_DATABASE.find(d => d.word === part || d.reading === part);
      if (matchedDict) {
        tokens.push({
          surface: matchedDict.word,
          reading: matchedDict.reading,
          romaji: matchedDict.romaji,
          accentType: matchedDict.accentType,
          accentPosition: matchedDict.accentPosition,
          morae: matchedDict.morae
        });
      } else {
        // Fallback token creation
        const moraeStrings = splitToMorae(part);
        const romaji = kanaToRomaji(part);
        // Default to Heiban [0] for unknown words offline
        const morae = calculateMoraPitches(moraeStrings, 0);

        tokens.push({
          surface: part,
          reading: part,
          romaji,
          accentType: 'Heiban',
          accentPosition: 0,
          morae
        });
      }
    }
  }

  return {
    tokens,
    translation: 'Japanese pitch accent analysis'
  };
}

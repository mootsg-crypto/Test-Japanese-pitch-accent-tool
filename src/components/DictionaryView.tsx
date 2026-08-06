import React, { useState } from 'react';
import { DICTIONARY_DATABASE } from '../lib/pitchAnalyzer';
import { DictionaryEntry } from '../types';
import { Search, Volume2, BookOpen, Layers } from 'lucide-react';

interface DictionaryViewProps {
  onAnalyzeWord?: (word: string) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({ onAnalyzeWord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Words' },
    { id: 'pairs', label: 'Minimal Pitch Pairs (雨/飴, 橋/箸)' },
    { id: 'Atamadaka', label: 'Atamadaka [1]' },
    { id: 'Heiban', label: 'Heiban [0]' },
    { id: 'Nakadaka', label: 'Nakadaka [N]' },
    { id: 'Odaka', label: 'Odaka [N]' },
  ];

  const filteredEntries = DICTIONARY_DATABASE.filter((entry) => {
    // Search query filter
    const matchesSearch =
      entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.meaning.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'pairs') return ['雨', '飴', '橋', '箸', '端'].includes(entry.word);
    return entry.accentType === selectedCategory;
  });

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="bg-[#212121] rounded-xl p-5 border border-[#282a2b] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAB917]/10 flex items-center justify-center text-[#FAB917]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Pitch Accent Dictionary
            </h2>
            <p className="text-xs text-[#A1A1A1]">
              Search Japanese words for Tokyo accent types, mora pitch contours, and usage examples.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A1A1A1] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Kanji, Kana, Romaji, or English..."
            className="w-full bg-[#121414] border border-[#282a2b] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#e2e2e2] placeholder:text-[#A1A1A1] focus:outline-none focus:border-[#FAB917] transition-colors"
          />
        </div>

        {/* Filter Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#FAB917] text-[#261900] font-bold shadow-sm'
                  : 'bg-[#1e2020] text-[#A1A1A1] hover:text-[#e2e2e2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#212121] rounded-xl p-5 border border-[#282a2b] flex flex-col justify-between gap-4 hover:border-[#FAB917]/30 transition-all shadow-sm group"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-[#A1A1A1] font-mono uppercase tracking-wider block mb-1">
                    {entry.reading} • {entry.romaji}
                  </span>
                  <h3 className="text-2xl font-bold text-white font-['Hiragino_Sans',sans-serif] group-hover:text-[#FAB917] transition-colors">
                    {entry.word}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#121414] text-[#FAB917] border border-[#282a2b] text-xs font-mono font-bold">
                    {entry.accentType} [{entry.accentPosition}]
                  </span>
                  <button
                    onClick={() => playAudio(entry.word)}
                    className="p-2 rounded-lg bg-[#121414] text-[#FAB917] hover:bg-[#282a2b] transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pitch Visualizer */}
              <div className="mt-4 p-3 bg-[#121414] rounded-lg border border-[#282a2b] flex items-center justify-between">
                <div className="flex items-center gap-1 font-['Hiragino_Sans',sans-serif] text-xl">
                  {entry.morae.map((m, idx) => {
                    const pClass =
                      m.pitch === 'high'
                        ? 'pitch-high'
                        : m.pitch === 'drop'
                        ? 'pitch-drop'
                        : 'pitch-low';
                    return (
                      <span key={idx} className={`${pClass} px-1.5`}>
                        {m.mora}
                      </span>
                    );
                  })}
                </div>
                <span className="text-[11px] text-[#A1A1A1] font-mono">{entry.pos}</span>
              </div>

              {/* Meaning & Note */}
              <p className="mt-3 text-sm text-[#e2e2e2] font-semibold">{entry.meaning}</p>
              {entry.pitchCategoryNote && (
                <p className="mt-1 text-xs text-[#A1A1A1] bg-[#1a1c1c] p-2 rounded border border-[#282a2b]">
                  {entry.pitchCategoryNote}
                </p>
              )}
            </div>

            {/* Example sentence & action */}
            <div className="pt-3 border-t border-[#282a2b] flex items-center justify-between text-xs">
              <div className="text-[#A1A1A1] italic">
                "{entry.exampleSentence}" ({entry.exampleTranslation})
              </div>
              {onAnalyzeWord && (
                <button
                  onClick={() => onAnalyzeWord(entry.exampleSentence)}
                  className="shrink-0 text-[#FAB917] hover:underline font-mono ml-2"
                >
                  Analyze sentence →
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="col-span-full bg-[#212121] rounded-xl p-8 border border-[#282a2b] text-center text-[#A1A1A1]">
            <p>No dictionary entries found for "{searchQuery}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

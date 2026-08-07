import React, { useState } from 'react';
import { AnalysisResult, Token, Mora } from '../types';
import { ShowMode, TranslationMode } from './SettingsCard';
import { Volume2, Copy, Check, Activity, Bookmark, Sparkles } from 'lucide-react';

interface AnalysisOutputProps {
  result: AnalysisResult;
  showMode: ShowMode;
  translationMode: TranslationMode;
  fontSizeRem: number;
  onBookmark?: (result: AnalysisResult) => void;
  isBookmarked?: boolean;
}

export const AnalysisOutput: React.FC<AnalysisOutputProps> = ({
  result,
  showMode,
  translationMode,
  fontSizeRem,
  onBookmark,
  isBookmarked = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPitchGraph, setShowPitchGraph] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);

  const handlePlaySpeech = () => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(result.originalText);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${result.originalText}\n[Reading] ${result.reading}\n[Romaji] ${result.romaji}\n[Translation] ${result.translation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to get CSS pitch class for a mora
  const getPitchClass = (pitch: Mora['pitch']) => {
    if (pitch === 'high') return 'pitch-high';
    if (pitch === 'drop') return 'pitch-drop';
    return 'pitch-low';
  };

  // Render individual character or mora with proper pitch border styling
  const renderTokenMorae = (token: Token) => {
    if (token.isPunctuation) {
      return (
        <span className="self-end pb-1 px-1 text-[#e2e2e2]">
          {token.surface}
        </span>
      );
    }

    if (!token.morae || token.morae.length === 0) {
      return (
        <div className="flex">
          <span className="px-1 pitch-low">{token.surface}</span>
        </div>
      );
    }

    // If surface is kanji with multiple characters or mora length matches
    // We render the morae characters or split surface characters
    const surfaceChars = Array.from(token.surface.replace(/\s+/g, ''));
    const isKanji = /[一-龠]/.test(token.surface);

    if (isKanji && surfaceChars.length > 0 && surfaceChars.length !== token.morae.length) {
      // For Kanji compounds where mora count doesn't equal kanji count (e.g. 今日 2 kanji, キョー 2 mora), distribute pitch over kanji characters
      return (
        <div className="flex items-center">
          {surfaceChars.map((char, cIdx) => {
            const correspondingMora = token.morae[Math.min(cIdx, token.morae.length - 1)];
            const pitchClass = getPitchClass(correspondingMora?.pitch || 'low');
            return (
              <span key={cIdx} className={`${pitchClass} px-1 inline-block transition-all`}>
                {char}
              </span>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        {token.morae.map((moraObj, mIdx) => {
          const char = isKanji ? (surfaceChars[mIdx] || moraObj.mora) : moraObj.mora;
          const pitchClass = getPitchClass(moraObj.pitch);
          return (
            <span key={mIdx} className={`${pitchClass} px-1 inline-block transition-all`}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  // Flatten all morae across tokens for the SVG pitch wave graph
  const allGraphMorae: { char: string; pitch: number; wordIndex: number }[] = [];
  result.tokens.forEach((t, wIdx) => {
    if (t.isPunctuation) return;
    t.morae.forEach((m) => {
      allGraphMorae.push({
        char: m.mora,
        pitch: m.pitch === 'high' || m.pitch === 'drop' ? 1 : 0,
        wordIndex: wIdx,
      });
    });
  });

  return (
    <div className="bg-[#212121] rounded-xl p-6 border border-[#282a2b] shadow-lg flex flex-col gap-6 relative transition-all">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between border-b border-[#282a2b] pb-4">
        <div className="flex items-center gap-2">
          {result.aiPowered && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FAB917]/10 text-[#FAB917] border border-[#FAB917]/30">
              <Sparkles className="w-3.5 h-3.5" /> Gemini AI Accent Engine
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Pitch Wave Toggle */}
          <button
            onClick={() => setShowPitchGraph(!showPitchGraph)}
            className={`p-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              showPitchGraph
                ? 'bg-[#FAB917] text-[#261900] font-bold'
                : 'text-[#A1A1A1] hover:text-[#e2e2e2] hover:bg-[#1e2020]'
            }`}
            title="Toggle Pitch Wave Graph"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Pitch Curve</span>
          </button>

          {/* Audio Speech */}
          <button
            onClick={handlePlaySpeech}
            className={`p-2 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              isPlayingAudio
                ? 'bg-[#FAB917] text-[#261900] font-bold animate-pulse'
                : 'text-[#FAB917] hover:bg-[#1e2020]'
            }`}
            title="Listen to Spoken Sentence"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Audio</span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-[#A1A1A1] hover:text-[#e2e2e2] hover:bg-[#1e2020] transition-colors"
            title="Copy Pitch Breakdown"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          {onBookmark && (
            <button
              onClick={() => onBookmark(result)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? 'text-[#FAB917]' : 'text-[#A1A1A1] hover:text-[#e2e2e2] hover:bg-[#1e2020]'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Save to History'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? '#FAB917' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Main Pitch Accent Visualization output */}
      <div
        className="flex flex-wrap gap-x-5 gap-y-9 font-['Hiragino_Sans',sans-serif] text-[#e2e2e2] select-text py-2"
        style={{ fontSize: `${fontSizeRem}rem` }}
      >
        {result.tokens.map((token, index) => {
          if (token.isPunctuation) {
            return (
              <span key={index} className="self-end pb-1 text-[#A1A1A1]">
                {token.surface}
              </span>
            );
          }

          const isHovered = hoveredTokenIndex === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredTokenIndex(index)}
              onMouseLeave={() => setHoveredTokenIndex(null)}
              className="flex flex-col items-center group relative cursor-pointer"
            >
              {/* Annotation Top (Kana or Romaji) */}
              {showMode !== 'none' && (
                <span className="text-xs text-[#A1A1A1] mb-1 font-mono tracking-wide uppercase transition-colors group-hover:text-[#FAB917]">
                  {showMode === 'kana' ? token.reading : token.romaji}
                </span>
              )}

              {/* Japanese Surface with Pitch Line */}
              {renderTokenMorae(token)}

              {/* Accent Tag Badge on Hover or Mobile */}
              <div
                className={`mt-2 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  isHovered
                    ? 'bg-[#FAB917] text-[#261900] font-bold scale-105'
                    : 'bg-[#121414] text-[#A1A1A1] border border-[#282a2b]'
                }`}
              >
                {token.accentType} [{token.accentPosition}]
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Pitch Contour Wave Graph */}
      {showPitchGraph && allGraphMorae.length > 0 && (
        <div className="bg-[#121414] p-4 rounded-xl border border-[#282a2b] flex flex-col gap-2 animate-in fade-in duration-300">
          <span className="text-xs font-mono text-[#FAB917] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Pitch Frequency Contour Wave
          </span>
          <div className="w-full h-24 overflow-x-auto py-2">
            <svg
              className="w-full h-full min-w-[320px]"
              viewBox={`0 0 ${Math.max(320, allGraphMorae.length * 40)} 80`}
            >
              {/* Background pitch level lines */}
              <line x1="0" y1="20" x2="100%" y2="20" stroke="#282a2b" strokeDasharray="3 3" />
              <text x="5" y="15" fill="#A1A1A1" fontSize="9" fontFamily="monospace">HIGH</text>
              <line x1="0" y1="60" x2="100%" y2="60" stroke="#282a2b" strokeDasharray="3 3" />
              <text x="5" y="72" fill="#A1A1A1" fontSize="9" fontFamily="monospace">LOW</text>

              {/* Connecting pitch line path */}
              <path
                d={allGraphMorae
                  .map((m, i) => {
                    const x = 30 + i * 40;
                    const y = m.pitch === 1 ? 20 : 60;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#FAB917"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Nodes and Labels */}
              {allGraphMorae.map((m, i) => {
                const x = 30 + i * 40;
                const y = m.pitch === 1 ? 20 : 60;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#FAB917" />
                    <text
                      x={x}
                      y={y === 20 ? 10 : 75}
                      textAnchor="middle"
                      fill="#e2e2e2"
                      fontSize="12"
                      fontFamily="Hiragino Sans, Meiryo, sans-serif"
                    >
                      {m.char}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Pitch Rules Reference Banner */}
      <div className="p-3 bg-[#121414] rounded-lg border border-[#282a2b] text-[11px] text-[#A1A1A1] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#FAB917] font-mono font-bold">
          <span>Tokyo Pitch Rules Applied:</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span>1. 1st & 2nd morae differ (L-H or H-L)</span>
          <span>•</span>
          <span>2. Single pitch drop per word</span>
          <span>•</span>
          <span>3. Particles absorb preceding pitch</span>
        </div>
      </div>

      {/* Translation Section */}
      {translationMode === 'on' && result.translation && (
        <div className="pt-3 border-t border-dashed border-[#282a2b] text-[#A1A1A1] text-sm font-['Inter',sans-serif]">
          <strong className="text-[#e2e2e2] font-semibold mr-2">Translation:</strong>
          {result.translation}
        </div>
      )}
    </div>
  );
};

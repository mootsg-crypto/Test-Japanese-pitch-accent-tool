import React from 'react';

export type ShowMode = 'none' | 'kana' | 'romaji';
export type TranslationMode = 'on' | 'off';

interface SettingsCardProps {
  fontSizeRem: number;
  setFontSizeRem: (val: number) => void;
  showMode: ShowMode;
  setShowMode: (mode: ShowMode) => void;
  translationMode: TranslationMode;
  setTranslationMode: (mode: TranslationMode) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  fontSizeRem,
  setFontSizeRem,
  showMode,
  setShowMode,
  translationMode,
  setTranslationMode,
}) => {
  return (
    <div className="bg-[#212121] rounded-xl p-5 border border-[#282a2b] flex flex-col gap-5 shadow-sm">
      {/* Font Size Slider */}
      <div className="flex items-center gap-4">
        <label className="text-[#A1A1A1] font-mono text-xs w-20 shrink-0">
          Font Size
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={fontSizeRem}
          onChange={(e) => setFontSizeRem(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-[#1e2020] rounded-full appearance-none cursor-pointer accent-[#FAB917]"
        />
        <span className="text-[#e2e2e2] font-mono text-xs w-14 text-right shrink-0">
          {fontSizeRem.toFixed(1)} rem
        </span>
      </div>

      {/* Show Toggle */}
      <div className="flex items-center gap-4">
        <label className="text-[#A1A1A1] font-mono text-xs w-20 shrink-0">
          Show:
        </label>
        <div className="flex bg-[#1e2020] rounded-lg p-1 gap-1">
          <button
            type="button"
            onClick={() => setShowMode('none')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
              showMode === 'none'
                ? 'bg-[#FAB917] text-[#261900] font-bold shadow-sm'
                : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => setShowMode('kana')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
              showMode === 'kana'
                ? 'bg-[#FAB917] text-[#261900] font-bold shadow-sm'
                : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
            }`}
          >
            Kana
          </button>
          <button
            type="button"
            onClick={() => setShowMode('romaji')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
              showMode === 'romaji'
                ? 'bg-[#FAB917] text-[#261900] font-bold shadow-sm'
                : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
            }`}
          >
            Romaji
          </button>
        </div>
      </div>

      {/* Translation Toggle */}
      <div className="flex items-center gap-4">
        <label className="text-[#A1A1A1] font-mono text-xs w-20 shrink-0">
          Translation:
        </label>
        <div className="flex bg-[#1e2020] rounded-lg p-1 gap-1">
          <button
            type="button"
            onClick={() => setTranslationMode('on')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
              translationMode === 'on'
                ? 'bg-[#FAB917] text-[#261900] font-bold shadow-sm'
                : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
            }`}
          >
            On
          </button>
          <button
            type="button"
            onClick={() => setTranslationMode('off')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
              translationMode === 'off'
                ? 'bg-[#FAB917] text-[#261900] font-bold shadow-sm'
                : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
            }`}
          >
            Off
          </button>
        </div>
      </div>
    </div>
  );
};

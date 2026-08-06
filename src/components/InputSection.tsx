import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface InputSectionProps {
  text: string;
  setText: (val: string) => void;
  breakOnSpaces: boolean;
  setBreakOnSpaces: (val: boolean) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const PRESET_SAMPLES = [
  '今日、どんなこと学びたい？',
  '雨と飴のちがい',
  '橋の端を箸持って走る',
  'すもももももももものうち',
  '日本語のアクセントが難しい'
];

export const InputSection: React.FC<InputSectionProps> = ({
  text,
  setText,
  breakOnSpaces,
  setBreakOnSpaces,
  onAnalyze,
  isLoading,
}) => {
  return (
    <div className="bg-[#212121] rounded-xl border border-[#FAB917]/20 overflow-hidden flex flex-col shadow-sm">
      {/* Sample presets */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-[#A1A1A1] font-mono shrink-0">Try:</span>
        {PRESET_SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setText(sample);
            }}
            className="text-xs px-2.5 py-1 rounded-full bg-[#1e2020] text-[#A1A1A1] hover:text-[#FAB917] hover:bg-[#282a2b] transition-colors shrink-0 font-['Hiragino_Sans',sans-serif]"
          >
            {sample}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="今日、どんなこと学びたい？"
        className="w-full bg-transparent text-[#e2e2e2] px-5 py-3 outline-none resize-y min-h-[110px] font-['Hiragino_Sans',sans-serif] text-lg border-none focus:ring-0 placeholder:text-[#333535]"
      />

      <div className="bg-[#1a1c1c] px-4 py-3 flex justify-between items-center border-t border-[#282a2b]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={breakOnSpaces}
            onChange={(e) => setBreakOnSpaces(e.target.checked)}
            className="rounded bg-[#1e2020] border-[#282a2b] text-[#FAB917] focus:ring-[#FAB917] focus:ring-offset-[#212121]"
          />
          <span className="text-[#A1A1A1] text-xs">Break on single spaces</span>
        </label>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !text.trim()}
          className="bg-[#FAB917] text-[#261900] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-md disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

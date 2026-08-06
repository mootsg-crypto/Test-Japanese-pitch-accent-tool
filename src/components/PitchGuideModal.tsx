import React from 'react';
import { X, Volume2, Info, BookOpen } from 'lucide-react';

interface PitchGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchGuideModal: React.FC<PitchGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1c1c] border border-[#282a2b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#282a2b] flex items-center justify-between sticky top-0 bg-[#1a1c1c] z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAB917]/10 flex items-center justify-center text-[#FAB917]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Japanese Pitch Accent Guide
              </h2>
              <p className="text-xs text-[#A1A1A1]">Tokyo Dialect (東京アクセント) Standard Rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1A1] hover:text-white p-2 rounded-lg hover:bg-[#282a2b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-[#d4c4ac]">
          {/* Intro Box */}
          <div className="p-4 rounded-xl bg-[#212121] border border-[#282a2b] space-y-2">
            <div className="flex items-center gap-2 text-[#FAB917] font-semibold text-xs font-mono uppercase tracking-wider">
              <Info className="w-4 h-4" /> What is Pitch Accent?
            </div>
            <p className="leading-relaxed text-[#e2e2e2]">
              Unlike English stress accent (loudness), Japanese uses <strong>Pitch Accent</strong> (musical pitch high/low). Each mora in a word has a pitch. Standard Tokyo accent consists of 4 primary patterns:
            </p>
          </div>

          {/* 4 Accent Patterns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Heiban */}
            <div className="p-4 rounded-xl bg-[#212121] border border-[#282a2b] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">1. Heiban (平板 [0])</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAB917]/10 text-[#FAB917]">Flat</span>
                </div>
                <p className="text-xs text-[#A1A1A1]">Low on 1st mora, High on 2nd and rest. Pitch stays high when particles follow.</p>
              </div>
              <div className="bg-[#121414] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1 font-['Hiragino_Sans',sans-serif] text-base">
                  <span className="pitch-low px-1">さ</span>
                  <span className="pitch-high px-1">く</span>
                  <span className="pitch-high px-1">ら</span>
                </div>
                <button
                  onClick={() => playAudio('さくら')}
                  className="p-1.5 rounded-md hover:bg-[#282a2b] text-[#FAB917] transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Atamadaka */}
            <div className="p-4 rounded-xl bg-[#212121] border border-[#282a2b] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">2. Atamadaka (頭高 [1])</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAB917]/10 text-[#FAB917]">Head High</span>
                </div>
                <p className="text-xs text-[#A1A1A1]">High on 1st mora and drops immediately. All following morae are Low.</p>
              </div>
              <div className="bg-[#121414] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1 font-['Hiragino_Sans',sans-serif] text-base">
                  <span className="pitch-drop px-1">あ</span>
                  <span className="pitch-low px-1">め</span>
                  <span className="text-xs text-[#A1A1A1] ml-1">(雨)</span>
                </div>
                <button
                  onClick={() => playAudio('あめ')}
                  className="p-1.5 rounded-md hover:bg-[#282a2b] text-[#FAB917] transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Nakadaka */}
            <div className="p-4 rounded-xl bg-[#212121] border border-[#282a2b] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">3. Nakadaka (中高 [N])</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAB917]/10 text-[#FAB917]">Mid High</span>
                </div>
                <p className="text-xs text-[#A1A1A1]">Low on 1st, rises to High, then drops after N-th mora before the word ends.</p>
              </div>
              <div className="bg-[#121414] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1 font-['Hiragino_Sans',sans-serif] text-base">
                  <span className="pitch-low px-1">こ</span>
                  <span className="pitch-drop px-1">こ</span>
                  <span className="pitch-low px-1">ろ</span>
                </div>
                <button
                  onClick={() => playAudio('こころ')}
                  className="p-1.5 rounded-md hover:bg-[#282a2b] text-[#FAB917] transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4. Odaka */}
            <div className="p-4 rounded-xl bg-[#212121] border border-[#282a2b] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">4. Odaka (尾高 [N])</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAB917]/10 text-[#FAB917]">Tail High</span>
                </div>
                <p className="text-xs text-[#A1A1A1]">Low on 1st, rises to High until last mora. The pitch drops on attached particles (e.g., はしが↓).</p>
              </div>
              <div className="bg-[#121414] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1 font-['Hiragino_Sans',sans-serif] text-base">
                  <span className="pitch-low px-1">は</span>
                  <span className="pitch-drop px-1">し</span>
                  <span className="text-xs text-[#A1A1A1] ml-1">(橋)</span>
                </div>
                <button
                  onClick={() => playAudio('はしが')}
                  className="p-1.5 rounded-md hover:bg-[#282a2b] text-[#FAB917] transition-colors"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Minimal Pairs Table */}
          <div className="p-4 rounded-xl bg-[#212121] border border-[#282a2b] space-y-3">
            <h3 className="font-bold text-white text-sm">Famous Minimal Pairs (Homophones)</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#121414] rounded-lg border border-[#282a2b]">
                <div className="text-[#FAB917] font-bold font-['Hiragino_Sans',sans-serif]">雨 (あめ) [1] — Rain</div>
                <div className="text-[#A1A1A1]">Atamadaka: High → Low</div>
              </div>
              <div className="p-2 bg-[#121414] rounded-lg border border-[#282a2b]">
                <div className="text-[#FAB917] font-bold font-['Hiragino_Sans',sans-serif]">飴 (あめ) [0] — Candy</div>
                <div className="text-[#A1A1A1]">Heiban: Low → High</div>
              </div>
              <div className="p-2 bg-[#121414] rounded-lg border border-[#282a2b]">
                <div className="text-[#FAB917] font-bold font-['Hiragino_Sans',sans-serif]">箸 (はし) [1] — Chopsticks</div>
                <div className="text-[#A1A1A1]">Atamadaka: High → Low</div>
              </div>
              <div className="p-2 bg-[#121414] rounded-lg border border-[#282a2b]">
                <div className="text-[#FAB917] font-bold font-['Hiragino_Sans',sans-serif]">橋 (はし) [2] — Bridge</div>
                <div className="text-[#A1A1A1]">Odaka: Low → High (drops on が)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#282a2b] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#FAB917] text-[#261900] font-bold text-xs rounded-full hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

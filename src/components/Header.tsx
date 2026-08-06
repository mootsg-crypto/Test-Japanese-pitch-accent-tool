import React, { useState } from 'react';
import { Globe, HelpCircle, Sparkles } from 'lucide-react';
import { PitchGuideModal } from './PitchGuideModal';

interface HeaderProps {
  aiEnabled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ aiEnabled = true }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <>
      <header className="bg-[#121414] border-b border-[#1e2020] flex justify-between items-center h-16 px-4 md:px-8 w-full fixed top-0 z-40 transition-all">
        <button
          onClick={() => setIsGuideOpen(true)}
          className="text-[#FAB917] hover:bg-[#1e2020] transition-colors w-11 h-11 flex items-center justify-center rounded-full"
          title="Language Settings / Info"
        >
          <Globe className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl md:text-2xl font-extrabold tracking-tighter text-[#FFD700]">
            KOTONOHA
          </span>
          {aiEnabled && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FAB917]/10 text-[#FAB917] border border-[#FAB917]/20">
              <Sparkles className="w-2.5 h-2.5" /> AI Ready
            </span>
          )}
        </div>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="text-[#FAB917] hover:bg-[#1e2020] transition-colors w-11 h-11 flex items-center justify-center rounded-full"
          title="Pitch Accent Guide & Rules"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Pitch Accent Guide Modal */}
      <PitchGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
};

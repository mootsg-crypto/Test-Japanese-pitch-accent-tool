import React from 'react';
import { Sparkles, BookOpen, History, Award } from 'lucide-react';

export type TabType = 'analyzer' | 'dictionary' | 'history' | 'quiz';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-[#1e2020] border-t border-[#282a2b] fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 pb-safe px-4 shadow-lg">
      {/* Analyzer */}
      <button
        onClick={() => setActiveTab('analyzer')}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all ${
          activeTab === 'analyzer'
            ? 'bg-[#FAB917] text-[#261900] font-bold shadow-md scale-105'
            : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-mono text-xs">Analyzer</span>
      </button>

      {/* Dictionary */}
      <button
        onClick={() => setActiveTab('dictionary')}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all ${
          activeTab === 'dictionary'
            ? 'bg-[#FAB917] text-[#261900] font-bold shadow-md scale-105'
            : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span className="font-mono text-xs">Dictionary</span>
      </button>

      {/* History */}
      <button
        onClick={() => setActiveTab('history')}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all ${
          activeTab === 'history'
            ? 'bg-[#FAB917] text-[#261900] font-bold shadow-md scale-105'
            : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
        }`}
      >
        <History className="w-4 h-4" />
        <span className="font-mono text-xs">History</span>
      </button>

      {/* Quiz */}
      <button
        onClick={() => setActiveTab('quiz')}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all ${
          activeTab === 'quiz'
            ? 'bg-[#FAB917] text-[#261900] font-bold shadow-md scale-105'
            : 'text-[#A1A1A1] hover:text-[#e2e2e2]'
        }`}
      >
        <Award className="w-4 h-4" />
        <span className="font-mono text-xs">Quiz</span>
      </button>
    </nav>
  );
};

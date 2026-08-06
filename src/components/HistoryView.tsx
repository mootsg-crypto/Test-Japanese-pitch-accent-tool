import React from 'react';
import { HistoryItem } from '../types';
import { History, Trash2, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onRemoveItem,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#212121] rounded-xl p-5 border border-[#282a2b] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAB917]/10 flex items-center justify-center text-[#FAB917]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Analysis History
            </h2>
            <p className="text-xs text-[#A1A1A1]">
              Review your saved Japanese pitch accent analyses and past prompts.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1e2020] text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-[#282a2b] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <div className="bg-[#212121] rounded-xl p-12 border border-[#282a2b] text-center space-y-3">
          <History className="w-10 h-10 text-[#333535] mx-auto" />
          <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
            No Analysis History Yet
          </h3>
          <p className="text-xs text-[#A1A1A1] max-w-sm mx-auto">
            When you analyze Japanese text or save bookmarks, your results will appear here for quick reference.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-[#212121] rounded-xl p-5 border border-[#282a2b] hover:border-[#FAB917]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A1A1A1] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {item.result?.aiPowered && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAB917]/10 text-[#FAB917]">
                      <Sparkles className="w-2.5 h-2.5" /> AI Analyzed
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-bold text-white font-['Hiragino_Sans',sans-serif] group-hover:text-[#FAB917] transition-colors">
                  {item.text}
                </h4>
                {item.translation && (
                  <p className="text-xs text-[#A1A1A1] italic">"{item.translation}"</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectHistoryItem(item)}
                  className="px-4 py-2 rounded-full bg-[#FAB917] text-[#261900] font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-lg text-[#A1A1A1] hover:text-red-400 hover:bg-[#121414] transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SettingsCard, ShowMode, TranslationMode } from './components/SettingsCard';
import { InputSection } from './components/InputSection';
import { AnalysisOutput } from './components/AnalysisOutput';
import { DictionaryView } from './components/DictionaryView';
import { HistoryView } from './components/HistoryView';
import { PitchQuizView } from './components/PitchQuizView';
import { DisqusComments } from './components/DisqusComments';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { AnalysisResult, HistoryItem } from './types';
import { offlineAnalyzeSentence } from './lib/pitchAnalyzer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('analyzer');
  const [fontSizeRem, setFontSizeRem] = useState<number>(1.0);
  const [showMode, setShowMode] = useState<ShowMode>('kana');
  const [translationMode, setTranslationMode] = useState<TranslationMode>('on');

  const [inputText, setInputText] = useState<string>('今日、どんなこと学びたい？');
  const [breakOnSpaces, setBreakOnSpaces] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // History state with LocalStorage persistence
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kotonoha_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kotonoha_history', JSON.stringify(history));
    } catch {
      // Ignore quota errors
    }
  }, [history]);

  // Sync dynamic font scale variable
  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-scale', `${fontSizeRem * 24}px`);
  }, [fontSizeRem]);

  // Trigger analysis function
  const handleAnalyze = async (textOverride?: string) => {
    const textToAnalyze = (textOverride || inputText).trim();
    if (!textToAnalyze) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze, breakOnSpaces }),
      });

      if (response.ok) {
        const data: AnalysisResult = await response.json();
        setResult(data);
        addToHistory(data);
      } else {
        throw new Error('Server response failed');
      }
    } catch (err) {
      console.warn('API analysis endpoint error, fallback to offline engine:', err);
      const fallback = offlineAnalyzeSentence(textToAnalyze, breakOnSpaces);
      const fallbackResult: AnalysisResult = {
        originalText: textToAnalyze,
        tokens: fallback.tokens,
        translation: fallback.translation,
        romaji: fallback.tokens.map((t) => t.romaji).join(' '),
        reading: fallback.tokens.map((t) => t.reading).join(''),
        aiPowered: false,
      };
      setResult(fallbackResult);
      addToHistory(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Add analysis result to history list
  const addToHistory = (res: AnalysisResult) => {
    setHistory((prev) => {
      // Avoid duplicate top item
      if (prev.length > 0 && prev[0].text === res.originalText) {
        return prev;
      }
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text: res.originalText,
        translation: res.translation,
        timestamp: Date.now(),
        result: res,
      };
      return [newItem, ...prev.slice(0, 49)]; // keep latest 50
    });
  };

  // Initial load analysis execution
  useEffect(() => {
    handleAnalyze('今日、どんなこと学びたい？');
  }, []);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInputText(item.text);
    setResult(item.result);
    setActiveTab('analyzer');
  };

  const handleAnalyzeWordFromDict = (word: string) => {
    setInputText(word);
    setActiveTab('analyzer');
    handleAnalyze(word);
  };

  const isBookmarked = result ? history.some((h) => h.text === result.originalText) : false;

  return (
    <div className="bg-[#0F0F0F] text-[#e2e2e2] font-['Inter',sans-serif] min-h-screen pb-28 pt-20">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
        {activeTab === 'analyzer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Description */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white mb-1.5">
                Japanese Pitch Accent Analyser
              </h1>
              <p className="text-xs md:text-sm text-[#A1A1A1]">
                Type or paste Japanese text below to see pitch accent patterns. If AI is enabled on your account, you can also add translations + romaji/kana.
              </p>
            </div>

            {/* Interactive Settings Card */}
            <SettingsCard
              fontSizeRem={fontSizeRem}
              setFontSizeRem={setFontSizeRem}
              showMode={showMode}
              setShowMode={setShowMode}
              translationMode={translationMode}
              setTranslationMode={setTranslationMode}
            />

            {/* Input Section */}
            <InputSection
              text={inputText}
              setText={setInputText}
              breakOnSpaces={breakOnSpaces}
              setBreakOnSpaces={setBreakOnSpaces}
              onAnalyze={() => handleAnalyze()}
              isLoading={isLoading}
            />

            {/* Analysis Output Section */}
            {result && (
              <AnalysisOutput
                result={result}
                showMode={showMode}
                translationMode={translationMode}
                fontSizeRem={fontSizeRem}
                onBookmark={(res) => addToHistory(res)}
                isBookmarked={isBookmarked}
              />
            )}
          </div>
        )}

        {/* Dictionary Tab */}
        {activeTab === 'dictionary' && (
          <DictionaryView onAnalyzeWord={handleAnalyzeWordFromDict} />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={() => setHistory([])}
            onRemoveItem={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
          />
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && <PitchQuizView />}

        {/* Disqus Comment Section */}
        <DisqusComments />
      </main>

      {/* Fixed Bottom Tab Navigation */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

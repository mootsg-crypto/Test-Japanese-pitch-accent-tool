import React, { useState } from 'react';
import { AccentCategory, Mora } from '../types';
import { Volume2, CheckCircle2, XCircle, Award, RotateCcw, HelpCircle } from 'lucide-react';

interface QuizItem {
  id: string;
  kanji: string;
  reading: string;
  meaning: string;
  correctType: AccentCategory;
  correctPosition: number;
  morae: Mora[];
  options: {
    type: AccentCategory;
    position: number;
    label: string;
    description: string;
  }[];
  explanation: string;
}

const QUIZ_QUESTIONS: QuizItem[] = [
  {
    id: 'q1',
    kanji: '雨',
    reading: 'アメ',
    meaning: 'Rain',
    correctType: 'Atamadaka',
    correctPosition: 1,
    morae: [{ mora: 'あ', pitch: 'drop' }, { mora: 'め', pitch: 'low' }],
    options: [
      { type: 'Atamadaka', position: 1, label: 'Atamadaka [1]', description: 'High → Low (Drops after あ)' },
      { type: 'Heiban', position: 0, label: 'Heiban [0]', description: 'Low → High (Flat)' },
      { type: 'Odaka', position: 2, label: 'Odaka [2]', description: 'Low → High (Drops on particle)' }
    ],
    explanation: '雨 (rain) is Atamadaka [1]. Pitch starts high on "a" and drops to low on "me". Compare with 飴 (candy) which is Heiban [0].'
  },
  {
    id: 'q2',
    kanji: '飴',
    reading: 'アメ',
    meaning: 'Candy',
    correctType: 'Heiban',
    correctPosition: 0,
    morae: [{ mora: 'あ', pitch: 'low' }, { mora: 'め', pitch: 'high' }],
    options: [
      { type: 'Atamadaka', position: 1, label: 'Atamadaka [1]', description: 'High → Low' },
      { type: 'Heiban', position: 0, label: 'Heiban [0]', description: 'Low → High (Flat)' },
      { type: 'Odaka', position: 2, label: 'Odaka [2]', description: 'Low → High' }
    ],
    explanation: '飴 (candy) is Heiban [0]. Pitch starts low on "a" and rises to high on "me", staying high.'
  },
  {
    id: 'q3',
    kanji: '箸',
    reading: 'ハシ',
    meaning: 'Chopsticks',
    correctType: 'Atamadaka',
    correctPosition: 1,
    morae: [{ mora: 'は', pitch: 'drop' }, { mora: 'し', pitch: 'low' }],
    options: [
      { type: 'Atamadaka', position: 1, label: 'Atamadaka [1]', description: 'High → Low (Drops after は)' },
      { type: 'Odaka', position: 2, label: 'Odaka [2]', description: 'Low → High (Drops on が)' },
      { type: 'Heiban', position: 0, label: 'Heiban [0]', description: 'Low → High (Flat)' }
    ],
    explanation: '箸 (chopsticks) is Atamadaka [1]. Pitch drops right after the first mora "ha".'
  },
  {
    id: 'q4',
    kanji: '橋',
    reading: 'ハシ',
    meaning: 'Bridge',
    correctType: 'Odaka',
    correctPosition: 2,
    morae: [{ mora: 'は', pitch: 'low' }, { mora: 'し', pitch: 'drop' }],
    options: [
      { type: 'Atamadaka', position: 1, label: 'Atamadaka [1]', description: 'High → Low' },
      { type: 'Odaka', position: 2, label: 'Odaka [2]', description: 'Low → High (Drops on attached particle)' },
      { type: 'Heiban', position: 0, label: 'Heiban [0]', description: 'Low → High (Stays high on particle)' }
    ],
    explanation: '橋 (bridge) is Odaka [2]. Pitch rises on "shi", but drops when followed by a particle (はしが↓).'
  },
  {
    id: 'q5',
    kanji: '端',
    reading: 'ハシ',
    meaning: 'Edge / End',
    correctType: 'Heiban',
    correctPosition: 0,
    morae: [{ mora: 'は', pitch: 'low' }, { mora: 'し', pitch: 'high' }],
    options: [
      { type: 'Atamadaka', position: 1, label: 'Atamadaka [1]', description: 'High → Low' },
      { type: 'Heiban', position: 0, label: 'Heiban [0]', description: 'Low → High (Stays high on particle)' },
      { type: 'Odaka', position: 2, label: 'Odaka [2]', description: 'Low → High' }
    ],
    explanation: '端 (edge) is Heiban [0]. Pitch rises on "shi" and remains high when particles follow (はしが).'
  }
];

export const PitchQuizView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (type: AccentCategory) => {
    if (selectedAnswer !== null) return; // Answered
    setSelectedAnswer(type);
    if (type === currentQ.correctType) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const playAudio = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-[#212121] rounded-xl p-8 border border-[#282a2b] text-center space-y-6 max-w-lg mx-auto my-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-[#FAB917]/10 flex items-center justify-center text-[#FAB917] mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Quiz Completed!
          </h2>
          <p className="text-[#A1A1A1] text-sm mt-1">
            You scored {score} out of {QUIZ_QUESTIONS.length} on Pitch Accent Recognition.
          </p>
        </div>

        <div className="p-4 bg-[#121414] rounded-xl border border-[#282a2b] text-left text-xs text-[#d4c4ac] space-y-2">
          <div className="font-bold text-[#FAB917] uppercase tracking-wider font-mono">
            {score === QUIZ_QUESTIONS.length ? '🌟 Perfect Master!' : '👍 Great Practice!'}
          </div>
          <p>
            Understanding the distinction between minimal pairs like 雨 (rain) vs 飴 (candy) and 箸 (chopsticks) vs 橋 (bridge) is essential for natural Japanese pronunciation.
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3 bg-[#FAB917] text-[#261900] font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-4 h-4" /> Try Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Quiz Header */}
      <div className="bg-[#212121] rounded-xl p-5 border border-[#282a2b] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAB917]/10 flex items-center justify-center text-[#FAB917]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Pitch Accent Quiz
            </h2>
            <p className="text-xs text-[#A1A1A1]">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold px-3 py-1 bg-[#121414] border border-[#282a2b] text-[#FAB917] rounded-full">
          Score: {score}/{QUIZ_QUESTIONS.length}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#212121] rounded-xl p-6 border border-[#282a2b] space-y-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#A1A1A1] block mb-1">
              {currentQ.reading} • {currentQ.meaning}
            </span>
            <h3 className="text-4xl font-bold text-white font-['Hiragino_Sans',sans-serif]">
              {currentQ.kanji}
            </h3>
          </div>

          <button
            onClick={() => playAudio(currentQ.kanji)}
            className="p-3 bg-[#121414] hover:bg-[#282a2b] text-[#FAB917] rounded-full transition-colors"
            title="Listen Pronunciation"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-[#A1A1A1] block">
            Select the correct Pitch Accent pattern for "{currentQ.kanji}":
          </label>
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswer === opt.type;
              const isCorrect = opt.type === currentQ.correctType;
              let btnStyle = 'bg-[#121414] border-[#282a2b] text-[#e2e2e2] hover:border-[#FAB917]/50';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                } else {
                  btnStyle = 'bg-[#121414] border-[#282a2b] text-[#333535] opacity-50';
                }
              }

              return (
                <button
                  key={opt.type}
                  onClick={() => handleSelectOption(opt.type)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <div>
                    <div className="text-sm font-bold font-mono">{opt.label}</div>
                    <div className="text-xs text-[#A1A1A1] mt-0.5">{opt.description}</div>
                  </div>

                  {selectedAnswer !== null && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback & Explanation */}
        {selectedAnswer !== null && (
          <div className="p-4 bg-[#121414] rounded-xl border border-[#282a2b] space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#FAB917] font-bold">
                  Correct Accent Visual:
                </span>
                <div className="flex items-center gap-1 font-['Hiragino_Sans',sans-serif] text-base">
                  {currentQ.morae.map((m, idx) => {
                    const pClass =
                      m.pitch === 'high'
                        ? 'pitch-high'
                        : m.pitch === 'drop'
                        ? 'pitch-drop'
                        : 'pitch-low';
                    return (
                      <span key={idx} className={`${pClass} px-1`}>
                        {m.mora}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#e2e2e2] leading-relaxed">{currentQ.explanation}</p>

            <button
              onClick={handleNext}
              className="w-full py-2.5 bg-[#FAB917] text-[#261900] font-bold text-xs rounded-full hover:opacity-90 transition-opacity"
            >
              {currentIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'See Results →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

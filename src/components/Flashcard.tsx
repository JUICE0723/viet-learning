import React, { useState } from 'react';
import { Volume2, ArrowRight, ArrowLeft, RotateCcw, Heart } from 'lucide-react';
import { VocabularyItem, isFavorite, toggleFavorite } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface FlashcardProps {
  item: VocabularyItem;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
  onFinish: () => void;
}

export default function Flashcard({ item, onNext, onPrev, currentIndex, total, onFinish }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const [isFav, setIsFav] = useState(() => isFavorite(item.vietnamese));

  React.useEffect(() => {
    setIsFav(isFavorite(item.vietnamese));
  }, [item]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFav = toggleFavorite(item);
    setIsFav(isNowFav);
  };

  const getHexPath = (text: string, type: 'words' | 'examples') => {
    const hex = Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `/audio/${type}/${hex}.mp3`;
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getHexPath(item.vietnamese, 'words');
    new Audio(url).play().catch(err => console.error('Audio playback failed:', err));
  };

  const playExampleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getHexPath(item.example_vn, 'examples');
    new Audio(url).play().catch(err => console.error('Audio playback failed:', err));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    if (currentIndex < total - 1) {
      onNext();
    } else {
      onFinish();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    onPrev();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <div className="mb-4 text-sm font-medium text-gray-500">
        詞彙 {currentIndex + 1} / {total}
      </div>
      
      <div 
        className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <AnimatePresence initial={false} mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button 
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition-colors ${isFav ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  <Heart className="w-6 h-6" fill={isFav ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={playAudio}
                  className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
              <h2 className="text-5xl font-bold text-gray-800 mb-6">{item.vietnamese}</h2>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> 點擊卡片翻面看翻譯
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl border border-blue-100 flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.chinese}</h2>
                  <p className="text-lg text-blue-600 font-medium">{item.vietnamese}</p>
                </div>
                <button 
                  onClick={playAudio}
                  className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-sm transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-grow">
                <div className="bg-white/60 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">南越發音指南</h3>
                  <p className="text-gray-700 leading-relaxed">{item.pronunciation}</p>
                </div>

                <div className="bg-white/60 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">例句</h3>
                    <button 
                      onClick={playExampleAudio}
                      className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-white transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-800 font-medium mb-2">{item.example_vn}</p>
                  <p className="text-gray-600 text-sm">{item.example_zh}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between w-full mt-8 px-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
              : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:text-blue-600'
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {currentIndex < total - 1 ? (
            <>下一張 <ArrowRight className="w-5 h-5" /></>
          ) : (
            '完成學習'
          )}
        </button>
      </div>
    </div>
  );
}

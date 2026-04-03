import React, { useState } from 'react';
import { BookOpen, Coffee, Plane, ShoppingBag, Clock, MessageCircle, BrainCircuit, Loader2, ChevronLeft } from 'lucide-react';
import { fetchVocabulary, VocabularyItem } from './lib/gemini';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  { id: 'greetings', name: '基礎問候', icon: MessageCircle, color: 'bg-blue-500' },
  { id: 'numbers', name: '數字與時間', icon: Clock, color: 'bg-purple-500' },
  { id: 'food', name: '飲食', icon: Coffee, color: 'bg-orange-500' },
  { id: 'transport', name: '交通與方向', icon: Plane, color: 'bg-teal-500' },
  { id: 'shopping', name: '購物', icon: ShoppingBag, color: 'bg-pink-500' },
  { id: 'daily', name: '日常生活', icon: BookOpen, color: 'bg-indigo-500' },
];

type ViewState = 'categories' | 'loading' | 'learning' | 'quiz';

export default function App() {
  const [view, setView] = useState<ViewState>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCategory = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    setView('loading');
    setError(null);
    try {
      const data = await fetchVocabulary(categoryName);
      if (data && data.length > 0) {
        setVocabulary(data);
        setCurrentIndex(0);
        setView('learning');
      } else {
        throw new Error('無法載入詞彙資料');
      }
    } catch (err) {
      setError('載入資料時發生錯誤，請稍後再試。');
      setView('categories');
    }
  };

  const handleBackToCategories = () => {
    setView('categories');
    setVocabulary([]);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {view !== 'categories' && (
              <button 
                onClick={handleBackToCategories}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 text-blue-600">
              <BookOpen className="w-6 h-6" />
              <h1 className="text-xl font-bold tracking-tight">越語小幫手 <span className="text-sm font-medium text-gray-500 ml-1 border border-gray-200 rounded-full px-2 py-0.5">南越口音</span></h1>
            </div>
          </div>
          {view === 'learning' && (
            <button
              onClick={() => setView('quiz')}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>隨堂測驗</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">今天想學什麼？</h2>
                <p className="text-gray-600">選擇一個主題，我們將為您自動生成包含南越口音發音指南與實用例句的專屬字卡。</p>
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.name)}
                      className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-left overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 rounded-bl-full ${cat.color} transition-transform group-hover:scale-110`} />
                      <div className={`w-12 h-12 rounded-xl ${cat.color} text-white flex items-center justify-center mb-4 shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{cat.name}</h3>
                      <p className="text-sm text-gray-500">點擊開始學習</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">正在為您準備「{selectedCategory}」詞彙...</h2>
              <p className="text-gray-500 text-sm">AI 正在整理南越口音發音指南與實用例句</p>
            </motion.div>
          )}

          {view === 'learning' && vocabulary.length > 0 && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="py-4"
            >
              <Flashcard
                item={vocabulary[currentIndex]}
                currentIndex={currentIndex}
                total={vocabulary.length}
                onNext={() => setCurrentIndex(prev => prev + 1)}
                onPrev={() => setCurrentIndex(prev => prev - 1)}
                onFinish={() => setView('quiz')}
              />
            </motion.div>
          )}

          {view === 'quiz' && vocabulary.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Quiz 
                vocabulary={vocabulary} 
                onFinish={() => handleBackToCategories()} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

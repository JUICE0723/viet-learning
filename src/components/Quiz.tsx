import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../lib/gemini';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizProps {
  vocabulary: VocabularyItem[];
  onFinish: (score: number, wrongAnswers?: VocabularyItem[]) => void;
}

export default function Quiz({ vocabulary, onFinish }: QuizProps) {
  const [questions, setQuestions] = useState<{
    word: VocabularyItem;
    options: string[];
  }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    // Generate questions
    const generatedQuestions = vocabulary.map((item) => {
      const otherOptions = vocabulary
        .filter((v) => v.vietnamese !== item.vietnamese)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => v.chinese);
      
      const options = [...otherOptions, item.chinese].sort(() => 0.5 - Math.random());
      
      return {
        word: item,
        options,
      };
    }).sort(() => 0.5 - Math.random()); // Shuffle questions

    setQuestions(generatedQuestions);
  }, [vocabulary]);

  const handleSelect = (option: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    setSelectedAnswer(option);
    
    const isCorrect = option === questions[currentIndex].word.chinese;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers(prev => {
        if (!prev.find(w => w.vietnamese === questions[currentIndex].word.vietnamese)) {
          return [...prev, questions[currentIndex].word];
        }
        return prev;
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) return <div>載入測驗中...</div>;

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold">{Math.round((score / questions.length) * 100)}%</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">測驗完成！</h2>
        <p className="text-gray-600 mb-8">
          你答對了 {score} 題，共 {questions.length} 題。
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onFinish(score)}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> 回到主選單
          </button>
          {wrongAnswers.length > 0 && (
            <button
              onClick={() => onFinish(score, wrongAnswers)}
              className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              複習錯題區 ({wrongAnswers.length})
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500">
          問題 {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-sm font-medium text-blue-600">
          得分: {score}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
        <h2 className="text-center text-gray-500 text-sm font-semibold mb-4 uppercase tracking-wider">請選出正確的中文翻譯</h2>
        <div className="text-center mb-8">
          <span className="text-4xl font-bold text-gray-800">{currentQ.word.vietnamese}</span>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isCorrect = option === currentQ.word.chinese;
            const isSelected = selectedAnswer === option;
            
            let buttonClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ";
            
            if (!isAnswered) {
              buttonClass += "border-gray-100 hover:border-blue-300 hover:bg-blue-50 text-gray-700";
            } else {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-700";
              } else if (isSelected) {
                buttonClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                buttonClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {currentIndex < questions.length - 1 ? '下一題' : '查看結果'} <ArrowRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

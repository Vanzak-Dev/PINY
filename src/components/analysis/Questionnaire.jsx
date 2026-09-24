import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const questions = [
  {
    id: 'frequencia_acne',
    question: 'Com que frequência você tem espinhas?',
    options: [
      { value: 'raramente', label: 'Raramente', emoji: '😊' },
      { value: 'algumas_vezes', label: 'Algumas vezes por mês', emoji: '😐' },
      { value: 'frequente', label: 'Toda semana', emoji: '😕' },
      { value: 'muito_frequente', label: 'Sempre tenho', emoji: '😓' }
    ]
  },
  {
    id: 'sensibilidade_historico',
    question: 'Sua pele é sensível?',
    options: [
      { value: 'nenhuma', label: 'Nada sensível', emoji: '💪' },
      { value: 'leve', label: 'Um pouco sensível', emoji: '🌸' },
      { value: 'moderada', label: 'Moderadamente sensível', emoji: '⚠️' },
      { value: 'alta', label: 'Muito sensível', emoji: '🔴' }
    ]
  },
  {
    id: 'rotina_atual',
    question: 'Como é sua rotina atual de skincare?',
    options: [
      { value: 'nenhuma', label: 'Não tenho rotina', emoji: '🆕' },
      { value: 'basica', label: 'Só lavo o rosto', emoji: '💧' },
      { value: 'intermediaria', label: 'Limpeza + hidratante', emoji: '✨' },
      { value: 'completa', label: 'Rotina completa', emoji: '🌟' }
    ]
  },
  {
    id: 'objetivo_principal',
    question: 'Qual seu principal objetivo?',
    options: [
      { value: 'acne', label: 'Reduzir acne e espinhas', emoji: '🎯' },
      { value: 'manchas', label: 'Clarear manchas', emoji: '✨' },
      { value: 'poros', label: 'Diminuir poros e cravos', emoji: '🔬' },
      { value: 'oleosidade', label: 'Controlar oleosidade', emoji: '💎' }
    ]
  },
  {
    id: 'tempo_disponivel',
    question: 'Quanto tempo você tem para cuidar da pele?',
    options: [
      { value: 'pouco', label: 'Menos de 5 min', emoji: '⚡' },
      { value: 'medio', label: '5-10 minutos', emoji: '⏱️' },
      { value: 'bastante', label: '10-20 minutos', emoji: '🕐' },
      { value: 'muito', label: 'O que precisar', emoji: '🧘' }
    ]
  }
];

export default function Questionnaire({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-400 to-pink-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          {currentIndex + 1} de {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-medium text-gray-800 text-center mb-8">
            {current.question}
          </h2>

          <div className="space-y-3">
            {current.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  answers[current.id] === option.value
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-gray-100 hover:border-rose-200 hover:bg-rose-50/50'
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-gray-700 font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {currentIndex > 0 && (
        <Button
          variant="ghost"
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="mt-6 text-gray-400"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import QuizCheckIcon from './QuizCheckIcon';
import QuizProgressRing from './QuizProgressRing';
import QuizStepIndicator from './QuizStepIndicator';
import QuizTimeline from './QuizTimeline';
import './QuizStepAnalyzing.css';

const ITEMS = [
  'Escaneando seu rosto',
  'Detectando pontos faciais',
  'Avaliando oleosidade e poros',
  'Verificando manchas e textura',
  'Mapeando quantidade de acne',
  'Montando sua rotina',
];

export default function QuizStepAnalyzing({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setProgress((value) => value + 1), 70);
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  const completedCount = Math.min(ITEMS.length, Math.ceil((progress / 100) * ITEMS.length));

  const items = ITEMS.map((text, index) => ({
    text,
    variant: index < completedCount ? 'done' : 'pending',
    markerContent: index < completedCount ? <QuizCheckIcon /> : null,
  }));

  return (
    <div className="quiz-analyzing">
      <QuizStepIndicator current={2} />

      <div className="quiz-analyzing__body">
        <QuizProgressRing ariaLabel={`Analisando, ${progress}% concluído`}>
          <span className="quiz-analyzing__percent">{progress}%</span>
          <span className="quiz-analyzing__label">Analisando</span>
        </QuizProgressRing>

        <div className="quiz-analyzing__list" aria-live="polite">
          <QuizTimeline items={items} />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import SkinAnalysisHero from '../sections/skin-analysis/Hero';
import SkinAnalysisQuiz from '../sections/skin-analysis/Quiz';

export default function AnaliseSuaPelePage() {
  const [quizStarted, setQuizStarted] = useState(false);

  return (
    <main>
      {quizStarted ? <SkinAnalysisQuiz /> : <SkinAnalysisHero onStart={() => setQuizStarted(true)} />}
    </main>
  );
}

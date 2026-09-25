import { useState, useEffect } from 'react';
import BeforeAfterSlider from '../../components/product/BeforeAfterSlider';
import resultBefore from '../../assets/images/skin-analysis-quiz/result-before.webp';
import resultAfter from '../../assets/images/skin-analysis-quiz/result-after.webp';
import QuizCheckIcon from './QuizCheckIcon';
import QuizTimeline from './QuizTimeline';
import './QuizStepBeforeAfter.css';

const DEFAULT_COLUMN_1 = ['Poros menos visíveis', 'Textura mais uniforme'];
const DEFAULT_COLUMN_2 = ['Pele equilibrada', 'Pele sem brilho'];

function getImprovements(analysisResult) {
  if (!analysisResult?.scores) {
    return [DEFAULT_COLUMN_1, DEFAULT_COLUMN_2];
  }

  const { scores } = analysisResult;
  const problems = [
    { key: 'acne', score: scores.acne || 0, text: 'Acne reduzida' },
    { key: 'manchas', score: scores.manchas || 0, text: 'Manchas atenuadas' },
    { key: 'poros', score: scores.poros || 0, text: 'Poros menos visíveis' },
    { key: 'oleosidade', score: scores.oleosidade || 0, text: 'Menos oleosidade' },
  ];

  const improvements = [];
  const topProblems = problems
    .filter((p) => p.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((p) => p.text);

  topProblems.forEach((p) => improvements.push(p));
  if (improvements.length < 2) improvements.push('Pele equilibrada');
  improvements.push('Textura mais uniforme');
  improvements.push('Pele sem brilho');

  const all = improvements.slice(0, 4);
  const mid = Math.ceil(all.length / 2);
  return [all.slice(0, mid), all.slice(mid)];
}

export default function QuizStepBeforeAfter({ analysisResult, onNext }) {
  const [column1, column2] = getImprovements(analysisResult);
  const beforeImage = analysisResult?.selfie_url || resultBefore;
  const [afterImage, setAfterImage] = useState(null);

  useEffect(() => {
    if (!analysisResult?.selfie_url) return;

    let cancelled = false;

    fetch('/api/generate-after-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selfie_url: analysisResult.selfie_url,
        top_problem: analysisResult.top_problem,
        scores: analysisResult.scores,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!cancelled && data.url) setAfterImage(data.url);
      })
      .catch((err) => console.error('[BeforeAfter] generate error:', err));

    return () => {
      cancelled = true;
    };
  }, [analysisResult?.selfie_url]);

  const displayAfterImage = afterImage || resultAfter;

  const toItems = (labels) =>
    labels.map((text) => ({ key: text, text, variant: 'done', markerContent: <QuizCheckIcon /> }));

  return (
    <div className="quiz-before-after">
      <div className="quiz-before-after__heading">
        <h2 className="quiz-before-after__title">
          <span>Resultados reais</span>
          <span>em 21 dias</span>
        </h2>
        <p className="quiz-before-after__subtitle">Veja o que nossos clientes alcançaram com o Desafio 21 Dias</p>
      </div>

      <BeforeAfterSlider
        className="quiz-before-after__slider"
        beforeImage={beforeImage}
        afterImage={displayAfterImage}
        beforeAlt="Pele antes do tratamento, com acne visível"
        afterAlt="Pele depois do tratamento, limpa e uniforme"
        beforeLabel="ANTES"
        afterLabel="DEPOIS"
      />

      <div className="quiz-before-after__columns">
        <QuizTimeline items={toItems(column1)} />
        <QuizTimeline items={toItems(column2)} />
      </div>

      <div className="quiz-before-after__note">
        <p className="quiz-before-after__note-title">Essa pode ser você em 21 dias!</p>
        <p className="quiz-before-after__note-text">
          Com o Desafio 21 Dias Piny, resultados reais e duradouros estão ao seu alcance.
        </p>
      </div>

      <p className="quiz-before-after__disclaimer">
        *Simulação baseada em resultados médios de clientes. Resultados podem variar.
      </p>

      <button type="button" className="quiz-btn-primary quiz-before-after__btn" onClick={onNext}>
        Quero esses resultados
      </button>
    </div>
  );
}

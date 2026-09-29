import QuizCheckIcon from './QuizCheckIcon';
import QuizProgressRing from './QuizProgressRing';
import QuizStepIndicator from './QuizStepIndicator';
import './QuizStepResult.css';

const FALLBACK_TAGS = ['Tipo de pele: Oleosa', 'Gravidade: Moderada'];

const FALLBACK_CONDITIONS = [
  'Acne ativa moderada',
  'Manchas pós-acne',
  'Poros dilatados',
  'Oleosidade excessiva',
  'Vermelhidão leve',
  'Textura leve',
];

const FALLBACK_METRICS = [
  { label: 'Acne Ativa', value: 7 },
  { label: 'Oleosidade', value: 8 },
  { label: 'Manchas', value: 4 },
  { label: 'Cravos/Poros', value: 6 },
  { label: 'Vermelhidão', value: 5 },
  { label: 'Textura', value: 6 },
];

const SCORE_KEYS = [
  { key: 'acne', label: 'Acne Ativa' },
  { key: 'oleosidade', label: 'Oleosidade' },
  { key: 'manchas', label: 'Manchas' },
  { key: 'poros', label: 'Cravos/Poros' },
  { key: 'vermelhidao', label: 'Vermelhidão' },
  { key: 'textura', label: 'Textura' },
];

const REQUIRED_SCORE_KEYS = ['acne', 'manchas', 'poros', 'oleosidade', 'vermelhidao', 'textura'];

function isValidScores(scores) {
  if (!scores || typeof scores !== 'object') return false;
  return REQUIRED_SCORE_KEYS.every(
    (key) => typeof scores[key] === 'number' && !isNaN(scores[key])
  );
}

export default function QuizStepResult({ result, onNext }) {
  if (!isValidScores(result?.scores)) {
    return (
      <div className="quiz-result">
        <QuizStepIndicator current={3} />
        <div className="quiz-result__note">
          <span className="quiz-timeline__marker quiz-timeline__marker--done" aria-hidden="true">
            <QuizCheckIcon />
          </span>
          <p>Não foi possível interpretar completamente os resultados da sua análise. Você pode continuar para ver as recomendações.</p>
        </div>
        <button type="button" className="quiz-btn-primary quiz-result__btn" onClick={onNext}>
          Entender meu problema
        </button>
      </div>
    );
  }

  const tags = result
    ? [`Tipo de pele: ${result.tipo_pele || '—'}`, `Gravidade: ${result.gravidade_geral || '—'}`]
    : FALLBACK_TAGS;

  const conditions = result?.condicoes_identificadas?.length
    ? result.condicoes_identificadas
    : FALLBACK_CONDITIONS;

  const metrics = result?.scores
    ? SCORE_KEYS.map(({ key, label }) => ({ label, value: result.scores[key] ?? 0 }))
    : FALLBACK_METRICS;

  const scoreValues = result?.scores
    ? SCORE_KEYS.map(({ key }) => result.scores[key] ?? 0)
    : FALLBACK_METRICS.map((m) => m.value);
  const avgProblem = scoreValues.reduce((a, b) => a + b, 0) / (scoreValues.length || 1);
  const score = Math.max(20, Math.min(95, Math.round(100 - avgProblem * 9)));
  const scoreMax = 100;
  const maxMetric = Math.max(...metrics.map((metric) => metric.value));

  return (
    <div className="quiz-result">
      <QuizStepIndicator current={3} />

      <div className="quiz-result__summary">
        <QuizProgressRing ariaLabel={`Pontuação ${score} de ${scoreMax}`}>
          <span className="quiz-result__score">
            {score}
            <span className="quiz-result__score-max">/{scoreMax}</span>
          </span>
        </QuizProgressRing>

        <div className="quiz-result__tags">
          {tags.map((tag) => (
            <span className="quiz-result__tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="quiz-result__conditions">
        <p className="quiz-result__conditions-title">Condições Identificadas</p>
        <div className="quiz-result__conditions-list">
          {conditions.map((condition) => (
            <span className="quiz-result__tag" key={condition}>{condition}</span>
          ))}
        </div>
      </div>

      <div className="quiz-result__metrics">
        {metrics.map((metric) => (
          <div className="quiz-result__metric" key={metric.label}>
            <p className={`quiz-result__metric-label${metric.value === maxMetric ? ' is-highlight' : ''}`}>
              {metric.label}
            </p>
            <div className="quiz-result__metric-bar-wrap">
              <div className="quiz-result__metric-bar">
                <div className="quiz-result__metric-fill" style={{ width: `${(metric.value / 10) * 100}%` }} />
              </div>
              <span className="quiz-result__metric-value">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-result__note">
        <span className="quiz-timeline__marker quiz-timeline__marker--done" aria-hidden="true">
          <QuizCheckIcon />
        </span>
        <p>É 100% reversível em apenas 21 dias com o tratamento correto e consistente.</p>
      </div>

      <button type="button" className="quiz-btn-primary quiz-result__btn" onClick={onNext}>
        Entender meu problema
      </button>
    </div>
  );
}

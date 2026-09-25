import QuizCheckIcon from './QuizCheckIcon';
import QuizProgressRing from './QuizProgressRing';
import QuizStepIndicator from './QuizStepIndicator';
import './QuizStepResult.css';

const TAGS = ['Tipo de pele: Oleosa', 'Gravidade: Moderada'];

const CONDITIONS = [
  'Acne ativa moderada',
  'Manchas pós-acne',
  'Poros dilatados',
  'Oleosidade excessiva',
  'Vermelhidão leve',
  'Textura leve',
];

const METRICS = [
  { label: 'Acne Ativa', value: 7 },
  { label: 'Oleosidade', value: 8 },
  { label: 'Manchas', value: 4 },
  { label: 'Cravos/Poros', value: 6 },
  { label: 'Vermelhidão', value: 5 },
  { label: 'Textura', value: 6 },
];

const MAX_METRIC = Math.max(...METRICS.map((metric) => metric.value));

export default function QuizStepResult({ score = 46, scoreMax = 100, onNext }) {
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
          {TAGS.map((tag) => (
            <span className="quiz-result__tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="quiz-result__conditions">
        <p className="quiz-result__conditions-title">Condições Identificadas</p>
        <div className="quiz-result__conditions-list">
          {CONDITIONS.map((condition) => (
            <span className="quiz-result__tag" key={condition}>{condition}</span>
          ))}
        </div>
      </div>

      <div className="quiz-result__metrics">
        {METRICS.map((metric) => (
          <div className="quiz-result__metric" key={metric.label}>
            <p className={`quiz-result__metric-label${metric.value === MAX_METRIC ? ' is-highlight' : ''}`}>
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

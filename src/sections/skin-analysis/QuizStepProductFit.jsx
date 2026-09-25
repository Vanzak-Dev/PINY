import productJars from '../../assets/images/guarantee/jars-row.png';
import QuizCheckIcon from './QuizCheckIcon';
import QuizTimeline from './QuizTimeline';
import './QuizStepProductFit.css';

const REASONS = [
  'Refina poros e controla oleosidade: argila desobstrui profundamente e reduz o tamanho dos poros',
  'Remove cravos e impurezas: limpa em profundidade sem agredir a pele',
  'Equilibra a produção de sebo que dilata os poros',
  'Mantém a pele lisa e matificada com uso contínuo',
];

const REASON_ITEMS = REASONS.map((text, index) => ({
  text,
  variant: 'number',
  markerContent: index + 1,
}));

const RESULTS = ['Espinhas secam muito rápido', 'Inflamações diminuem visivelmente', 'Pele mais lisa, uniforme e iluminada'];

const RESULT_ITEMS = RESULTS.map((text) => ({
  key: text,
  text,
  variant: 'done',
  markerContent: <QuizCheckIcon />,
}));

export default function QuizStepProductFit({ onNext }) {
  return (
    <div className="quiz-fit">
      <div className="quiz-fit__heading">
        <h2 className="quiz-fit__title">
          <span>Máscara Piny:</span>
          <span>Seu Tratamento Completo</span>
        </h2>
        <p className="quiz-fit__subtitle">Descubra por que vai funcionar para sua pele</p>
      </div>

      <div className="quiz-fit__jars">
        <img src={productJars} alt="Linha de máscaras faciais Piny: argila preta, rosa, verde e amarela" />
      </div>

      <div className="quiz-fit__reasons">
        <p className="quiz-fit__reasons-title">Por que a Máscara Piny funciona para você:</p>
        <QuizTimeline items={REASON_ITEMS} />
      </div>

      <div className="quiz-fit__usage">
        <p className="quiz-fit__usage-title">Como usar?</p>
        <p className="quiz-fit__usage-highlight">Para uso geral: use 1x à noite</p>
        <p className="quiz-fit__usage-text">
          Aplicar na pele limpa, deixar 10-15 min e enxaguar. Use protetor solar durante o dia.
        </p>
      </div>

      <div className="quiz-fit__results">
        <p className="quiz-fit__results-title">Resultados visíveis em 21 dias:</p>
        <QuizTimeline items={RESULT_ITEMS} />
        <p className="quiz-fit__results-guarantee">Resultados em 21 dias ou seu dinheiro de volta!</p>
      </div>

      <button type="button" className="quiz-btn-primary quiz-fit__btn" onClick={onNext}>
        Ver prova social
      </button>
    </div>
  );
}

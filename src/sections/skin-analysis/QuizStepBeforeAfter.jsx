import BeforeAfterSlider from '../../components/product/BeforeAfterSlider';
import resultBefore from '../../assets/images/skin-analysis-quiz/result-before.webp';
import resultAfter from '../../assets/images/skin-analysis-quiz/result-after.webp';
import QuizCheckIcon from './QuizCheckIcon';
import QuizTimeline from './QuizTimeline';
import './QuizStepBeforeAfter.css';

const COLUMN_1 = ['Poros menos visíveis', 'Textura mais uniforme'];
const COLUMN_2 = ['Pele equilibrada', 'Pele sem brilho'];

const toItems = (labels) =>
  labels.map((text) => ({ key: text, text, variant: 'done', markerContent: <QuizCheckIcon /> }));

export default function QuizStepBeforeAfter({ onNext }) {
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
        beforeImage={resultBefore}
        afterImage={resultAfter}
        beforeAlt="Pele antes do tratamento, com acne visível"
        afterAlt="Pele depois do tratamento, limpa e uniforme"
        beforeLabel="ANTES"
        afterLabel="DEPOIS"
      />

      <div className="quiz-before-after__columns">
        <QuizTimeline items={toItems(COLUMN_1)} />
        <QuizTimeline items={toItems(COLUMN_2)} />
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

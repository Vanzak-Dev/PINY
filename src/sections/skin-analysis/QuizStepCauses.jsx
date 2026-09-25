import QuizCheckIcon from './QuizCheckIcon';
import QuizInfoStep from './QuizInfoStep';

const CAUSES = [
  'Produção excessiva de sebo pelas glândulas sebáceas',
  'Barreira cutânea desequilibrada tentando compensar',
  'Brilho excessivo que aparece poucas horas após limpar',
  'Maquiagem que não fixa e poros aparentes',
];

const ITEMS = CAUSES.map((text, index) => ({
  text,
  variant: 'number',
  markerContent: index + 1,
}));

export default function QuizStepCauses({ onNext }) {
  return (
    <QuizInfoStep
      titleLines={['Por que sua pele está', 'tão oleosa?']}
      subtitle="Análise das causas raiz identificadas pela IA"
      items={ITEMS}
      noteIcon={
        <span className="quiz-timeline__marker quiz-timeline__marker--done" aria-hidden="true">
          <QuizCheckIcon />
        </span>
      }
      noteTitle="Entendemos sua pele"
      noteText="Controlar a oleosidade não é ressecar, é equilibrar a produção natural de óleo da pele"
      footnote="Milhares de pessoas já resolveram esse problema com o método certo..."
      buttonLabel="Ver como resolver"
      onNext={onNext}
    />
  );
}

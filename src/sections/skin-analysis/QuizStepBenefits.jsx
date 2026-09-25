import QuizInfoStep from './QuizInfoStep';

const BENEFITS = [
  { title: 'Acalma vermelhidão rapidamente', text: 'Ação anti-inflamatória que reduz irritação e sensibilidade' },
  { title: 'Pele menos reativa em dias', text: 'Primeiras melhorias visíveis em 7 dias' },
  { title: 'Restaura a barreira cutânea', text: 'Fortalece a pele contra irritações externas' },
  { title: 'Tom uniforme e calmo', text: 'Reduz vermelhidão difusa e inflamação' },
];

const ITEMS = BENEFITS.map((benefit, index) => ({
  key: benefit.title,
  text: (
    <>
      <p className="quiz-timeline__item-title">{benefit.title}</p>
      <p className="quiz-timeline__item-desc">{benefit.text}</p>
    </>
  ),
  variant: 'number',
  markerContent: index + 1,
  alignStart: true,
}));

export default function QuizStepBenefits({ onNext }) {
  return (
    <QuizInfoStep
      titleLines={['É mais fácil do', 'que você imagina']}
      subtitle="Com os ativos certos, sua pele se transforma em semanas."
      items={ITEMS}
      noteTitle="Sem mistério, sem complicação"
      noteText="Apenas 3 minutos por dia para uma pele transformada."
      buttonLabel="Ver ativos ideais"
      onNext={onNext}
    />
  );
}

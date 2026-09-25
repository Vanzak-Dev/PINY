import QuizCheckIcon from './QuizCheckIcon';
import QuizInfoStep from './QuizInfoStep';

const ACTIVES = [
  { title: 'Argila (Kaolin)', text: 'Desobstrui poros profundamente e reduz seu tamanho visivelmente.' },
  { title: 'Óxido de Zinco', text: 'Ação anti-inflamatória e calmante que reduz vermelhidão e acalma a pele.' },
  { title: 'Ácido Glicólico', text: 'Esfolia, renova e uniformiza o tom da pele progressivamente.' },
  { title: 'Ácido Salicílico', text: 'Penetra nos poros, remove impurezas e refina a textura da pele.' },
  { title: 'Extrato de Abacaxi', text: 'Rico em enzimas que iluminam e renovam a pele.' },
  { title: 'Extrato de Hamamélis', text: 'Ação calmante que ajuda a uniformizar e equilibrar a pele.' },
];

const ITEMS = ACTIVES.map((active) => ({
  key: active.title,
  text: (
    <>
      <p className="quiz-timeline__item-title">{active.title}</p>
      <p className="quiz-timeline__item-desc">{active.text}</p>
    </>
  ),
  variant: 'done',
  markerContent: <QuizCheckIcon />,
  alignStart: true,
}));

export default function QuizStepActives({ onNext }) {
  return (
    <QuizInfoStep
      titleLines={['É mais fácil do', 'que você imagina']}
      subtitle="Com os ativos certos, sua pele se transforma em semanas."
      items={ITEMS}
      noteTitle="Esses ativos são o que sua pele precisa"
      noteText="Todos reunidos na Máscara Piny"
      buttonLabel="Conhecer o produto"
      onNext={onNext}
    />
  );
}

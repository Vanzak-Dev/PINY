import QuizCheckIcon from './QuizCheckIcon';
import QuizInfoStep from './QuizInfoStep';

const BASE_ACTIVES = [
  { key: 'argila', title: 'Argila (Kaolin)', desc: 'Desobstrui poros profundamente e reduz seu tamanho visivelmente.' },
  { key: 'oxido', title: 'Óxido de Zinco', desc: 'Ação anti-inflamatória e calmante que reduz vermelhidão e acalma a pele.' },
  { key: 'glico', title: 'Ácido Glicólico', desc: 'Esfolia, renova e uniformiza o tom da pele progressivamente.' },
  { key: 'salicilico', title: 'Ácido Salicílico', desc: 'Penetra nos poros, remove impurezas e refina a textura da pele.' },
  { key: 'abacaxi', title: 'Extrato de Abacaxi', desc: 'Rico em enzimas que iluminam e renovam a pele.' },
  { key: 'hamamelis', title: 'Extrato de Hamamélis', desc: 'Ação calmante que ajuda a uniformizar e equilibrar a pele.' },
];

function hasCondition(condicoes, match) {
  return condicoes?.some((c) => c.toLowerCase().includes(match));
}

function getPersonalizedActives(analysisResult) {
  const actives = BASE_ACTIVES.map((a) => ({ ...a }));

  if (!analysisResult) return actives;

  const { condicoes_identificadas: condicoes, scores } = analysisResult;

  const hasAcne = hasCondition(condicoes, 'acne') || (scores?.acne ?? 0) >= 4;
  const hasMelasma = hasCondition(condicoes, 'melasma');
  const hasManchas = hasCondition(condicoes, 'mancha') || (scores?.manchas ?? 0) >= 4;
  const hasVermelhidao = hasCondition(condicoes, 'vermelhidão') || hasCondition(condicoes, 'vermelhidao') || (scores?.vermelhidao ?? 0) >= 4;
  const hasPoros = hasCondition(condicoes, 'poros') || (scores?.poros ?? 0) >= 4;
  const hasOleosidade = hasCondition(condicoes, 'oleosidade') || (scores?.oleosidade ?? 0) >= 4;

  const byKey = Object.fromEntries(actives.map((a) => [a.key, a]));

  if (hasAcne) {
    byKey.argila.desc = 'Absorve oleosidade e acelera a secagem de espinhas sem ressecar.';
    byKey.salicilico.desc = 'Desobstrui poros, combate espinhas e previne novas inflamações.';
  }
  if (hasMelasma) {
    byKey.glico.desc = 'Esfolia e clareia melasma progressivamente, uniformizando o tom da pele.';
    byKey.abacaxi.desc = 'Rico em enzimas que clareiam manchas de melasma e iluminam a pele.';
    byKey.hamamelis.desc = 'Ação clareadora e antioxidante que melhora o tom da pele.';
  } else if (hasManchas) {
    byKey.glico.desc = 'Esfolia e diminui manchas escuras, uniformizando o tom da pele.';
    byKey.abacaxi.desc = 'Rico em enzimas que clareiam manchas pós-acne e iluminam a pele.';
  }
  if (hasVermelhidao) {
    byKey.oxido.desc = 'Potente anti-inflamatório que acalma vermelhidão e sensibilidade rapidamente.';
    byKey.hamamelis.desc = 'Acalma irritações, reduz vermelhidão e fortalece a barreira cutânea.';
  }
  if (hasPoros) {
    byKey.argila.desc = 'Desobstrui poros profundamente e reduz seu tamanho visivelmente.';
    byKey.salicilico.desc = 'Penetra nos poros, remove impurezas e refina a textura da pele.';
  }
  if (hasOleosidade) {
    byKey.argila.desc = 'Absorve excesso de oleosidade e mantém a pele equilibrada.';
    byKey.hamamelis.desc = 'Controla oleosidade e equilibra a produção de sebo.';
  }

  return actives;
}

export default function QuizStepActives({ analysisResult, onNext }) {
  const actives = getPersonalizedActives(analysisResult);

  const items = actives.map((active) => ({
    key: active.title,
    text: (
      <>
        <p className="quiz-timeline__item-title">{active.title}</p>
        <p className="quiz-timeline__item-desc">{active.desc}</p>
      </>
    ),
    variant: 'done',
    markerContent: <QuizCheckIcon />,
    alignStart: true,
  }));

  return (
    <QuizInfoStep
      titleLines={['É mais fácil do', 'que você imagina']}
      subtitle="Com os ativos certos, sua pele se transforma em semanas."
      items={items}
      noteTitle="Esses ativos são o que sua pele precisa"
      noteText="Todos reunidos na Máscara Piny"
      buttonLabel="Conhecer o produto"
      onNext={onNext}
    />
  );
}

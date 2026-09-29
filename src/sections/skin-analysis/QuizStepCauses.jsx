import QuizCheckIcon from './QuizCheckIcon';
import QuizInfoStep from './QuizInfoStep';

const DEFAULT_CAUSES = {
  titleLines: ['Por que sua pele está', 'tão oleosa?'],
  causes: [
    'Produção excessiva de sebo pelas glândulas sebáceas',
    'Barreira cutânea desequilibrada tentando compensar',
    'Brilho excessivo que aparece poucas horas após limpar',
    'Maquiagem que não fixa e poros aparentes',
  ],
  insight: 'Controlar a oleosidade não é ressecar, é equilibrar a produção natural de óleo da pele',
};

const EXPLANATIONS = {
  acne: {
    titleLines: ['Por que sua pele está', 'com acne?'],
    causes: [
      'Poros obstruídos por excesso de oleosidade e células mortas',
      'Bactérias que se multiplicam nos poros bloqueados causando acne',
      'Inflamação causando vermelhidão e sensibilidade',
      'Ciclo vicioso: mais inflamação = mais espinhas',
    ],
    insight: 'A acne não é apenas estética, é um processo inflamatório que precisa ser tratado de forma direcionada.',
  },
  manchas: {
    titleLines: ['Por que sua pele tem', 'manchas?'],
    causes: [
      'Manchas pós-inflamatórias que demoram para sumir',
      'Hiperpigmentação causada por inflamações antigas',
      'Renovação celular lenta deixando marcas visíveis',
      'Falta de uniformidade no tom da pele',
    ],
    insight: 'Manchas exigem ativos que trabalhem na renovação celular e clareamento progressivo.',
  },
  vermelhidao: {
    titleLines: ['Por que sua pele está', 'vermelha?'],
    causes: [
      'Pele sensível e reativa a produtos ou ambiente',
      'Vermelhidão difusa por inflamação ou dermatite',
      'Barreira cutânea comprometida aumentando sensibilidade',
      'Vasos sanguíneos dilatados deixando a pele avermelhada',
    ],
    insight: 'Vermelhidão precisa de tratamento calmante e anti-inflamatório para restaurar o equilíbrio da pele.',
  },
  poros: {
    titleLines: ['Por que sua pele tem', 'poros visíveis?'],
    causes: [
      'Poros dilatados por excesso de sebo e impurezas',
      'Acúmulo de células mortas e sujeira nos poros',
      "Textura irregular e aparência de pele 'casca de laranja'",
      'Cravos e pontos pretos que aumentam os poros',
    ],
    insight: 'Poros dilatados precisam de limpeza profunda e controle de oleosidade para refinar a textura.',
  },
  oleosidade: DEFAULT_CAUSES,
  textura: {
    titleLines: ['Por que sua pele tem', 'textura irregular?'],
    causes: [
      'Acúmulo de células mortas deixando a superfície áspera',
      'Poros dilatados e cravos criando relevo na pele',
      'Renovação celular lenta mantendo a textura desigual',
      'Oleosidade e impurezas obstruindo os poros',
    ],
    insight: 'Textura irregular precisa de esfoliação suave e renovação celular para deixar a pele lisa.',
  },
};

function hasCondition(condicoes, match) {
  return condicoes?.some((c) => c.toLowerCase().includes(match));
}

function getExplanation(analysisResult) {
  if (!analysisResult) return DEFAULT_CAUSES;

  const { condicoes_identificadas: condicoes, scores, top_problem } = analysisResult;

  const hasAcne = hasCondition(condicoes, 'acne');
  const hasMelasma = hasCondition(condicoes, 'melasma');
  const hasVermelhidao = hasCondition(condicoes, 'vermelhidão') || hasCondition(condicoes, 'vermelhidao');
  const hasDermatite = hasCondition(condicoes, 'dermatite');
  const hasFoliculite = hasCondition(condicoes, 'foliculite');

  if (hasDermatite) {
    return {
      titleLines: ['Por que sua pele está', 'com dermatite?'],
      causes: [
        'Inflamação crônica deixando a pele irritada e descamando',
        'Barreira cutânea comprometida causando sensibilidade extrema',
        'Vermelhidão, coceira e desconforto persistentes',
        'Ciclo de irritação: produtos errados pioram o quadro',
      ],
      insight: 'Dermatite precisa de tratamento específico com produtos calmantes e que restaurem a barreira cutânea.',
    };
  }

  if (hasFoliculite) {
    return {
      titleLines: ['Por que sua pele está', 'com foliculite?'],
      causes: [
        'Inflamação nos folículos pilosos causando pequenas espinhas',
        'Bactérias ou fungos infectando os folículos',
        'Comum em áreas com atrito, suor ou depilação',
        'Vermelhidão, coceira e bolinhas que parecem acne',
      ],
      insight: 'Foliculite precisa de limpeza profunda, controle bacteriano e ingredientes que acalmem a inflamação.',
    };
  }

  // Use top_problem from AI if available, otherwise compute from scores
  let problemKey = top_problem;
  if (!problemKey && scores) {
    const problems = [
      { key: 'acne', score: scores.acne || 0 },
      { key: 'manchas', score: scores.manchas || 0 },
      { key: 'poros', score: scores.poros || 0 },
      { key: 'oleosidade', score: scores.oleosidade || 0 },
      { key: 'vermelhidao', score: scores.vermelhidao || 0 },
      { key: 'textura', score: scores.textura || 0 },
    ];
    problemKey = problems.sort((a, b) => b.score - a.score)[0].key;
  }

  // Special case: acne + vermelhidão
  if (problemKey === 'acne' && hasVermelhidao) {
    return {
      titleLines: ['Por que sua pele está', 'com acne e vermelhidão?'],
      causes: [
        'Poros obstruídos por excesso de oleosidade e células mortas',
        'Bactérias multiplicando-se causando acne e inflamação',
        'Inflamação intensa causando vermelhidão e sensibilidade',
        'Ciclo vicioso: mais inflamação = mais espinhas e vermelhidão',
      ],
      insight: 'Acne inflamada com vermelhidão precisa de tratamento anti-inflamatório e calmante direcionado.',
    };
  }

  // Special case: manchas + melasma
  if (problemKey === 'manchas' && hasMelasma) {
    return {
      titleLines: ['Por que sua pele tem', 'melasma?'],
      causes: [
        'Melasma é hiperpigmentação causada por hormônios, sol e inflamação',
        'Manchas escuras e acastanhadas em maçãs do rosto, testa e queixo',
        'Renovação celular lenta mantém as manchas visíveis',
        'Exposição solar e inflamação pioram progressivamente',
      ],
      insight: 'Melasma precisa de tratamento específico com clareadores, esfoliantes e proteção solar rigorosa.',
    };
  }

  // Special case: manchas + acne
  if (problemKey === 'manchas' && hasAcne) {
    return {
      titleLines: ['Por que sua pele tem', 'acne e manchas?'],
      causes: [
        'Acne deixa manchas pós-inflamatórias roxas e escuras',
        'Hiperpigmentação causada por inflamações recentes',
        'Novas espinhas criam novas manchas continuamente',
        'Renovação celular lenta mantém as marcas visíveis',
      ],
      insight: 'Manchas exigem ativos que trabalhem na renovação celular e clareamento progressivo.',
    };
  }

  return EXPLANATIONS[problemKey] || EXPLANATIONS.acne;
}

export default function QuizStepCauses({ analysisResult, onNext }) {
  const explanation = getExplanation(analysisResult);

  const items = explanation.causes.map((text, index) => ({
    text,
    variant: 'number',
    markerContent: index + 1,
  }));

  return (
    <QuizInfoStep
      titleLines={explanation.titleLines}
      subtitle="Análise das causas raiz identificadas pela IA"
      items={items}
      noteIcon={
        <span className="quiz-timeline__marker quiz-timeline__marker--done" aria-hidden="true">
          <QuizCheckIcon />
        </span>
      }
      noteTitle="Entendemos sua pele"
      noteText={explanation.insight}
      footnote="Milhares de pessoas já resolveram esse problema com o método certo..."
      buttonLabel="Ver como resolver"
      onNext={onNext}
    />
  );
}

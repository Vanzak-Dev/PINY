import productJars from '../../assets/images/guarantee/jars-row.png';
import QuizCheckIcon from './QuizCheckIcon';
import QuizTimeline from './QuizTimeline';
import './QuizStepProductFit.css';

const DEFAULT_REASONS = [
  'Refina poros e controla oleosidade: argila desobstrui profundamente e reduz o tamanho dos poros',
  'Remove cravos e impurezas: limpa em profundidade sem agredir a pele',
  'Equilibra a produção de sebo que dilata os poros',
  'Mantém a pele lisa e matificada com uso contínuo',
];

const DEFAULT_USAGE = {
  highlight: 'Para uso geral: use 1x à noite',
  text: 'Aplicar na pele limpa, deixar 10-15 min e enxaguar. Use protetor solar durante o dia.',
};

const DEFAULT_RESULTS = ['Espinhas secam muito rápido', 'Inflamações diminuem visivelmente', 'Pele mais lisa, uniforme e iluminada'];

const REASONS_BY_PROBLEM = {
  acne: [
    'Trata acne e vermelhidão: argila e ácidos secam espinhas, reduzem inflamações e acalmam a pele',
    'Fórmula poderosa sem irritar: limpa profundamente e controla oleosidade sem ressecar',
    'Atua em diferentes tipos de acne: hormonal, inflamada e cística',
    'Mantém a pele equilibrada e livre de novas inflamações com uso contínuo',
  ],
  manchas: [
    'Clareia manchas e marcas de acne: ácidos e extratos naturais uniformizam o tom e reduzem hiperpigmentação',
    'Esfolia e renova: remove células mortas e acelera a renovação da pele sem irritar',
    'Reduz manchas escuras, roxas e antigas progressivamente com uso consistente',
    'Mantém a pele iluminada e uniforme, prevenindo novas manchas',
  ],
  vermelhidao: [
    'Acalma vermelhidão e sensibilidade: óxido de zinco e hamamélis reduzem inflamação e irritação',
    'Restaura a barreira cutânea: fortalece a pele contra agressões externas',
    'Reduz reatividade da pele progressivamente com uso contínuo',
    'Mantém a pele calma, uniforme e menos propensa a irritações',
  ],
  poros: DEFAULT_REASONS,
  oleosidade: [
    'Controla oleosidade excessiva: argila absorve excesso de sebo e equilibra a pele',
    'Fórmula matificante sem ressecar: regula a produção de óleo mantendo a hidratação',
    'Refina poros dilatados pela oleosidade e melhora a textura',
    'Mantém a pele equilibrada e sem brilho o dia todo',
  ],
  textura: [
    'Suaviza a textura: argila e ácidos esfoliam e renovam a superfície da pele',
    'Refina poros e remove cravos: limpa profundamente sem agredir',
    'Acelera a renovação celular deixando a pele mais lisa',
    'Mantém a pele uniforme e suave com uso contínuo',
  ],
};

function hasCondition(condicoes, match) {
  return condicoes?.some((c) => c.toLowerCase().includes(match));
}

function getReasons(analysisResult) {
  if (!analysisResult) return DEFAULT_REASONS;

  const { condicoes_identificadas: condicoes, scores, top_problem } = analysisResult;
  const hasFoliculite = hasCondition(condicoes, 'foliculite');

  if (hasFoliculite) {
    return [
      'Trata foliculite e inflamação nos folículos: argila, ácidos e óxido de zinco limpam e desinflamam',
      'Ação antibacteriana e calmante: elimina bactérias e reduz vermelhidão rapidamente',
      'Pode ser usada no rosto e corpo: eficaz em áreas com atrito, suor ou depilação',
      'Mantém os folículos limpos e livres de novas inflamações',
    ];
  }

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
  if (problemKey === 'acne' && (hasCondition(condicoes, 'vermelhidão') || hasCondition(condicoes, 'vermelhidao'))) {
    return [
      'Trata acne e vermelhidão intensa: argila, ácidos e óxido de zinco secam espinhas e acalmam inflamação',
      'Ação anti-inflamatória potente: reduz vermelhidão, irritação e sensibilidade rapidamente',
      'Atua em acne inflamada, hormonal e cística sem agredir a pele sensível',
      'Mantém a pele equilibrada, calma e livre de novas inflamações',
    ];
  }

  // Special case: manchas + melasma
  if (problemKey === 'manchas' && hasCondition(condicoes, 'melasma')) {
    return [
      'Clareia melasma e hiperpigmentação: ácido glicólico, extrato de abacaxi e hamamélis uniformizam o tom',
      'Esfolia progressivamente: remove células mortas e acelera renovação sem irritar pele sensível',
      'Reduz manchas acastanhadas, escuras e resistentes com uso consistente',
      'Mantém a pele iluminada, uniforme e protegida contra novas manchas',
    ];
  }

  return REASONS_BY_PROBLEM[problemKey] || REASONS_BY_PROBLEM.acne;
}

function getUserInstruction(analysisResult) {
  if (!analysisResult?.scores) return DEFAULT_USAGE;

  const { acne, poros, oleosidade } = analysisResult.scores;
  if ((acne ?? 0) >= 6) return { highlight: 'Para acne moderada/vulgar: use 2x ao dia (manhã e noite)', text: 'Aplicar camada fina na pele limpa, deixar 10-15 min e enxaguar. Use protetor solar durante o dia.' };
  if ((acne ?? 0) >= 3) return { highlight: 'Para acne leve: use 1x ao dia (noite)', text: 'Aplicar na pele limpa, deixar 10-15 min e enxaguar. Use protetor solar durante o dia.' };
  if ((poros ?? 0) >= 4 || (oleosidade ?? 0) >= 4) return { highlight: 'Para poros e oleosidade: use 1x a cada 2 dias (noite)', text: 'Aplicar na pele limpa, deixar 10-15 min e enxaguar. Use protetor solar durante o dia.' };
  return DEFAULT_USAGE;
}

function getResults21Days(analysisResult) {
  if (!analysisResult) return DEFAULT_RESULTS;

  const { condicoes_identificadas: condicoes, scores } = analysisResult;
  const results = [];

  const hasAcneResult = hasCondition(condicoes, 'acne') || (scores?.acne ?? 0) >= 4;
  const hasMelasmaResult = hasCondition(condicoes, 'melasma');
  const hasManchasResult = hasCondition(condicoes, 'mancha') || (scores?.manchas ?? 0) >= 4;
  const hasVermelhidaoResult = hasCondition(condicoes, 'vermelhidão') || hasCondition(condicoes, 'vermelhidao') || (scores?.vermelhidao ?? 0) >= 4;

  if (hasAcneResult) {
    results.push('Espinhas secam muito rápido');
    results.push('Inflamações diminuem visivelmente');
  }
  if (hasVermelhidaoResult) results.push('Vermelhidão reduz significativamente');
  if (hasMelasmaResult) results.push('Melasma clareia progressivamente');
  else if (hasManchasResult) results.push('Manchas escuras, roxas e antigas clareiam');
  if ((scores?.poros ?? 0) >= 4 || (scores?.oleosidade ?? 0) >= 4) {
    results.push('Poros refinados e menos visíveis');
    results.push('Controle de oleosidade sem ressecar');
  }
  results.push('Pele mais lisa, uniforme e iluminada');

  if (results.length <= 1) {
    return ['Espinhas secam muito rápido', 'Inflamações diminuem visivelmente', 'Manchas clareiam progressivamente', 'Pele mais lisa, uniforme e iluminada'];
  }

  return results;
}

export default function QuizStepProductFit({ analysisResult, onNext }) {
  const reasons = getReasons(analysisResult);
  const usage = getUserInstruction(analysisResult);
  const results = getResults21Days(analysisResult);

  const reasonItems = reasons.map((text, index) => ({
    text,
    variant: 'number',
    markerContent: index + 1,
  }));

  const resultItems = results.map((text) => ({
    key: text,
    text,
    variant: 'done',
    markerContent: <QuizCheckIcon />,
  }));

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
        <QuizTimeline items={reasonItems} />
      </div>

      <div className="quiz-fit__usage">
        <p className="quiz-fit__usage-title">Como usar?</p>
        <p className="quiz-fit__usage-highlight">{usage.highlight}</p>
        <p className="quiz-fit__usage-text">{usage.text}</p>
      </div>

      <div className="quiz-fit__results">
        <p className="quiz-fit__results-title">Resultados visíveis em 21 dias:</p>
        <QuizTimeline items={resultItems} />
        <p className="quiz-fit__results-guarantee">Resultados em 21 dias ou seu dinheiro de volta!</p>
      </div>

      <button type="button" className="quiz-btn-primary quiz-fit__btn" onClick={onNext}>
        Ver prova social
      </button>
    </div>
  );
}

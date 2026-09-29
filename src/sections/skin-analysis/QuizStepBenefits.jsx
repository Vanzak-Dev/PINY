import QuizInfoStep from './QuizInfoStep';

const DEFAULT_BENEFITS = [
  { title: 'Acalma vermelhidão rapidamente', desc: 'Ação anti-inflamatória que reduz irritação e sensibilidade' },
  { title: 'Pele menos reativa em dias', desc: 'Primeiras melhorias visíveis em 7 dias' },
  { title: 'Restaura a barreira cutânea', desc: 'Fortalece a pele contra irritações externas' },
  { title: 'Tom uniforme e calmo', desc: 'Reduz vermelhidão difusa e inflamação' },
];

const BENEFITS_BY_PROBLEM = {
  acne: [
    { title: 'Seca espinhas rapidamente', desc: 'Ação anti-inflamatória que combate a acne na raiz' },
    { title: 'Resultados visíveis em 7 dias', desc: 'Redução de inflamações e vermelhidão' },
    { title: 'Sem ressecar a pele', desc: 'Trata acne mantendo o equilíbrio da pele' },
    { title: 'Previne novas espinhas', desc: 'Controla oleosidade e desobstrui poros' },
  ],
  manchas: [
    { title: 'Clareia manchas escuras', desc: 'Atua diretamente na hiperpigmentação pós-acne' },
    { title: 'Renovação acelerada', desc: 'Primeiras melhorias no tom em 7 dias' },
    { title: 'Uniformiza o tom', desc: 'Esfolia e renova sem irritar' },
    { title: 'Ilumina a pele', desc: 'Deixa a pele mais clara e radiante' },
  ],
  poros: [
    { title: 'Refina poros dilatados', desc: 'Limpa profundamente e reduz o tamanho' },
    { title: 'Textura lisa em dias', desc: 'Primeiras melhorias visíveis em 7 dias' },
    { title: 'Remove cravos', desc: 'Desobstrui e purifica sem agredir' },
    { title: 'Controla oleosidade', desc: 'Regula sebo e mantém poros limpos' },
  ],
  oleosidade: [
    { title: 'Controla oleosidade', desc: 'Regula a produção de sebo sem ressecar' },
    { title: 'Pele matificada em dias', desc: 'Primeiras melhorias em 7 dias' },
    { title: 'Equilibra a pele', desc: 'Absorve excesso sem efeito rebote' },
    { title: 'Refina textura', desc: 'Reduz poros e deixa a pele lisa' },
  ],
  vermelhidao: DEFAULT_BENEFITS,
  textura: [
    { title: 'Textura lisa e uniforme', desc: 'Esfolia e renova a superfície da pele' },
    { title: 'Pele mais suave em dias', desc: 'Primeiras melhorias visíveis em 7 dias' },
    { title: 'Refina poros dilatados', desc: 'Desobstrui e reduz o relevo da pele' },
    { title: 'Renovação celular acelerada', desc: 'Remove células mortas sem agredir' },
  ],
};

function getBenefits(analysisResult) {
  if (!analysisResult) return DEFAULT_BENEFITS;

  const { top_problem, scores } = analysisResult;

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

  return BENEFITS_BY_PROBLEM[problemKey] || BENEFITS_BY_PROBLEM.acne;
}

export default function QuizStepBenefits({ analysisResult, onNext }) {
  const benefits = getBenefits(analysisResult);

  const items = benefits.map((benefit, index) => ({
    key: benefit.title,
    text: (
      <>
        <p className="quiz-timeline__item-title">{benefit.title}</p>
        <p className="quiz-timeline__item-desc">{benefit.desc}</p>
      </>
    ),
    variant: 'number',
    markerContent: index + 1,
    alignStart: true,
  }));

  return (
    <QuizInfoStep
      titleLines={['É mais fácil do', 'que você imagina']}
      subtitle="Com os ativos certos, sua pele se transforma em semanas."
      items={items}
      noteTitle="Sem mistério, sem complicação"
      noteText="Apenas 3 minutos por dia para uma pele transformada."
      buttonLabel="Ver ativos ideais"
      onNext={onNext}
    />
  );
}

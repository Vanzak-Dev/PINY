import StarRating, { STAR_PATH } from '../../components/product/StarRating';
import './QuizStepSocialProof.css';

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Marina, 24 anos',
    tag: 'Redução de 80% da acne',
    text: '"Em 15 dias já vi uma diferença incrível! Minha pele ficou menos oleosa e as espinhas secaram sem deixar marcas."',
  },
  {
    name: 'Carla, 29 anos',
    tag: 'Pele sem espinhas e inflamações',
    text: '"Sofria com acne adulta há anos. Com o Desafio 21 Dias, finalmente encontrei algo que funciona de verdade."',
  },
  {
    name: 'Beatriz, 26 anos',
    tag: 'Acne controlada em 3 semanas',
    text: '"Minha acne hormonal estava fora de controle. Depois do tratamento, minha pele está limpa e saudável."',
  },
];

const TESTIMONIALS_BY_PROBLEM = {
  acne: DEFAULT_TESTIMONIALS,
  manchas: [
    {
      name: 'Júlia, 22 anos',
      tag: 'Manchas 70% mais claras',
      text: '"As manchas escuras que eu tinha há meses clarearam muito! Minha pele está uniforme e iluminada."',
    },
    {
      name: 'Fernanda, 28 anos',
      tag: 'Manchas pós-acne clareadas',
      text: '"Sofria com marcas de acne antiga. Em 21 dias, as manchas roxas e escuras diminuíram tanto!"',
    },
    {
      name: 'Amanda, 25 anos',
      tag: 'Tom de pele uniforme',
      text: '"Tinha hiperpigmentação que me incomodava muito. A máscara realmente funciona!"',
    },
  ],
  poros: [
    {
      name: 'Rafaela, 23 anos',
      tag: 'Poros 60% menos visíveis',
      text: '"Meus poros eram super visíveis, parecia textura de laranja. Agora estão refinados e a pele muito mais lisa!"',
    },
    {
      name: 'Patrícia, 30 anos',
      tag: 'Poros refinados e textura lisa',
      text: '"Tinha poros dilatados e cravos constantes. Minha pele ficou mais refinada e os poros diminuíram muito!"',
    },
    {
      name: 'Camila, 27 anos',
      tag: 'Textura refinada',
      text: '"Os poros do meu nariz e bochechas eram enormes. Agora estão bem menores e a textura melhorou demais!"',
    },
  ],
  oleosidade: [
    {
      name: 'Larissa, 21 anos',
      tag: 'Oleosidade controlada',
      text: '"Minha pele era super oleosa, tinha que usar papel matificante toda hora. Agora está equilibrada o dia todo!"',
    },
    {
      name: 'Gabriela, 26 anos',
      tag: 'Pele equilibrada sem brilho',
      text: '"Tinha brilho excessivo até no inverno. Com o tratamento, minha pele ficou matinha e saudável."',
    },
    {
      name: 'Priscila, 24 anos',
      tag: 'Pele matinha o dia todo',
      text: '"Sofria com oleosidade extrema que causava espinhas. Agora minha pele está balanceada e sem inflamações!"',
    },
  ],
  melasma: [
    {
      name: 'Claudia, 38 anos',
      tag: 'Melasma clareado em 3 semanas',
      text: '"Meu melasma estava me tirando a autoestima. Em 21 dias, as manchas clarearam visivelmente!"',
    },
    {
      name: 'Renata, 42 anos',
      tag: 'Tom mais uniforme e iluminado',
      text: '"Tentei diversos tratamentos para melasma e nada funcionava. Com a Piny, finalmente vi resultados reais!"',
    },
    {
      name: 'Fernanda, 35 anos',
      tag: 'Hiperpigmentação reduzida',
      text: '"As manchas escuras do meu rosto diminuíram tanto que mal precisei usar base. Estou muito mais confiante!"',
    },
  ],
  vermelhidao: [
    {
      name: 'Sofia, 30 anos',
      tag: 'Vermelhidão reduzida em 70%',
      text: '"Minha pele vivia vermelha e irritada. Em 21 dias, a vermelhidão diminuiu muito e minha pele está calma!"',
    },
    {
      name: 'Carolina, 33 anos',
      tag: 'Sensibilidade controlada',
      text: '"Tinha pele super sensível e reativa. Agora consigo usar produtos sem medo e minha pele não fica mais irritada!"',
    },
    {
      name: 'Isabela, 28 anos',
      tag: 'Pele calma e equilibrada',
      text: '"Sofria com rosácea e minha pele estava sempre inflamada. O tratamento acalmou minha pele de forma incrível!"',
    },
  ],
  textura: [
    {
      name: 'Juliana, 25 anos',
      tag: 'Textura 70% mais suave',
      text: '"Minha pele era áspera e irregular. Em 21 dias, ficou lisinha e com poros bem menos visíveis!"',
    },
    {
      name: 'Renata, 31 anos',
      tag: 'Pele lisa e uniforme',
      text: '"A textura da minha pele sempre me incomodou. Com o tratamento, ficou suave e renovada!"',
    },
    {
      name: 'Bianca, 28 anos',
      tag: 'Textura refinada',
      text: '"Cravos e aspereza sumiram. Minha pele está lisa, uniforme e muito mais macia!"',
    },
  ],
};

const STATS = [
  { value: '94%', lines: ['Viram resultados', 'em 21 dias'] },
  { value: '15k+', lines: ['Clientes', 'Satisfeitos'] },
  { value: '4.9', lines: ['Avaliação', 'média'], withStar: true },
];

function hasCondition(condicoes, match) {
  return condicoes?.some((c) => c.toLowerCase().includes(match));
}

function getTestimonials(analysisResult) {
  if (!analysisResult) return DEFAULT_TESTIMONIALS;

  const { condicoes_identificadas: condicoes, scores, top_problem } = analysisResult;

  const hasAcne = hasCondition(condicoes, 'acne');
  const hasMelasma = hasCondition(condicoes, 'melasma');
  const hasVermelhidao = hasCondition(condicoes, 'vermelhidão') || hasCondition(condicoes, 'vermelhidao') || hasCondition(condicoes, 'sensibilidade');
  const hasManchas = hasCondition(condicoes, 'manchas');
  const hasPoros = hasCondition(condicoes, 'poros');
  const hasTextura = hasCondition(condicoes, 'textura');

  let category = top_problem;

  if (!category) {
    if (hasAcne) category = 'acne';
    else if (hasMelasma) category = 'melasma';
    else if (hasVermelhidao) category = 'vermelhidao';
    else if (hasManchas) category = 'manchas';
    else if (hasPoros) category = 'poros';
    else if (hasTextura) category = 'textura';
    else if (scores) {
      const problems = [
        { key: 'acne', score: scores.acne || 0 },
        { key: 'manchas', score: scores.manchas || 0 },
        { key: 'poros', score: scores.poros || 0 },
        { key: 'oleosidade', score: scores.oleosidade || 0 },
        { key: 'textura', score: scores.textura || 0 },
      ];
      category = problems.sort((a, b) => b.score - a.score)[0].key;
    }
  }

  return TESTIMONIALS_BY_PROBLEM[category] || TESTIMONIALS_BY_PROBLEM.acne;
}

export default function QuizStepSocialProof({ analysisResult, onNext }) {
  const testimonials = getTestimonials(analysisResult);

  return (
    <div className="quiz-social">
      <div className="quiz-social__heading">
        <h2 className="quiz-social__title">
          <span>Resultados reais</span>
          <span>em 21 dias</span>
        </h2>
        <p className="quiz-social__subtitle">Veja o que nossos clientes alcançaram com o Desafio 21 Dias</p>
      </div>

      {testimonials.map((testimonial) => (
        <div className="quiz-social__card" key={testimonial.name}>
          <div className="quiz-social__card-header">
            <div className="quiz-social__card-author">
              <span className="quiz-social__avatar" aria-hidden="true" />
              <div>
                <p className="quiz-social__name">{testimonial.name}</p>
                <StarRating stars={5} size={16} gap={2} color="#1c8c44" />
              </div>
            </div>
            <span className="quiz-social__tag">{testimonial.tag}</span>
          </div>
          <p className="quiz-social__quote">{testimonial.text}</p>
        </div>
      ))}

      <div className="quiz-social__stats">
        {STATS.map((stat) => (
          <div className="quiz-social__stat" key={stat.value}>
            <p className="quiz-social__stat-value">
              {stat.value}
              {stat.withStar && (
                <svg viewBox="0 0 25 24" width="0.72em" height="0.72em" aria-hidden="true">
                  <path d={STAR_PATH} fill="#1c8c44" />
                </svg>
              )}
            </p>
            <p className="quiz-social__stat-label">
              {stat.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <button type="button" className="quiz-btn-primary quiz-social__btn" onClick={onNext}>
        Quero esses resultados
      </button>
    </div>
  );
}

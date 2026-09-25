import StarRating, { STAR_PATH } from '../../components/product/StarRating';
import './QuizStepSocialProof.css';

const TESTIMONIALS = [
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

const STATS = [
  { value: '94%', lines: ['Viram resultados', 'em 21 dias'] },
  { value: '15k+', lines: ['Clientes', 'Satisfeitos'] },
  { value: '4.9', lines: ['Avaliação', 'média'], withStar: true },
];

export default function QuizStepSocialProof({ onNext }) {
  return (
    <div className="quiz-social">
      <div className="quiz-social__heading">
        <h2 className="quiz-social__title">
          <span>Resultados reais</span>
          <span>em 21 dias</span>
        </h2>
        <p className="quiz-social__subtitle">Veja o que nossos clientes alcançaram com o Desafio 21 Dias</p>
      </div>

      {TESTIMONIALS.map((testimonial) => (
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

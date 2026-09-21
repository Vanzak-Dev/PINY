import pineappleLeft from '../../assets/images/journey/abacaxi-esquerda.webp';
import pineappleRight from '../../assets/images/journey/abacaxi-direita.webp';
import './Journey21DaysSection.css';

const journeyCards = [
  {
    badge: 'DIAS 1 - 3',
    title: 'Pele limpa de verdade',
    description: 'A argila age fundo no poro desde a primeira aplicação; a oleosidade começa a ceder.',
    highlight: false,
  },
  {
    badge: 'DIA 7',
    title: 'Acne acalmando',
    description: 'Os ativos ajudam a reduzir a inflamação das espinhas ativas e a segurar novas erupções.',
    highlight: false,
  },
  {
    badge: 'DIA 14',
    title: 'Textura mais uniforme',
    description: 'A renovação constante contribui para suavizar marcas e equilibrar o tom da pele.',
    highlight: false,
  },
  {
    badge: 'DIA 21',
    title: 'Resultado garantido',
    description: 'A evolução aparece no espelho. Se não aparecer, seu dinheiro volta. Simples assim.',
    highlight: true,
  },
];

export default function Journey21DaysSection() {
  return (
    <section className="journey-21" aria-labelledby="journey-21-title">
      <div className="journey-21__heading">
        <h2 className="journey-21__title" id="journey-21-title">
          <span className="journey-21__title-line">SUA JORNADA DE</span>
          <span className="journey-21__title-accent">
            <img className="journey-21__pineapple" src={pineappleLeft} alt="" aria-hidden="true" />
            21 Dias
            <img className="journey-21__pineapple" src={pineappleRight} alt="" aria-hidden="true" />
          </span>
        </h2>
        <p className="journey-21__subtitle">
          Uso diário, evolução vísivel dia após dia, e a garantia esperando no fim.
        </p>
      </div>

      <div className="journey-21__cards">
        {journeyCards.map((card) => (
          <div
            key={card.title}
            className={`journey-21__card${card.highlight ? ' journey-21__card--highlight' : ''}`}
          >
            <span className="journey-21__badge">{card.badge}</span>
            <h3 className="journey-21__card-title">{card.title}</h3>
            <p className="journey-21__card-description">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

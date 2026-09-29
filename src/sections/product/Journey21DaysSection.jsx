import pineappleLeft from '../../assets/images/journey/abacaxi-esquerda.webp';
import pineappleRight from '../../assets/images/journey/abacaxi-direita.webp';
import './Journey21DaysSection.css';

export default function Journey21DaysSection({
  cards,
  titleLine = 'SUA JORNADA DE',
  titleAccent = '21 Dias',
  subtitle = 'Uso diário, evolução vísivel dia após dia, e a garantia esperando no fim.',
}) {
  const journeyCards = cards;

  return (
    <section
      className={`journey-21${journeyCards.length <= 3 ? ' journey-21--compact' : ''}`}
      aria-labelledby="journey-21-title"
    >
      <div className="journey-21__heading">
        <h2 className="journey-21__title" id="journey-21-title">
          <span className="journey-21__title-line">{titleLine}</span>
          <span className="journey-21__title-accent">
            <img className="journey-21__pineapple" src={pineappleLeft} alt="" aria-hidden="true" />
            {titleAccent}
            <img className="journey-21__pineapple" src={pineappleRight} alt="" aria-hidden="true" />
          </span>
        </h2>
        <p className="journey-21__subtitle">{subtitle}</p>
      </div>

      <div className="journey-21__cards">
        {journeyCards.map((card) => (
          <div
            key={card.title}
            className={`journey-21__card${card.highlight ? ' journey-21__card--highlight' : ''}`}
          >
            {card.badge && <span className="journey-21__badge">{card.badge}</span>}
            <h3 className="journey-21__card-title">{card.title}</h3>
            <p className="journey-21__card-description">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

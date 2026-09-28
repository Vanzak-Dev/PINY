import pineappleLeft from '../../assets/images/journey/abacaxi-esquerda.webp';
import pineappleRight from '../../assets/images/journey/abacaxi-direita.webp';
import { pinyMaskJourney } from '../../data/journey';
import './Journey21DaysSection.css';

export default function Journey21DaysSection({ content = pinyMaskJourney }) {
  const { titleTop, titleAccent, subtitle, cards } = content;

  return (
    <section className="journey-21" aria-labelledby="journey-21-title">
      <div className="journey-21__heading">
        <h2 className="journey-21__title" id="journey-21-title">
          <span className="journey-21__title-line">{titleTop}</span>
          <span className="journey-21__title-accent">
            <img className="journey-21__pineapple" src={pineappleLeft} alt="" aria-hidden="true" />
            {titleAccent}
            <img className="journey-21__pineapple" src={pineappleRight} alt="" aria-hidden="true" />
          </span>
        </h2>
        <p className="journey-21__subtitle">{subtitle}</p>
      </div>

      <div className={`journey-21__cards${cards.length < 4 ? ' journey-21__cards--compact' : ''}`}>
        {cards.map((card) => (
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

import { useEffect, useRef, useState } from 'react';
import pineappleIcon from '../../assets/images/kit-picker/pineapple-icon.svg';
import jarBranca from '../../assets/images/kit-picker/jar-branca.png';
import jarVerde from '../../assets/images/kit-picker/jar-verde.png';
import jarRosa from '../../assets/images/kit-picker/jar-rosa.png';
import jarPreta from '../../assets/images/kit-picker/jar-preta.png';
import './KitPickerSection.css';

const cards = [
  {
    id: 'branca',
    tag: 'PINY Original',
    name: 'Argila Branca',
    description: 'Acne e manchas, a clássica com mais de +200mil vendas.',
    background: 'rgba(255, 245, 71, 0.5)',
    jar: jarBranca,
    jarCrop: { left: '-23.32%', top: '-23.56%', size: '146.86%' },
  },
  {
    id: 'verde',
    tag: 'Antiacne',
    name: 'Argila Verde',
    description: 'Trata espinhas ativas e controle do oleosidade da pele.',
    background: 'rgba(164, 244, 132, 0.5)',
    jar: jarVerde,
    jarCrop: { left: '-34.12%', top: '-29.65%', size: '168.36%' },
  },
  {
    id: 'rosa',
    tag: 'Calmante',
    name: 'Argila Rosa',
    description: 'Ideal para peles sensiblilizadas e avermelhadas',
    background: 'rgba(237, 125, 156, 0.5)',
    jar: jarRosa,
    jarCrop: { left: '-32.22%', top: '-26.56%', size: '164.6%' },
  },
  {
    id: 'preta',
    tag: 'DETOX',
    name: 'Argila Preta',
    description: 'Diminui cravos, poros e oleosidade intensa.',
    background: 'rgba(0, 11, 6, 0.5)',
    jar: jarPreta,
    jarCrop: { left: '-30.16%', top: '-24.68%', size: '160.3%' },
  },
];

const cardsPerPage = 2;
const pageCount = Math.ceil(cards.length / cardsPerPage);

export default function KitPickerSection() {
  const trackRef = useRef(null);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const pageWidth = track.clientWidth;
        if (!pageWidth) return;
        const page = Math.min(pageCount - 1, Math.max(0, Math.round(track.scrollLeft / pageWidth)));
        setActivePage(page);
      });
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const goToPage = (page) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: page * track.clientWidth, behavior: 'smooth' });
    setActivePage(page);
  };

  return (
    <section className="kit-picker" aria-labelledby="kit-picker-heading">
      <div className="kit-picker__heading">
        <h2 id="kit-picker-heading" className="kit-picker__title">
          <span className="kit-picker__title-line">MONTE SEU KIT EM</span>
          <span className="kit-picker__title-line kit-picker__title-line--highlight">
            <img className="kit-picker__pineapple kit-picker__pineapple--left" src={pineappleIcon} alt="" aria-hidden="true" />
            3 Toques
            <img className="kit-picker__pineapple kit-picker__pineapple--right" src={pineappleIcon} alt="" aria-hidden="true" />
          </span>
        </h2>
        <p className="kit-picker__subtitle">Toque na argila que combina com a sua pele. A gente cuida do resto.</p>
      </div>

      <div className="kit-picker__track" ref={trackRef}>
        {cards.map((card) => (
          <article className="kit-picker__card" key={card.id}>
            <div className="kit-picker__visual" style={{ background: card.background }}>
              <div className="kit-picker__jar">
                <img
                  className="kit-picker__jar-image"
                  src={card.jar}
                  alt={card.name}
                  style={{
                    left: card.jarCrop.left,
                    top: card.jarCrop.top,
                    width: card.jarCrop.size,
                    height: card.jarCrop.size,
                  }}
                />
              </div>
            </div>

            <div className="kit-picker__info">
              <span className="kit-picker__tag">{card.tag}</span>
              <p className="kit-picker__name">{card.name}</p>
              <p className="kit-picker__description">{card.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="kit-picker__dots" role="tablist" aria-label="Páginas de argilas">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            type="button"
            role="tab"
            className={`kit-picker__dot${index === activePage ? ' is-active' : ''}`}
            key={index}
            aria-selected={index === activePage}
            aria-label={`Ir para página ${index + 1}`}
            onClick={() => goToPage(index)}
          />
        ))}
      </div>

      <button type="button" className="kit-picker__button">Não sabe qual é a sua? Descubra Agora!</button>
    </section>
  );
}

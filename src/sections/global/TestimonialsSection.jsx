import { useEffect, useRef, useState } from 'react';
import logoMarcaPop from '../../assets/images/testimonials/logo-marca-pop.svg';
import logoExame from '../../assets/images/testimonials/logo-exame.svg';
import logoTerra from '../../assets/images/testimonials/logo-terra.svg';
import './TestimonialsSection.css';

const testimonials = [
  {
    quote:
      'Foi a primeira marca no Brasil a desenvolver um sistema próprio de análise de pele com inteligência artificial.',
    logo: logoMarcaPop,
    alt: 'Marca Pop',
  },
  {
    quote:
      'A proposta é criar um ecossistema para quem tem pele oleosa e acneica, indo além do tratamento pontual da acne.',
    logo: logoExame,
    alt: 'Exame',
  },
  {
    quote:
      'Com a PINY, você não precisa escolher entre praticidade e resultado. Hoje, é possível ter os dois.',
    logo: logoTerra,
    alt: 'Terra',
  },
];

export default function TestimonialsSection() {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const [activePage, setActivePage] = useState(0);

  const getCards = () => trackRef.current?.querySelectorAll('.testimonials__card') ?? [];

  const handleScroll = () => {
    const track = trackRef.current;
    const cards = getCards();
    if (!track || !cards.length) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActivePage(closest);
  };

  const goToPage = (page) => {
    const track = trackRef.current;
    const card = getCards()[page];
    if (!track || !card) return;
    // Scroll-snap fights a JS-driven smooth scroll (Chrome/Safari can resolve
    // the snap instantly, skipping the animation), so snapping is suspended for
    // the duration of the animated scroll and restored after.
    window.clearTimeout(settleTimeoutRef.current);
    track.classList.add('is-settling');
    settleTimeoutRef.current = window.setTimeout(() => {
      track.classList.remove('is-settling');
    }, 600);
    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActivePage(page);
  };

  // Touch/pen already get native horizontal scrolling from `touch-action` below;
  // this drag-to-scroll is only for mouse users, who have no swipe gesture.
  // Tracking follows the pointer via window listeners (rather than
  // setPointerCapture) because capturing the pointer on this scrollable,
  // pannable element gets it silently released after the first move.
  const handlePointerMove = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag) return;
    const delta = event.clientX - drag.startX;
    track.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    trackRef.current?.classList.remove('is-settling');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
  };

  const handlePointerDown = (event) => {
    const track = trackRef.current;
    if (!track || event.pointerType !== 'mouse') return;
    window.clearTimeout(settleTimeoutRef.current);
    dragRef.current = { startX: event.clientX, startScrollLeft: track.scrollLeft };
    track.classList.add('is-settling');
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };

  useEffect(() => {
    handleScroll();
    return () => {
      window.clearTimeout(settleTimeoutRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  return (
    <section className="testimonials" aria-label="O que a imprensa diz sobre a PINY">
      <div className="testimonials__mobile">
        <div
          className="testimonials__track"
          ref={trackRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
        >
          {testimonials.map((item) => (
            <div className="testimonials__card" key={item.alt}>
              <p className="testimonials__quote">&#8220;{item.quote}&#8221;</p>
              <div className="testimonials__logo-slot">
                <img
                  className="testimonials__logo"
                  src={item.logo}
                  alt={item.alt}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials__dots" role="tablist" aria-label="Depoimentos">
          {testimonials.map((item, index) => (
            <button
              type="button"
              role="tab"
              className={`testimonials__dot${index === activePage ? ' is-active' : ''}`}
              key={item.alt}
              aria-selected={index === activePage}
              aria-label={`Ir para depoimento ${index + 1}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      </div>

      <div className="testimonials__desktop">
        {testimonials.map((item) => (
          <div className="testimonials__column" key={item.alt}>
            <p className="testimonials__quote">&#8220;{item.quote}&#8221;</p>
            <div className="testimonials__logo-slot">
              <img className="testimonials__logo" src={item.logo} alt={item.alt} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

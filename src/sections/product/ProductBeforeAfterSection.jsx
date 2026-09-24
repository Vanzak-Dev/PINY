import { useEffect, useRef, useState } from 'react';
import pineappleLeft from '../../assets/images/before-after/pineapple-left.svg';
import pineappleRight from '../../assets/images/before-after/pineapple-right.svg';
import './ProductBeforeAfterSection.css';

function SliderHandle({ hideKnob }) {
  return (
    <svg
      className="before-after__handle-svg"
      viewBox="0 0 62.1907 415.9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line x1="31.0954" y1="415.9" x2="31.0954" y2="0" stroke="white" strokeWidth="3.88692" />
      <g className={`before-after__handle-knob${hideKnob ? ' is-hidden' : ''}`}>
        <rect x="1.77506" y="178.631" width="58.6406" height="58.6406" rx="29.2885" fill="#00532E" />
        <rect x="1.77506" y="178.631" width="58.6406" height="58.6406" rx="29.2885" stroke="white" strokeWidth="3.55012" />
        <path d="M20.4063 216.697L11.6608 207.952L20.4063 199.206" stroke="white" strokeWidth="2.91519" strokeLinecap="round" />
        <path d="M41.7844 216.697L50.5299 207.952L41.7844 199.206" stroke="white" strokeWidth="2.91519" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function BeforeAfterCard({ item, beforeLabel, afterLabel }) {
  const frameRef = useRef(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX) => {
    const rect = frameRef.current.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  };

  // Mouse: a posicao segue o hover, sem precisar clicar. Touch: precisa arrastar
  // (nao existe hover em touch, e mover o dedo sem pressionar tambem rolaria a pagina).
  const handlePointerMove = (event) => {
    if (event.pointerType === 'mouse' || dragging) {
      updateFromClientX(event.clientX);
    }
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    frameRef.current.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const stopDragging = (event) => {
    setDragging(false);
    if (frameRef.current?.hasPointerCapture(event.pointerId)) {
      frameRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerEnter = (event) => {
    if (event.pointerType === 'mouse') setDragging(true);
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === 'mouse') setDragging(false);
  };

  return (
    <div className="before-after__card">
      <div
        className={`before-after__image${dragging ? ' is-active' : ''}`}
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <img
          className="before-after__photo"
          src={item.beforeImage}
          alt={`${item.name} antes`}
          draggable={false}
        />
        <img
          className="before-after__photo"
          src={item.afterImage}
          alt={`${item.name} depois`}
          draggable={false}
          style={{ clipPath: `inset(0 0 0 ${100 - position}%)` }}
        />

        <span className="before-after__badge before-after__badge--left">{beforeLabel}</span>
        <span className="before-after__badge before-after__badge--right">{afterLabel}</span>

        <div className="before-after__handle" style={{ left: `${position}%` }}>
          <SliderHandle hideKnob={dragging} />
        </div>
      </div>

      <div className="before-after__meta">
        <p className="before-after__name">{item.name}</p>
        <p className="before-after__usage">{item.usage}</p>
      </div>
    </div>
  );
}

export default function ProductBeforeAfterSection({ product }) {
  const items = product?.beforeAfterItems || [];
  const trackRef = useRef(null);
  const [activePage, setActivePage] = useState(0);

  const getCards = () => trackRef.current?.querySelectorAll('.before-after__card') ?? [];

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
    const card = getCards()[page];
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActivePage(page);
  };

  useEffect(() => {
    handleScroll();
  }, [items.length]);

  if (!product?.beforeAfterEnabled || !items.length) return null;

  return (
    <section className="before-after" aria-labelledby="before-after-title">
      <div className="before-after__heading">
        <h2 className="before-after__title" id="before-after-title">
          <span className="before-after__title-line">{product.beforeAfterTitle}</span>
          <span className="before-after__title-line before-after__title-accent">
            <img className="before-after__pineapple" src={pineappleLeft} alt="" aria-hidden="true" />
            {product.beforeAfterTitleAccent}
            <img className="before-after__pineapple" src={pineappleRight} alt="" aria-hidden="true" />
          </span>
        </h2>
        <p className="before-after__subtitle">{product.beforeAfterSubtitle}</p>
      </div>

      <div className="before-after__track" ref={trackRef} onScroll={handleScroll}>
        {items.map((item) => (
          <BeforeAfterCard
            key={item.name}
            item={item}
            beforeLabel={product.beforeAfterBeforeLabel}
            afterLabel={product.beforeAfterAfterLabel}
          />
        ))}
      </div>

      {items.length > 1 && (
        <div className="before-after__dots" role="tablist" aria-label="Depoimentos de antes e depois">
          {items.map((item, index) => (
            <button
              type="button"
              role="tab"
              className={`before-after__dot${index === activePage ? ' is-active' : ''}`}
              key={item.name}
              aria-selected={index === activePage}
              aria-label={`Ir para o depoimento de ${item.name}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

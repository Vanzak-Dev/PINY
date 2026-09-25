import { useRef, useState } from 'react';
import './BeforeAfterSlider.css';

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

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  className,
}) {
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
    <div
      className={`before-after__image${dragging ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <img className="before-after__photo" src={beforeImage} alt={beforeAlt} draggable={false} />
      <img
        className="before-after__photo"
        src={afterImage}
        alt={afterAlt}
        draggable={false}
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      />

      <span className="before-after__badge before-after__badge--left">{beforeLabel}</span>
      <span className="before-after__badge before-after__badge--right">{afterLabel}</span>

      <div className="before-after__handle" style={{ left: `${position}%` }}>
        <SliderHandle hideKnob={dragging} />
      </div>
    </div>
  );
}

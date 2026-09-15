import { useRef } from 'react';
import leafLeft from '../../assets/images/instafeed/instafeed-leaf-left.svg';
import leafRight from '../../assets/images/instafeed/instafeed-leaf-right.svg';
import photo01 from '../../assets/images/instafeed/instafeed-01.png';
import photo02 from '../../assets/images/instafeed/instafeed-02.png';
import photo03 from '../../assets/images/instafeed/instafeed-03.png';
import photo04 from '../../assets/images/instafeed/instafeed-04.png';
import photo05 from '../../assets/images/instafeed/instafeed-05.png';
import photo06 from '../../assets/images/instafeed/instafeed-06.png';
import photo07 from '../../assets/images/instafeed/instafeed-07.png';
import photo08 from '../../assets/images/instafeed/instafeed-08.png';
import photo09 from '../../assets/images/instafeed/instafeed-09.png';
import photo10 from '../../assets/images/instafeed/instafeed-10.png';
import './InstafeedSection.css';

const DRAG_THRESHOLD = 4;

// Placeholder destination until each post gets its own link from the CMS.
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/pinybrasil/';

const columns = [
  [
    { src: photo01, size: 'tall', href: INSTAGRAM_PROFILE_URL },
    { src: photo02, size: 'short', href: INSTAGRAM_PROFILE_URL },
  ],
  [
    { src: photo03, size: 'short', href: INSTAGRAM_PROFILE_URL },
    { src: photo04, size: 'tall', href: INSTAGRAM_PROFILE_URL },
  ],
  [
    { src: photo05, size: 'tall', crop: 'a', href: INSTAGRAM_PROFILE_URL },
    { src: photo06, size: 'short', crop: 'b', href: INSTAGRAM_PROFILE_URL },
  ],
  [
    { src: photo07, size: 'short', fallbackBg: true, href: INSTAGRAM_PROFILE_URL },
    { src: photo08, size: 'tall', fallbackBg: true, href: INSTAGRAM_PROFILE_URL },
  ],
  [
    { src: photo09, size: 'tall', href: INSTAGRAM_PROFILE_URL },
    { src: photo10, size: 'short', href: INSTAGRAM_PROFILE_URL },
  ],
];

export default function InstafeedSection() {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);

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
    if (Math.abs(delta) > DRAG_THRESHOLD) draggedRef.current = true;
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
    dragRef.current = { startX: event.clientX, startScrollLeft: track.scrollLeft };
    draggedRef.current = false;
    // Scroll-snap otherwise fights every JS-driven scrollLeft write during the
    // drag itself, snapping straight back to the nearest column each frame.
    track.classList.add('is-settling');
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };

  const handleTileClick = (event) => {
    if (draggedRef.current) event.preventDefault();
  };

  return (
    <section className="instafeed" aria-label="Publicações do Instagram @pinybrasil">
      <h2 className="instafeed__title">
        <p className="instafeed__title-line">SIGA @PINYBRASIL</p>
        <p className="instafeed__title-line">
          <span className="instafeed__tag">
            <img className="instafeed__leaf is-left" src={leafLeft} alt="" aria-hidden="true" />
            no instagram
            <img className="instafeed__leaf is-right" src={leafRight} alt="" aria-hidden="true" />
          </span>
        </p>
      </h2>

      <div
        className="instafeed__grid"
        ref={trackRef}
        onPointerDown={handlePointerDown}
      >
        {columns.map((tiles, columnIndex) => (
          <div className="instafeed__column" key={columnIndex}>
            {tiles.map((tile, tileIndex) => (
              <a
                className={[
                  'instafeed__tile',
                  `is-${tile.size}`,
                  tile.crop ? `instafeed__tile--crop-${tile.crop}` : '',
                  tile.fallbackBg ? 'has-fallback-bg' : '',
                ].filter(Boolean).join(' ')}
                key={tileIndex}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver publicação no Instagram"
                draggable={false}
                onClick={handleTileClick}
              >
                <img src={tile.src} alt="" draggable={false} loading="lazy" />
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

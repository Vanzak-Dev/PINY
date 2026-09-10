import { useEffect, useRef, useState } from 'react';
import CarouselArrowButton from '../../components/ui/CarouselArrowButton';
import { useUgcReviews } from '../../hooks/useUgcReviews';
import UgcProductPanel from './UgcProductPanel';
import PinyLoversLogo from './PinyLoversLogo';
import UgcBackgroundPattern from './UgcBackgroundPattern';
import selectorWhite from '../../assets/images/ugc/selector-white.webp';
import selectorPink from '../../assets/images/ugc/selector-pink.webp';
import selectorGreen from '../../assets/images/ugc/selector-green.webp';
import selectorBlack from '../../assets/images/ugc/selector-black.webp';
import './UgcReviewsSection.css';

const selectors = [selectorWhite, selectorPink, selectorGreen, selectorBlack];
const transitionDuration = 800;

function relativePosition(index, activeIndex, length) {
  let relative = index - activeIndex;
  const middle = Math.floor(length / 2);
  if (relative > middle) relative -= length;
  if (relative < -middle) relative += length;
  return relative;
}

function mediaElement(review) {
  if (review.mediaType === 'video') {
    return <video src={review.media} controls playsInline preload="metadata" aria-label={review.title || 'Review em vídeo'} />;
  }
  return <img src={review.media} alt={review.title || 'Review da comunidade PINY'} />;
}

export default function UgcReviewsSection({ products, onAdd }) {
  const reviews = useUgcReviews(products);
  const [activeIndex, setActiveIndex] = useState(Math.min(2, reviews.length - 1));
  const [isMoving, setIsMoving] = useState(false);
  const [repositioningIds, setRepositioningIds] = useState([]);
  const movementTimer = useRef(null);
  const repositionFrame = useRef(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(reviews.length - 1, 0)));
  }, [reviews.length]);

  useEffect(() => () => {
    window.clearTimeout(movementTimer.current);
    window.cancelAnimationFrame(repositionFrame.current);
  }, []);

  const move = (step) => {
    if (isMoving || reviews.length < 2) return;

    const nextIndex = (activeIndex + step + reviews.length) % reviews.length;
    const wrapping = reviews
      .filter((review, index) => Math.abs(
        relativePosition(index, nextIndex, reviews.length) - relativePosition(index, activeIndex, reviews.length),
      ) > 1)
      .map((review) => review.id);

    setIsMoving(true);
    setRepositioningIds(wrapping);
    setActiveIndex(nextIndex);

    repositionFrame.current = window.requestAnimationFrame(() => {
      repositionFrame.current = window.requestAnimationFrame(() => setRepositioningIds([]));
    });
    movementTimer.current = window.setTimeout(() => setIsMoving(false), transitionDuration);
  };

  return (
    <section className={`ugc-reviews${isMoving ? ' is-moving' : ''}`} aria-label="Reviews da comunidade PINY">
      <UgcBackgroundPattern />
      <div className="ugc-reviews__selectors" aria-hidden="true">
        {selectors.map((selector, index) => (
          <span className={`ugc-reviews__selector${index === 0 ? ' is-highlighted' : ''}`} key={selector}>
            <img src={selector} alt="" />
          </span>
        ))}
      </div>

      <PinyLoversLogo />

      <div className="ugc-reviews__carousel">
        <div className="ugc-reviews__stage">
          {reviews.map((review, index) => {
            const relative = relativePosition(index, activeIndex, reviews.length);
            const distance = Math.abs(relative);
            if (distance > 2) return null;
            const product = products.find((item) => item.id === review.productId) || products[index % products.length];
            return (
              <article
                className={`ugc-review-card${relative === 0 ? ' is-active' : ''}${repositioningIds.includes(review.id) ? ' is-repositioning' : ''}`}
                data-relative={relative}
                style={{ '--ugc-relative': relative }}
                key={review.id}
              >
                <div className="ugc-review-card__media">{mediaElement(review)}</div>
                <UgcProductPanel product={product} onAdd={onAdd} isActive={relative === 0} />
              </article>
            );
          })}
        </div>
        <CarouselArrowButton direction="previous" label="Ver review anterior" onClick={() => move(-1)} />
        <CarouselArrowButton direction="next" label="Ver próximo review" onClick={() => move(1)} />
      </div>
      <p className="ugc-reviews__position" aria-live="polite">Review {activeIndex + 1} de {reviews.length}</p>
    </section>
  );
}

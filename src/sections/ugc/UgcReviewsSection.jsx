import { useEffect, useMemo, useRef, useState } from 'react';
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

const selectors = [
  { image: selectorWhite, match: 'Branca' },
  { image: selectorPink, match: 'Rosa' },
  { image: selectorGreen, match: 'Verde' },
  { image: selectorBlack, match: 'Preta' },
];
const transitionDuration = 800;

function normalizeIndex(index, length) {
  return ((index % length) + length) % length;
}

function mediaElement(review) {
  if (review.mediaType === 'video') {
    return <video src={review.media} controls playsInline preload="metadata" aria-label={review.title || 'Review em vídeo'} />;
  }
  return <img src={review.media} alt={review.title || 'Review da comunidade PINY'} />;
}

export default function UgcReviewsSection({ products, onAdd, selectedProductId, onSelectProduct }) {
  const reviews = useUgcReviews(products);
  const reviewCount = reviews.length;
  const selectorProducts = selectors.map((selector) => (
    products.find((item) => item.name?.includes(selector.match))
  ));
  const activeFeaturedProduct = products.find((item) => item.id === selectedProductId)
    || products.find((item) => item.featureEnabled);

  const [activePosition, setActivePosition] = useState(() => reviewCount + Math.max(Math.min(2, reviewCount - 1), 0));
  const [isMoving, setIsMoving] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const movementTimer = useRef(null);

  const loopedReviews = useMemo(
    () => (reviewCount ? [...reviews, ...reviews, ...reviews] : []),
    [reviews, reviewCount],
  );

  useEffect(() => {
    if (!reviewCount) return undefined;
    setTransitionEnabled(false);
    setActivePosition(reviewCount + Math.max(Math.min(2, reviewCount - 1), 0));
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reviewCount]);

  useEffect(() => () => window.clearTimeout(movementTimer.current), []);

  useEffect(() => {
    if (!isMoving || !reviewCount) return undefined;

    movementTimer.current = window.setTimeout(() => {
      if (activePosition < reviewCount || activePosition >= reviewCount * 2) {
        setTransitionEnabled(false);
        setActivePosition(reviewCount + normalizeIndex(activePosition, reviewCount));
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)));
      }
      setIsMoving(false);
    }, transitionDuration);

    return () => window.clearTimeout(movementTimer.current);
  }, [activePosition, isMoving, reviewCount]);

  if (!reviewCount) return null;

  const activeIndex = normalizeIndex(activePosition, reviewCount);

  const move = (step) => {
    if (isMoving) return;
    setIsMoving(true);
    setActivePosition((current) => current + step);
  };

  return (
    <section className="ugc-reviews" aria-label="Reviews da comunidade PINY">
      <UgcBackgroundPattern />
      <div className="ugc-reviews__selectors">
        {selectors.map((selector, index) => {
          const selectorProduct = selectorProducts[index];
          const isHighlighted = Boolean(selectorProduct) && selectorProduct.id === activeFeaturedProduct?.id;
          return (
            <button
              type="button"
              className={`ugc-reviews__selector${isHighlighted ? ' is-highlighted' : ''}`}
              key={selector.match}
              disabled={!selectorProduct}
              aria-label={selectorProduct ? `Ver ${selectorProduct.name} em destaque` : undefined}
              aria-pressed={isHighlighted}
              onClick={() => selectorProduct && onSelectProduct?.(selectorProduct.id)}
            >
              <img src={selector.image} alt="" />
            </button>
          );
        })}
      </div>

      <PinyLoversLogo />

      <div className="ugc-reviews__carousel">
        <div className="ugc-reviews__stage">
          {loopedReviews.map((review, position) => {
            const relative = position - activePosition;
            const distance = Math.abs(relative);
            const isFar = distance > 2;
            const product = products.find((item) => item.id === review.productId) || products[position % products.length];
            return (
              <article
                className={`ugc-review-card${relative === 0 ? ' is-active' : ''}${isFar ? ' is-far' : ''}${transitionEnabled ? '' : ' is-repositioning'}`}
                data-relative={distance <= 2 ? relative : undefined}
                aria-hidden={isFar}
                style={{ '--ugc-relative': relative }}
                key={`${review.id}-${position}`}
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
      <p className="ugc-reviews__position" aria-live="polite">Review {activeIndex + 1} de {reviewCount}</p>
    </section>
  );
}

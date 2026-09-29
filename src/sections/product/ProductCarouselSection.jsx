import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import CarouselArrowButton from '../../components/ui/CarouselArrowButton';
import './ProductCarouselSection.css';

const transitionDuration = 700;

function normalizeIndex(index, length) {
  return ((index % length) + length) % length;
}

export default function ProductCarouselSection({ products, initialIndex = 0, onAdd }) {
  const productCount = products?.length || 0;
  const initialProductIndex = productCount ? normalizeIndex(initialIndex, productCount) : 0;
  const [activePosition, setActivePosition] = useState(productCount + initialProductIndex);
  const [isMoving, setIsMoving] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const loopedProducts = useMemo(
    () => productCount ? [...products, ...products, ...products] : [],
    [products, productCount],
  );

  useEffect(() => {
    if (!productCount) return;
    setTransitionEnabled(false);
    setActivePosition(productCount + normalizeIndex(initialIndex, productCount));
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
    return () => window.cancelAnimationFrame(frame);
  }, [initialIndex, productCount]);

  useEffect(() => {
    if (!isMoving || !productCount) return;

    const timer = window.setTimeout(() => {
      if (activePosition < productCount || activePosition >= productCount * 2) {
        setTransitionEnabled(false);
        setActivePosition(productCount + normalizeIndex(activePosition, productCount));
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)));
      }
      setIsMoving(false);
    }, transitionDuration);

    return () => window.clearTimeout(timer);
  }, [activePosition, isMoving, productCount]);

  const touchStartX = useRef(null);

  if (!productCount) return null;

  const activeIndex = normalizeIndex(activePosition, productCount);

  const move = (step) => {
    if (isMoving) return;
    setIsMoving(true);
    setActivePosition((current) => current + step);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const swipeThreshold = 40;
    if (deltaX > swipeThreshold) move(-1);
    else if (deltaX < -swipeThreshold) move(1);
  };

  return (
    <section
      className="product-carousel"
      aria-label="Produtos em destaque"
      aria-roledescription="carrossel"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="product-carousel__viewport">
        <div className="product-carousel__stage">
          {loopedProducts.map((product, position) => {
            const relativeIndex = position - activePosition;
            const distance = Math.abs(relativeIndex);
            const isCentered = relativeIndex === 0;
            const width = distance === 0 ? '23.4375vw' : distance === 1 ? '22.200365vw' : '20.9625vw';
            const height = distance === 0 ? '32.552083vw' : distance === 1 ? '30.833802vw' : '29.114583vw';
            const rotation = distance === 0 ? 0 : Math.sign(relativeIndex) * (distance === 1 ? 6 : 8);
            const bottomShift = distance === 0 ? '0' : distance === 1 ? '1.244635vw' : '4.516926vw';
            const gap = distance === 0 ? '0.833333vw' : distance === 1 ? '0.789323vw' : '0.745313vw';
            const fontStep = Math.min(distance, 2) * 2;
            const titleFontSize = `calc(1.666667vw - ${fontStep}px)`;
            const currentPriceFontSize = titleFontSize;
            const oldPriceFontSize = `calc(1.25vw - ${fontStep}px)`;
            const informationHeight = distance === 0 ? '3.411458vw' : distance === 1 ? '3.203125vw' : '3.098958vw';

            return (
              <div
                className={`product-carousel__slide${transitionEnabled ? '' : ' is-repositioning'}`}
                key={`${product.id}-${position}`}
                data-distance={distance}
                aria-hidden={distance > 2}
                style={{
                  '--slide-offset': relativeIndex,
                  '--slide-width': width,
                  '--slide-height': height,
                  '--slide-rotation': `${rotation}deg`,
                  '--slide-bottom-shift': bottomShift,
                  '--card-gap': gap,
                  '--title-font-size': titleFontSize,
                  '--current-price-font-size': currentPriceFontSize,
                  '--old-price-font-size': oldPriceFontSize,
                  '--information-height': informationHeight,
                  '--slide-depth': isCentered ? 2 : 1,
                  '--slide-opacity': distance > 2 ? 0 : 1,
                }}
              >
                <ProductCard
                  product={product}
                  isActive={isCentered}
                  isMotionLocked={isMoving}
                  onAdd={onAdd}
                />
              </div>
            );
          })}
        </div>

        <CarouselArrowButton
          direction="previous"
          label="Ver produto anterior"
          onClick={() => move(-1)}
        />
        <CarouselArrowButton
          direction="next"
          label="Ver próximo produto"
          onClick={() => move(1)}
        />
      </div>

      <p className="product-carousel__position" aria-live="polite">
        Produto {activeIndex + 1} de {productCount}: {products[activeIndex].name}
      </p>
    </section>
  );
}

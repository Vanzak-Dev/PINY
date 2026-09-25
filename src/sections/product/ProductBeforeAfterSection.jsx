import { useEffect, useRef, useState } from 'react';
import pineappleLeft from '../../assets/images/before-after/pineapple-left.svg';
import pineappleRight from '../../assets/images/before-after/pineapple-right.svg';
import BeforeAfterSlider from '../../components/product/BeforeAfterSlider';
import './ProductBeforeAfterSection.css';

function BeforeAfterCard({ item, beforeLabel, afterLabel }) {
  return (
    <div className="before-after__card">
      <BeforeAfterSlider
        beforeImage={item.beforeImage}
        afterImage={item.afterImage}
        beforeAlt={`${item.name} antes`}
        afterAlt={`${item.name} depois`}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />

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

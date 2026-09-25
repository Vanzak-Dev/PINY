import { useState } from 'react';
import FaqAccordionItem from '../../components/product/FaqAccordionItem';
import { faqItems } from '../../data/faq';
import patternBackground from '../../assets/product/benefits/pattern-background.svg';
import badgeEllipseOuter from '../../assets/product/faq/badge-ellipse-outer.svg';
import badgeEllipseInner from '../../assets/product/faq/badge-ellipse-inner.svg';
import pineappleLeft from '../../assets/product/faq/pineapple-left.svg';
import pineappleRight from '../../assets/product/faq/pineapple-right.svg';
import './ProductFaqSection.css';

export default function ProductFaqSection({ product }) {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const groupA = faqItems.slice(0, 3);
  const groupB = faqItems.slice(3, 6);

  const patternSrc = product?.faqPatternImage || patternBackground;

  return (
    <section className="product-faq" aria-labelledby="product-faq-heading" style={{ '--product-faq-bg': product?.faqBackgroundColor || '#fef8dd' }}>
      <img className="product-faq__pattern" src={patternSrc} alt="" aria-hidden="true" />

      <div className="product-faq__badge">
        <img className="product-faq__badge-ellipse product-faq__badge-ellipse--outer" src={badgeEllipseOuter} alt="" aria-hidden="true" />
        <img className="product-faq__badge-ellipse product-faq__badge-ellipse--inner" src={badgeEllipseInner} alt="" aria-hidden="true" />
        <h2 id="product-faq-heading" className="product-faq__badge-text">FAQ</h2>
        <img className="product-faq__badge-pineapple product-faq__badge-pineapple--left" src={pineappleLeft} alt="" aria-hidden="true" />
        <img className="product-faq__badge-pineapple product-faq__badge-pineapple--right" src={pineappleRight} alt="" aria-hidden="true" />
      </div>

      <div className="product-faq__groups">
        <div className="product-faq__group">
          {groupA.map((item) => (
            <FaqAccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
        <div className="product-faq__group product-faq__group--secondary">
          {groupB.map((item) => (
            <FaqAccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

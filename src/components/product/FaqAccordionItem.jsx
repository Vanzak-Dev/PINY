import iconPlus from '../../assets/product/faq/icon-plus.svg';
import './FaqAccordionItem.css';

export default function FaqAccordionItem({ id, question, answer, isOpen, onToggle }) {
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-button-${id}`;

  return (
    <div className={`faq-accordion-item${isOpen ? ' faq-accordion-item--open' : ''}`}>
      <button
        id={buttonId}
        type="button"
        className="faq-accordion-item__button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle(id)}
      >
        <span className="faq-accordion-item__question">{question}</span>
        <img className="faq-accordion-item__icon" src={iconPlus} alt="" aria-hidden="true" />
      </button>
      <div className="faq-accordion-item__panel" role="region" aria-labelledby={buttonId} id={panelId}>
        <div className="faq-accordion-item__panel-inner">
          <p className="faq-accordion-item__answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}

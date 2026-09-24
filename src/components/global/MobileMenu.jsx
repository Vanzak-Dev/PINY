import { useEffect } from 'react';
import analiseImg from '../../assets/menu/analisesuapele.webp';
import montesuaImg from '../../assets/menu/montesuatextura.webp';
import pinymasksImg from '../../assets/menu/pinymasks.webp';
import pinystarsImg from '../../assets/menu/pinystars.webp';
import './MobileMenu.css';

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
    <path d="M6.36395 6.36426C5.81167 6.36426 5.36395 6.81197 5.36395 7.36426C5.36395 7.91654 5.81167 8.36426 6.36395 8.36426V7.36426V6.36426ZM8.07106 8.07136C8.46158 7.68084 8.46158 7.04768 8.07106 6.65715L1.7071 0.29319C1.31657 -0.0973344 0.683409 -0.0973344 0.292885 0.29319C-0.0976396 0.683714 -0.0976396 1.31688 0.292885 1.7074L5.94974 7.36426L0.292885 13.0211C-0.0976396 13.4116 -0.0976396 14.0448 0.292885 14.4353C0.683409 14.8259 1.31657 14.8259 1.7071 14.4353L8.07106 8.07136ZM6.36395 7.36426V8.36426H7.36395V7.36426V6.36426H6.36395V7.36426Z" fill="#000B06"/>
  </svg>
);

const menuSections = [
  {
    title: 'Análise com IA',
    items: [
      { label: 'Analise sua Pele', image: analiseImg, href: '#' },
    ],
  },
  {
    title: 'Kits',
    items: [
      { label: 'Monte sua Textura', image: montesuaImg, href: '#' },
    ],
  },
  {
    title: 'Produtos',
    items: [
      { label: 'Piny Masks', image: pinymasksImg, href: '#' },
      { label: 'Piny Stars', image: pinystarsImg, href: '#' },
    ],
  },
];

export default function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu">
      <button type="button" className="mobile-menu__overlay" aria-label="Fechar menu" onClick={onClose} />
      <div className="mobile-menu__panel">
      <div className="mobile-menu__header">
        <span className="mobile-menu__title">Menu</span>
        <button type="button" className="mobile-menu__close" aria-label="Fechar menu" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
            <line x1="1.41415" y1="2.3584" x2="16.5059" y2="17.4502" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16.506" y1="2.59292" x2="1.41416" y2="17.6847" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="mobile-menu__body">
        {menuSections.map((section) => (
          <div key={section.title} className="mobile-menu__section">
            <h2 className="mobile-menu__section-title">{section.title}</h2>
            <div className="mobile-menu__items">
              {section.items.map((item) => (
                <a key={item.label} href={item.href} className="mobile-menu__item">
                  <img src={item.image} alt="" className="mobile-menu__item-img" draggable="false" />
                  <span className="mobile-menu__item-label">{item.label}</span>
                  <span className="mobile-menu__item-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

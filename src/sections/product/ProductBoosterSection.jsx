import { useState } from 'react';
import bottleTilted from '../../assets/product/booster/bottle-tilted.png';
import bottlePourBg from '../../assets/product/booster/bottle-pour-bg.png';
import bottlePurple from '../../assets/product/booster/bottle-purple.png';
import bottleCapPurple from '../../assets/product/booster/bottle-cap-purple.png';
import bottlePourBgPurple from '../../assets/product/booster/bottle-pour-bg-purple.png';
import waveBgDesktop from '../../assets/product/booster/wave-bg-desktop.svg';
import waveBgDesktopPurple from '../../assets/product/booster/wave-bg-desktop-purple.svg';
import waveBgMobile from '../../assets/product/booster/wave-bg-mobile.svg';
import waveBgMobilePurple from '../../assets/product/booster/wave-bg-mobile-purple.svg';
import droplet1 from '../../assets/product/booster/droplet-1.svg';
import droplet2 from '../../assets/product/booster/droplet-2.svg';
import droplet3 from '../../assets/product/booster/droplet-3.svg';
import droplet1Purple from '../../assets/product/booster/droplet-1-purple.svg';
import droplet2Purple from '../../assets/product/booster/droplet-2-purple.svg';
import droplet3Purple from '../../assets/product/booster/droplet-3-purple.svg';
import stepBase from '../../assets/product/booster/step-base.svg';
import stepBooster from '../../assets/product/booster/step-booster.svg';
import stepProduct from '../../assets/product/booster/step-product.svg';
import stepBasePurple from '../../assets/product/booster/step-base-purple.svg';
import stepBoosterPurple from '../../assets/product/booster/step-booster-purple.svg';
import stepProductPurple from '../../assets/product/booster/step-product-purple.svg';
import btnBuy from '../../assets/product/booster/btn-buy.svg';
import ellipseRing from '../../assets/product/booster/ellipse-ring.svg';
import './ProductBoosterSection.css';

const VARIANTS = {
  antiacne: {
    id: 'booster-antiacne',
    label: 'Booster Antiacne',
    nameLines: ['Booster', 'Antiacne'],
    price: 89,
    compareAtPrice: 129,
    pourBg: bottlePourBg,
    capImg: bottleTilted,
    capCrop: { top: '-53.74%', left: '-44.91%', width: '187.34%', height: '827.09%' },
    cardIcon: bottleTilted,
    cardIconBg: '#e98a07',
    cardIconGradientRgb: '249, 196, 124',
    waveDesktop: waveBgDesktop,
    waveMobile: waveBgMobile,
    step1: stepBase,
    step2: stepBooster,
    step3: stepProduct,
    droplet1,
    droplet2,
    droplet3,
  },
  antimanchas: {
    id: 'booster-anti-manchas',
    label: 'Booster Anti-Manchas',
    nameLines: ['Booster', 'Anti-Manchas'],
    price: 89,
    compareAtPrice: 129,
    pourBg: bottlePourBgPurple,
    pourBgCrop: { top: '1.47%', left: '0.26%', width: '133.41%', height: '100%' },
    capImg: bottleCapPurple,
    capCrop: { top: '0.86%', left: '1.27%', width: '100%', height: '719.5%' },
    cardIcon: bottlePurple,
    cardIconBg: '#9d7dc3',
    cardIconGradientRgb: '203, 177, 234',
    waveDesktop: waveBgDesktopPurple,
    waveMobile: waveBgMobilePurple,
    step1: stepBasePurple,
    step2: stepBoosterPurple,
    step3: stepProductPurple,
    droplet1: droplet1Purple,
    droplet2: droplet2Purple,
    droplet3: droplet3Purple,
  },
};

export default function ProductBoosterSection({ onAdd }) {
  const [selected, setSelected] = useState('antiacne');
  const active = VARIANTS[selected];

  return (
    <section className="product-booster" aria-label="Adicione o booster à sua rotina">
      <div className="product-booster__pour-bg" aria-hidden="true">
        <div className="product-booster__pour-bg-inner">
          <img src={active.pourBg} alt="" style={active.pourBgCrop} />
        </div>
      </div>

      <div className="product-booster__wave" aria-hidden="true">
        <img className="product-booster__wave-img product-booster__wave-img--desktop" src={active.waveDesktop} alt="" />
        <img className="product-booster__wave-img product-booster__wave-img--mobile" src={active.waveMobile} alt="" />
      </div>

      <div className="product-booster__cap" aria-hidden="true">
        <div className="product-booster__cap-inner">
          <img src={active.capImg} alt="" style={active.capCrop} />
        </div>
      </div>

      <div className="product-booster__drop product-booster__drop--1" aria-hidden="true">
        <div className="product-booster__drop-inner"><img src={active.droplet1} alt="" /></div>
      </div>
      <div className="product-booster__drop product-booster__drop--2" aria-hidden="true">
        <div className="product-booster__drop-inner"><img src={active.droplet2} alt="" /></div>
      </div>
      <div className="product-booster__drop product-booster__drop--3" aria-hidden="true">
        <div className="product-booster__drop-inner"><img src={active.droplet3} alt="" /></div>
      </div>

      <div className="product-booster__steps">
        <div className="product-booster__step product-booster__step--1">
          <img className="product-booster__step-icon" src={active.step1} alt="" aria-hidden="true" />
          <p className="product-booster__step-label">
            Escolha<br className="product-booster__break product-booster__break--mobile" /> sua Base
          </p>
        </div>
        <p className="product-booster__operator product-booster__operator--plus" aria-hidden="true">+</p>
        <div className="product-booster__step product-booster__step--2">
          <img className="product-booster__step-icon" src={active.step2} alt="" aria-hidden="true" />
          <p className="product-booster__step-label">
            Escolha seu<br className="product-booster__break product-booster__break--mobile" /> Booster
          </p>
        </div>
        <p className="product-booster__operator product-booster__operator--eq" aria-hidden="true">=</p>
        <div className="product-booster__step product-booster__step--3">
          <span className="product-booster__step-icon product-booster__step-icon--crop">
            <span className="product-booster__step-icon-inset">
              <img src={active.step3} alt="" />
            </span>
          </span>
          <p className="product-booster__step-label">
            Adicione ao<br className="product-booster__break product-booster__break--mobile" /> Produto
          </p>
        </div>
      </div>

      <div className="product-booster__cta">
        <p className="product-booster__cta-title">Adicione o booster a sua rotina:</p>
        <div className="product-booster__card">
          <div className="product-booster__card-main">
            <span
              className="product-booster__card-icon"
              style={{
                '--card-icon-bg': active.cardIconBg,
                '--card-icon-gradient': `rgba(${active.cardIconGradientRgb}, 0) 50%, rgba(${active.cardIconGradientRgb}, 1) 99.974%`,
              }}
            >
              <span className="product-booster__card-icon-crop">
                <img src={active.cardIcon} alt="" />
              </span>
            </span>
            <div className="product-booster__card-info">
              <p className="product-booster__card-name">
                {active.nameLines[0]}<br className="product-booster__break product-booster__break--desktop" /> {active.nameLines[1]}
              </p>
              <div className="product-booster__card-prices">
                <span className="product-booster__price">R$ {active.price},00</span>
                <span className="product-booster__price product-booster__price--old">R$ {active.compareAtPrice},00</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="product-booster__buy"
            onClick={() => onAdd?.({
              id: active.id,
              name: active.label,
              price: active.price,
              compareAtPrice: active.compareAtPrice,
              image: active.cardIcon,
            })}
            aria-label={`Adicionar ${active.label} ao carrinho`}
          >
            <img src={btnBuy} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="product-booster__variations">
        <button
          type="button"
          className={`product-booster__variation product-booster__variation--1${selected === 'antiacne' ? ' product-booster__variation--active' : ''}`}
          onClick={() => setSelected('antiacne')}
          aria-pressed={selected === 'antiacne'}
          aria-label="Selecionar Booster Antiacne"
        >
          <span className="product-booster__variation-crop">
            <img className="product-booster__variation-img" src={bottleTilted} alt="" />
          </span>
          <img className="product-booster__variation-ring" src={ellipseRing} alt="" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`product-booster__variation product-booster__variation--2${selected === 'antimanchas' ? ' product-booster__variation--active' : ''}`}
          onClick={() => setSelected('antimanchas')}
          aria-pressed={selected === 'antimanchas'}
          aria-label="Selecionar Booster Anti-Manchas"
        >
          <span className="product-booster__variation-crop">
            <span className="product-booster__variation-crop-inset">
              <img src={bottlePurple} alt="" />
            </span>
          </span>
          <img className="product-booster__variation-ring" src={ellipseRing} alt="" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

import bottleTilted from '../../assets/product/booster/bottle-tilted.png';
import bottlePourBg from '../../assets/product/booster/bottle-pour-bg.png';
import bottlePurple from '../../assets/product/booster/bottle-purple.png';
import waveBgDesktop from '../../assets/product/booster/wave-bg-desktop.svg';
import waveBgMobile from '../../assets/product/booster/wave-bg-mobile.svg';
import droplet1 from '../../assets/product/booster/droplet-1.svg';
import droplet2 from '../../assets/product/booster/droplet-2.svg';
import droplet3 from '../../assets/product/booster/droplet-3.svg';
import stepBase from '../../assets/product/booster/step-base.svg';
import stepBooster from '../../assets/product/booster/step-booster.svg';
import stepProduct from '../../assets/product/booster/step-product.svg';
import btnBuy from '../../assets/product/booster/btn-buy.svg';
import ellipseRing from '../../assets/product/booster/ellipse-ring.svg';
import './ProductBoosterSection.css';

const boosterProduct = {
  id: 'booster-antiacne',
  name: 'Booster Antiacne',
  price: 89,
  compareAtPrice: 129,
  image: bottleTilted,
};

export default function ProductBoosterSection({ onAdd }) {
  return (
    <section className="product-booster" aria-label="Adicione o booster à sua rotina">
      <div className="product-booster__pour-bg" aria-hidden="true">
        <div className="product-booster__pour-bg-inner">
          <img src={bottlePourBg} alt="" />
        </div>
      </div>

      <div className="product-booster__wave" aria-hidden="true">
        <img className="product-booster__wave-img product-booster__wave-img--desktop" src={waveBgDesktop} alt="" />
        <img className="product-booster__wave-img product-booster__wave-img--mobile" src={waveBgMobile} alt="" />
      </div>

      <div className="product-booster__cap" aria-hidden="true">
        <div className="product-booster__cap-inner">
          <img src={bottleTilted} alt="" />
        </div>
      </div>

      <div className="product-booster__drop product-booster__drop--1" aria-hidden="true">
        <div className="product-booster__drop-inner"><img src={droplet1} alt="" /></div>
      </div>
      <div className="product-booster__drop product-booster__drop--2" aria-hidden="true">
        <div className="product-booster__drop-inner"><img src={droplet2} alt="" /></div>
      </div>
      <div className="product-booster__drop product-booster__drop--3" aria-hidden="true">
        <div className="product-booster__drop-inner"><img src={droplet3} alt="" /></div>
      </div>

      <div className="product-booster__steps">
        <div className="product-booster__step product-booster__step--1">
          <img className="product-booster__step-icon" src={stepBase} alt="" aria-hidden="true" />
          <p className="product-booster__step-label">
            Escolha<br className="product-booster__break product-booster__break--mobile" /> sua Base
          </p>
        </div>
        <p className="product-booster__operator product-booster__operator--plus" aria-hidden="true">+</p>
        <div className="product-booster__step product-booster__step--2">
          <img className="product-booster__step-icon" src={stepBooster} alt="" aria-hidden="true" />
          <p className="product-booster__step-label">
            Escolha seu<br className="product-booster__break product-booster__break--mobile" /> Booster
          </p>
        </div>
        <p className="product-booster__operator product-booster__operator--eq" aria-hidden="true">=</p>
        <div className="product-booster__step product-booster__step--3">
          <span className="product-booster__step-icon product-booster__step-icon--crop">
            <span className="product-booster__step-icon-inset">
              <img src={stepProduct} alt="" />
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
            <span className="product-booster__card-icon">
              <span className="product-booster__card-icon-crop">
                <img src={bottleTilted} alt="" />
              </span>
            </span>
            <div className="product-booster__card-info">
              <p className="product-booster__card-name">
                Booster<br className="product-booster__break product-booster__break--desktop" /> Antiacne
              </p>
              <div className="product-booster__card-prices">
                <span className="product-booster__price">R$ 89,00</span>
                <span className="product-booster__price product-booster__price--old">R$ 129,00</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="product-booster__buy"
            onClick={() => onAdd?.(boosterProduct)}
            aria-label="Adicionar Booster Antiacne ao carrinho"
          >
            <img src={btnBuy} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="product-booster__variations" aria-hidden="true">
        <span className="product-booster__variation product-booster__variation--1">
          <span className="product-booster__variation-crop">
            <img className="product-booster__variation-img" src={bottleTilted} alt="" />
          </span>
          <img className="product-booster__variation-ring" src={ellipseRing} alt="" />
        </span>
        <span className="product-booster__variation product-booster__variation--2">
          <span className="product-booster__variation-crop">
            <span className="product-booster__variation-crop-inset">
              <img src={bottlePurple} alt="" />
            </span>
          </span>
          <img className="product-booster__variation-ring" src={ellipseRing} alt="" />
        </span>
      </div>
    </section>
  );
}

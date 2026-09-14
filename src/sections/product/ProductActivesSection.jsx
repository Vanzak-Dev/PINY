import figmaProductImage from '../../assets/product/pdp-actives-product.png';
import clayTexture from '../../assets/product/pdp-actives-texture.png';
import brushCrop from '../../assets/product/pdp-actives-brush-transparent.png';
import brushSource from '../../assets/product/pdp-actives-brush.png';
import arc from '../../assets/product/pdp-actives-arc.svg';
import dotLeftTop from '../../assets/product/pdp-actives-dot-left-top.svg';
import dotRight from '../../assets/product/pdp-actives-dot-right.svg';
import dotLeftBottom from '../../assets/product/pdp-actives-dot-left-bottom.svg';
import './ProductActivesSection.css';

const callouts = [
  {
    position: 'left-top',
    dot: dotLeftTop,
    title: 'Caulim',
    lines: ['A argila mais suave,', 'absorve sem irritar'],
  },
  {
    position: 'right-top',
    dot: dotRight,
    title: 'Óxido de Zinco',
    lines: ['Ação secativa'],
  },
  {
    position: 'left-bottom',
    dot: dotLeftBottom,
    title: <>Extrato<br /> de Abacaxi</>,
    lines: ['O símbolo da PINY'],
  },
  {
    position: 'right-bottom',
    dot: dotRight,
    title: <>Salicílico<br /> + Glicólico</>,
    lines: ['Motor antiacne', 'de fábrica'],
  },
];

export default function ProductActivesSection({ product }) {
  const productImage = product?.activesImage || figmaProductImage;

  return (
    <section className="product-actives" aria-label={`Ativos de ${product?.name || 'PINY MASK'}`}>
      <img className="product-actives__arc" src={arc} alt="" aria-hidden="true" />
      <img className="product-actives__product" src={productImage} alt={product?.name || 'Máscara facial PINY'} />

      <div className="product-actives__callouts">
        {callouts.map((callout) => (
          <div className={`product-actives__callout product-actives__callout--${callout.position}`} key={callout.position}>
            <img className="product-actives__dot" src={callout.dot} alt="" aria-hidden="true" />
            <div>
              <h2>{callout.title}</h2>
              {callout.lines.map((line) => <p key={line}>{line}</p>)}
            </div>
          </div>
        ))}
      </div>

      <img className="product-actives__texture" src={clayTexture} alt="Textura cremosa da máscara facial" />
      <img className="product-actives__brush product-actives__brush--desktop" src={brushCrop} alt="" aria-hidden="true" />
      <div className="product-actives__brush-mobile" aria-hidden="true">
        <div className="product-actives__brush-mobile-crop">
          <img src={brushSource} alt="" />
        </div>
      </div>
    </section>
  );
}

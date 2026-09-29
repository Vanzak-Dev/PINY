import figmaProductImage from '../../assets/product/pdp-actives-product.png';
import clayTexture from '../../assets/product/pdp-actives-texture.png';
import brushCrop from '../../assets/product/pdp-actives-brush-transparent.png';
import brushSource from '../../assets/product/pdp-actives-brush.png';
import arc from '../../assets/product/pdp-actives-arc.svg';
import dotLeftTop from '../../assets/product/pdp-actives-dot-left-top.svg';
import dotRight from '../../assets/product/pdp-actives-dot-right.svg';
import dotLeftBottom from '../../assets/product/pdp-actives-dot-left-bottom.svg';
import './ProductActivesSection.css';

const defaultCallouts = [
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
    title: 'Extrato de Abacaxi',
    lines: ['O símbolo da PINY'],
  },
  {
    position: 'right-bottom',
    dot: dotRight,
    title: 'Salicílico + Glicólico',
    lines: ['Motor antiacne', 'de fábrica'],
  },
];

const dotByPosition = {
  'left-top': dotLeftTop,
  'right-top': dotRight,
  'left-bottom': dotLeftBottom,
  'right-bottom': dotRight,
  'arc-left': dotRight,
  'arc-center': dotRight,
  'arc-right': dotRight,
};

const positions = ['left-top', 'right-top', 'left-bottom', 'right-bottom'];
const arcPositions = ['arc-left', 'arc-center', 'arc-right'];

export default function ProductActivesSection({ product }) {
  const productImage = product?.activesProductImage || figmaProductImage;
  const textureImage = product?.activesTextureImage || clayTexture;
  const brushImage = product?.activesBrushImage || brushCrop;
  const brushMobileImage = product?.activesBrushImage || brushSource;
  const hideTextureBrush = product?.activesHideTextureBrush || false;

  const rawCallouts = product?.activesCallouts?.length ? product.activesCallouts : defaultCallouts;
  const isArcLayout = rawCallouts.length === 3;
  const layoutPositions = isArcLayout ? arcPositions : positions;

  const callouts = rawCallouts.map((callout, index) => ({
    position: layoutPositions[index] || layoutPositions[index % layoutPositions.length],
    dot: dotByPosition[layoutPositions[index] || layoutPositions[index % layoutPositions.length]] || dotRight,
    title: callout.title,
    lines: callout.lines || [],
  }));

  return (
    <section className={`product-actives${isArcLayout ? ' product-actives--arc' : ''}${hideTextureBrush ? ' product-actives--no-texture' : ''}`} aria-label={`Ativos de ${product?.name || 'PINY MASK'}`}>
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

      {!hideTextureBrush && (
        <>
          <img className="product-actives__texture" src={textureImage} alt="Textura cremosa da máscara facial" />
          <img className="product-actives__brush product-actives__brush--desktop" src={brushImage} alt="" aria-hidden="true" />
          <div className="product-actives__brush-mobile" aria-hidden="true">
            <div className="product-actives__brush-mobile-crop">
              <img src={brushMobileImage} alt="" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

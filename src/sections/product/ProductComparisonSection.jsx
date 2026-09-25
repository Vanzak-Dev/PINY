import iconCheck from '../../assets/product/comparison/icon-check.svg';
import iconX from '../../assets/product/comparison/icon-x.svg';
import defaultImage1 from '../../assets/product/comparison/comparison-image-1.png';
import defaultImage2 from '../../assets/product/comparison/comparison-image-2.png';
import defaultImage3 from '../../assets/product/comparison/comparison-image-3.png';
import defaultImage4 from '../../assets/product/comparison/comparison-image-4.png';
import defaultProductIcon from '../../assets/product/comparison/product-icon-default.png';
import './ProductComparisonSection.css';

const defaultRows = [
  { label: '12 combinações diferentes', piny: 'check', other: 'x' },
  { label: 'Booster concentrado 2 em 1', piny: 'check', other: 'x' },
  { label: 'Análise de pele por IA', piny: 'check', other: 'x' },
  { label: 'Garantia de 21 dias', piny: 'check', other: 'x' },
  { label: 'Ácido salicílico + glicólico de fábrica', piny: 'check', other: 'Raro' },
  { label: 'Vegano e cruelty free', piny: 'check', other: 'Nem Sempre' },
];

function ComparisonValue({ value, checkIcon }) {
  if (value === 'check') {
    return (
      <span className="product-comparison__cell product-comparison__cell--check">
        <img src={checkIcon || iconCheck} alt="Sim" />
      </span>
    );
  }
  if (value === 'x') {
    return (
      <span className="product-comparison__cell product-comparison__cell--x">
        <img src={iconX} alt="Não" />
      </span>
    );
  }
  return (
    <span className="product-comparison__cell product-comparison__cell--text">{value}</span>
  );
}

export default function ProductComparisonSection({ product }) {
  if (product && product.comparisonEnabled === false) return null;

  const title = product?.comparisonTitle || 'Kit PINY vs. Máscara Comum';
  const subtitle = product?.comparisonSubtitle || 'Mais de 44 mil peles transformadas desde 2021, com uma selfie de cada vez.';
  const pinyLabel = product?.comparisonPinyLabel || 'Máscaras Faciais';
  const otherLabel = product?.comparisonOtherLabel || 'Outras Marcas';
  const rows = product?.comparisonRows?.length ? product.comparisonRows : defaultRows;
  const images = [
    product?.comparisonImage1 || defaultImage1,
    product?.comparisonImage2 || defaultImage2,
    product?.comparisonImage3 || defaultImage3,
    product?.comparisonImage4 || defaultImage4,
  ];
  // Precisa ser uma foto reta/frontal: o card principal do produto costuma vir
  // rotacionado por estilo, e isso deixa o ícone circular pequeno com cara de "torto".
  const productIconImage = product?.comparisonProductIcon || defaultProductIcon;
  const comparisonCheckIcon = product?.comparisonCheckIcon || '';
  const comparisonStyle = {
    '--comparison-header-label-color': product?.comparisonHeaderLabelColor || '#1c8c44',
    '--comparison-highlight-color': product?.comparisonHighlightColor || '#85e86f',
    '--comparison-table-color': product?.comparisonTableColor || '#e8fce0',
    '--comparison-cell-color': product?.comparisonCellColor || '#1c8c44',
  };

  return (
    <section className="product-comparison" aria-label={title} style={comparisonStyle}>
      <div className="product-comparison__inner">
        <div className="product-comparison__gallery" aria-hidden="true">
          <div className="product-comparison__column">
            <img className="product-comparison__image product-comparison__image--tall" src={images[0]} alt="" />
            <img className="product-comparison__image product-comparison__image--short" src={images[1]} alt="" />
          </div>
          <div className="product-comparison__column">
            <img className="product-comparison__image product-comparison__image--short" src={images[2]} alt="" />
            <img className="product-comparison__image product-comparison__image--tall" src={images[3]} alt="" />
          </div>
        </div>

        <div className="product-comparison__panel">
          <div className="product-comparison__text">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <div className="product-comparison__table">
            <span className="product-comparison__highlight" aria-hidden="true" />

            <div className="product-comparison__row product-comparison__row--header">
              <p className="product-comparison__label product-comparison__label--header">{pinyLabel}</p>
              <div className="product-comparison__values">
                <span className="product-comparison__product-icon">
                  <img src={productIconImage} alt="" />
                </span>
                <p className="product-comparison__label product-comparison__label--header product-comparison__label--other">{otherLabel}</p>
              </div>
            </div>
            <span className="product-comparison__divider" aria-hidden="true" />

            {rows.map((row, index) => (
              <div className="product-comparison__row-wrap" key={`${row.label}-${index}`}>
                <div className="product-comparison__row">
                  <p className="product-comparison__label">{row.label}</p>
                  <div className="product-comparison__values">
                    <ComparisonValue value={row.piny} checkIcon={comparisonCheckIcon} />
                    <ComparisonValue value={row.other} checkIcon={comparisonCheckIcon} />
                  </div>
                </div>
                {index < rows.length - 1 && <span className="product-comparison__divider" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

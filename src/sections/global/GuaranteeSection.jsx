import patternBackground from '../../assets/product/benefits/pattern-background.svg';
import badgeEllipseOuter from '../../assets/product/faq/badge-ellipse-outer.svg';
import badgeEllipseInner from '../../assets/product/faq/badge-ellipse-inner.svg';
import pineappleLeft from '../../assets/product/faq/pineapple-left.svg';
import pineappleRight from '../../assets/product/faq/pineapple-right.svg';
import jarsRow from '../../assets/images/guarantee/jars-row.png';
import './GuaranteeSection.css';

export default function GuaranteeSection() {
  return (
    <section className="guarantee" aria-labelledby="guarantee-heading">
      <img className="guarantee__pattern" src={patternBackground} alt="" aria-hidden="true" />

      <div className="guarantee__heading-row">
        <div className="guarantee__badge">
          <img className="guarantee__badge-ellipse guarantee__badge-ellipse--outer" src={badgeEllipseOuter} alt="" aria-hidden="true" />
          <img className="guarantee__badge-ellipse guarantee__badge-ellipse--inner" src={badgeEllipseInner} alt="" aria-hidden="true" />
          <p className="guarantee__badge-text" aria-hidden="true">
            <span>21</span>
            <span>DIAS</span>
          </p>
          <img className="guarantee__badge-pineapple guarantee__badge-pineapple--left" src={pineappleLeft} alt="" aria-hidden="true" />
          <img className="guarantee__badge-pineapple guarantee__badge-pineapple--right" src={pineappleRight} alt="" aria-hidden="true" />
        </div>

        <h2 id="guarantee-heading" className="guarantee__title">
          <span className="guarantee__title-line guarantee__title-line--upper">Sua pele muda,</span>
          <span className="guarantee__title-line">ou seu dinheiro volta.</span>
        </h2>
      </div>

      <div className="guarantee__panels">
        <div className="guarantee__panel guarantee__panel--left" aria-hidden="true">
          <img className="guarantee__panel-image" src={jarsRow} alt="" />
        </div>

        <div className="guarantee__card">
          <p className="guarantee__text">
            É a confiança de quem já transformou mais de <strong>44 mil peles</strong>: use o seu kit <strong>todos os dias por 21 dias.</strong> Se você não perceber evolução, devolvemos o valor. <strong>Sem letra miúda, sem interrogatório.</strong>
          </p>
          <button type="button" className="guarantee__button">Como funciona a garantia?</button>
        </div>

        <div className="guarantee__panel guarantee__panel--right" aria-hidden="true">
          <img className="guarantee__panel-image" src={jarsRow} alt="" />
        </div>

        <div className="guarantee__panel guarantee__panel--mobile" aria-hidden="true">
          <img className="guarantee__panel-image" src={jarsRow} alt="" />
        </div>
      </div>
    </section>
  );
}

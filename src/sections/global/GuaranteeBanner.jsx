import pineappleIcon from '../../assets/images/kit-picker/pineapple-icon.svg';
import './GuaranteeBanner.css';

export default function GuaranteeBanner() {
  return (
    <section className="guarantee-banner" aria-labelledby="guarantee-banner-heading">
      <div className="guarantee-banner__heading">
        <h2 id="guarantee-banner-heading" className="guarantee-banner__title">
          <span className="guarantee-banner__title-line guarantee-banner__title-line--highlight">
            <img className="guarantee-banner__pineapple guarantee-banner__pineapple--left" src={pineappleIcon} alt="" aria-hidden="true" />
            21 DIAS
            <img className="guarantee-banner__pineapple guarantee-banner__pineapple--right" src={pineappleIcon} alt="" aria-hidden="true" />
          </span>
          <span className="guarantee-banner__title-line">Sua pele ou seu dinheiro.</span>
        </h2>
        <p className="guarantee-banner__subtitle">A gente confia tanto na fórmula que o risco é todo nosso.</p>
      </div>

      <div className="guarantee-banner__actions">
        <a href="#kit-picker-heading" className="guarantee-banner__btn guarantee-banner__btn--primary">Montar meu Kit</a>
        <a href="/analise-sua-pele" className="guarantee-banner__btn guarantee-banner__btn--secondary">Ver minha pele no dia 21</a>
      </div>
    </section>
  );
}

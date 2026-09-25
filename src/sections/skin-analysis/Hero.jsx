import backgroundPattern from '../../assets/images/skin-analysis-hero/blob-pattern.svg';
import models from '../../assets/images/skin-analysis-hero/models.webp';
import cameraIcon from '../../assets/images/skin-analysis-hero/camera-icon.svg';
import './Hero.css';

export default function Hero({ onStart }) {
  return (
    <section className="skin-analysis-hero" aria-label="Descubra sua rotina personalizada">
      <img className="skin-analysis-hero__bg" src={backgroundPattern} alt="" aria-hidden="true" />

      <div className="skin-analysis-hero__photo-frame">
        <img className="skin-analysis-hero__photo" src={models} alt="Duas mulheres aplicando máscara de argila no rosto" />
        <div className="skin-analysis-hero__photo-gradient" aria-hidden="true" />
      </div>

      <div className="skin-analysis-hero__content">
        <p className="skin-analysis-hero__eyebrow">Descubra Sua</p>

        <div className="skin-analysis-hero__title">
          <span className="skin-analysis-hero__title-line skin-analysis-hero__title-line--1">
            <span>ROTINA</span>
          </span>
          <span className="skin-analysis-hero__title-line skin-analysis-hero__title-line--2">
            <span>PERSONALIZADA</span>
          </span>
        </div>

        <p className="skin-analysis-hero__subtitle">
          Analise sua pele  em segundos e receba uma rotina completa de skincare focada em acne, manchas e oleosidade.
        </p>

        <div className="skin-analysis-hero__cta-wrap">
          <button type="button" className="skin-analysis-hero__cta" onClick={onStart}>
            <img src={cameraIcon} alt="" aria-hidden="true" />
            Começar Análise
          </button>
        </div>
      </div>
    </section>
  );
}

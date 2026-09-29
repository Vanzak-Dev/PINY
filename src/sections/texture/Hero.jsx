import jarsDesktop from '../../assets/images/texture-hero/jars-desktop.webp';
import jarsMobile from '../../assets/images/texture-hero/jars-mobile.webp';
import './Hero.css';

export default function Hero() {
  return (
    <section className="texture-hero" aria-label="Uma argila para cada pele">
      <img className="texture-hero__bg texture-hero__bg--mobile" src={jarsMobile} alt="" aria-hidden="true" />
      <img className="texture-hero__bg texture-hero__bg--desktop" src={jarsDesktop} alt="" aria-hidden="true" />
      <div className="texture-hero__vignette" aria-hidden="true" />

      <h1 className="texture-hero__title">
        <span className="texture-hero__title-line texture-hero__title-line--bold">UMA ARGILA</span>
        <span className="texture-hero__title-line">Para cada Pele</span>
      </h1>

      <p className="texture-hero__subtitle">
        <span className="texture-hero__subtitle-line">Quatro fórmulas, </span>
        <span className="texture-hero__subtitle-line">o mesmo motor antiacne. conheça de perto.</span>
      </p>
    </section>
  );
}

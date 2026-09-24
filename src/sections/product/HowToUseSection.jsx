import badgeSvg from '../../assets/images/how-to-use/como-usar-badge.svg';
import bgPattern from '../../assets/images/how-to-use/fundocomousaramarelo.webp';
import imgTopLeft from '../../assets/images/how-to-use/img-superior-esquerda.webp';
import imgBottomLeft from '../../assets/images/how-to-use/img-inferior-esquerda.webp';
import imgTopRight from '../../assets/images/how-to-use/img-superior-direita.webp';
import imgBottomRight from '../../assets/images/how-to-use/img-inferior-direita.webp';
import './HowToUseSection.css';

const steps = [
  { number: '01', text: 'Aplique uma camada generosa do produto' },
  { number: '02', text: 'Deixe agir por 15-20min e enxágue' },
  { number: '03', text: 'Use 1-2x ao dia, conforme a condição da sua pele' },
  { number: '04', text: 'De dia, finalize com protetor solar — a fórmula tem ácidos.' },
];

export default function HowToUseSection() {
  return (
    <section
      className="how-to-use"
      aria-label="Como usar"
      style={{ backgroundImage: `url(${bgPattern})` }}
    >
        <div className="how-to-use__layout">
          {/* Left images (desktop) */}
          <div className="how-to-use__images how-to-use__images--left">
            <img className="how-to-use__image" src={imgTopLeft} alt="Aplicando a máscara no rosto" />
            <img className="how-to-use__image" src={imgBottomLeft} alt="Pote do produto PINY" />
          </div>

          {/* Center card */}
          <div className="how-to-use__center">
            <img className="how-to-use__badge" src={badgeSvg} alt="Como usar?" />
            <div className="how-to-use__card">
              {steps.map((step, i) => (
                <div className="how-to-use__step" key={step.number}>
                  <div className="how-to-use__step-number">{step.number}</div>
                  <p className="how-to-use__step-text">{step.text}</p>
                  {i < steps.length - 1 && <div className="how-to-use__connector" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right images (desktop) */}
          <div className="how-to-use__images how-to-use__images--right">
            <img className="how-to-use__image" src={imgTopRight} alt="Potes do produto PINY" />
            <img className="how-to-use__image" src={imgBottomRight} alt="Aplicando a máscara na bochecha" />
          </div>
        </div>

        {/* Mobile images grid */}
        <div className="how-to-use__mobile-images">
          <img className="how-to-use__mobile-image how-to-use__mobile-image--tall" src={imgTopLeft} alt="Aplicando a máscara no rosto" />
          <img className="how-to-use__mobile-image" src={imgTopRight} alt="Potes do produto PINY" />
          <img className="how-to-use__mobile-image" src={imgBottomLeft} alt="Pote do produto PINY" />
          <img className="how-to-use__mobile-image how-to-use__mobile-image--tall" src={imgBottomRight} alt="Aplicando a máscara na bochecha" />
        </div>
    </section>
  );
}

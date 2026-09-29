import logo from '../../assets/hero/logo.svg';
import blobTopRight from '../../assets/images/ai-analysis/ai-analysis-jar-top-right.png';
import blobCenterLeft from '../../assets/images/ai-analysis/ai-analysis-jar-center-left.png';
import blobBottomRight from '../../assets/images/ai-analysis/ai-analysis-jar-bottom-right.png';
import blobBottomLeft from '../../assets/images/ai-analysis/ai-analysis-jar-bottom-left.png';
import './AiAnalysisSection.css';

const DEFAULT_ACCENT = '#FFBD35';
const PDP_ACCENT = '#1C8C44';

const BLOBS = [
  { key: 'a', src: blobTopRight },
  { key: 'b', src: blobCenterLeft },
  { key: 'c', src: blobBottomRight },
  { key: 'd', src: blobBottomLeft },
];

function AiAnalysisDecor({ variant }) {
  return (
    <div className={`ai-analysis__decor ai-analysis__decor--${variant}`} aria-hidden="true">
      {BLOBS.map(({ key, src }) => (
        <div className={`ai-analysis__blob ai-analysis__blob--${key}`} key={key}>
          <div className="ai-analysis__blob-inner">
            <img src={src} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AiAnalysisSection({ product }) {
  const accentColor = product ? PDP_ACCENT : DEFAULT_ACCENT;

  return (
    <section
      className="ai-analysis"
      aria-labelledby="ai-analysis-title"
      style={{ '--ai-analysis-accent': accentColor, '--ai-analysis-bg': product?.aiAnalysisBackgroundColor || '#fef8dd' }}
    >
      {/* No mobile os potes sao ancorados ao final do card (dentro de
          .ai-analysis__inner); no desktop, ao topo da propria secao -
          os dois designs do Figma posicionam esses elementos de forma
          diferente, entao cada breakpoint usa seu proprio bloco de decor. */}
      <AiAnalysisDecor variant="desktop" />

      <div className="ai-analysis__inner">
        <div className="ai-analysis__heading">
          <h2 className="ai-analysis__title" id="ai-analysis-title">
            {'Não sabe qual é a'}
            <br />
            {'máscara ideal '}
            <br className="ai-analysis__title-break" />
            {'para você?'}
          </h2>
          <p className="ai-analysis__subtitle">
            Deixa com a nossa IA. Envie uma selfie — a IA identifica acne, manchas e oleosidade — ou responda 5
            perguntas rápidas. A PINY foi a 1ª marca brasileira de skincare com análise de pele por IA.
          </p>
        </div>

        <div className="ai-analysis__card">
          <div className="ai-analysis__card-top">
            <div className="ai-analysis__brand">
              <img className="ai-analysis__logo" src={logo} alt="PINY" />
              <span className="ai-analysis__brand-label">Análise com IA</span>
            </div>
            <span className="ai-analysis__step-tag">1/10 - Boas-Vindas</span>
          </div>

          <div className="ai-analysis__card-body">
            <div className="ai-analysis__message">
              <span className="ai-analysis__avatar" aria-hidden="true" />
              <p className="ai-analysis__bubble">
                Oi! Eu sou a PINY IA 💚 Vou montar seu tratamento personalizado de 21 dias.
              </p>
            </div>
            <div className="ai-analysis__message">
              <span className="ai-analysis__avatar" aria-hidden="true" />
              <p className="ai-analysis__bubble">
                Posso analisar sua pele por uma <strong className="ai-analysis__emphasis">selfie</strong> — ou por{' '}
                <strong className="ai-analysis__emphasis">5 perguntas rápidas.</strong> Como você prefere?
              </p>
            </div>
          </div>

          <div className="ai-analysis__card-actions">
            <button type="button" className="ai-analysis__action">Enviar Selfie</button>
            <button type="button" className="ai-analysis__action">Responder Perguntas</button>
          </div>
        </div>

        <AiAnalysisDecor variant="mobile" />
      </div>
    </section>
  );
}

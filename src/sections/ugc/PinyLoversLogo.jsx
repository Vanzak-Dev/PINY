import pineappleMark from '../../assets/icons/piny-logo-pineapple.svg';

function PineappleMark({ side }) {
  return <img className={`piny-lovers-logo__pineapple is-${side}`} src={pineappleMark} alt="" aria-hidden="true" />;
}

export default function PinyLoversLogo() {
  return (
    <div className="piny-lovers-logo" role="img" aria-label="PINY Lovers">
      <div className="piny-lovers-logo__badge">
        <div className="piny-lovers-logo__border" />
        <PineappleMark side="left" />
        <span className="piny-lovers-logo__text"><span>PINY</span><span>LOVERS</span></span>
        <PineappleMark side="right" />
      </div>
    </div>
  );
}

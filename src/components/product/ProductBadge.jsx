import './ProductBadge.css';

export default function ProductBadge({ tone = 'outline', color = '#1c8c44', textColor, children }) {
  const style = {
    '--badge-color': color,
    '--badge-text': textColor || (tone === 'solid' ? '#fff' : color),
  };

  return (
    <span className={`product-badge product-badge--${tone}`} style={style}>
      {children}
    </span>
  );
}

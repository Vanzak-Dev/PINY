import { useEffect, useRef, useState } from 'react';
import { featuredProducts } from '../../data/products';
import AddToCartIcon from '../ui/AddToCartIcon';
import { formatPrice } from '../../lib/formatPrice';
import './SearchPanel.css';

const suggestedSearches = ['ACNE', 'ANTIMANCHAS', 'DETOX', 'OLEOSIDADE', 'CALMANTE', 'MÁSCARA', 'ADESIVO', 'ESTRELAS'];
const panelProducts = ['Argila Branca', 'Argila Verde', 'Argila Rosa', 'Argila Preta', 'Argila Branca'];
const panelColors = ['#fff547', '#a4f484', '#ed7d9c', '#747b78', '#fff547'];

function findProduct(name) {
  return featuredProducts.find((product) => product.name === name) || featuredProducts[0];
}

export default function SearchPanel({ isOpen, onClose }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSuggestions = suggestedSearches.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="search-panel" role="dialog" aria-label="Pesquisa de produtos">
      <div className="search-panel__backdrop" onClick={onClose} />
      <div className="search-panel__surface">
        <div className="search-panel__input-wrap">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar produtos..."
            aria-label="Pesquisar produtos"
          />
          <span className="search-panel__icon" aria-hidden="true" />
        </div>

        <div className="search-panel__columns">
          <section className="search-panel__suggestions">
            <h2>Pesquisas sugeridas</h2>
            <div className="search-panel__tags">
              {filteredSuggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>{suggestion}</button>
              ))}
            </div>
          </section>

          <section className="search-panel__products">
            <h2>Você pode gostar:</h2>
            <div className="search-panel__product-list">
              {panelProducts.map((name, index) => {
                const product = findProduct(name);
                return (
                  <article className="search-panel__product" key={`${name}-${index}`}>
                    <div className="search-panel__product-visual" style={{ backgroundColor: panelColors[index] }}>
                      <img src={product.image} alt={name} />
                      <button type="button" aria-label={`Adicionar ${name} ao carrinho`}><AddToCartIcon /></button>
                    </div>
                    <div className="search-panel__product-info">
                      <strong>{name.split(' ')[0]}<br />{name.split(' ').slice(1).join(' ')}</strong>
                      <span><del>{formatPrice(product.oldPrice)}</del>{formatPrice(product.price)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
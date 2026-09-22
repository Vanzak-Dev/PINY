import { useEffect, useRef, useState } from 'react';
import { featuredProducts } from '../../data/products';
import AddToCartIcon from '../ui/AddToCartIcon';
import { formatPrice } from '../../lib/formatPrice';
import './SearchPanel.css';

const suggestedSearches = ['ACNE', 'ANTIMANCHAS', 'DETOX', 'OLEOSIDADE', 'CALMANTE', 'MÁSCARA', 'ADESIVO', 'ESTRELAS'];
const defaultPanelProducts = ['Argila Branca', 'Argila Verde', 'Argila Rosa', 'Argila Preta', 'Argila Branca'];
const panelColors = ['#fff547', '#a4f484', '#ed7d9c', '#747b78', '#fff547'];

function findProduct(name) {
  return featuredProducts.find((product) => product.name === name) || featuredProducts[0];
}

function matchesQuery(product, query) {
  const haystack = [product.name, product.category, ...(product.badges?.map((badge) => badge.label) || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export default function SearchPanel({ isOpen, onClose, offsetTop }) {
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

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSuggestions = suggestedSearches.filter((suggestion) => suggestion.toLowerCase().includes(normalizedQuery));

  const searchResults = normalizedQuery
    ? featuredProducts.filter((product) => matchesQuery(product, normalizedQuery)).slice(0, 5)
    : null;

  const displayProducts = searchResults && searchResults.length > 0
    ? searchResults.map((product, index) => ({ product, color: panelColors[index % panelColors.length] }))
    : defaultPanelProducts.map((name, index) => ({ product: findProduct(name), color: panelColors[index] }));

  const hasNoResults = normalizedQuery && searchResults && searchResults.length === 0;

  return (
    <div className="search-panel" role="dialog" aria-label="Pesquisa de produtos">
      <div className="search-panel__backdrop" onClick={onClose} />
      <div className="search-panel__surface" style={offsetTop ? { top: `${offsetTop}px` } : undefined}>
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
            {hasNoResults ? (
              <p className="search-panel__no-results">Nenhum produto encontrado.</p>
            ) : (
              <div className="search-panel__product-list">
                {displayProducts.map(({ product, color }, index) => {
                  const productUrl = `/produtos/${product.slug || product.id}`;
                  return (
                    <article className="search-panel__product" key={`${product.id}-${index}`}>
                      <div className="search-panel__product-visual" style={{ backgroundColor: color }}>
                        <a href={productUrl} aria-label={`Ver detalhes de ${product.name}`} onClick={onClose}>
                          <img src={product.image} alt={product.name} />
                        </a>
                        <button type="button" aria-label={`Adicionar ${product.name} ao carrinho`}><AddToCartIcon /></button>
                      </div>
                      <a className="search-panel__product-info" href={productUrl} onClick={onClose}>
                        <strong>{product.name.split(' ')[0]}<br />{product.name.split(' ').slice(1).join(' ')}</strong>
                        <span><del>{formatPrice(product.oldPrice)}</del>{formatPrice(product.price)}</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

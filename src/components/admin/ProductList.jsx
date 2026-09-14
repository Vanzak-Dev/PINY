const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProductList({ products, selectedId, onEdit, onCreate, onDuplicate, onDelete }) {
  return (
    <aside className="admin-list">
      <div className="admin-list__heading">
        <div><p className="admin-eyebrow">Catálogo</p><h2>{products.length} produtos</h2></div>
        <button className="admin-button admin-button--primary" onClick={onCreate}>Novo produto</button>
      </div>
      <div className="admin-list__items">
        {products.map((product) => (
          <article className={`admin-product-row${selectedId === product.id ? ' is-selected' : ''}`} key={product.id}>
            <button className="admin-product-row__main" onClick={() => onEdit(product)}>
              <img src={product.image} alt="" />
              <span><strong>{product.name}</strong><small>{product.sku || 'Sem SKU'} · {money.format(product.price || 0)}</small></span>
              <em className={`admin-status admin-status--${product.status}`}>{product.status === 'active' ? 'Ativo' : 'Rascunho'}</em>
            </button>
            <div className="admin-product-row__actions">
              {product.status === 'active' && <a className="admin-product-row__preview" href={`/produtos/${product.slug || product.id}`} target="_blank" rel="noreferrer">Ver</a>}
              <button className="admin-product-row__duplicate" onClick={() => onDuplicate(product)} aria-label={`Duplicar ${product.name}`}>Duplicar</button>
              <button className="admin-product-row__delete" onClick={() => onDelete(product)} aria-label={`Excluir ${product.name}`}>×</button>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

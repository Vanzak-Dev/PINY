import { useEffect, useState } from 'react';
import { catalogApi } from '../../services/catalogApi';
import './CollectionsManager.css';

const emptyForm = { name: '', active: true, productIds: [] };

export default function CollectionsManager({ products }) {
  const [collections, setCollections] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCollections = async () => setCollections(await catalogApi.listCollectionsAdmin());

  useEffect(() => {
    loadCollections().catch((error) => setMessage(error.message));
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setMessage('');
  };

  const startEdit = (collection) => {
    setEditing(collection);
    setForm({ name: collection.name, active: collection.active, productIds: collection.productIds || [] });
    setMessage('');
  };

  const toggleProduct = (productId) => {
    setForm((current) => {
      const exists = current.productIds.includes(productId);
      return {
        ...current,
        productIds: exists
          ? current.productIds.filter((id) => id !== productId)
          : [...current.productIds, productId],
      };
    });
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return setMessage('Informe o nome da coleção.');
    setSaving(true);
    setMessage('');
    try {
      if (editing) await catalogApi.updateCollection(editing.id, form);
      else await catalogApi.createCollection(form);
      await loadCollections();
      startCreate();
      localStorage.setItem('piny:catalog-version', String(Date.now()));
      setMessage('Coleção salva.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (collection) => {
    if (!window.confirm(`Excluir a coleção "${collection.name}"?`)) return;
    try {
      await catalogApi.removeCollection(collection.id);
      await loadCollections();
      if (editing?.id === collection.id) startCreate();
      localStorage.setItem('piny:catalog-version', String(Date.now()));
      setMessage('Coleção excluída.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="admin-collections">
      <div className="admin-collections__heading">
        <div><p className="admin-eyebrow">Coleções</p><h2>{collections.length} coleções cadastradas</h2></div>
        <button className="admin-button" type="button" onClick={startCreate}>Nova coleção</button>
      </div>

      {message && <p className="admin-message admin-collections__message" role="status">{message}</p>}

      <div className="admin-collections__workspace">
        <div className="admin-collections__list">
          {collections.length === 0 && <p className="admin-collections__empty">Nenhuma coleção cadastrada. Crie uma para organizar produtos em abas na home.</p>}
          {collections.map((collection) => (
            <article className={`admin-collections__row${editing?.id === collection.id ? ' is-selected' : ''}`} key={collection.id}>
              <button type="button" className="admin-collections__row-main" onClick={() => startEdit(collection)}>
                <strong>{collection.name}</strong>
                <small>{(collection.productIds || []).length} produto(s) · {collection.active ? 'Ativo' : 'Oculto'}</small>
              </button>
              <button type="button" className="admin-product-row__delete" onClick={() => remove(collection)} aria-label={`Excluir ${collection.name}`}>×</button>
            </article>
          ))}
        </div>

        <form className="admin-collections__form" onSubmit={save}>
          <h3>{editing ? 'Editar coleção' : 'Cadastrar coleção'}</h3>
          <label>Nome da coleção<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Linha Antiacne" /></label>
          <label className="admin-check"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Exibir na loja</label>
          <fieldset className="admin-collections__products">
            <legend>Produtos da coleção</legend>
            {products.map((product) => (
              <label key={product.id} className="admin-collections__product-check">
                <input
                  type="checkbox"
                  checked={form.productIds.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                />
                {product.name}
              </label>
            ))}
          </fieldset>
          <div className="admin-collections__actions">
            <button className="admin-button" type="button" onClick={startCreate}>Limpar</button>
            <button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Salvando…' : 'Salvar coleção'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import PasswordChange from '../components/admin/PasswordChange';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';
import UgcManager from '../components/admin/UgcManager';
import { catalogApi } from '../services/catalogApi';
import './AdminPage.css';

export default function AdminPage() {
  const [session, setSession] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [message, setMessage] = useState('');

  const loadProducts = async () => setProducts(await catalogApi.listAdmin());

  useEffect(() => {
    catalogApi.session().then(setSession).catch(() => setSession(null));
  }, []);

  useEffect(() => {
    if (session && !session.mustChangePassword) loadProducts().catch((error) => setMessage(error.message));
  }, [session]);

  if (session === undefined) return <main className="admin-loading">Carregando painel…</main>;
  if (!session) return <AdminLogin onLogin={async (credentials) => setSession(await catalogApi.login(credentials))} />;
  if (session.mustChangePassword) return <PasswordChange onChange={async (passwords) => setSession(await catalogApi.changePassword(passwords))} />;

  const save = async (formData) => {
    if (selected) await catalogApi.update(selected.id, formData);
    else await catalogApi.create(formData);
    await loadProducts();
    setFormOpen(false); setSelected(null); setMessage('Produto salvo e publicado no catálogo.');
  };

  const duplicate = async (product) => {
    try {
      const copy = await catalogApi.duplicate(product.id);
      await loadProducts();
      setSelected(copy);
      setFormOpen(true);
      setMessage('Cópia criada como rascunho. Revise os dados antes de ativar.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const remove = (product) => setPendingDelete(product);

  const confirmRemove = async () => {
    await catalogApi.remove(pendingDelete.id);
    await loadProducts();
    if (selected?.id === pendingDelete.id) { setSelected(null); setFormOpen(false); }
    setMessage('Produto excluído.');
    setPendingDelete(null);
  };

  const logout = async () => { await catalogApi.logout(); setSession(null); };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><p className="admin-eyebrow">PINY</p><h1>Gestão de catálogo</h1></div>
        <nav><a className="admin-button" href="/">Ver loja</a><button className="admin-button" onClick={logout}>Sair</button></nav>
      </header>
      {message && <p className="admin-message" role="status">{message}</p>}
      <div className={`admin-workspace${formOpen ? ' has-form' : ''}`}>
        <ProductList products={products} selectedId={selected?.id} onCreate={() => { setSelected(null); setFormOpen(true); }} onEdit={(product) => { setSelected(product); setFormOpen(true); }} onDuplicate={duplicate} onDelete={remove} />
        {formOpen && <ProductForm product={selected} onSave={save} onCancel={() => { setFormOpen(false); setSelected(null); }} />}
      </div>
      <UgcManager products={products} />
      {pendingDelete && (
        <div className="admin-dialog-backdrop" role="presentation">
          <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <p className="admin-eyebrow">Confirmar exclusão</p>
            <h2 id="delete-title">Excluir {pendingDelete.name}?</h2>
            <p>Essa ação remove o produto de todas as seções do site.</p>
            <div><button className="admin-button" onClick={() => setPendingDelete(null)}>Cancelar</button><button className="admin-button admin-button--danger" onClick={confirmRemove}>Excluir produto</button></div>
          </section>
        </div>
      )}
    </main>
  );
}

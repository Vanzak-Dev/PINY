import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try { await onLogin({ username, password }); }
    catch (requestError) { setError(requestError.message); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="admin-auth">
      <form className="admin-auth__card" onSubmit={submit}>
        <p className="admin-eyebrow">PINY · Gestão</p>
        <h1>Acessar catálogo</h1>
        <p>Entre com o usuário administrador para gerenciar os produtos.</p>
        <label>Usuário<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        <button className="admin-button admin-button--primary" disabled={submitting}>{submitting ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </main>
  );
}

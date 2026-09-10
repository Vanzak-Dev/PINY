import { useState } from 'react';

export default function PasswordChange({ onChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try { await onChange({ currentPassword, newPassword }); }
    catch (requestError) { setError(requestError.message); }
  };

  return (
    <main className="admin-auth">
      <form className="admin-auth__card" onSubmit={submit}>
        <p className="admin-eyebrow">Primeiro acesso</p>
        <h1>Crie sua senha</h1>
        <p>Por segurança, substitua a senha temporária antes de gerenciar o catálogo.</p>
        <label>Senha temporária<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
        <label>Nova senha<input type="password" minLength="10" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        <button className="admin-button admin-button--primary">Salvar nova senha</button>
      </form>
    </main>
  );
}

import { useEffect, useState } from 'react';
import AnnouncementBar from '../global/AnnouncementBar';
import { catalogApi } from '../../services/catalogApi';
import './AnnouncementBarManager.css';

const initialDraft = {
  enabled: true,
  messages: 'Frete grátis acima de R$199\nAproveite 10% OFF na sua primeira compra',
  backgroundColor: '#fff547',
  textColor: '#1c8c44',
  speed: 24,
};

export default function AnnouncementBarManager({ onSaved }) {
  const [draft, setDraft] = useState(initialDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    catalogApi.getAdminSettings()
      .then(({ announcementBar }) => {
        setDraft({
          ...initialDraft,
          ...announcementBar,
          messages: (announcementBar?.messages || []).join('\n'),
        });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const settings = await catalogApi.updateSettings({
        announcementBar: {
          ...draft,
          messages: draft.messages.split(/\r?\n/).map((message) => message.trim()).filter(Boolean),
          speed: Number(draft.speed),
        },
      });
      onSaved?.(settings);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section className="admin-announcement admin-list">Carregando banner…</section>;

  const previewSettings = {
    announcementBar: {
      ...draft,
      messages: draft.messages.split(/\r?\n/).map((message) => message.trim()).filter(Boolean),
      speed: Number(draft.speed) || 24,
    },
  };

  return (
    <section className="admin-announcement admin-list" aria-labelledby="announcement-settings-title">
      <div className="admin-announcement__heading">
        <div>
          <p className="admin-eyebrow">Configuração global</p>
          <h2 id="announcement-settings-title">Banner de anúncios</h2>
        </div>
        <label className="admin-announcement__toggle">
          <input type="checkbox" checked={draft.enabled} onChange={(event) => update('enabled', event.target.checked)} />
          Exibir na loja
        </label>
      </div>

      <form className="admin-announcement__form" onSubmit={submit}>
        <label className="admin-announcement__messages">
          Mensagens <small>Uma por linha</small>
          <textarea rows="4" value={draft.messages} onChange={(event) => update('messages', event.target.value)} />
        </label>

        <label>
          Cor do fundo
          <span className="admin-announcement__color-field">
            <input type="color" value={draft.backgroundColor} onChange={(event) => update('backgroundColor', event.target.value)} />
            <input value={draft.backgroundColor} onChange={(event) => update('backgroundColor', event.target.value)} />
          </span>
        </label>

        <label>
          Cor do texto
          <span className="admin-announcement__color-field">
            <input type="color" value={draft.textColor} onChange={(event) => update('textColor', event.target.value)} />
            <input value={draft.textColor} onChange={(event) => update('textColor', event.target.value)} />
          </span>
        </label>

        <label>
          Duração da volta
          <span className="admin-announcement__speed-field">
            <input type="range" min="8" max="120" step="1" value={draft.speed} onChange={(event) => update('speed', event.target.value)} />
            <input type="number" min="8" max="120" value={draft.speed} onChange={(event) => update('speed', event.target.value)} />
            <span>seg.</span>
          </span>
        </label>

        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        <button className="admin-button admin-button--primary" type="submit" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar banner'}
        </button>
      </form>

      <div className="admin-announcement__preview">
        <p>Prévia</p>
        {draft.enabled ? <AnnouncementBar settings={previewSettings} /> : <span>O banner está desativado.</span>}
      </div>
    </section>
  );
}

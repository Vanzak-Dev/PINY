import { useEffect, useMemo, useState } from 'react';
import separator from '../../assets/announcement-separator.svg';
import { catalogApi } from '../../services/catalogApi';
import './AnnouncementBar.css';

const fallbackSettings = {
  announcementBar: {
    enabled: true,
    messages: ['Frete grátis acima de R$199', 'Aproveite 10% OFF na sua primeira compra'],
    backgroundColor: '#fff547',
    textColor: '#1c8c44',
    speed: 24,
  },
};

function AnnouncementItems({ messages }) {
  return (
    <div className="announcement-bar__group">
      {messages.map((message, index) => (
        <span className="announcement-bar__item" key={`${message}-${index}`}>
          <span>{message}</span>
          <img src={separator} alt="" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar({ settings: suppliedSettings }) {
  const [remoteSettings, setRemoteSettings] = useState(fallbackSettings);

  useEffect(() => {
    if (suppliedSettings) return undefined;
    const load = () => catalogApi.getSettings().then(setRemoteSettings).catch(() => {});
    const handleStorage = (event) => {
      if (event.key === 'piny:site-settings-version') load();
    };
    load();
    window.addEventListener('focus', load);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('focus', load);
      window.removeEventListener('storage', handleStorage);
    };
  }, [suppliedSettings]);

  const config = (suppliedSettings || remoteSettings).announcementBar || fallbackSettings.announcementBar;
  const repeatedMessages = useMemo(
    () => Array.from({ length: 4 }, () => config.messages || []).flat(),
    [config.messages],
  );

  if (!config.enabled || repeatedMessages.length === 0) return null;

  return (
    <section
      className="announcement-bar"
      aria-label="Anúncios da loja"
      style={{
        '--announcement-background': config.backgroundColor,
        '--announcement-color': config.textColor,
        '--announcement-duration': `${config.speed}s`,
      }}
    >
      <span className="announcement-bar__accessible">{config.messages.join('. ')}</span>
      <div className="announcement-bar__track" aria-hidden="true">
        <AnnouncementItems messages={repeatedMessages} />
        <AnnouncementItems messages={repeatedMessages} />
      </div>
    </section>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import defaultSeparator from '../../assets/announcement-separator.svg';
import { catalogApi } from '../../services/catalogApi';
import { subscribeProductAnnouncement } from '../../lib/productAnnouncement';
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

function AnnouncementItems({ messages, separator }) {
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

  const [productOverride, setProductOverride] = useState(null);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    if (suppliedSettings) return undefined;
    const load = () => catalogApi.getSettings().then(setRemoteSettings).catch(() => {});
    const handleStorage = (event) => {
      if (event.key === 'piny:site-settings-version') load();
    };
    load();
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [suppliedSettings]);

  useEffect(() => {
    return subscribeProductAnnouncement(setProductOverride);
  }, []);

  const globalConfig = (suppliedSettings || remoteSettings).announcementBar || fallbackSettings.announcementBar;
  const config = { ...globalConfig, ...(productOverride?.announcementBar || {}) };
  const separator = config.separatorImage || defaultSeparator;
  const repeatedMessages = useMemo(
    () => Array.from({ length: 4 }, () => config.messages || []).flat(),
    [config.messages],
  );

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setHidden(window.scrollY > 4);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = barRef.current;
    if (!el) {
      document.documentElement.style.setProperty('--announcement-bar-height', '0px');
      return undefined;
    }
    const update = () => {
      if (hidden) {
        document.documentElement.style.setProperty('--announcement-bar-height', '0px');
      } else {
        document.documentElement.style.setProperty('--announcement-bar-height', `${el.offsetHeight}px`);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  });

  if (!config.enabled || repeatedMessages.length === 0) return null;

  return (
    <section
      ref={barRef}
      className={`announcement-bar${hidden ? ' announcement-bar--hidden' : ''}`}
      aria-label="Anúncios da loja"
      style={{
        '--announcement-background': config.backgroundColor,
        '--announcement-color': config.textColor,
        '--announcement-duration': `${config.speed}s`,
      }}
    >
      <span className="announcement-bar__accessible">{config.messages.join('. ')}</span>
      <div className="announcement-bar__track" aria-hidden="true">
        <AnnouncementItems messages={repeatedMessages} separator={separator} />
        <AnnouncementItems messages={repeatedMessages} separator={separator} />
      </div>
    </section>
  );
}

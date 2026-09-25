import { useState, useRef, useEffect } from 'react';
import logo from '../../assets/hero/logo.svg';
import blobTopRight from '../../assets/images/ai-analysis/ai-analysis-jar-top-right.png';
import blobCenterLeft from '../../assets/images/ai-analysis/ai-analysis-jar-center-left.png';
import blobBottomRight from '../../assets/images/ai-analysis/ai-analysis-jar-bottom-right.png';
import blobBottomLeft from '../../assets/images/ai-analysis/ai-analysis-jar-bottom-left.png';
import { PERGUNTAS, buildDiagnosis, fallbackDiagnosis, buildRotina, DEPOIMENTOS, CAUSAS_MAP, SOLUCOES_MAP } from '../../lib/diagnosis';
import { ASSETS, BASES, BOOSTERS, CONFIG, kitPhoto } from '../../lib/pinyAssets';
import { buildDiagFromAnalysisResult } from '../../lib/buildDiagFromAnalysisResult';
import AiAnalysisCamera from '../../components/global/AiAnalysisCamera';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/formatPrice';
import './AiAnalysisSection.css';

const DEFAULT_ACCENT = '#FFBD35';
const PDP_ACCENT = '#1C8C44';

const BLOBS = [
  { key: 'a', src: blobTopRight },
  { key: 'b', src: blobCenterLeft },
  { key: 'c', src: blobBottomRight },
  { key: 'd', src: blobBottomLeft },
];

const STAGE_LABELS = ['Boas-vindas', 'Análise', 'Problema', 'Causa', 'Solução', 'Ativos', 'Produto', 'Prova', 'Simulação', 'Oferta'];
const PASSOS_FOTO = ['Recebendo sua selfie…', 'Detectando seu rosto…', 'Analisando a oleosidade…', 'Medindo o grau de acne…', 'Localizando manchas e poros…', 'Avaliando textura e tom…', 'Cruzando com seu perfil…', 'Escolhendo seus ativos…', 'Montando sua rotina personalizada…'];
const PASSOS_PERG = ['Montando sua análise…', 'Cruzando suas respostas…', 'Escolhendo seus ativos…', 'Montando seu tratamento…'];
const OFFER_OFF = { 1: 0, 2: 10, 3: 15 };

const money = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let _id = 0;
const nid = () => `m${++_id}`;

function fmt(t) {
  if (!t) return t;
  return t.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : p
  );
}

function AiAnalysisDecor({ variant }) {
  return (
    <div className={`ai-analysis__decor ai-analysis__decor--${variant}`} aria-hidden="true">
      {BLOBS.map(({ key, src }) => (
        <div className={`ai-analysis__blob ai-analysis__blob--${key}`} key={key}>
          <div className="ai-analysis__blob-inner">
            <img src={src} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AiAnalysisSection({ product }) {
  const accentColor = product ? PDP_ACCENT : DEFAULT_ACCENT;
  const { addItem } = useCart();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState(0);
  const [path, setPath] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [diag, setDiag] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [afterUrl, setAfterUrl] = useState(null);
  const [afterLoading, setAfterLoading] = useState(false);
  const [afterError, setAfterError] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [offerQty, setOfferQty] = useState(3);
  const bodyRef = useRef(null);
  const busyRef = useRef(false);
  const afterStartedRef = useRef(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    // Delay ensures the new message has painted before scrolling —
    // iOS Safari otherwise stops short with smooth behavior.
    const t = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(t);
  }, [messages, typing]);

  const bootRef = useRef(false);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    boot();
  }, []);

  // Background "after" image generation — starts as soon as selfie_url is available.
  // Runs exactly once per analysis to avoid duplicate calls.
  useEffect(() => {
    if (!selfieUrl || afterStartedRef.current) return;
    afterStartedRef.current = true;

    setAfterLoading(true);
    setAfterError(false);

    fetch('/api/generate-after-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selfie_url: selfieUrl,
        top_problem: diag?.principal?.toLowerCase() || 'oleosidade',
        scores: diag?.aspectos || {},
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (data.url) {
          setAfterUrl(data.url);
          setAfterLoading(false);
        }
      })
      .catch(() => {
        setAfterError(true);
        setAfterLoading(false);
      });
  }, [selfieUrl]);

  async function botSay(items) {
    for (const it of items) {
      setTyping(true);
      await sleep(800 + Math.random() * 500);
      setTyping(false);
      setMessages((m) => [...m, { ...it, id: nid() }]);
      await sleep(200);
    }
  }

  function userMsg(text) {
    setMessages((m) => [...m, { id: nid(), from: 'user', kind: 'text', text }]);
  }

  async function boot() {
    busyRef.current = true;
    await botSay([
      { from: 'bot', kind: 'text', text: 'Oi! Eu sou a PINY IA 💚 Vou montar seu tratamento personalizado de 21 dias.' },
      { from: 'bot', kind: 'text', text: 'Posso analisar sua pele por uma **selfie** — ou por **5 perguntas rápidas**. Como você prefere?' },
      { from: 'bot', kind: 'chips', action: 'path', chips: [{ label: '📸 Enviar selfie', value: 'foto' }, { label: '💬 Responder perguntas', value: 'perguntas' }] },
    ]);
    busyRef.current = false;
  }

  async function handlePath(choice) {
    if (busyRef.current) return;
    busyRef.current = true;
    userMsg(choice === 'foto' ? '📸 Enviar selfie' : '💬 Responder perguntas');
    setPath(choice);
    setStage(1);
    if (choice === 'foto') {
      await botSay([
        { from: 'bot', kind: 'text', text: 'Perfeito! Me manda uma selfie de frente, com boa luz, rosto limpo e sem maquiagem.' },
        { from: 'bot', kind: 'upload' },
      ]);
    } else {
      setQIdx(0);
      await askQuestion(0);
    }
    busyRef.current = false;
  }

  async function askQuestion(i) {
    const q = PERGUNTAS[i];
    await botSay([
      { from: 'bot', kind: 'text', text: q.pergunta },
      { from: 'bot', kind: 'chips', action: 'answer', chips: q.chips.map((c) => ({ label: c, value: c })) },
    ]);
  }

  async function handleAnswer(value) {
    if (busyRef.current) return;
    busyRef.current = true;
    const q = PERGUNTAS[qIdx];
    userMsg(value);
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    const next = qIdx + 1;
    if (next < PERGUNTAS.length) {
      setQIdx(next);
      await botSay([{ from: 'bot', kind: 'text', text: next % 2 ? 'Entendi! 💚' : 'Anotado!' }]);
      await askQuestion(next);
    } else {
      await runProgress(PASSOS_PERG, 700);
      const d = buildDiagnosis(newAnswers);
      setDiag(d);
      await goStage(2, d);
    }
    busyRef.current = false;
  }

  async function runProgress(steps, intervalMs) {
    const id = nid();
    setMessages((m) => [...m, { id, from: 'bot', kind: 'progress', steps, idx: 0 }]);
    for (let i = 1; i < steps.length; i++) {
      await sleep(intervalMs);
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, idx: i } : x)));
    }
    await sleep(intervalMs);
    setMessages((m) => m.filter((x) => x.id !== id));
  }

  const downscale = (file, M) =>
    new Promise((res, rej) => {
      const img = document.createElement('img');
      img.onload = () => {
        const s = Math.min(1, M / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        res(c);
      };
      img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });

  async function handleUpload(file) {
    setCameraOpen(false);
    if (busyRef.current) return;
    busyRef.current = true;
    userMsg('📸 Selfie enviada');

    let src;
    try {
      src = await downscale(file, 900);
    } catch {
      await botSay([
        { from: 'bot', kind: 'text', text: 'Não consegui abrir essa imagem. Tenta outro arquivo?' },
        { from: 'bot', kind: 'upload' },
      ]);
      busyRef.current = false;
      return;
    }

    // Convert downscaled canvas to a File for upload
    const blob = await new Promise((r) => src.toBlob(r, 'image/jpeg', 0.9));
    const uploadFile = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

    const progId = nid();
    setMessages((m) => [...m, { id: progId, from: 'bot', kind: 'progress', steps: PASSOS_FOTO, idx: 0 }]);

    let stepIdx = 0;
    const advance = (idx) => setMessages((m) => m.map((x) => (x.id === progId ? { ...x, idx } : x)));
    const stepTimer = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, PASSOS_FOTO.length - 2);
      advance(stepIdx);
    }, 1600);

    const formData = new FormData();
    formData.append('selfie', uploadFile);

    try {
      const res = await fetch('/api/skin-analysis', { method: 'POST', body: formData });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${res.status}`);
      }
      const result = await res.json();

      clearInterval(stepTimer);
      advance(PASSOS_FOTO.length - 1);
      await sleep(900);
      setMessages((m) => m.filter((x) => x.id !== progId));

      if (result.erro === 'sem_rosto' || result.error) {
        await botSay([
          { from: 'bot', kind: 'text', text: 'Não consegui ver um rosto com clareza. Tenta de novo com mais luz, de frente pra câmera.' },
          { from: 'bot', kind: 'upload' },
        ]);
        busyRef.current = false;
        return;
      }

      // Build diag from the API result
      let d = buildDiagFromAnalysisResult(result);
      if (!d || !d.bases || d.bases.length === 0) {
        d = fallbackDiagnosis('verde', 'laranja');
      }
      setDiag(d);
      setSelfieUrl(result.selfie_url || null);

      await goStage(2, d);
    } catch (err) {
      clearInterval(stepTimer);
      setMessages((m) => m.filter((x) => x.id !== progId));
      // Fallback to a default diagnosis if the API fails
      const d = fallbackDiagnosis('verde', 'laranja');
      setDiag(d);
      await botSay([
        { from: 'bot', kind: 'text', text: 'Tive um problema para analisar sua selfie, mas montei uma recomendação com base no seu perfil.' },
      ]);
      await goStage(2, d);
    }
    busyRef.current = false;
  }

  async function goStage(s, d) {
    const D = d || diag;
    setStage(s);
    if (s === 2) {
      await botSay([
        { from: 'bot', kind: 'diagcard', diag: D },
        { from: 'bot', kind: 'goodcard' },
        { from: 'bot', kind: 'cta', label: 'Entender meu problema →', next: 3 },
      ]);
    } else if (s === 3) {
      const causas = CAUSAS_MAP[D.principal] || CAUSAS_MAP['Oleosidade'];
      const fechamento = D.principal === 'Sensibilidade' ? 'Entendemos sua pele: acalmar não é esconder — é restaurar a barreira.'
        : D.principal === 'Manchas' ? 'Entendemos sua pele: clarear não é agredir — é renovar com suavidade.'
        : 'Entendemos sua pele: controlar a oleosidade não é ressecar — é equilibrar.';
      await botSay([
        { from: 'bot', kind: 'causecard', items: causas },
        { from: 'bot', kind: 'text', text: fechamento },
        { from: 'bot', kind: 'cta', label: 'Ver como resolver →', next: 4 },
      ]);
    } else if (s === 4) {
      const sols = SOLUCOES_MAP[D.principal] || SOLUCOES_MAP['Oleosidade'];
      await botSay([
        { from: 'bot', kind: 'text', text: 'É mais fácil do que você imagina. Com os ativos certos, sua pele se transforma em semanas.' },
        { from: 'bot', kind: 'solcard', items: sols },
        { from: 'bot', kind: 'cta', label: 'Ver os ativos ideais →', next: 5 },
      ]);
    } else if (s === 5) {
      await botSay([
        { from: 'bot', kind: 'text', text: 'Os ativos que a SUA pele precisa:' },
        { from: 'bot', kind: 'ativoscard', ativos: D.ativos },
        { from: 'bot', kind: 'cta', label: 'Conhecer meu tratamento →', next: 6 },
      ]);
    } else if (s === 6) {
      await botSay([
        { from: 'bot', kind: 'text', text: 'Montei o tratamento ideal pra você:' },
        { from: 'bot', kind: 'productcard', diag: D },
        { from: 'bot', kind: 'cta', label: 'Ver resultados reais →', next: 7 },
      ]);
    } else if (s === 7) {
      await botSay([
        { from: 'bot', kind: 'text', text: 'Olha o que pessoas como você conseguiram:' },
        { from: 'bot', kind: 'proofcard' },
        { from: 'bot', kind: 'cta', label: 'Ver como minha pele pode ficar →', next: 8 },
      ]);
    } else if (s === 8) {
      if (path === 'foto' && selfieUrl && (afterUrl || afterLoading)) {
        await botSay([
          { from: 'bot', kind: 'text', text: afterUrl ? 'Aqui está sua simulação — sua pele no dia 21:' : 'Sua simulação está sendo gerada, um momento…' },
          { from: 'bot', kind: 'simcard', beforeURL: selfieUrl, afterURL: afterUrl, afterLoading, afterError },
        ]);
      } else {
        await botSay([
          { from: 'bot', kind: 'text', text: 'Veja a evolução de uma cliente com o mesmo perfil de pele que você:' },
          { from: 'bot', kind: 'realsimcard', base: D.bases[0] },
        ]);
      }
      await botSay([{ from: 'bot', kind: 'cta', label: 'Quero esse resultado →', next: 9 }]);
    } else if (s === 9) {
      await botSay([
        { from: 'bot', kind: 'text', text: 'Oferta especial para você ✨' },
        { from: 'bot', kind: 'offercard', diag: D },
      ]);
    }
  }

  async function handleCta(label, next) {
    if (busyRef.current) return;
    busyRef.current = true;
    userMsg(label.replace(/→/g, '').trim());
    await goStage(next);
    busyRef.current = false;
  }

  function handleChip(action, value) {
    if (action === 'path') handlePath(value);
    else if (action === 'answer') handleAnswer(value);
  }

  function handleOfferCheckout() {
    if (busyRef.current || !diag) return;
    const base = diag.bases[0];
    const booster = diag.booster;
    const unit = CONFIG.precoBase + (booster ? CONFIG.precoBooster : 0);
    const kitName = diag.bases.map((b) => BASES[b].nome).join(' + ') + (booster ? ' + ' + BOOSTERS[booster].nome : '');
    const total = unit * offerQty * (1 - OFFER_OFF[offerQty] / 100);

    addItem({
      id: `kit-${base}${booster ? `-${booster}` : ''}`,
      name: kitName,
      price: formatPrice(total),
      image: kitPhoto(base, booster),
      selectedQuantity: { quantity: offerQty, price: total },
    });
  }

  const activeIdx = typing ? -1 : messages.length - 1;

  function renderBot(children, key) {
    return (
      <div className="ai-analysis__msg-bot" key={key}>
        <span className="ai-analysis__avatar" aria-hidden="true" />
        <div className="ai-analysis__bot-col">{children}</div>
      </div>
    );
  }

  function renderMsg(m, idx) {
    const active = idx === activeIdx;

    if (m.from === 'user') {
      return <div className="ai-analysis__msg-user" key={m.id}>{m.text}</div>;
    }

    if (m.kind === 'text') {
      return renderBot(<div className="ai-analysis__bubble">{fmt(m.text)}</div>, m.id);
    }

    if (m.kind === 'chips') {
      return renderBot(
        <div className={`ai-analysis__chips${active ? '' : ' spent'}`}>
          {m.chips.map((c) => (
            <button key={c.value} className="ai-analysis__chip" onClick={() => active && handleChip(m.action, c.value)}>
              {c.label}
            </button>
          ))}
        </div>,
        m.id
      );
    }

    if (m.kind === 'cta') {
      return renderBot(
        <button className={`ai-analysis__cta${active ? '' : ' spent'}`} onClick={() => active && handleCta(m.label, m.next)}>
          {m.label}
        </button>,
        m.id
      );
    }

    if (m.kind === 'upload') {
      return renderBot(
        <button className={`ai-analysis__cta ai-analysis__cta--sec${active ? '' : ' spent'}`} onClick={() => active && setCameraOpen(true)}>
          📷 Enviar selfie
        </button>,
        m.id
      );
    }

    if (m.kind === 'progress') {
      return renderBot(
        <div className="ai-analysis__progress">
          <div className="ai-analysis__progress-bar">
            <i style={{ width: `${((m.idx + 1) / m.steps.length) * 100}%` }} />
          </div>
          {m.steps.map((s, i) => (
            <div key={i} className={`ai-analysis__progress-step${i <= m.idx ? ' done' : ''}`}>
              <span className="ai-analysis__progress-ic">{i < m.idx ? '✓' : i === m.idx ? '•' : ''}</span>
              {s}
            </div>
          ))}
        </div>,
        m.id
      );
    }

    if (m.kind === 'diagcard') {
      const D = m.diag;
      return renderBot(
        <div className="ai-analysis__card-inner">
          <div className="ai-analysis__diag-conditions">
            {D.condicoes?.map((c, i) => <span key={i} className="ai-analysis__tag">{c}</span>)}
          </div>
          <div className="ai-analysis__diag-metas">
            <span>Tipo: <b>{D.tipo}</b></span>
            <span>Gravidade: <b>{D.gravidade}</b></span>
          </div>
          <div className="ai-analysis__diag-score">{D.principal} · {D.score}/10</div>
          {D.aspectos && (
            <div className="ai-analysis__diag-aspects">
              {Object.entries({
                oleosidade: 'Oleosidade', acne_ativa: 'Acne ativa', cravos_poros: 'Cravos/poros',
                manchas: 'Manchas', vermelhidao: 'Vermelhidão', textura: 'Textura',
              }).map(([k, label]) => {
                const v = Math.max(0, Math.min(10, Number(D.aspectos[k]) || 0));
                return (
                  <div className="ai-analysis__aspect-row" key={k}>
                    <span>{label}</span>
                    <div className="ai-analysis__aspect-bar"><i style={{ width: `${v * 10}%` }} /></div>
                    <b>{v}/10</b>
                  </div>
                );
              })}
            </div>
          )}
          <p className="ai-analysis__diag-text">{fmt(D.texto)}</p>
        </div>,
        m.id
      );
    }

    if (m.kind === 'goodcard') {
      return renderBot(
        <div className="ai-analysis__good-card">💚 Mas temos uma ótima notícia: é 100% reversível em 21 dias com o tratamento correto.</div>,
        m.id
      );
    }

    if (m.kind === 'causecard') {
      return renderBot(
        <div className="ai-analysis__card-inner">
          <h4>Por que sua pele está assim?</h4>
          <ul className="ai-analysis__check-list">
            {m.items.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>,
        m.id
      );
    }

    if (m.kind === 'solcard') {
      return renderBot(
        <div className="ai-analysis__card-inner">
          <h4>O que vai acontecer com sua pele</h4>
          <div className="ai-analysis__bene-list">
            {m.items.map((s, i) => <div key={i}>{s}</div>)}
          </div>
        </div>,
        m.id
      );
    }

    if (m.kind === 'ativoscard') {
      return renderBot(
        <div className="ai-analysis__card-inner">
          <h4>Ativos para a sua pele</h4>
          <ul className="ai-analysis__ativos-list">
            {m.ativos.map((a, i) => <li key={i}><b>{a[0]}</b><span>{a[1]}</span></li>)}
          </ul>
          <div className="ai-analysis__ativos-foot">💡 Esses ativos são exatamente o que sua pele precisa — todos reunidos no seu kit Piny.</div>
        </div>,
        m.id
      );
    }

    if (m.kind === 'productcard') {
      const D = m.diag;
      const kitName = D.bases.map((b) => BASES[b].nome).join(' + ') + (D.booster ? ' + ' + BOOSTERS[D.booster].nome : '');
      const why = BASES[D.bases[0]].bene.slice(0, 3);
      const res = ['Primeiras melhorias em 7 dias', 'Pele mais lisa e uniforme', 'Resultado visível em 21 dias'];
      return renderBot(
        <div className="ai-analysis__card-inner">
          <div className="ai-analysis__product-row">
            <div className="ai-analysis__product-img">
              <img src={ASSETS[D.bases[0] + '_pack']} alt={kitName} />
            </div>
            <div className="ai-analysis__product-info">
              <b>{kitName}</b>
              <span>Para {BASES[D.bases[0]].para}</span>
            </div>
          </div>
          <p className="ai-analysis__section-title"><b>Por que funciona para VOCÊ:</b></p>
          <ul className="ai-analysis__bullet-list">{why.map((b, i) => <li key={i}>{b}</li>)}</ul>
          <div className="ai-analysis__routine"><b>Como usar (baseado na sua pele):</b> {D.rotina}</div>
          <p className="ai-analysis__section-title"><b>Resultados visíveis em 21 dias:</b></p>
          <ul className="ai-analysis__bullet-list">{res.map((b, i) => <li key={i}>{b}</li>)}</ul>
        </div>,
        m.id
      );
    }

    if (m.kind === 'proofcard') {
      return renderBot(
        <div className="ai-analysis__card-inner">
          {DEPOIMENTOS.map((d, i) => (
            <div className="ai-analysis__depoimento" key={i}>
              <b>{d.nome}</b>{d.texto}
            </div>
          ))}
          <div className="ai-analysis__proof-numbers">
            <span><b>94%</b> viram resultados em 21 dias</span>
            <span><b>15k+</b> clientes</span>
            <span><b>4.9★</b> avaliação</span>
          </div>
          <div className="ai-analysis__guarantee">💯 Resultados em 21 dias ou seu dinheiro de volta</div>
        </div>,
        m.id
      );
    }

    if (m.kind === 'simcard') {
      return renderBot(
        <div className="ai-analysis__sim">
          <div className="ai-analysis__sim-images">
            <div className="ai-analysis__sim-cell">
              <div className="ai-analysis__sim-img">
                <img src={m.beforeURL} alt="Sua pele hoje" />
              </div>
              <span className="ai-analysis__sim-tag ai-analysis__sim-tag--hoje">Hoje</span>
            </div>
            <div className="ai-analysis__sim-cell">
              <div className="ai-analysis__sim-img">
                {m.afterURL ? (
                  <img src={m.afterURL} alt="Sua pele no dia 21" />
                ) : m.afterLoading ? (
                  <div className="ai-analysis__sim-loading">Gerando…</div>
                ) : (
                  <div className="ai-analysis__sim-fallback">Resultado em breve</div>
                )}
              </div>
              <span className="ai-analysis__sim-tag ai-analysis__sim-tag--dia21">Dia 21 · Simulação</span>
            </div>
          </div>
          <ul className="ai-analysis__bullet-list">
            <li>Menos oleosidade</li>
            <li>Poros menos visíveis</li>
            <li>Textura uniforme</li>
            <li>Pele sem brilho</li>
          </ul>
          <div className="ai-analysis__sim-note">*Simulação baseada em resultados médios de clientes. Resultados podem variar.</div>
        </div>,
        m.id
      );
    }

    if (m.kind === 'realsimcard') {
      const imgKey = `mk_${m.base}_1`;
      return renderBot(
        <div className="ai-analysis__sim">
          <div className="ai-analysis__realsim">
            <img src={ASSETS[imgKey]} alt="Resultado real de cliente" />
          </div>
          <ul className="ai-analysis__bullet-list">
            <li>Menos oleosidade</li>
            <li>Poros menos visíveis</li>
            <li>Textura uniforme</li>
            <li>Pele sem brilho</li>
          </ul>
          <div className="ai-analysis__sim-note">*Resultado real de cliente com perfil parecido. Resultados podem variar.</div>
        </div>,
        m.id
      );
    }

    if (m.kind === 'offercard') {
      const D = m.diag;
      const unit = CONFIG.precoBase + (D.booster ? CONFIG.precoBooster : 0);
      const kitName = D.bases.map((b) => BASES[b].curto).join(' + ') + (D.booster ? ' + ' + BOOSTERS[D.booster].nome.replace('Booster ', '') : '');
      const opts = [1, 2, 3].map((q) => ({ q, off: OFFER_OFF[q], total: unit * q * (1 - OFFER_OFF[q] / 100) }));
      return renderBot(
        <div className="ai-analysis__offer">
          <div className="ai-analysis__offer-img">
            <img src={kitPhoto(D.bases[0], D.booster)} alt={kitName} />
          </div>
          <h4>Kit Desafio 21 Dias</h4>
          <div className="ai-analysis__offer-kit">{kitName}</div>
          <div className="ai-analysis__qty-row">
            {opts.map((o) => (
              <div
                key={o.q}
                className={`ai-analysis__qty${offerQty === o.q ? ' on' : ''}`}
                onClick={() => setOfferQty(o.q)}
              >
                <span className="ai-analysis__qty-radio" />
                <span className="ai-analysis__qty-info">
                  {o.q}× {o.q > 1 ? 'kits' : 'kit'}
                  {o.off ? <span className="ai-analysis__qty-tag">{o.off}% OFF</span> : null}
                  {o.q === 3 ? <span className="ai-analysis__qty-tag">Mais vendido</span> : null}
                </span>
                <span className="ai-analysis__qty-price">{money(o.total)}</span>
              </div>
            ))}
          </div>
          <div className="ai-analysis__offer-meta">Frete grátis · {CONFIG.parcelas}× sem juros · Garantia 21 dias</div>
          <div className="ai-analysis__offer-scarcity">⏳ Apenas 12 kits com desconto hoje</div>
          <div className="ai-analysis__offer-cta">
            <button className="ai-analysis__cta ai-analysis__cta--primary" onClick={handleOfferCheckout}>
              ✨ Começar Desafio 21 dias agora
            </button>
          </div>
        </div>,
        m.id
      );
    }

    return null;
  }

  return (
    <section
      className="ai-analysis"
      aria-labelledby="ai-analysis-title"
      style={{ '--ai-analysis-accent': accentColor }}
    >
      <AiAnalysisDecor variant="desktop" />

      <div className="ai-analysis__inner">
        <div className="ai-analysis__heading">
          <h2 className="ai-analysis__title" id="ai-analysis-title">
            {'Não sabe qual é a'}
            <br />
            {'máscara ideal '}
            <br className="ai-analysis__title-break" />
            {'para você?'}
          </h2>
          <p className="ai-analysis__subtitle">
            Deixa com a nossa IA. Envie uma selfie — a IA identifica acne, manchas e oleosidade — ou responda 5
            perguntas rápidas. A PINY foi a 1ª marca brasileira de skincare com análise de pele por IA.
          </p>
        </div>

        <div className="ai-analysis__card">
          <div className="ai-analysis__card-top">
            <div className="ai-analysis__brand">
              <img className="ai-analysis__logo" src={logo} alt="PINY" />
              <span className="ai-analysis__brand-label">Análise com IA</span>
            </div>
            <span className="ai-analysis__step-tag">{stage + 1}/10 · {STAGE_LABELS[stage]}</span>
          </div>

          <div className="ai-analysis__card-body" ref={bodyRef}>
            {messages.map((m, i) => renderMsg(m, i))}
            {typing && (
              <div className="ai-analysis__msg-bot">
                <span className="ai-analysis__avatar" aria-hidden="true" />
                <div className="ai-analysis__typing">
                  <i /><i /><i />
                </div>
              </div>
            )}
          </div>
        </div>

        {cameraOpen && (
          <AiAnalysisCamera onCapture={handleUpload} onClose={() => setCameraOpen(false)} />
        )}

        <AiAnalysisDecor variant="mobile" />
      </div>
    </section>
  );
}

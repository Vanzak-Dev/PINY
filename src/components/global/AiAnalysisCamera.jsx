import { useState, useRef, useEffect } from 'react';

/**
 * Camera capture overlay — generates a File (JPEG) from camera or gallery.
 * No AI calls, no SDK. Adapted from the original CameraCapture component.
 */
export default function AiAnalysisCamera({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (e) {
        setError(e);
      }
    })();
    return () => {
      active = false;
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const snap = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, c.width, c.height);
    c.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      onCapture(file);
    }, 'image/jpeg', 0.92);
  };

  const close = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return (
    <div className="ai-cam-overlay" onClick={close}>
      <div className="ai-cam" onClick={(e) => e.stopPropagation()}>
        <div className="ai-cam-stage">
          {!error ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="ai-cam-video"
              style={{ opacity: ready ? 1 : 0 }}
            />
          ) : (
            <div className="ai-cam-novideo">
              <p>Não consegui acessar a câmera.</p>
              <button className="ai-cam-btn" onClick={() => fileRef.current?.click()}>
                Escolher arquivo
              </button>
            </div>
          )}
          <div className="ai-cam-oval" />
          <div className="ai-cam-hint">Centralize seu rosto no oval</div>
        </div>
        <div className="ai-cam-foot">
          <button className="ai-cam-btn" onClick={close}>Cancelar</button>
          {!error && (
            <button className="ai-cam-shot" onClick={snap} disabled={!ready} aria-label="Capturar" />
          )}
          <button
            className="ai-cam-btn"
            onClick={() => fileRef.current?.click()}
            style={{ fontSize: '.8rem', padding: '10px 14px' }}
          >
            Galeria
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onCapture(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

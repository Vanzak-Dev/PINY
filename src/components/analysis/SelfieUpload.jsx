import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCw, Check, ScanLine, X } from 'lucide-react';
import { ScanCorners } from '@/components/funnel/BeautyTech';

export default function SelfieUpload({ onComplete }) {
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const fileRef = useRef();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraReady(false);
  };

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    setCameraError(false);
    setCameraActive(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(true);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
          setCameraReady(true);
        };
      }
    } catch (e) {
      setCameraError(true);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !cameraReady) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // mirror horizontally to match preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      stopCamera();
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      handleFile(file);
    }, 'image/jpeg', 0.92);
  };

  const handleFile = async (file) => {
    if (!file) return;
    const correctedFile = await fixImageOrientation(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(correctedFile);

    setScanning(true);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('selfie', correctedFile);

      const res = await fetch('/api/skin-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${res.status}`);
      }

      const json = await res.json();
      setScanning(false);
      setUploading(false);
      onComplete(json);
    } catch (err) {
      console.error('[SkinAnalysis] Erro na API:', err?.message || err);
      setScanning(false);
      setUploading(false);
    }
  };

  const fixImageOrientation = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const correctedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
            resolve(correctedFile);
          }, file.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <h2 className="text-[26px] font-bold text-slate-900 mb-1.5">Tire uma selfie</h2>
      <p className="text-[14px] text-slate-500 font-medium mb-7">Rosto limpo, boa iluminação, sem maquiagem</p>

      {!preview && !cameraActive && (
        <div className="space-y-4">
          <div className="relative mx-auto w-64 h-64 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/60 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-700 font-semibold text-[15px]">Envie sua selfie</p>
            <p className="text-[12px] text-slate-400 mt-1">A IA escaneia seu rosto em segundos</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={startCamera}
              className="w-full rounded-2xl py-4 font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.55)' }}
            >
              <Camera className="w-5 h-5" /> Tirar foto agora
            </button>
            <button
              onClick={() => fileRef.current.click()}
              className="w-full rounded-2xl py-4 font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" /> Escolher da galeria
            </button>
          </div>
        </div>
      )}

      {/* Live camera feed */}
      {!preview && cameraActive && (
        <div className="space-y-4">
          <div className="relative mx-auto w-64 h-64 rounded-3xl overflow-hidden bg-black shadow-sm">
            {cameraError ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                <Camera className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-slate-300 text-[13px] font-medium mb-4">Câmera indisponível</p>
                <button
                  onClick={() => { stopCamera(); fileRef.current.click(); }}
                  className="bg-white text-slate-900 rounded-xl px-5 py-2.5 font-bold text-[13px]"
                >
                  Escolher arquivo
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <ScanCorners color="border-white/70" />
                {/* moving scan line while camera is live */}
                {cameraReady && (
                  <motion.div
                    className="absolute left-3 right-3 h-[2px] bg-emerald-400"
                    style={{ boxShadow: '0 0 16px 4px rgba(16,185,129,0.7)' }}
                    initial={{ top: '8%' }}
                    animate={{ top: ['8%', '88%', '8%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/80 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <ScanLine className="w-3.5 h-3.5 animate-pulse" /> Centralize o rosto
                  </span>
                </div>
              </>
            )}
          </div>

          {!cameraError && (
            <div className="flex items-center gap-3">
              <button
                onClick={stopCamera}
                className="flex-1 rounded-2xl py-3.5 font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Cancelar
              </button>
              <button
                onClick={captureFrame}
                disabled={!cameraReady}
                className="flex-1 rounded-2xl py-3.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" /> Capturar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview with scan animation */}
      {preview && (
        <div className="relative mx-auto w-64 h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <img src={preview} alt="Selfie" className="w-full h-full object-cover" />
          <ScanCorners />
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-emerald-400"
                  style={{ boxShadow: '0 0 16px 4px rgba(16,185,129,0.7)' }}
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 bg-emerald-900/5" />
              </motion.div>
            )}
          </AnimatePresence>

          {scanning && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 bg-slate-900/80 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <ScanLine className="w-3.5 h-3.5 animate-pulse" /> Escaneando rosto...
              </span>
            </div>
          )}
          {!scanning && !uploading && (
            <div className="absolute bottom-3 right-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      {preview && !uploading && !scanning && (
        <button
          onClick={() => { setPreview(null); startCamera(); }}
          className="mt-4 text-slate-600 font-semibold text-[14px] inline-flex items-center gap-2 hover:text-slate-900 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Tirar outra foto
        </button>
      )}
    </motion.div>
  );
}

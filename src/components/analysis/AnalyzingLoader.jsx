import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { label: 'Escaneando seu rosto', progress: 14 },
  { label: 'Detectando pontos faciais', progress: 28 },
  { label: 'Avaliando oleosidade e poros', progress: 42 },
  { label: 'Verificando manchas e textura', progress: 58 },
  { label: 'Mapeando quantidade de acne', progress: 72 },
  { label: 'Cruzando com seu perfil', progress: 86 },
  { label: 'Montando sua rotina', progress: 96 },
];

export default function AnalyzingLoader({ currentStage = 'analyzing' }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const pct = steps[currentStep].progress;

  return (
    <div className="py-6 flex flex-col items-center">
      {/* Radar / scan circular */}
      <div className="relative w-44 h-44 mb-7">
        {/* pulsing rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-emerald-400/40"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
          />
        ))}
        {/* rotating sweep */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(16,185,129,0) 0deg, rgba(16,185,129,0.25) 60deg, rgba(16,185,129,0) 90deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* center gauge */}
        <svg width={176} height={176} className="absolute inset-0 -rotate-90">
          <circle cx={88} cy={88} r={74} fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <motion.circle
            cx={88} cy={88} r={74} fill="none" stroke="url(#loaderGrad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 74}
            animate={{ strokeDashoffset: 2 * Math.PI * 74 * (1 - pct / 100) }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[30px] font-bold text-slate-900 leading-none">{pct}%</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mt-1.5">Analisando</span>
        </div>
      </div>

      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="text-[16px] text-slate-700 font-semibold mb-5"
      >
        {steps[currentStep].label}...
      </motion.p>

      {/* Tech step list */}
      <div className="w-full max-w-sm space-y-2.5">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              i < currentStep ? 'bg-emerald-500' : i === currentStep ? 'bg-emerald-100 border border-emerald-300' : 'bg-slate-100'
            }`}>
              {i < currentStep ? (
                <Check className="w-3 h-3 text-white" />
              ) : i === currentStep ? (
                <motion.div className="w-2 h-2 rounded-full bg-emerald-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              ) : null}
            </div>
            <span className={`text-[13px] font-medium ${i <= currentStep ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

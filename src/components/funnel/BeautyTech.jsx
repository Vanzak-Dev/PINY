import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const TECH = {
  primary: '#059669',
  primaryDark: '#047857',
  scan: '#10B981',
};

export function PageShell({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.28 }}
      className={`max-w-lg mx-auto px-5 py-8 min-h-[80vh] flex flex-col bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StepHeader({ icon, title, subtitle }) {
  return (
    <div className="text-center mb-6">
      {icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4">
          <span className="text-emerald-600">{icon}</span>
        </div>
      )}
      <h2 className="text-[25px] font-bold text-slate-900 mb-1.5 leading-tight">{title}</h2>
      {subtitle && <p className="text-[14px] text-slate-500 font-medium px-4">{subtitle}</p>}
    </div>
  );
}

export function NextButton({ children, onClick, delay = 0.4 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mt-auto pt-6"
    >
      <button
        onClick={onClick}
        className="w-full rounded-2xl py-4 text-[16px] font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.99] flex items-center justify-center gap-2 bg-emerald-600"
        style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.55)' }}
      >
        {children}
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export function ScanCorners({ color = 'border-emerald-500/80' }) {
  const base = `absolute w-5 h-5 ${color}`;
  return (
    <>
      <div className={`${base} top-0 left-0 border-t-2 border-l-2 rounded-tl-lg`} />
      <div className={`${base} top-0 right-0 border-t-2 border-r-2 rounded-tr-lg`} />
      <div className={`${base} bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg`} />
      <div className={`${base} bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg`} />
    </>
  );
}

export function ScoreGauge({ value, max = 100, size = 156 }) {
  const pct = Math.min(1, Math.max(0, value / max));
  const r = (size - 18) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="11" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#gaugeGrad)" strokeWidth="11"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[36px] font-bold text-slate-900 leading-none">
          {value}<span className="text-[16px] text-slate-400 font-semibold">/{max}</span>
        </span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mt-1.5">Skin Score</span>
      </div>
    </div>
  );
}

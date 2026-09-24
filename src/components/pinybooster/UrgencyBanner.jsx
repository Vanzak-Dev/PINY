import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingDown } from 'lucide-react';

const PROMO_DURATION_HOURS = 24;
const STORAGE_KEY = 'pinybooster_promo_deadline';

export default function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    let storedDeadline = localStorage.getItem(STORAGE_KEY);
    if (!storedDeadline) {
      const newDeadline = Date.now() + PROMO_DURATION_HOURS * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, newDeadline.toString());
      storedDeadline = newDeadline.toString();
    }
    setDeadline(parseInt(storedDeadline));
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const pad = (n) => String(n).padStart(2, '0');
  const estimatedStock = Math.max(20, Math.min(150, Math.floor((timeLeft.hours * 60 + timeLeft.minutes) / 1440 * 130) + 20));
  const stockPercent = (estimatedStock / 150) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-bold text-[14px]">Oferta termina em:</span>
        </div>
        <div className="flex items-center gap-1 font-mono font-bold">
          <span className="bg-white/20 px-2 py-1 rounded-lg text-[16px]">{pad(timeLeft.hours)}</span>
          <span className="text-[16px]">:</span>
          <span className="bg-white/20 px-2 py-1 rounded-lg text-[16px]">{pad(timeLeft.minutes)}</span>
          <span className="text-[16px]">:</span>
          <span className="bg-white/20 px-2 py-1 rounded-lg text-[16px]">{pad(timeLeft.seconds)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="w-4 h-4" />
        <span className="text-[13px] font-medium">Estimativa de estoque: {estimatedStock} unidades</span>
      </div>

      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: `${stockPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

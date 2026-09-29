import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronRight } from 'lucide-react';
import { PageShell, StepHeader, NextButton, Card, ScoreGauge } from '@/components/funnel/BeautyTech';

const SCORE_ROWS = [
  { key: 'acne', label: 'Acne ativa' },
  { key: 'oleosidade', label: 'Oleosidade' },
  { key: 'manchas', label: 'Manchas' },
  { key: 'poros', label: 'Cravos/poros' },
  { key: 'vermelhidao', label: 'Vermelhidão' },
  { key: 'textura', label: 'Textura' },
];

export default function FunnelStep1({ scores, condicoes, tipoPele, gravidade, observacoes, onNext }) {
  const hasCondicoes = condicoes && condicoes.length > 0;

  const getMainProblem = () => {
    const problems = [
      { key: 'acne', label: 'Acne', score: scores.acne || 0 },
      { key: 'oleosidade', label: 'Oleosidade', score: scores.oleosidade || 0 },
      { key: 'manchas', label: 'Manchas', score: scores.manchas || 0 },
      { key: 'poros', label: 'Poros Dilatados', score: scores.poros || 0 },
      { key: 'vermelhidao', label: 'Vermelhidão', score: scores.vermelhidao || 0 },
      { key: 'textura', label: 'Textura Irregular', score: scores.textura || 0 },
    ];
    return problems.sort((a, b) => b.score - a.score)[0];
  };

  const mainProblem = getMainProblem();

  // General skin health score: higher = healthier. Invert problem scores (0-10 each).
  const scoreValues = SCORE_ROWS.map((r) => scores[r.key] || 0);
  const avgProblem = scoreValues.reduce((a, b) => a + b, 0) / (scoreValues.length || 1);
  const skinScore = Math.max(20, Math.min(95, Math.round(100 - avgProblem * 9)));

  return (
    <PageShell>
      <StepHeader
        icon={<Activity className="w-7 h-7" />}
        title="O que está te impedindo de ter a pele perfeita"
        subtitle="Sua análise facial completa com IA"
      />

      {/* Skin Score Gauge */}
      <Card className="flex flex-col items-center mb-4">
        <ScoreGauge value={skinScore} max={100} size={156} />
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {tipoPele && <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">Tipo: {tipoPele}</span>}
          {gravidade && <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">Gravidade: {gravidade}</span>}
        </div>
      </Card>

      {/* Conditions tags */}
      {hasCondicoes && (
        <Card className="mb-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3 text-center">Condições identificadas</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {condicoes.map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-[12px] font-semibold"
              >
                {c}
              </motion.span>
            ))}
          </div>
        </Card>
      )}

      {/* Data table of scores */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-slate-700">Mapeamento facial</h3>
          <span className="text-[11px] text-slate-400 font-medium">0 a 10</span>
        </div>
        <div className="space-y-3">
          {SCORE_ROWS.map((row, i) => {
            const sc = scores[row.key] || 0;
            const isMain = row.key === mainProblem.key;
            return (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3"
              >
                <span className={`text-[12px] w-24 flex-shrink-0 ${isMain ? 'text-emerald-700 font-bold' : 'text-slate-600 font-medium'}`}>{row.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isMain ? 'bg-emerald-500' : 'bg-emerald-400/70'}`}
                    initial={{ width: 0 }} animate={{ width: `${sc * 10}%` }} transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
                  />
                </div>
                <span className={`text-[12px] font-bold w-7 text-right ${isMain ? 'text-emerald-700' : 'text-slate-700'}`}>{sc}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Reversible note */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3"
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 flex-shrink-0 mt-0.5">
          <ChevronRight className="w-4 h-4 text-white" />
        </span>
        <p className="text-[13px] text-emerald-800 font-semibold leading-relaxed">
          É 100% reversível em apenas 21 dias com o tratamento correto e consistente.
        </p>
      </motion.div>

      <NextButton onClick={onNext}>Entender meu problema</NextButton>
    </PageShell>
  );
}

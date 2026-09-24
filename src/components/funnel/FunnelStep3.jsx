import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { PageShell, StepHeader, NextButton, Card } from '@/components/funnel/BeautyTech';

export default function FunnelStep3({ onNext, scores, condicoes }) {
  const getMainProblem = () => {
    const hasAcne = condicoes?.some(c => c.toLowerCase().includes('acne'));
    const hasVermelhidao = condicoes?.some(c => c.toLowerCase().includes('vermelhidão') || c.toLowerCase().includes('vermelhidao'));
    const hasMelasma = condicoes?.some(c => c.toLowerCase().includes('melasma'));

    const problems = [
      { key: 'acne', score: scores?.acne || 0 },
      { key: 'manchas', score: scores?.manchas || 0 },
      { key: 'poros', score: scores?.poros || 0 },
      { key: 'oleosidade', score: scores?.oleosidade || 0 },
      { key: 'vermelhidao', score: scores?.vermelhidao || 0 },
    ];
    if (hasVermelhidao && hasAcne) return 'vermelhidao';
    if (hasMelasma) return 'manchas';
    return problems.sort((a, b) => b.score - a.score)[0].key;
  };

  const benefitsByProblem = {
    acne: [
      { title: 'Seca espinhas rapidamente', desc: 'Ação anti-inflamatória que combate a acne na raiz' },
      { title: 'Resultados visíveis em 7 dias', desc: 'Redução de inflamações e vermelhidão' },
      { title: 'Sem ressecar a pele', desc: 'Trata acne mantendo o equilíbrio da pele' },
      { title: 'Previne novas espinhas', desc: 'Controla oleosidade e desobstrui poros' },
    ],
    manchas: [
      { title: 'Clareia manchas escuras', desc: 'Atua diretamente na hiperpigmentação pós-acne' },
      { title: 'Renovação acelerada', desc: 'Primeiras melhorias no tom em 7 dias' },
      { title: 'Uniformiza o tom', desc: 'Esfolia e renova sem irritar' },
      { title: 'Ilumina a pele', desc: 'Deixa a pele mais clara e radiante' },
    ],
    poros: [
      { title: 'Refina poros dilatados', desc: 'Limpa profundamente e reduz o tamanho' },
      { title: 'Textura lisa em dias', desc: 'Primeiras melhorias visíveis em 7 dias' },
      { title: 'Remove cravos', desc: 'Desobstrui e purifica sem agredir' },
      { title: 'Controla oleosidade', desc: 'Regula sebo e mantém poros limpos' },
    ],
    oleosidade: [
      { title: 'Controla oleosidade', desc: 'Regula a produção de sebo sem ressecar' },
      { title: 'Pele matificada em dias', desc: 'Primeiras melhorias em 7 dias' },
      { title: 'Equilibra a pele', desc: 'Absorve excesso sem efeito rebote' },
      { title: 'Refina textura', desc: 'Reduz poros e deixa a pele lisa' },
    ],
    vermelhidao: [
      { title: 'Acalma vermelhidão rapidamente', desc: 'Ação anti-inflamatória que reduz irritação e sensibilidade' },
      { title: 'Pele menos reativa em dias', desc: 'Primeiras melhorias visíveis em 7 dias' },
      { title: 'Restaura a barreira cutânea', desc: 'Fortalece a pele contra irritações externas' },
      { title: 'Tom uniforme e calmo', desc: 'Reduz vermelhidão difusa e inflamação' },
    ],
  };

  const mainProblem = getMainProblem();
  const benefits = benefitsByProblem[mainProblem] || benefitsByProblem.acne;

  return (
    <PageShell>
      <StepHeader
        icon={<Zap className="w-7 h-7" />}
        title="É mais fácil do que você imagina"
        subtitle="Com os ativos certos, sua pele se transforma em semanas"
      />

      <div className="space-y-3 mb-4">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          >
            <Card className="flex items-start gap-3.5">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[14px]">
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-0.5 text-[15px]">{b.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{b.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
      >
        <Card className="text-center">
          <p className="text-slate-900 font-bold text-[14px] mb-1">Sem mistério, sem complicação</p>
          <p className="text-slate-500 text-[13px] font-medium">Apenas 3 minutos por dia para uma pele transformada</p>
        </Card>
      </motion.div>

      <NextButton onClick={onNext}>Ver os ativos ideais</NextButton>
    </PageShell>
  );
}

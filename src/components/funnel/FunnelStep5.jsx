import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle } from 'lucide-react';
import { PageShell, StepHeader, NextButton, Card } from '@/components/funnel/BeautyTech';

export default function FunnelStep5({ onNext, scores, condicoes }) {
  const getWhyItWorks = () => {
    const hasAcne = condicoes?.some(c => c.toLowerCase().includes('acne'));
    const hasVermelhidao = condicoes?.some(c => c.toLowerCase().includes('vermelhidão') || c.toLowerCase().includes('vermelhidao'));
    const hasMelasma = condicoes?.some(c => c.toLowerCase().includes('melasma'));
    const hasFoliculite = condicoes?.some(c => c.toLowerCase().includes('foliculite'));

    const problems = [
      { key: 'acne', score: scores?.acne || 0 },
      { key: 'manchas', score: scores?.manchas || 0 },
      { key: 'poros', score: scores?.poros || 0 },
      { key: 'oleosidade', score: scores?.oleosidade || 0 },
      { key: 'vermelhidao', score: scores?.vermelhidao || 0 },
    ];
    const mainProblem = problems.sort((a, b) => b.score - a.score)[0].key;

    const texts = {
      acne: hasVermelhidao ? [
        'Trata acne e vermelhidão intensa: argila, ácidos e óxido de zinco secam espinhas e acalmam inflamação',
        'Ação anti-inflamatória potente: reduz vermelhidão, irritação e sensibilidade rapidamente',
        'Atua em acne inflamada, hormonal e cística sem agredir a pele sensível',
        'Mantém a pele equilibrada, calma e livre de novas inflamações',
      ] : [
        'Trata acne e vermelhidão: argila e ácidos secam espinhas, reduzem inflamações e acalmam a pele',
        'Fórmula poderosa sem irritar: limpa profundamente e controla oleosidade sem ressecar',
        'Atua em diferentes tipos de acne: hormonal, inflamada e cística',
        'Mantém a pele equilibrada e livre de novas inflamações com uso contínuo',
      ],
      manchas: hasMelasma ? [
        'Clareia melasma e hiperpigmentação: ácido glicólico, extrato de abacaxi e hamamélis uniformizam o tom',
        'Esfolia progressivamente: remove células mortas e acelera renovação sem irritar pele sensível',
        'Reduz manchas acastanhadas, escuras e resistentes com uso consistente',
        'Mantém a pele iluminada, uniforme e protegida contra novas manchas',
      ] : [
        'Clareia manchas e marcas de acne: ácidos e extratos naturais uniformizam o tom e reduzem hiperpigmentação',
        'Esfolia e renova: remove células mortas e acelera a renovação da pele sem irritar',
        'Reduz manchas escuras, roxas e antigas progressivamente com uso consistente',
        'Mantém a pele iluminada e uniforme, prevenindo novas manchas',
      ],
      vermelhidao: [
        'Acalma vermelhidão e sensibilidade: óxido de zinco e hamamélis reduzem inflamação e irritação',
        'Restaura a barreira cutânea: fortalece a pele contra agressões externas',
        'Reduz reatividade da pele progressivamente com uso contínuo',
        'Mantém a pele calma, uniforme e menos propensa a irritações',
      ],
      poros: [
        'Refina poros e controla oleosidade: argila desobstrui profundamente e reduz o tamanho dos poros',
        'Remove cravos e impurezas: limpa em profundidade sem agredir a pele',
        'Equilibra a produção de sebo que dilata os poros',
        'Mantém a pele lisa e matificada com uso contínuo',
      ],
      oleosidade: [
        'Controla oleosidade excessiva: argila absorve excesso de sebo e equilibra a pele',
        'Fórmula matificante sem ressecar: regula a produção de óleo mantendo a hidratação',
        'Refina poros dilatados pela oleosidade e melhora a textura',
        'Mantém a pele equilibrada e sem brilho o dia todo',
      ],
    };

    if (hasFoliculite) {
      return [
        'Trata foliculite e inflamação nos folículos: argila, ácidos e óxido de zinco limpam e desinflamam',
        'Ação antibacteriana e calmante: elimina bactérias e reduz vermelhidão rapidamente',
        'Pode ser usada no rosto e corpo: eficaz em áreas com atrito, suor ou depilação',
        'Mantém os folículos limpos e livres de novas inflamações',
      ];
    }
    return texts[mainProblem] || texts.acne;
  };

  const whyItWorks = getWhyItWorks();

  const getUserInstruction = () => {
    const acne = scores?.acne || 0;
    const poros = scores?.poros || 0;
    const oleosidade = scores?.oleosidade || 0;
    if (acne >= 6) return { condition: 'Acne Moderada/Vulgar', frequency: '2x ao dia (manhã e noite)', detail: 'Aplicar camada fina na pele limpa, deixar 10-15 min e enxaguar' };
    if (acne >= 3) return { condition: 'Acne Leve', frequency: '1x ao dia (noite)', detail: 'Aplicar na pele limpa, deixar 10-15 min e enxaguar' };
    if (poros >= 4 || oleosidade >= 4) return { condition: 'Poros e Oleosidade', frequency: '1x a cada 2 dias (noite)', detail: 'Aplicar na pele limpa, deixar 10-15 min e enxaguar' };
    return { condition: 'Uso Geral', frequency: '1x ao dia (noite)', detail: 'Aplicar na pele limpa, deixar 10-15 min e enxaguar' };
  };

  const userInstruction = getUserInstruction();

  const results21Days = [];
  const hasAcneResult = condicoes?.some(c => c.toLowerCase().includes('acne')) || scores?.acne >= 4;
  const hasMelasmaResult = condicoes?.some(c => c.toLowerCase().includes('melasma'));
  const hasManchasResult = condicoes?.some(c => c.toLowerCase().includes('mancha')) || scores?.manchas >= 4;
  const hasVermelhidaoResult = condicoes?.some(c => c.toLowerCase().includes('vermelhidão') || c.toLowerCase().includes('vermelhidao')) || scores?.vermelhidao >= 4;

  if (hasAcneResult) { results21Days.push('Espinhas secam muito rápido'); results21Days.push('Inflamações diminuem visivelmente'); }
  if (hasVermelhidaoResult) results21Days.push('Vermelhidão reduz significativamente');
  if (hasMelasmaResult) results21Days.push('Melasma clareia progressivamente');
  else if (hasManchasResult) results21Days.push('Manchas escuras, roxas e antigas clareiam');
  if (scores?.poros >= 4 || scores?.oleosidade >= 4) { results21Days.push('Poros refinados e menos visíveis'); results21Days.push('Controle de oleosidade sem ressecar'); }
  results21Days.push('Pele mais lisa, uniforme e iluminada');
  if (results21Days.length === 1) {
    results21Days.unshift('Espinhas secam muito rápido', 'Inflamações diminuem visivelmente', 'Manchas clareiam progressivamente');
  }

  return (
    <PageShell className="min-h-[auto]">
      <StepHeader
        icon={<Package className="w-7 h-7" />}
        title="Máscara Piny: Seu Tratamento Completo"
        subtitle="Descubra por que vai funcionar para sua pele"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="mb-4 bg-white rounded-3xl border border-slate-200/70 shadow-sm p-4 flex items-center justify-center"
      >
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694afb5c418f06629191d6f6/590ae097b_Designsemnome18.png"
          alt="Kit Desafio 21 Dias"
          className="w-full h-72 object-contain"
        />
      </motion.div>

      <Card className="mb-4">
        <h3 className="text-[15px] font-bold text-slate-900 mb-3.5">Por que a Máscara Piny funciona para você:</h3>
        <div className="space-y-3">
          {whyItWorks.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium text-[13px] leading-relaxed">{item}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="bg-emerald-600 rounded-3xl p-5 mb-4 text-white" style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.5)' }}>
        <h3 className="text-[15px] font-bold mb-3">Como usar (baseado na sua pele):</h3>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
          <p className="font-bold text-[13px] mb-2">Para {userInstruction.condition}:</p>
          <p className="text-white font-semibold text-[15px] mb-2">{userInstruction.frequency}</p>
          <p className="text-[12px] text-emerald-50 font-medium leading-relaxed">
            {userInstruction.detail}. Use protetor solar durante o dia.
          </p>
        </div>
      </div>

      <Card className="mb-4">
        <h3 className="text-[15px] font-bold text-slate-900 mb-3.5 text-center">Resultados visíveis em 21 dias:</h3>
        <div className="space-y-2.5">
          {results21Days.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700 font-medium text-[14px]">{r}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-5 p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-center font-bold text-rose-700 text-[14px]">Resultados em 21 dias ou seu dinheiro de volta!</p>
        </div>
      </Card>

      <NextButton onClick={onNext} delay={1}>Ver prova social</NextButton>
    </PageShell>
  );
}

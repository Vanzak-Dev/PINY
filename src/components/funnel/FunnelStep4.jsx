import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Check } from 'lucide-react';
import { PageShell, StepHeader, NextButton, Card } from '@/components/funnel/BeautyTech';

export default function FunnelStep4({ onNext, scores, condicoes }) {
  const baseActives = {
    argila: { title: 'Argila (Kaolin)', desc: 'Absorve oleosidade, desobstrui poros profundamente e purifica a pele.' },
    oxido: { title: 'Óxido de Zinco', desc: 'Ação anti-inflamatória e calmante que reduz vermelhidão e acalma a pele.' },
    glico: { title: 'Ácido Glicólico', desc: 'Esfolia, renova e uniformiza o tom da pele progressivamente.' },
    salicilico: { title: 'Ácido Salicílico', desc: 'Desobstrui poros e acelera a renovação celular da pele.' },
    abacaxi: { title: 'Extrato de Abacaxi', desc: 'Rico em enzimas que iluminam e renovam a pele.' },
    hamamelis: { title: 'Extrato de Hamamélis', desc: 'Ação calmante que ajuda a uniformizar e equilibrar a pele.' },
  };

  const getPersonalizedActives = () => {
    const hasAcne = condicoes?.some(c => c.toLowerCase().includes('acne')) || scores?.acne >= 4;
    const hasMelasma = condicoes?.some(c => c.toLowerCase().includes('melasma'));
    const hasManchas = condicoes?.some(c => c.toLowerCase().includes('mancha')) || scores?.manchas >= 4;
    const hasVermelhidao = condicoes?.some(c => c.toLowerCase().includes('vermelhidão') || c.toLowerCase().includes('vermelhidao')) || scores?.vermelhidao >= 4;
    const hasPoros = condicoes?.some(c => c.toLowerCase().includes('poros')) || scores?.poros >= 4;
    const hasOleosidade = condicoes?.some(c => c.toLowerCase().includes('oleosidade')) || scores?.oleosidade >= 4;

    const p = { ...baseActives };
    if (hasAcne) {
      p.argila.desc = 'Absorve oleosidade e acelera a secagem de espinhas sem ressecar.';
      p.salicilico.desc = 'Desobstrui poros, combate espinhas e previne novas inflamações.';
    }
    if (hasMelasma) {
      p.glico.desc = 'Esfolia e clareia melasma progressivamente, uniformizando o tom da pele.';
      p.abacaxi.desc = 'Rico em enzimas que clareiam manchas de melasma e iluminam a pele.';
      p.hamamelis.desc = 'Ação clareadora e antioxidante que melhora o tom da pele.';
    } else if (hasManchas) {
      p.glico.desc = 'Esfolia e diminui manchas escuras, uniformizando o tom da pele.';
      p.abacaxi.desc = 'Rico em enzimas que clareiam manchas pós-acne e iluminam a pele.';
    }
    if (hasVermelhidao) {
      p.oxido.desc = 'Potente anti-inflamatório que acalma vermelhidão e sensibilidade rapidamente.';
      p.hamamelis.desc = 'Acalma irritações, reduz vermelhidão e fortalece a barreira cutânea.';
    }
    if (hasPoros) {
      p.argila.desc = 'Desobstrui poros profundamente e reduz seu tamanho visivelmente.';
      p.salicilico.desc = 'Penetra nos poros, remove impurezas e refina a textura da pele.';
    }
    if (hasOleosidade) {
      p.argila.desc = 'Absorve excesso de oleosidade e mantém a pele equilibrada.';
      p.hamamelis.desc = 'Controla oleosidade e equilibra a produção de sebo.';
    }
    return Object.values(p);
  };

  const actives = getPersonalizedActives();

  return (
    <PageShell>
      <StepHeader
        icon={<FlaskConical className="w-7 h-7" />}
        title="Os ativos que sua pele realmente precisa"
        subtitle="Ingredientes cientificamente comprovados"
      />

      <Card className="mb-4">
        <div className="space-y-4">
          {actives.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                <Check className="w-3.5 h-3.5 text-white" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 mb-0.5 text-[14px]">{a.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center"
      >
        <p className="text-emerald-800 font-bold text-[14px] mb-0.5">Esses ativos são o que sua pele precisa</p>
        <p className="text-emerald-700 text-[13px] font-medium">Todos reunidos na Máscara Piny</p>
      </motion.div>

      <NextButton onClick={onNext} delay={0.6}>Conhecer o produto</NextButton>
    </PageShell>
  );
}

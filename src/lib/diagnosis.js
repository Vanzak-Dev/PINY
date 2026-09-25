/**
 * Deterministic skin diagnosis logic — ported exactly from the original app.
 * No AI, no SDK calls. Pure logic from questionnaire answers.
 */
import { BASES, BOOSTERS } from './pinyAssets';

export const PERGUNTAS = [
  { id: "q1", pergunta: "O que mais te incomoda na sua pele hoje?", chips: ["Espinhas/acne", "Cravos e poros", "Oleosidade/brilho", "Manchas pós-espinha", "Vermelhidão"] },
  { id: "q2", pergunta: "Sua pele brilha quantas horas depois de lavar?", chips: ["Logo depois", "Algumas horas", "Quase não brilha"] },
  { id: "q3", pergunta: "Sua pele fica vermelha ou ardida com facilidade?", chips: ["Sim, é sensível", "Às vezes", "Não"] },
  { id: "q4", pergunta: "E as manchinhas pós-espinha, como estão?", chips: ["Muitas", "Algumas", "Quase nenhuma"] },
  { id: "q5", pergunta: "Com que frequência aparecem espinhas novas?", chips: ["Toda semana", "De vez em quando", "Raramente"] },
];

export const ATIVOS_MAP = {
  "Oleosidade": [["Niacinamida", "controla o brilho e a produção de sebo"], ["Zinco PCA", "regula a oleosidade na origem"], ["Ácido Salicílico", "desobstrui o poro"]],
  "Acne": [["Ácido Salicílico", "trata a espinha ativa na origem"], ["Niacinamida", "acalma a inflamação"], ["Ácido Glicólico", "renova e uniformiza"]],
  "Cravos e poros": [["Carvão Ativado", "um ímã de impurezas"], ["Ácido Salicílico", "entra no poro e desobstrui"], ["Ácido Glicólico", "renovação celular"]],
  "Manchas": [["Ácido Glicólico", "renovação que clareia as marcas"], ["Niacinamida", "uniformiza o tom"], ["Extrato de Abacaxi", "o símbolo da PINY, ajuda no clareamento"]],
  "Sensibilidade": [["Bisabolol", "calmante derivado da camomila"], ["Centella Asiática", "conforto imediato"], ["Pantenol", "recupera a barreira"]],
};

export function buildRotina(bases, booster) {
  const prim = BASES[bases[0]];
  const manha = `Manhã: máscara de ${prim.curto} por 15 min, 1–2× na semana${bases[1] ? " (alterne com a " + BASES[bases[1]].curto + ")" : ""}. Hidrate e use protetor solar sempre de dia.`;
  const noite = booster ? `Noite: o ${BOOSTERS[booster].nome} potencializa o tratamento — use conforme o rótulo.` : `Noite: mantenha a pele limpa e hidratada.`;
  return `${manha} ${noite}`;
}

export function buildDiagnosis(a) {
  const oil = { "Logo depois": 3, "Algumas horas": 2, "Quase não brilha": 0 }[a.q2] ?? 1;
  const sens = { "Sim, é sensível": 3, "Às vezes": 1, "Não": 0 }[a.q3] ?? 0;
  const marks = { "Muitas": 3, "Algumas": 2, "Quase nenhuma": 0 }[a.q4] ?? 0;
  const acne = { "Toda semana": 3, "De vez em quando": 1, "Raramente": 0 }[a.q5] ?? 0;
  const concern = a.q1;

  const conds = [];
  if (oil >= 2) conds.push("oleosidade excessiva");
  if (concern === "Cravos e poros" || (oil >= 2 && acne >= 1)) conds.push("poros dilatados");
  if (concern === "Espinhas/acne" || acne >= 2) conds.push(acne >= 3 ? "acne ativa intensa" : "acne ativa leve");
  if (concern === "Vermelhidão" || sens >= 2) conds.push("sensibilidade cutânea");
  if (concern === "Manchas pós-espinha" || marks >= 2) conds.push("manchas pós-acne");
  if (conds.length === 0) conds.push("oleosidade leve");

  let tipo = "mista";
  if (oil >= 2 && sens === 0) tipo = "oleosa";
  else if (oil === 0 && sens >= 2) tipo = "seca e sensível";
  else if (oil === 0 && sens === 0) tipo = "normal";

  const total = oil + acne + marks + sens;
  let grav = "leve";
  if (total >= 7) grav = "intensa";
  else if (total >= 4) grav = "moderada";

  const scores = {
    "Oleosidade": oil * 3 + (concern === "Oleosidade/brilho" ? 3 : 0),
    "Acne": acne * 3 + (concern === "Espinhas/acne" ? 3 : 0),
    "Cravos e poros": (concern === "Cravos e poros" ? 5 : 0) + oil,
    "Manchas": marks * 3 + (concern === "Manchas pós-espinha" ? 3 : 0),
    "Sensibilidade": sens * 3 + (concern === "Vermelhidão" ? 3 : 0),
  };
  let principal = "Oleosidade", best = 0;
  for (const k in scores) { if (scores[k] > best) { best = scores[k]; principal = k; } }
  const score = Math.min(10, 4 + best);

  let bases = [], booster = null;
  if (principal === "Sensibilidade" || sens >= 3) { bases = ["rosa"]; }
  else if (principal === "Cravos e poros") { bases = ["preta", "verde"]; booster = "laranja"; }
  else if (principal === "Manchas") { bases = [oil >= 2 ? "verde" : "amarela"]; booster = "roxo"; }
  else if (principal === "Oleosidade") { bases = ["verde"]; booster = "laranja"; }
  else if (principal === "Acne") { bases = ["verde"]; booster = "laranja"; }
  else { bases = ["amarela"]; }

  if (bases.length === 1 && sens >= 2 && oil >= 2 && !bases.includes("rosa")) bases.push("rosa");
  if (bases.length === 1 && marks >= 2 && !booster) booster = "roxo";
  bases = bases.slice(0, 2);

  const ativos = ATIVOS_MAP[principal] ? ATIVOS_MAP[principal].slice(0, 4) : ATIVOS_MAP["Oleosidade"].slice(0, 4);

  const texto = `Pelo que você me contou, sua pele é ${tipo} com tendência ${grav} a ${principal.toLowerCase()}. Identifiquei: ${conds.join(", ")}. Tudo isso tem solução — e é 100% reversível com o tratamento certo.`;

  return { condicoes: conds, tipo, gravidade: grav, principal, score, texto, bases, booster, ativos, rotina: buildRotina(bases, booster) };
}

export function fallbackDiagnosis(base, booster) {
  const B = BASES[base];
  const conds = [];
  if (base === "verde" || base === "preta") conds.push("oleosidade excessiva", "poros dilatados");
  if (base === "preta") conds.push("cravos e comedões");
  if (base === "rosa") conds.push("sensibilidade cutânea", "vermelhidão difusa");
  if (base === "amarela") conds.push("acne ativa leve", "manchas pós-acne");
  if (conds.length === 0) conds.push("oleosidade moderada");
  const principal = base === "rosa" ? "Sensibilidade" : base === "preta" ? "Cravos e poros" : base === "amarela" ? "Manchas" : "Oleosidade";
  const tipo = base === "rosa" ? "sensível" : base === "preta" || base === "verde" ? "oleosa" : "mista";
  const ativos = (ATIVOS_MAP[principal] || ATIVOS_MAP["Oleosidade"]).slice(0, 4);
  return {
    condicoes: conds, tipo, gravidade: "moderada", principal, score: 7,
    texto: `Pelo que deu pra ver na sua selfie, sua pele pede foco em ${B.para}. ${booster ? "O " + BOOSTERS[booster].nome + " soma " + BOOSTERS[booster].ativos + " ao tratamento." : "Um booster acelera o resultado."}`,
    bases: [base], booster, ativos, rotina: buildRotina([base], booster),
  };
}

export const DEPOIMENTOS = [
  { nome: "Marina, 24", texto: "Em 3 semanas minha oleosidade desceu e os cravos do nariz sumiram. Não acredito." },
  { nome: "Júlia, 19", texto: "Minha pele era toda vermelha e sensível. A rosa acalmou demais, uso até hoje." },
  { nome: "Bia, 27", texto: "As manchinhas pós-espinha clarearam muito na reta final dos 21 dias. Valeu cada centavo." },
];

export const CAUSAS_MAP = {
  "Oleosidade": ["Produção excessiva de sebo pelas glândulas", "Barreira desequilibrada tentando compensar o ressecamento", "Brilho poucas horas após lavar", "Maquiagem que não fixa"],
  "Acne": ["Poros entupidos por sebo + células mortas", "Inflamação bacteriana localizada", "Hormônios e estresse", "Falta de renovação celular"],
  "Cravos e poros": ["Acúmulo de sebo oxidado no poro", "Falta de esfoliação suave", "Limpeza insuficiente da zona T", "Pele que descama em volta do poro"],
  "Manchas": ["Inflamação pós-acne que marcou a pele", "Exposição ao sol sem proteção", "Renovação celular lenta", "Pele que não descama o pigmento"],
  "Sensibilidade": ["Barreira cutânea fragilizada", "Excesso de ativos agressivos", "Clima e água quente", "Pele que reage a cosméticos comuns"],
};

export const SOLUCOES_MAP = {
  "Oleosidade": ["Acalma o brilho em horas, não dias", "Primeiras melhorias em 7 dias", "Equilibra a barreira sem ressecar", "Tom uniforme e poros menos visíveis"],
  "Acne": ["Acalma a espinha ativa rápido", "Renovação que fecha o poro", "Menos inflamação na semana 1", "Pele mais lisa em 21 dias"],
  "Cravos e poros": ["Desobstrui o poro profundamente", "Reduz cravos na primeira semana", "Poros visivelmente menores", "Textura mais lisa e uniforme"],
  "Manchas": ["Clareia as marcas pós-espinha", "Tom uniforme e iluminado", "Renovação celular acelerada", "Pele com aspecto saudável"],
  "Sensibilidade": ["Acalma a vermelhidão rapidamente", "Conforto imediato na aplicação", "Restaura a barreira cutânea", "Pele tolerante e equilibrada"],
};

/**
 * PINY product assets and config — ported from the original app.
 * Only the data needed by the AiAnalysisSection is included.
 */

export const ASSETS = {
  logo_preta:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/d528c9669_Image2.png",

  preta_pack:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/27d759c3f_preta_pack.webp",
  verde_pack:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/66fc3d92f_verde_pack.webp",
  rosa_pack:     "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/c15da9ea0_rosa_pack.webp",
  amarela_pack:  "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/a2962733f_amarela_pack.webp",

  preta_open:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/9b9eba000_preta_open.webp",
  verde_open:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/6e496dae2_verde_open.webp",
  rosa_open:     "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/e3e480492_rosa_open.webp",
  amarela_open:  "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/8ee878fe5_amarela_open.webp",

  kit_preta_laranja:   "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/09bfc025d_Image400.png",
  kit_preta_roxo:      "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/ef94377ce_Image406.png",
  kit_verde_laranja:   "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/34e1cb87a_Image407.png",
  kit_verde_roxo:      "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/c128e5ff8_Image399.png",
  kit_rosa_laranja:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/ed4a87328_Image409.png",
  kit_rosa_roxo:       "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/21d5652c5_Image402.png",
  kit_amarela_laranja: "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/922edf674_Image401.png",
  kit_amarela_roxo:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/1d8fc62be_Image408.png",

  mk_preta_1:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/c1f3788cc_mk_preta_1.webp",
  mk_rosa_1:     "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/a08db4796_mk_rosa_1.webp",
  mk_verde_1:    "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/0007a6b3e_mk_verde_1.webp",
  mk_amarela_1:  "https://media.base44.com/images/public/6a7a707e879448fc186f44fc/36e254cb5_ArgilaBrancaPinyTextoCorrigido.png",
};

export const CONFIG = {
  precoBase: 89.90,
  precoBooster: 39.90,
  parcelas: 3,
};

export const BASES = {
  preta: {
    nome: "Argila Preta Detox", curto: "Preta", para: "cravos, poros e oleosidade intensa",
    bene: ["Remove impurezas e toxinas da pele", "Controla a oleosidade excessiva", "Desobstrui e minimiza os poros", "Previne acne e cravos"],
    ativos: [
      ["Carvão Ativado", "um ímã de impurezas: puxa o que entope o poro."],
      ["Chá Verde", "antioxidante que ajuda a segurar a oleosidade."],
      ["Ácido Salicílico", "entra no poro e combate a acne na origem."],
      ["Ácido Glicólico", "renovação celular que uniformiza o tom."],
    ],
  },
  verde: {
    nome: "Argila Verde Antiacne", curto: "Verde", para: "espinhas ativas e controle do brilho",
    bene: ["Controla a oleosidade excessiva", "Reduz acne e cravos", "Minimiza poros dilatados", "Purifica a pele"],
    ativos: [
      ["Niacinamida", "acalma a inflamação e controla o brilho."],
      ["Zinco PCA", "regula a produção de sebo."],
      ["Ácido Salicílico", "desobstrui o poro e trata a espinha ativa."],
      ["Ácido Glicólico", "renova e uniformiza a textura."],
    ],
  },
  rosa: {
    nome: "Argila Rosa Calmante", curto: "Rosa", para: "pele sensibilizada e avermelhada",
    bene: ["Ajuda a reduzir manchas e marcas", "Diminui a vermelhidão", "Acalma e suaviza a pele", "Conforto para peles com rosácea"],
    ativos: [
      ["Bisabolol", "calmante derivado da camomila."],
      ["Centella Asiática (cica)", "conforto imediato."],
      ["Pantenol", "hidrata e recupera a barreira."],
      ["Ácido Glicólico", "renova com suavidade."],
    ],
  },
  amarela: {
    nome: "Argila Branca — PINY Original", curto: "Branca", para: "acne e manchas, a clássica +200 mil",
    bene: ["Trata acne e manchas ao mesmo tempo", "Absorbe a oleosidade sem agredir", "Uniformiza o tom", "A clássica: +200 mil vendidas"],
    ativos: [
      ["Caulim", "a argila mais suave: absorve sem irritar."],
      ["Extrato de Abacaxi", "o símbolo da PINY."],
      ["Óxido de Zinco", "ação secativa."],
      ["Salicílico + Glicólico", "o motor antiacne, de fábrica."],
    ],
  },
};

export const BOOSTERS = {
  laranja: { nome: "Booster Antiacne", ativos: "ácido salicílico + niacinamida", para: "espinhas ativas" },
  roxo:    { nome: "Booster Anti-manchas", ativos: "niacinamida + PHAs + uva", para: "marcas e manchas" },
};

export function kitPhoto(base, booster) {
  if (booster) {
    const k = "kit_" + base + "_" + booster;
    if (ASSETS[k]) return ASSETS[k];
  }
  return ASSETS[base + "_open"];
}

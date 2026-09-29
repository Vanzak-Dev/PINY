/**
 * Adapts the /api/skin-analysis response (analysisResult) into the
 * `diag` object format expected by the AiAnalysisSection stages.
 *
 * analysisResult ≈ {
 *   selfie_url, scores, condicoes_identificadas,
 *   tipo_pele, gravidade_geral, top_problem, top_score,
 *   observacoes, rotina
 * }
 *
 * diag ≈ {
 *   condicoes, tipo, gravidade, principal, score, texto,
 *   bases, booster, ativos, rotina, aspectos, selfie_url
 * }
 *
 * IMPORTANT: diag.score is the intensity of the principal condition
 * on a 0–10 scale, derived directly from analysisResult.scores.
 * This is NOT the same as the general skin score (20–95) used in
 * the /analise-sua-pele flow.
 */
import { ATIVOS_MAP, buildRotina } from './diagnosis';

const PRINCIPAL_MAP = {
  'acne': 'Acne',
  'oleosidade': 'Oleosidade',
  'poros': 'Cravos e poros',
  'cravos': 'Cravos e poros',
  'manchas': 'Manchas',
  'vermelhidao': 'Sensibilidade',
  'vermelhidão': 'Sensibilidade',
  'sensibilidade': 'Sensibilidade',
  'textura': 'Textura',
};

const SCORE_KEY_FOR_PRINCIPAL = {
  'Oleosidade': 'oleosidade',
  'Acne': 'acne',
  'Cravos e poros': 'poros',
  'Manchas': 'manchas',
  'Sensibilidade': 'vermelhidao',
  'Textura': 'textura',
};

export function buildDiagFromAnalysisResult(analysisResult) {
  if (!analysisResult) return null;

  const {
    scores = {},
    condicoes_identificadas = [],
    tipo_pele = 'mista',
    gravidade_geral = 'moderada',
    top_problem = '',
    observacoes = '',
    rotina = null,
    selfie_url = null,
  } = analysisResult;

  // Normalize top_problem to the principal format used by the old logic
  let principal = PRINCIPAL_MAP[String(top_problem).toLowerCase()] || 'Oleosidade';
  // If the principal is not in the lookup maps, fallback to Oleosidade
  if (!ATIVOS_MAP[principal]) principal = 'Oleosidade';

  // diag.score: intensity of the principal condition, 0–10,
  // derived directly from scores (NOT top_score, NOT the 20–95 general score).
  const scoreKey = SCORE_KEY_FOR_PRINCIPAL[principal] || 'oleosidade';
  const score = typeof scores[scoreKey] === 'number'
    ? Math.min(10, Math.max(0, scores[scoreKey]))
    : 7;

  // Normalize scores (0–10) to the 0–3 scale used by buildDiagnosis
  // for the bases/booster selection logic.
  const norm = (v) => Math.min(3, Math.round((v ?? 0) / 3.33));
  const oil = norm(scores.oleosidade);
  const sens = norm(scores.vermelhidao);
  const marks = norm(scores.manchas);
  const acne = norm(scores.acne);

  // Derive bases and booster — same logic as buildDiagnosis
  let bases = [], booster = null;
  if (principal === 'Sensibilidade' || sens >= 3) {
    bases = ['rosa'];
  } else if (principal === 'Cravos e poros') {
    bases = ['preta', 'verde']; booster = 'laranja';
  } else if (principal === 'Manchas') {
    bases = [oil >= 2 ? 'verde' : 'amarela']; booster = 'roxo';
  } else if (principal === 'Oleosidade') {
    bases = ['verde']; booster = 'laranja';
  } else if (principal === 'Acne') {
    bases = ['verde']; booster = 'laranja';
  } else {
    bases = ['amarela'];
  }

  if (bases.length === 1 && sens >= 2 && oil >= 2 && !bases.includes('rosa')) bases.push('rosa');
  if (bases.length === 1 && marks >= 2 && !booster) booster = 'roxo';
  bases = bases.slice(0, 2);

  // Ativos from the principal's map
  const ativos = ATIVOS_MAP[principal]
    ? ATIVOS_MAP[principal].slice(0, 4)
    : ATIVOS_MAP['Oleosidade'].slice(0, 4);

  return {
    condicoes: condicoes_identificadas,
    tipo: tipo_pele,
    gravidade: gravidade_geral,
    principal,
    score,
    texto: observacoes,
    bases,
    booster,
    ativos,
    rotina: rotina || buildRotina(bases, booster),
    aspectos: scores || null,
    selfie_url,
  };
}

/**
 * server/lib/skinAnalysis.js
 *
 * Forwards a selfie image to the external Skin Analysis endpoint
 * (a Base44 function deployed on a separate app) and returns the JSON.
 * The API key never reaches the frontend — it lives only in the server env.
 */

const SKIN_ANALYSIS_ENDPOINT =
  'https://piny-routine-advisor-copy-eb9d0002.base44.app/functions/analyzeSkin';

const TIMEOUT_MS = 65_000; // enough for two sequential AI calls

/**
 * @param {{ buffer: Buffer, mimetype: string, originalname: string }} file
 * @param {string} apiKey  — process.env.SKIN_API_KEY
 * @returns {Promise<object>}  JSON from the external endpoint
 */
export async function analyzeSkin(file, apiKey) {
  if (!apiKey) {
    const err = new Error('SKIN_API_KEY não configurada no servidor.');
    err.status = 500;
    throw err;
  }

  const blob = new Blob([file.buffer], { type: file.mimetype });
  const formData = new FormData();
  formData.append('selfie', blob, file.originalname || 'selfie.jpg');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(SKIN_ANALYSIS_ENDPOINT, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = new Error(`Endpoint externo retornou ${res.status}`);
      err.status = res.status;
      err.upstream = true;
      throw err;
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      const err = new Error('Resposta inválida do endpoint externo (não é JSON).');
      err.status = 502;
      err.upstream = true;
      throw err;
    }

    return json;
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error('Timeout: o endpoint externo não respondeu em tempo hábil.');
      e.status = 504;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

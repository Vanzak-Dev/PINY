/**
 * server/lib/generateAfterImage.js
 *
 * Builds a dynamic prompt based on the skin analysis results and calls
 * the external Base44 function that generates the "after" image via
 * GenerateImage. The API key never reaches the frontend — it lives only
 * in the server env.
 */

const GENERATE_IMAGE_ENDPOINT =
  'https://piny-routine-advisor-copy-eb9d0002.base44.app/functions/generateAfterImage';

const TIMEOUT_MS = 60_000;

/**
 * Builds a dynamic prompt based on the top problem and scores.
 * Keeps identity, lighting, framing and orientation. Natural, plausible.
 */
function buildPrompt(top_problem, scores) {
  const identity =
    'CRITICAL IDENTITY PRESERVATION: You MUST preserve EXACTLY the same person. ' +
    'Same facial identity, same facial structure, same hair, same eyes, same nose, same mouth, same pose, same framing, same lighting. ' +
    'Do NOT replace the person. Do NOT change age, gender or ethnicity. ' +
    'Do NOT generate a new face. Use the provided reference image as the base and ONLY modify visible skin conditions.';

  const task =
    'Apply subtle, realistic skincare improvements to this exact face to simulate 21 days of consistent treatment. ' +
    'The improvements must look natural and plausible — not exaggerated or artificial.';

  const specifics = {
    acne: 'Reduce acne, pimples and blemishes. Calm inflammation and redness from active breakouts.',
    manchas: 'Lighten dark spots, hyperpigmentation and post-acne marks. Even out skin tone gradually.',
    vermelhidao: 'Reduce redness, calm sensitivity and inflammation. Restore an even, calm complexion.',
    poros: 'Refine and minimize visible pores. Smooth skin texture without altering structure.',
    oleosidade: 'Balance oiliness, matte the skin naturally. Reduce excess shine without drying.',
    textura: 'Smooth rough skin texture, even out the surface. Refine without changing structure.',
  };

  const problemText = specifics[top_problem] || specifics.acne;

  const emphasis = [];
  if (scores) {
    if ((scores.acne ?? 0) >= 5) emphasis.push('Significantly reduce active acne.');
    if ((scores.manchas ?? 0) >= 5) emphasis.push('Visibly lighten dark spots.');
    if ((scores.vermelhidao ?? 0) >= 5) emphasis.push('Calm visible redness.');
    if ((scores.poros ?? 0) >= 5) emphasis.push('Refine enlarged pores.');
    if ((scores.oleosidade ?? 0) >= 5) emphasis.push('Control excess oil.');
    if ((scores.textura ?? 0) >= 5) emphasis.push('Smooth rough texture.');
  }

  const emphasisText = emphasis.length > 0 ? ` ${emphasis.join(' ')}` : '';

  return `${identity}\n\n${task} ${problemText}${emphasisText} Healthy, glowing but natural skin. No makeup, no filters, no unrealistic perfection.`;
}

/**
 * @param {{ selfie_url: string, top_problem: string, scores: object }} params
 * @param {string} apiKey — process.env.GENERATE_IMAGE_API_KEY
 * @returns {Promise<{ url: string }>}
 */
export async function generateAfterImage({ selfie_url, top_problem, scores }, apiKey) {
  if (!apiKey) {
    const err = new Error('GENERATE_IMAGE_API_KEY não configurada no servidor.');
    err.status = 500;
    throw err;
  }

  const prompt = buildPrompt(top_problem, scores);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GENERATE_IMAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        prompt,
        selfie_url,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = new Error(`Endpoint externo retornou ${res.status}`);
      err.status = res.status;
      err.upstream = true;
      err.notDeployed = res.status === 404;
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

    if (!json.url) {
      const err = new Error('Endpoint externo não retornou uma URL de imagem.');
      err.status = 502;
      err.upstream = true;
      throw err;
    }

    return { url: json.url };
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

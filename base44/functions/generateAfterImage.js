/**
 * Base44 Function: generateAfterImage
 *
 * DEPLOY INSTRUCTION:
 * Create this function on the Base44 app "piny-routine-advisor-copy-eb9d0002"
 * at the endpoint path: /functions/generateAfterImage
 *
 * The function receives { prompt, selfie_url } from the backend Express server
 * (sent as JSON with an X-API-Key header for authentication), calls
 * GenerateImage with the selfie as a reference image, and returns { url }.
 *
 * The API key is configured in the function's settings on the Base44 platform
 * and must match the GENERATE_IMAGE_API_KEY secret stored in this app's env.
 */

export async function generateAfterImage({ prompt, selfie_url }) {
  const { url } = await base44.integrations.Core.GenerateImage({
    prompt,
    existing_image_urls: [selfie_url],
  });

  return { url };
}

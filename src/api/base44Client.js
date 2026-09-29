/**
 * Base44 SDK client.
 *
 * Creates and exports a singleton Base44 client configured with the app ID,
 * access token, and functions version from app-params.js.
 *
 * Usage:
 *   import { base44 } from "@/api/base44Client";
 *   await base44.entities.SkinAnalysisData.create({ ... });
 *   await base44.integrations.Core.InvokeLLM({ prompt: "..." });
 *   await base44.integrations.Core.UploadPublicFile({ file });
 *   await base44.integrations.Core.GenerateImage({ prompt: "..." });
 *   base44.analytics.track({ eventName: "...", properties: { ... } });
 */

import { createClient } from "@base44/sdk";
import { APP_ID, ACCESS_TOKEN, FUNCTIONS_VERSION } from "@/lib/app-params";

export const base44 = createClient({
  appId: APP_ID,
  token: ACCESS_TOKEN || undefined,
  functionsVersion: FUNCTIONS_VERSION,
  requiresAuth: false,
});

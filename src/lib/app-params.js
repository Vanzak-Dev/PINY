/**
 * Base44 app parameters.
 *
 * Reads configuration from Vite env vars (VITE_* prefix) and URL query params.
 * URL params take precedence — they are set by the Base44 platform when the
 * app is embedded in the builder iframe. In standalone/development mode the
 * Vite env vars (from .env.base44-defaults or the platform env file) are used.
 */

const urlParams = new URLSearchParams(
  typeof window !== "undefined" ? window.location.search : ""
);

export const APP_ID =
  urlParams.get("app_id") ||
  import.meta.env.VITE_BASE44_APP_ID ||
  "";

export const FUNCTIONS_VERSION =
  urlParams.get("functions_version") ||
  import.meta.env.VITE_BASE44_FUNCTIONS_VERSION ||
  "v1";

export const ACCESS_TOKEN =
  urlParams.get("access_token") ||
  "";

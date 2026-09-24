/**
 * Converts a page name (PascalCase) to a URL path (kebab-case).
 * e.g. ProductsPinyBooster -> /products-piny-booster
 *      Home -> /
 */
export function createPageUrl(pageName) {
  if (pageName === "Home") return "/";
  return (
    "/" +
    pageName
      .split(/(?=[A-Z])/)
      .map((s) => s.toLowerCase())
      .join("-")
  );
}

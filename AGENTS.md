# PINY development notes

- For day-to-day coding, run without Docker: `npm install` (root) + `npm install` (in `server/`), then start the API with `node --watch index.js` in `server/` (needs `PORT=8000`) and the web app with `npm run dev` (Vite, port 5173). The `/api` proxy target defaults to `http://localhost:8000` (see `API_PROXY_TARGET` in `vite.config.js`) for this flow.
- Docker (`docker compose -f docker-compose.base44.yml up -d`) is reserved for production-like runs; it sets `API_PROXY_TARGET=http://api:8000` for the web service so the proxy reaches the api container by its Compose network hostname.
- The Vite development server runs from bind-mounted source on host port 3000.
- Pages compose sections; Home-specific sections live in `src/sections/home`.
- Verify production compilation with `npm run build` inside the web service.
- The catalog API runs from `server/` as the `api` Compose service; Vite proxies same-origin `/api` requests to it.
- Catalog JSON, UGC review records, product images, and uploaded review media persist in `server/data/` and `server/uploads/` (bind-mounted, gitignored). Verify the catalog with `curl http://localhost:3000/api/products?featured=true` and public UGC with `curl http://localhost:3000/api/reviews`.
- With no active UGC records, the public section intentionally renders five static crops from the supplied Figma reference.

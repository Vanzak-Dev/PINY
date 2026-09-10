# PINY development notes

- Start the preview with `docker compose -f docker-compose.base44.yml up -d`.
- The Vite development server runs from bind-mounted source on host port 3000.
- Pages compose sections; Home-specific sections live in `src/sections/home`.
- Verify production compilation with `npm run build` inside the web service.
- The catalog API runs from `server/` as the `api` Compose service; Vite proxies same-origin `/api` requests to it.
- Catalog JSON, UGC review records, product images, and uploaded review media persist in the `piny_catalog_data` and `piny_product_uploads` volumes. Verify the catalog with `curl http://localhost:3000/api/products?featured=true` and public UGC with `curl http://localhost:3000/api/reviews`.
- With no active UGC records, the public section intentionally renders five static crops from the supplied Figma reference.

import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { changePassword, createSession, parseCookies, readSession, verifyCredentials } from './lib/auth.js';
import { ensureCatalog, ensureCollections, ensureSiteSettings, normalizeCollection, normalizeProduct, normalizeProductReview, normalizeReview, readCollections, readProductReviews, readProducts, readReviews, readSiteSettings, saveCollections, saveProductReviews, saveProducts, saveReviews, saveSiteSettings } from './lib/store.js';

const port = Number(process.env.PORT || 8000);
const uploadDirectory = process.env.UPLOAD_DIR || path.resolve('uploads');
await mkdir(uploadDirectory, { recursive: true });
await ensureCatalog();
await ensureCollections();
await ensureSiteSettings();

const mediaStorage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
  },
});

const upload = multer({
  storage: mediaStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => callback(null, file.mimetype.startsWith('image/')),
});

const reviewUpload = multer({
  storage: mediaStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => callback(null, file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')),
});

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use('/api/uploads', express.static(uploadDirectory));

function sessionCookie(token) {
  return `admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`;
}

async function authenticate(request, response, next) {
  const session = await readSession(parseCookies(request.headers.cookie).admin_session);
  if (!session) return response.status(401).json({ error: 'Sessão expirada. Entre novamente.' });
  request.admin = session;
  next();
}

async function authorizeCatalog(request, response, next) {
  if (request.admin.mustChangePassword) return response.status(403).json({ error: 'Troque a senha temporária antes de acessar o catálogo.' });
  next();
}

function bodyWithUploads(request, current = {}) {
  const files = request.files || {};
  return {
    ...request.body,
    image: files.imageFile?.[0] ? `/api/uploads/${files.imageFile[0].filename}` : request.body.image || current.image,
    backgroundImage: files.backgroundFile?.[0] ? `/api/uploads/${files.backgroundFile[0].filename}` : request.body.backgroundImage || current.backgroundImage,
    featureLeftImage: files.featureLeftImageFile?.[0] ? `/api/uploads/${files.featureLeftImageFile[0].filename}` : request.body.featureLeftImage || current.featureLeftImage,
    featureRightImage: files.featureRightImageFile?.[0] ? `/api/uploads/${files.featureRightImageFile[0].filename}` : request.body.featureRightImage || current.featureRightImage,
    featureProductImage: files.featureProductImageFile?.[0] ? `/api/uploads/${files.featureProductImageFile[0].filename}` : request.body.featureProductImage || current.featureProductImage,
    comparisonImage1: files.comparisonImage1File?.[0] ? `/api/uploads/${files.comparisonImage1File[0].filename}` : request.body.comparisonImage1 || current.comparisonImage1,
    comparisonImage2: files.comparisonImage2File?.[0] ? `/api/uploads/${files.comparisonImage2File[0].filename}` : request.body.comparisonImage2 || current.comparisonImage2,
    comparisonImage3: files.comparisonImage3File?.[0] ? `/api/uploads/${files.comparisonImage3File[0].filename}` : request.body.comparisonImage3 || current.comparisonImage3,
    comparisonImage4: files.comparisonImage4File?.[0] ? `/api/uploads/${files.comparisonImage4File[0].filename}` : request.body.comparisonImage4 || current.comparisonImage4,
    comparisonProductIcon: files.comparisonProductIconFile?.[0] ? `/api/uploads/${files.comparisonProductIconFile[0].filename}` : request.body.comparisonProductIcon || current.comparisonProductIcon,
    presentationBackgroundImage: files.presentationBackgroundFile?.[0] ? `/api/uploads/${files.presentationBackgroundFile[0].filename}` : request.body.presentationBackgroundImage || current.presentationBackgroundImage,
    presentationProductImage: files.presentationProductFile?.[0] ? `/api/uploads/${files.presentationProductFile[0].filename}` : request.body.presentationProductImage || current.presentationProductImage,
  };
}

function validateProduct(product) {
  if (!product.name) return 'Informe o nome do produto.';
  if (!product.slug) return 'Informe um slug válido.';
  if (product.price < 0) return 'O preço não pode ser negativo.';
  if (!product.image) return 'Envie uma imagem principal.';
  return '';
}

function hasConflict(products, product, ignoredId) {
  return products.some((item) => item.id !== ignoredId && (item.slug === product.slug || (product.sku && item.sku === product.sku)));
}

function uniqueProductValue(products, baseValue, key) {
  let value = baseValue;
  let suffix = 2;
  while (products.some((product) => product[key] === value)) value = `${baseValue}-${suffix++}`;
  return value;
}

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.get('/api/settings', async (_request, response) => response.json(await readSiteSettings()));

app.get('/api/products', async (request, response) => {
  const products = await readProducts();
  const featuredOnly = request.query.featured === 'true';
  response.json(products.filter((product) => product.status === 'active' && (!featuredOnly || product.featured)));
});

app.get('/api/products/:identifier', async (request, response) => {
  const products = await readProducts();
  const product = products.find((item) => (
    item.status === 'active'
    && (item.slug === request.params.identifier || item.id === request.params.identifier)
  ));
  if (!product) return response.status(404).json({ error: 'Produto não encontrado.' });
  response.json(product);
});

app.get('/api/reviews', async (_request, response) => {
  response.json((await readReviews()).filter((review) => review.active));
});

app.get('/api/collections', async (_request, response) => {
  response.json((await readCollections()).filter((collection) => collection.active));
});

app.get('/api/product-reviews', async (request, response) => {
  const productId = String(request.query.productId || '');
  const reviews = (await readProductReviews()).filter((review) => review.active && (!productId || review.productId === productId));
  response.json(reviews);
});

app.post('/api/product-reviews', upload.single('photoFile'), async (request, response) => {
  const photo = request.file ? `/api/uploads/${request.file.filename}` : request.body.photo || '';
  const review = normalizeProductReview({ ...request.body, photo });
  if (!review.productId) return response.status(400).json({ error: 'Selecione um produto.' });
  if (!review.userName) return response.status(400).json({ error: 'Informe seu nome.' });
  if (!review.title) return response.status(400).json({ error: 'Informe um título.' });
  if (!review.body) return response.status(400).json({ error: 'Escreva sua avaliação.' });
  const reviews = await readProductReviews();
  reviews.push(review);
  await saveProductReviews(reviews);
  response.status(201).json(review);
});

app.post('/api/auth/login', async (request, response) => {
  const auth = await verifyCredentials(String(request.body.username || ''), String(request.body.password || ''));
  if (!auth) return response.status(401).json({ error: 'Usuário ou senha inválidos.' });
  const token = await createSession();
  response.setHeader('Set-Cookie', sessionCookie(token));
  response.json({ username: auth.username, mustChangePassword: auth.mustChangePassword });
});

app.get('/api/auth/session', authenticate, (request, response) => response.json(request.admin));
app.post('/api/auth/logout', (_request, response) => {
  response.setHeader('Set-Cookie', 'admin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  response.status(204).end();
});

app.put('/api/auth/password', authenticate, async (request, response) => {
  try {
    const changed = await changePassword(String(request.body.currentPassword || ''), String(request.body.newPassword || ''));
    if (!changed) return response.status(400).json({ error: 'A senha temporária está incorreta.' });
    const token = await createSession();
    response.setHeader('Set-Cookie', sessionCookie(token));
    response.json({ username: request.admin.username, mustChangePassword: false });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.use('/api/admin', authenticate, authorizeCatalog);
app.get('/api/admin/products', async (_request, response) => response.json(await readProducts()));
app.get('/api/admin/reviews', async (_request, response) => response.json(await readReviews()));
app.get('/api/admin/settings', async (_request, response) => response.json(await readSiteSettings()));
app.put('/api/admin/settings', async (request, response) => response.json(await saveSiteSettings(request.body)));

app.get('/api/admin/collections', async (_request, response) => response.json(await readCollections()));
app.post('/api/admin/collections', async (request, response) => {
  const collections = await readCollections();
  const collection = normalizeCollection(request.body);
  if (!collection.name) return response.status(400).json({ error: 'Informe o nome da coleção.' });
  collections.push(collection);
  await saveCollections(collections);
  response.status(201).json(collection);
});
app.put('/api/admin/collections/:id', async (request, response) => {
  const collections = await readCollections();
  const index = collections.findIndex((collection) => collection.id === request.params.id);
  if (index < 0) return response.status(404).json({ error: 'Coleção não encontrada.' });
  const collection = normalizeCollection(request.body, collections[index]);
  if (!collection.name) return response.status(400).json({ error: 'Informe o nome da coleção.' });
  collections[index] = collection;
  await saveCollections(collections);
  response.json(collection);
});
app.delete('/api/admin/collections/:id', async (request, response) => {
  const collections = await readCollections();
  const nextCollections = collections.filter((collection) => collection.id !== request.params.id);
  if (nextCollections.length === collections.length) return response.status(404).json({ error: 'Coleção não encontrada.' });
  await saveCollections(nextCollections);
  response.status(204).end();
});

app.get('/api/admin/product-reviews', async (_request, response) => response.json(await readProductReviews()));
app.delete('/api/admin/product-reviews/:id', async (request, response) => {
  const reviews = await readProductReviews();
  const nextReviews = reviews.filter((review) => review.id !== request.params.id);
  if (nextReviews.length === reviews.length) return response.status(404).json({ error: 'Review não encontrado.' });
  await saveProductReviews(nextReviews);
  response.status(204).end();
});
app.put('/api/admin/product-reviews/:id', async (request, response) => {
  const reviews = await readProductReviews();
  const index = reviews.findIndex((review) => review.id === request.params.id);
  if (index < 0) return response.status(404).json({ error: 'Review não encontrado.' });
  reviews[index] = normalizeProductReview(request.body, reviews[index]);
  await saveProductReviews(reviews);
  response.json(reviews[index]);
});

const reviewMediaUpload = reviewUpload.single('mediaFile');
app.post('/api/admin/reviews', reviewMediaUpload, async (request, response) => {
  const media = request.file ? `/api/uploads/${request.file.filename}` : request.body.media;
  const review = normalizeReview({
    ...request.body,
    media,
    mediaType: request.file?.mimetype.startsWith('image/') ? 'image' : request.body.mediaType || 'video',
  });
  if (!review.productId) return response.status(400).json({ error: 'Selecione um produto.' });
  if (!review.media) return response.status(400).json({ error: 'Envie um vídeo ou uma imagem.' });
  const reviews = await readReviews();
  reviews.push(review);
  await saveReviews(reviews);
  response.status(201).json(review);
});

app.put('/api/admin/reviews/:id', reviewMediaUpload, async (request, response) => {
  const reviews = await readReviews();
  const index = reviews.findIndex((review) => review.id === request.params.id);
  if (index < 0) return response.status(404).json({ error: 'Review não encontrado.' });
  const media = request.file ? `/api/uploads/${request.file.filename}` : request.body.media || reviews[index].media;
  const review = normalizeReview({
    ...request.body,
    media,
    mediaType: request.file?.mimetype.startsWith('image/') ? 'image' : request.file ? 'video' : reviews[index].mediaType,
  }, reviews[index]);
  if (!review.productId) return response.status(400).json({ error: 'Selecione um produto.' });
  reviews[index] = review;
  await saveReviews(reviews);
  response.json(review);
});

app.delete('/api/admin/reviews/:id', async (request, response) => {
  const reviews = await readReviews();
  const nextReviews = reviews.filter((review) => review.id !== request.params.id);
  if (nextReviews.length === reviews.length) return response.status(404).json({ error: 'Review não encontrado.' });
  await saveReviews(nextReviews);
  response.status(204).end();
});

const productUpload = upload.fields([
  { name: 'imageFile', maxCount: 1 },
  { name: 'backgroundFile', maxCount: 1 },
  { name: 'featureLeftImageFile', maxCount: 1 },
  { name: 'featureRightImageFile', maxCount: 1 },
  { name: 'featureProductImageFile', maxCount: 1 },
  { name: 'comparisonImage1File', maxCount: 1 },
  { name: 'comparisonImage2File', maxCount: 1 },
  { name: 'comparisonImage3File', maxCount: 1 },
  { name: 'comparisonImage4File', maxCount: 1 },
  { name: 'comparisonProductIconFile', maxCount: 1 },
  { name: 'presentationBackgroundFile', maxCount: 1 },
  { name: 'presentationProductFile', maxCount: 1 },
]);
app.post('/api/admin/products', productUpload, async (request, response) => {
  const products = await readProducts();
  const product = normalizeProduct(bodyWithUploads(request));
  product.crossSellIds = product.crossSellIds.filter((id) => id !== product.id && products.some((item) => item.id === id));
  const error = validateProduct(product);
  if (error) return response.status(400).json({ error });
  if (hasConflict(products, product)) return response.status(409).json({ error: 'Já existe um produto com este slug ou SKU.' });
  products.push(product);
  await saveProducts(products);
  response.status(201).json(product);
});

app.post('/api/admin/products/:id/duplicate', async (request, response) => {
  const products = await readProducts();
  const source = products.find((product) => product.id === request.params.id);
  if (!source) return response.status(404).json({ error: 'Produto não encontrado.' });

  const duplicate = normalizeProduct({
    ...source,
    name: `${source.name} (cópia)`,
    slug: uniqueProductValue(products, `${source.slug}-copia`, 'slug'),
    sku: source.sku ? uniqueProductValue(products, `${source.sku}-COPY`, 'sku') : '',
    status: 'draft',
  });
  products.push(duplicate);
  await saveProducts(products);
  response.status(201).json(duplicate);
});

app.put('/api/admin/products/:id', productUpload, async (request, response) => {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === request.params.id);
  if (index < 0) return response.status(404).json({ error: 'Produto não encontrado.' });
  const product = normalizeProduct(bodyWithUploads(request, products[index]), products[index]);
  product.crossSellIds = product.crossSellIds.filter((id) => id !== product.id && products.some((item) => item.id === id));
  const error = validateProduct(product);
  if (error) return response.status(400).json({ error });
  if (hasConflict(products, product, product.id)) return response.status(409).json({ error: 'Já existe um produto com este slug ou SKU.' });
  products[index] = product;
  await saveProducts(products);
  response.json(product);
});

app.delete('/api/admin/products/:id', async (request, response) => {
  const products = await readProducts();
  const nextProducts = products.filter((product) => product.id !== request.params.id);
  if (nextProducts.length === products.length) return response.status(404).json({ error: 'Produto não encontrado.' });
  await saveProducts(nextProducts);
  response.status(204).end();
});

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) return response.status(400).json({ error: 'A imagem deve ter no máximo 8 MB.' });
  console.error(error);
  response.status(500).json({ error: 'Erro interno do catálogo.' });
});

app.listen(port, '0.0.0.0', () => console.log(`Catalog API listening on ${port}`));

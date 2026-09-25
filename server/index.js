import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { changePassword, createSession, parseCookies, readSession, verifyCredentials } from './lib/auth.js';
import { ensureCatalog, ensureCollections, ensureSiteSettings, normalizeCollection, normalizeProduct, normalizeProductReview, normalizeReview, readCollections, readProductReviews, readProducts, readReviews, readSiteSettings, saveCollections, saveProductReviews, saveProducts, saveReviews, saveSiteSettings } from './lib/store.js';
import { getYampiConfig, findSkuByCode, createPaymentLink, findCustomersByCpf, listOrdersByCustomer, getOrderDetails, extractLocalizedString } from './lib/yampi.js';
import { readOrders, upsertOrder, findOrderByYampiId } from './lib/orders.js';

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
    featureProductInfoMobileBackground: files.featureProductInfoMobileBackgroundFile?.[0] ? `/api/uploads/${files.featureProductInfoMobileBackgroundFile[0].filename}` : request.body.featureProductInfoMobileBackground || current.featureProductInfoMobileBackground,
    comparisonImage1: files.comparisonImage1File?.[0] ? `/api/uploads/${files.comparisonImage1File[0].filename}` : request.body.comparisonImage1 || current.comparisonImage1,
    comparisonImage2: files.comparisonImage2File?.[0] ? `/api/uploads/${files.comparisonImage2File[0].filename}` : request.body.comparisonImage2 || current.comparisonImage2,
    comparisonImage3: files.comparisonImage3File?.[0] ? `/api/uploads/${files.comparisonImage3File[0].filename}` : request.body.comparisonImage3 || current.comparisonImage3,
    comparisonImage4: files.comparisonImage4File?.[0] ? `/api/uploads/${files.comparisonImage4File[0].filename}` : request.body.comparisonImage4 || current.comparisonImage4,
    comparisonProductIcon: files.comparisonProductIconFile?.[0] ? `/api/uploads/${files.comparisonProductIconFile[0].filename}` : request.body.comparisonProductIcon || current.comparisonProductIcon,
    comparisonCheckIcon: files.comparisonCheckIconFile?.[0] ? `/api/uploads/${files.comparisonCheckIconFile[0].filename}` : request.body.comparisonCheckIcon || current.comparisonCheckIcon,
    comparisonXIcon: files.comparisonXIconFile?.[0] ? `/api/uploads/${files.comparisonXIconFile[0].filename}` : request.body.comparisonXIcon || current.comparisonXIcon,
    presentationBackgroundImage: files.presentationBackgroundFile?.[0] ? `/api/uploads/${files.presentationBackgroundFile[0].filename}` : request.body.presentationBackgroundImage || current.presentationBackgroundImage,
    presentationMobileBackgroundImage: files.presentationMobileBackgroundFile?.[0] ? `/api/uploads/${files.presentationMobileBackgroundFile[0].filename}` : request.body.presentationMobileBackgroundImage || current.presentationMobileBackgroundImage,
    presentationProductImage: files.presentationProductFile?.[0] ? `/api/uploads/${files.presentationProductFile[0].filename}` : request.body.presentationProductImage || current.presentationProductImage,
    quantityOptionIcon: files.quantityOptionIconFile?.[0] ? `/api/uploads/${files.quantityOptionIconFile[0].filename}` : request.body.quantityOptionIcon || current.quantityOptionIcon || '',
    activesProductImage: files.activesProductFile?.[0] ? `/api/uploads/${files.activesProductFile[0].filename}` : request.body.activesProductImage || current.activesProductImage,
    activesTextureImage: files.activesTextureFile?.[0] ? `/api/uploads/${files.activesTextureFile[0].filename}` : request.body.activesTextureImage || current.activesTextureImage,
    activesBrushImage: files.activesBrushFile?.[0] ? `/api/uploads/${files.activesBrushFile[0].filename}` : request.body.activesBrushImage || current.activesBrushImage,
    benefitsPatternImage: files.benefitsPatternFile?.[0] ? `/api/uploads/${files.benefitsPatternFile[0].filename}` : request.body.benefitsPatternImage || current.benefitsPatternImage,
    benefitsItems: (() => {
      try {
        const items = JSON.parse(request.body.benefitsItems || '[]');
        for (let i = 0; i < 8; i++) {
          const file = files[`benefitIconFile_${i}`]?.[0];
          if (file && items[i]) items[i].icon = `/api/uploads/${file.filename}`;
        }
        return JSON.stringify(items);
      } catch { return request.body.benefitsItems || '[]'; }
    })(),
    faqPatternImage: files.faqPatternFile?.[0] ? `/api/uploads/${files.faqPatternFile[0].filename}` : request.body.faqPatternImage || current.faqPatternImage,
    howToUseBackgroundImage: files.howToUseBackgroundFile?.[0] ? `/api/uploads/${files.howToUseBackgroundFile[0].filename}` : request.body.howToUseBackgroundImage || current.howToUseBackgroundImage,
    howToUseImages: (() => {
      try {
        const imgs = JSON.parse(request.body.howToUseImages || '[]');
        for (let i = 0; i < 4; i++) {
          const file = files[`howToUseImage${i + 1}File`]?.[0];
          if (file) imgs[i] = `/api/uploads/${file.filename}`;
        }
        return JSON.stringify(imgs);
      } catch { return request.body.howToUseImages || '[]'; }
    })(),
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
  { name: 'featureProductInfoMobileBackgroundFile', maxCount: 1 },
  { name: 'comparisonImage1File', maxCount: 1 },
  { name: 'comparisonImage2File', maxCount: 1 },
  { name: 'comparisonImage3File', maxCount: 1 },
  { name: 'comparisonImage4File', maxCount: 1 },
  { name: 'comparisonProductIconFile', maxCount: 1 },
  { name: 'comparisonCheckIconFile', maxCount: 1 },
  { name: 'comparisonXIconFile', maxCount: 1 },
  { name: 'presentationBackgroundFile', maxCount: 1 },
  { name: 'presentationMobileBackgroundFile', maxCount: 1 },
  { name: 'presentationProductFile', maxCount: 1 },
  { name: 'quantityOptionIconFile', maxCount: 1 },
  { name: 'activesProductFile', maxCount: 1 },
  { name: 'activesTextureFile', maxCount: 1 },
  { name: 'activesBrushFile', maxCount: 1 },
  { name: 'benefitsPatternFile', maxCount: 1 },
  { name: 'benefitIconFile_0', maxCount: 1 },
  { name: 'benefitIconFile_1', maxCount: 1 },
  { name: 'benefitIconFile_2', maxCount: 1 },
  { name: 'benefitIconFile_3', maxCount: 1 },
  { name: 'benefitIconFile_4', maxCount: 1 },
  { name: 'benefitIconFile_5', maxCount: 1 },
  { name: 'benefitIconFile_6', maxCount: 1 },
  { name: 'benefitIconFile_7', maxCount: 1 },
  { name: 'faqPatternFile', maxCount: 1 },
  { name: 'howToUseBackgroundFile', maxCount: 1 },
  { name: 'howToUseImage1File', maxCount: 1 },
  { name: 'howToUseImage2File', maxCount: 1 },
  { name: 'howToUseImage3File', maxCount: 1 },
  { name: 'howToUseImage4File', maxCount: 1 },
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

// ─── Yampi integration ────────────────────────────────────────────

/**
 * POST /api/yampi/lookup
 * Body: { cpf }
 * Searches Yampi customers by CPF, fetches their orders,
 * normalises fields and upserts local Order records.
 */
app.post('/api/yampi/lookup', async (request, response) => {
  try {
    const config = getYampiConfig();
    const { cpf } = request.body;

    if (!cpf) {
      return response.status(400).json({ error: 'Informe o CPF para busca.' });
    }

    // 1. Find customers matching the CPF
    const customers = await findCustomersByCpf(cpf, config);
    if (customers.length === 0) {
      return response.json({ orders: [], synced: 0 });
    }

    const syncedOrders = [];

    // 2. For each customer, fetch all orders
    for (const customer of customers) {
      const orders = await listOrdersByCustomer(customer.id, config);

      for (const order of orders) {
        // 3. Get order details (items + tracking)
        const details = await getOrderDetails(order.id || order.order_id, config);
        const items = details?.items || order?.items || [];
        const productName = items.map((item) => extractLocalizedString(item.name || item.product?.name)).filter(Boolean).join(', ');
        const tracking = details?.tracking || order?.tracking || {};

        const normalized = {
          customer_name: customer.name || '',
          customer_email: customer.email || '',
          customer_phone: customer.phone || '',
          customer_cpf: customer.document || '',
          shipping_address: details?.shipping_address || order?.shipping_address || {},
          product_name: productName,
          quantity: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
          total_price: Number(details?.total || order?.total || 0),
          yampi_order_id: String(order.id || order.order_id),
          yampi_checkout_url: details?.checkout_url || order?.checkout_url || '',
          status: mapYampiStatus(details?.status || order?.status),
          payment_method: details?.payment_method || order?.payment_method || '',
          tracking_code: tracking.code || tracking.tracking_code || '',
          tracking_url: tracking.url || tracking.tracking_url || '',
          estimated_delivery_date: details?.estimated_delivery_date || order?.estimated_delivery_date || '',
          shipped_at: details?.shipped_at || order?.shipped_at || '',
        };

        const upserted = await upsertOrder(normalized);
        syncedOrders.push(upserted);
      }
    }

    response.json({ orders: syncedOrders, synced: syncedOrders.length });
  } catch (error) {
    console.error('lookupYampiOrders error:', error.message);
    response.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/yampi/webhook
 * Public endpoint registered in the Yampi panel.
 * Receives events: order.paid, order.cancelled, order.shipped,
 * order.tracking_added, order.delivered.
 */
app.post('/api/yampi/webhook', async (request, response) => {
  try {
    const { event, data } = request.body;

    if (!event || !data) {
      return response.status(400).json({ error: 'Payload inválido. Esperado { event, data }.' });
    }

    const yampiOrderId = String(data.id || data.order_id || '');
    if (!yampiOrderId) {
      return response.status(400).json({ error: 'ID do pedido não encontrado no payload.' });
    }

    const localOrder = await findOrderByYampiId(yampiOrderId);
    if (!localOrder) {
      // Acknowledge webhook even if we don't have a local order yet
      return response.json({ success: true, message: 'Pedido local não encontrado. Webhook ignorado.' });
    }

    const now = new Date().toISOString();
    const updates = { tracking_history: localOrder.tracking_history || [] };

    switch (event) {
      case 'order.paid':
        updates.status = 'paid';
        updates.payment_method = data.payment_method || localOrder.payment_method;
        break;
      case 'order.cancelled':
        updates.status = 'cancelled';
        break;
      case 'order.shipped':
        updates.status = 'shipped';
        updates.shipped_at = data.shipped_at || now;
        if (data.tracking_code) updates.tracking_code = data.tracking_code;
        if (data.tracking_url) updates.tracking_url = data.tracking_url;
        if (data.estimated_delivery_date) updates.estimated_delivery_date = data.estimated_delivery_date;
        break;
      case 'order.tracking_added':
        if (data.tracking_code) updates.tracking_code = data.tracking_code;
        if (data.tracking_url) updates.tracking_url = data.tracking_url;
        if (data.estimated_delivery_date) updates.estimated_delivery_date = data.estimated_delivery_date;
        break;
      case 'order.delivered':
        updates.status = 'delivered';
        break;
      default:
        // Unknown event — acknowledge but don't modify
        return response.json({ success: true, message: `Evento ${event} não processado.` });
    }

    // Append to tracking history
    updates.tracking_history = [
      ...updates.tracking_history,
      {
        event,
        status: updates.status || localOrder.status,
        tracking_code: updates.tracking_code || localOrder.tracking_code || '',
        tracking_url: updates.tracking_url || localOrder.tracking_url || '',
        timestamp: now,
      },
    ];

    await upsertOrder({ ...updates, yampi_order_id: yampiOrderId });

    response.json({ success: true, event, yampi_order_id: yampiOrderId });
  } catch (error) {
    console.error('yampiWebhook error:', error.message);
    response.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/yampi/checkout
 * Body: { items: [{ sku, quantity, name }] }
 * Resolves each cart item's SKU in Yampi, creates a Payment Link (checkout)
 * and returns the link_url. Yampi handles customer data, payment and order
 * creation on their hosted checkout page — we just redirect the user there.
 */
app.post('/api/yampi/checkout', async (request, response) => {
  try {
    const config = getYampiConfig();
    const { items } = request.body;

    if (!Array.isArray(items) || items.length === 0) {
      return response.status(400).json({ error: 'Carrinho vazio. Adicione produtos antes de finalizar.' });
    }

    // 1. Resolve all SKUs to get their Yampi IDs
    const skus = [];
    for (const item of items) {
      const sku = await findSkuByCode(item.sku, config);
      if (!sku) {
        return response.status(404).json({ error: `SKU "${item.sku}" não encontrado na Yampi.` });
      }
      skus.push({
        id: sku.id || sku.sku_id,
        quantity: Math.max(1, Number(item.quantity || 1)),
      });
    }

    // 2. Create a payment link — Yampi handles the rest (customer, payment, order)
    const paymentLink = await createPaymentLink({
      name: `Checkout PINY ${Date.now()}`,
      active: true,
      skus,
    }, config);

    const checkoutUrl = paymentLink?.link_url || '';

    if (!checkoutUrl) {
      return response.status(500).json({ error: 'Yampi não retornou uma URL de checkout.' });
    }

    response.json({ success: true, checkout_url: checkoutUrl });
  } catch (error) {
    console.error('yampiCheckout error:', error.message);
    response.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/yampi/orders
 * Returns all local orders (for admin/debugging).
 */
app.get('/api/yampi/orders', async (_request, response) => {
  response.json(await readOrders());
});

/**
 * Maps Yampi order statuses to local Order statuses.
 */
function mapYampiStatus(yampiStatus) {
  const map = {
    waiting_payment: 'pending',
    pending: 'pending',
    paid: 'paid',
    approved: 'paid',
    cancelled: 'cancelled',
    canceled: 'cancelled',
    shipped: 'shipped',
    delivered: 'delivered',
  };
  return map[yampiStatus] || 'pending';
}

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) return response.status(400).json({ error: 'A imagem deve ter no máximo 8 MB.' });
  console.error(error);
  response.status(500).json({ error: 'Erro interno do catálogo.' });
});

app.listen(port, '0.0.0.0', () => console.log(`Catalog API listening on ${port}`));

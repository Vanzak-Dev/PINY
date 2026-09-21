import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const dataDirectory = process.env.DATA_DIR || path.resolve('data');
const catalogPath = path.join(dataDirectory, 'products.json');
const reviewsPath = path.join(dataDirectory, 'reviews.json');
const settingsPath = path.join(dataDirectory, 'site-settings.json');
const collectionsPath = path.join(dataDirectory, 'collections.json');
const seedPath = path.resolve('seeds/products.json');

const defaultSiteSettings = {
  announcementBar: {
    enabled: true,
    messages: [
      'Frete grátis acima de R$199',
      'Aproveite 10% OFF na sua primeira compra',
    ],
    backgroundColor: '#fff547',
    textColor: '#1c8c44',
    speed: 24,
  },
};

async function writeJson(filePath, value) {
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(value, null, 2));
  await rename(temporaryPath, filePath);
}

export async function ensureCatalog() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    await readFile(catalogPath, 'utf8');
  } catch {
    const seed = JSON.parse(await readFile(seedPath, 'utf8'));
    await writeJson(catalogPath, seed);
  }
}

export async function ensureSiteSettings() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    await readFile(settingsPath, 'utf8');
  } catch {
    await writeJson(settingsPath, defaultSiteSettings);
  }
}

export async function readSiteSettings() {
  await ensureSiteSettings();
  const stored = JSON.parse(await readFile(settingsPath, 'utf8'));
  return normalizeSiteSettings(stored, defaultSiteSettings);
}

export async function saveSiteSettings(settings) {
  const normalized = normalizeSiteSettings(settings, defaultSiteSettings);
  await writeJson(settingsPath, normalized);
  return normalized;
}

export function normalizeSiteSettings(input = {}, current = defaultSiteSettings) {
  const source = input.announcementBar || {};
  const previous = current.announcementBar || defaultSiteSettings.announcementBar;
  const enabled = source.enabled === true || source.enabled === 'true'
    ? true
    : source.enabled === false || source.enabled === 'false'
      ? false
      : previous.enabled;
  const messagesInput = Array.isArray(source.messages)
    ? source.messages
    : typeof source.messages === 'string'
      ? source.messages.split(/\r?\n/)
      : previous.messages;
  const messages = messagesInput.map((message) => String(message).trim()).filter(Boolean).slice(0, 12);
  const speedValue = Number(source.speed);

  return {
    announcementBar: {
      enabled,
      messages: messages.length ? messages : defaultSiteSettings.announcementBar.messages,
      backgroundColor: String(source.backgroundColor || previous.backgroundColor || '#fff547').trim(),
      textColor: String(source.textColor || previous.textColor || '#1c8c44').trim(),
      speed: Number.isFinite(speedValue) ? Math.min(120, Math.max(8, speedValue)) : previous.speed,
    },
  };
}

export async function readProducts() {
  await ensureCatalog();
  return JSON.parse(await readFile(catalogPath, 'utf8'));
}

export async function saveProducts(products) {
  await writeJson(catalogPath, products);
}

export async function ensureCollections() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    await readFile(collectionsPath, 'utf8');
  } catch {
    await writeJson(collectionsPath, []);
  }
}

export async function readCollections() {
  await ensureCollections();
  return JSON.parse(await readFile(collectionsPath, 'utf8'));
}

export async function saveCollections(collections) {
  await writeJson(collectionsPath, collections);
}

export function normalizeCollection(input, current = {}) {
  const now = new Date().toISOString();
  const boolean = (value, fallback = false) => value === true || value === 'true' ? true : value === false || value === 'false' ? false : fallback;
  const array = (value, fallback = []) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    id: current.id || randomUUID(),
    name: String(input.name || current.name || '').trim(),
    active: boolean(input.active, current.active ?? true),
    productIds: [...new Set(array(input.productIds, current.productIds ?? []).map(String).filter(Boolean))],
    createdAt: current.createdAt || now,
    updatedAt: now,
  };
}

export async function readReviews() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(reviewsPath, 'utf8'));
  } catch {
    await writeJson(reviewsPath, []);
    return [];
  }
}

export async function saveReviews(reviews) {
  await writeJson(reviewsPath, reviews);
}

export function normalizeReview(input, current = {}) {
  const now = new Date().toISOString();
  const active = input.active === true || input.active === 'true'
    ? true
    : input.active === false || input.active === 'false'
      ? false
      : current.active ?? true;

  return {
    id: current.id || randomUUID(),
    title: String(input.title ?? current.title ?? '').trim(),
    productId: String(input.productId ?? current.productId ?? '').trim(),
    media: String(input.media ?? current.media ?? '').trim(),
    mediaType: String(input.mediaType ?? current.mediaType ?? 'video') === 'image' ? 'image' : 'video',
    active,
    createdAt: current.createdAt || now,
    updatedAt: now,
  };
}

export function normalizeProduct(input, current = {}) {
  const now = new Date().toISOString();
  const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const boolean = (value, fallback = false) => value === true || value === 'true' ? true : value === false || value === 'false' ? false : fallback;
  const array = (value, fallback = []) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };
  const slug = String(input.slug || input.name || current.slug || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id: current.id || randomUUID(),
    name: String(input.name || current.name || '').trim(),
    slug,
    sku: String(input.sku ?? current.sku ?? '').trim(),
    status: input.status === 'draft' ? 'draft' : 'active',
    featured: boolean(input.featured, current.featured ?? false),
    category: String(input.category ?? current.category ?? '').trim(),
    shortDescription: String(input.shortDescription ?? current.shortDescription ?? '').trim(),
    description: String(input.description ?? current.description ?? '').trim(),
    reviewCount: String(input.reviewCount ?? current.reviewCount ?? '').trim(),
    badges: array(input.badges, current.badges ?? [])
      .map((badge) => ({
        label: String(badge?.label || '').trim(),
        tone: badge?.tone === 'solid' ? 'solid' : 'outline',
        color: String(badge?.color || '#1c8c44').trim(),
      }))
      .filter((badge) => badge.label),
    quantityOptions: array(input.quantityOptions, current.quantityOptions ?? [])
      .map((option) => ({
        quantity: Math.max(1, Math.round(number(option?.quantity, 1))),
        price: Math.max(0, number(option?.price, 0)),
        discountLabel: String(option?.discountLabel || '').trim(),
      }))
      .filter((option) => option.price > 0),
    crossSellIds: [...new Set(array(input.crossSellIds, current.crossSellIds ?? []).map(String).filter(Boolean))],
    price: number(input.price, current.price ?? 0),
    oldPrice: input.oldPrice === '' ? null : number(input.oldPrice, current.oldPrice ?? 0) || null,
    costPrice: input.costPrice === '' ? null : number(input.costPrice, current.costPrice ?? 0) || null,
    stock: number(input.stock, current.stock ?? 0),
    trackStock: boolean(input.trackStock, current.trackStock ?? true),
    tags: Array.isArray(input.tags) ? input.tags : String(input.tags ?? current.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
    image: String(input.image ?? current.image ?? '').trim(),
    backgroundImage: String(input.backgroundImage ?? current.backgroundImage ?? '').trim(),
    backgroundColor: String(input.backgroundColor ?? current.backgroundColor ?? '#b8efad').trim(),
    featureEnabled: boolean(input.featureEnabled, current.featureEnabled ?? false),
    featureLabel: String(input.featureLabel ?? current.featureLabel ?? '').trim(),
    featurePrice: input.featurePrice === '' ? null : number(input.featurePrice, current.featurePrice ?? 0) || null,
    featureBackgroundCenter: String(input.featureBackgroundCenter ?? current.featureBackgroundCenter ?? '#F3FD5A').trim(),
    featureBackgroundEdge: String(input.featureBackgroundEdge ?? current.featureBackgroundEdge ?? '#FFD72F').trim(),
    featureLeftImage: String(input.featureLeftImage ?? current.featureLeftImage ?? '').trim(),
    featureRightImage: String(input.featureRightImage ?? current.featureRightImage ?? '').trim(),
    featureProductImage: String(input.featureProductImage ?? current.featureProductImage ?? '').trim(),
    beforeAfterEnabled: boolean(input.beforeAfterEnabled, current.beforeAfterEnabled ?? false),
    beforeAfterTitle: String(input.beforeAfterTitle ?? current.beforeAfterTitle ?? '').trim(),
    beforeAfterTitleAccent: String(input.beforeAfterTitleAccent ?? current.beforeAfterTitleAccent ?? '').trim(),
    beforeAfterSubtitle: String(input.beforeAfterSubtitle ?? current.beforeAfterSubtitle ?? '').trim(),
    beforeAfterBeforeLabel: String(input.beforeAfterBeforeLabel ?? current.beforeAfterBeforeLabel ?? '').trim(),
    beforeAfterAfterLabel: String(input.beforeAfterAfterLabel ?? current.beforeAfterAfterLabel ?? '').trim(),
    beforeAfterItems: array(input.beforeAfterItems, current.beforeAfterItems ?? [])
      .map((item) => ({
        name: String(item?.name || '').trim(),
        usage: String(item?.usage || '').trim(),
        beforeImage: String(item?.beforeImage || '').trim(),
        afterImage: String(item?.afterImage || '').trim(),
      }))
      .filter((item) => item.name && item.beforeImage && item.afterImage),
    comparisonEnabled: boolean(input.comparisonEnabled, current.comparisonEnabled ?? true),
    comparisonTitle: String(input.comparisonTitle ?? current.comparisonTitle ?? '').trim(),
    comparisonSubtitle: String(input.comparisonSubtitle ?? current.comparisonSubtitle ?? '').trim(),
    comparisonPinyLabel: String(input.comparisonPinyLabel ?? current.comparisonPinyLabel ?? '').trim(),
    comparisonOtherLabel: String(input.comparisonOtherLabel ?? current.comparisonOtherLabel ?? '').trim(),
    comparisonImage1: String(input.comparisonImage1 ?? current.comparisonImage1 ?? '').trim(),
    comparisonImage2: String(input.comparisonImage2 ?? current.comparisonImage2 ?? '').trim(),
    comparisonImage3: String(input.comparisonImage3 ?? current.comparisonImage3 ?? '').trim(),
    comparisonImage4: String(input.comparisonImage4 ?? current.comparisonImage4 ?? '').trim(),
    comparisonProductIcon: String(input.comparisonProductIcon ?? current.comparisonProductIcon ?? '').trim(),
    comparisonRows: array(input.comparisonRows, current.comparisonRows ?? [])
      .map((row) => ({
        label: String(row?.label || '').trim(),
        piny: String(row?.piny ?? 'check').trim() || 'check',
        other: String(row?.other ?? 'x').trim() || 'x',
      }))
      .filter((row) => row.label),
    imageRestRotation: number(input.imageRestRotation, current.imageRestRotation ?? 0),
    imageActiveRotation: number(input.imageActiveRotation, current.imageActiveRotation ?? 15),
    weight: number(input.weight, current.weight ?? 0),
    dimensions: {
      length: number(input.length ?? input.dimensions?.length, current.dimensions?.length ?? 0),
      width: number(input.width ?? input.dimensions?.width, current.dimensions?.width ?? 0),
      height: number(input.height ?? input.dimensions?.height, current.dimensions?.height ?? 0),
    },
    seoTitle: String(input.seoTitle ?? current.seoTitle ?? '').trim(),
    seoDescription: String(input.seoDescription ?? current.seoDescription ?? '').trim(),
    createdAt: current.createdAt || now,
    updatedAt: now,
  };
}

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const dataDirectory = process.env.DATA_DIR || path.resolve('data');
const catalogPath = path.join(dataDirectory, 'products.json');
const reviewsPath = path.join(dataDirectory, 'reviews.json');
const productReviewsPath = path.join(dataDirectory, 'product-reviews.json');
const settingsPath = path.join(dataDirectory, 'site-settings.json');
const collectionsPath = path.join(dataDirectory, 'collections.json');
const seedPath = path.resolve('seeds/products.json');
const collectionsSeedPath = path.resolve('seeds/collections.json');

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
    const seed = JSON.parse(await readFile(collectionsSeedPath, 'utf8'));
    await writeJson(collectionsPath, seed);
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

export async function readProductReviews() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(productReviewsPath, 'utf8'));
  } catch {
    await writeJson(productReviewsPath, []);
    return [];
  }
}

export async function saveProductReviews(reviews) {
  await writeJson(productReviewsPath, reviews);
}

export function normalizeProductReview(input, current = {}) {
  const now = new Date().toISOString();
  const active = input.active === true || input.active === 'true'
    ? true
    : input.active === false || input.active === 'false'
      ? false
      : current.active ?? true;
  const stars = Math.min(5, Math.max(1, Math.round(Number(input.stars ?? current.stars ?? 5))));

  return {
    id: current.id || randomUUID(),
    productId: String(input.productId ?? current.productId ?? '').trim(),
    stars,
    userName: String(input.userName ?? current.userName ?? '').trim(),
    title: String(input.title ?? current.title ?? '').trim(),
    body: String(input.body ?? current.body ?? '').trim(),
    photo: String(input.photo ?? current.photo ?? '').trim(),
    active,
    createdAt: current.createdAt || now,
    updatedAt: now,
  };
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
        image: String(option?.image ?? '').trim(),
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
    presentationBackgroundImage: String(input.presentationBackgroundImage ?? current.presentationBackgroundImage ?? '').trim(),
    presentationMobileBackgroundImage: String(input.presentationMobileBackgroundImage ?? current.presentationMobileBackgroundImage ?? '').trim(),
    presentationProductImage: String(input.presentationProductImage ?? current.presentationProductImage ?? '').trim(),
    quantityOptionIcon: String(input.quantityOptionIcon ?? current.quantityOptionIcon ?? '').trim(),
    backgroundImage: String(input.backgroundImage ?? current.backgroundImage ?? '').trim(),
    backgroundColor: String(input.backgroundColor ?? current.backgroundColor ?? '#b8efad').trim(),
    badgeGradientColor1: String(input.badgeGradientColor1 ?? current.badgeGradientColor1 ?? '').trim(),
    badgeGradientColor2: String(input.badgeGradientColor2 ?? current.badgeGradientColor2 ?? '').trim(),
    badgeGradientAngle: String(input.badgeGradientAngle ?? current.badgeGradientAngle ?? '180').trim(),
    featureEnabled: boolean(input.featureEnabled, current.featureEnabled ?? false),
    featureLabel: String(input.featureLabel ?? current.featureLabel ?? '').trim(),
    featurePrice: input.featurePrice === '' ? null : number(input.featurePrice, current.featurePrice ?? 0) || null,
    featureBackgroundCenter: String(input.featureBackgroundCenter ?? current.featureBackgroundCenter ?? '#F3FD5A').trim(),
    featureBackgroundEdge: String(input.featureBackgroundEdge ?? current.featureBackgroundEdge ?? '#FFD72F').trim(),
    featureLeftImage: String(input.featureLeftImage ?? current.featureLeftImage ?? '').trim(),
    featureRightImage: String(input.featureRightImage ?? current.featureRightImage ?? '').trim(),
    featureProductImage: String(input.featureProductImage ?? current.featureProductImage ?? '').trim(),
    featureProductInfoMobileBackground: String(input.featureProductInfoMobileBackground ?? current.featureProductInfoMobileBackground ?? '').trim(),
    featureTextColor: String(input.featureTextColor ?? current.featureTextColor ?? '').trim(),
    featureVariant: String(input.featureVariant ?? current.featureVariant ?? '').trim(),
    featurePerks: array(input.featurePerks, current.featurePerks ?? [])
      .map((perk) => ({
        icon: String(perk?.icon || '').trim(),
        label: String(perk?.label || '').trim(),
      }))
      .filter((perk) => perk.label || perk.icon),
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
    comparisonHeaderLabelColor: String(input.comparisonHeaderLabelColor ?? current.comparisonHeaderLabelColor ?? '#1c8c44').trim(),
    comparisonHighlightColor: String(input.comparisonHighlightColor ?? current.comparisonHighlightColor ?? '#85e86f').trim(),
    comparisonTableColor: String(input.comparisonTableColor ?? current.comparisonTableColor ?? '#e8fce0').trim(),
    comparisonCellColor: String(input.comparisonCellColor ?? current.comparisonCellColor ?? '#1c8c44').trim(),
    comparisonCheckIcon: String(input.comparisonCheckIcon ?? current.comparisonCheckIcon ?? '').trim(),
    comparisonXIcon: String(input.comparisonXIcon ?? current.comparisonXIcon ?? '').trim(),
    comparisonDividerColor: String(input.comparisonDividerColor ?? current.comparisonDividerColor ?? '#1c8c44').trim(),
    comparisonRows: array(input.comparisonRows, current.comparisonRows ?? [])
      .map((row) => ({
        label: String(row?.label || '').trim(),
        piny: String(row?.piny ?? 'check').trim() || 'check',
        other: String(row?.other ?? 'x').trim() || 'x',
      }))
      .filter((row) => row.label),
    activesEnabled: boolean(input.activesEnabled, current.activesEnabled ?? true),
    activesProductImage: String(input.activesProductImage ?? current.activesProductImage ?? '').trim(),
    benefitsEnabled: boolean(input.benefitsEnabled, current.benefitsEnabled ?? true),
    benefitsPatternImage: String(input.benefitsPatternImage ?? current.benefitsPatternImage ?? '').trim(),
    benefitsBackgroundColor: String(input.benefitsBackgroundColor ?? current.benefitsBackgroundColor ?? '#fef8dd').trim(),
    aiAnalysisBackgroundColor: String(input.aiAnalysisBackgroundColor ?? current.aiAnalysisBackgroundColor ?? '#fef8dd').trim(),
    faqBackgroundColor: String(input.faqBackgroundColor ?? current.faqBackgroundColor ?? '#fef8dd').trim(),
    faqPatternImage: String(input.faqPatternImage ?? current.faqPatternImage ?? '').trim(),
    howToUseEnabled: boolean(input.howToUseEnabled, current.howToUseEnabled ?? true),
    howToUseBackgroundColor: String(input.howToUseBackgroundColor ?? current.howToUseBackgroundColor ?? '#fef8dd').trim(),
    howToUseBackgroundImage: String(input.howToUseBackgroundImage ?? current.howToUseBackgroundImage ?? '').trim(),
    howToUseImages: array(input.howToUseImages, current.howToUseImages ?? []).map((img) => String(img || '').trim()),
    howToUseSteps: array(input.howToUseSteps, current.howToUseSteps ?? [])
      .map((step) => ({ text: String(step?.text || '').trim() }))
      .filter((step) => step.text),
    benefitsItems: array(input.benefitsItems, current.benefitsItems ?? [])
      .map((item) => ({
        icon: String(item?.icon || '').trim(),
        label: String(item?.label || '').trim(),
      }))
      .filter((item) => item.label),
    activesTextureImage: String(input.activesTextureImage ?? current.activesTextureImage ?? '').trim(),
    activesBrushImage: String(input.activesBrushImage ?? current.activesBrushImage ?? '').trim(),
    activesCallouts: array(input.activesCallouts, current.activesCallouts ?? [])
      .map((callout) => ({
        title: String(callout?.title || '').trim(),
        lines: array(callout?.lines, []).map((line) => String(line || '').trim()).filter(Boolean),
      }))
      .filter((callout) => callout.title),
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

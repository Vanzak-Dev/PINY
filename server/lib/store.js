import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const dataDirectory = process.env.DATA_DIR || path.resolve('data');
const catalogPath = path.join(dataDirectory, 'products.json');
const reviewsPath = path.join(dataDirectory, 'reviews.json');
const seedPath = path.resolve('seeds/products.json');

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

export async function readProducts() {
  await ensureCatalog();
  return JSON.parse(await readFile(catalogPath, 'utf8'));
}

export async function saveProducts(products) {
  await writeJson(catalogPath, products);
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

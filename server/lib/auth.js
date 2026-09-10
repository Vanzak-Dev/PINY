import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDirectory = process.env.DATA_DIR || path.resolve('data');
const authPath = path.join(dataDirectory, 'auth.json');
const defaultUsername = 'admin';
const defaultPassword = 'Piny@PrimeiroAcesso2026!';

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(password, salt, 64).toString('hex') };
}

async function writeAuth(value) {
  const temporaryPath = `${authPath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(value, null, 2));
  await rename(temporaryPath, authPath);
}

export async function ensureAuth() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return JSON.parse(await readFile(authPath, 'utf8'));
  } catch {
    const auth = {
      username: defaultUsername,
      ...hashPassword(defaultPassword),
      mustChangePassword: true,
      sessionSecret: randomBytes(48).toString('hex'),
    };
    await writeAuth(auth);
    return auth;
  }
}

export async function verifyCredentials(username, password) {
  const auth = await ensureAuth();
  if (username !== auth.username) return null;
  const candidate = scryptSync(password, auth.salt, 64);
  const expected = Buffer.from(auth.hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected) ? auth : null;
}

function sign(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export async function createSession() {
  const auth = await ensureAuth();
  const payload = Buffer.from(JSON.stringify({ username: auth.username, expiresAt: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  return `${payload}.${sign(payload, auth.sessionSecret)}`;
}

export async function readSession(token) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  const auth = await ensureAuth();
  if (!payload || !signature || sign(payload, auth.sessionSecret) !== signature) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return session.expiresAt > Date.now() ? { ...session, mustChangePassword: auth.mustChangePassword } : null;
  } catch {
    return null;
  }
}

export async function changePassword(currentPassword, newPassword) {
  const auth = await verifyCredentials((await ensureAuth()).username, currentPassword);
  if (!auth) return false;
  if (newPassword.length < 10) throw new Error('A nova senha deve ter pelo menos 10 caracteres.');
  const next = { ...auth, ...hashPassword(newPassword), mustChangePassword: false, sessionSecret: randomBytes(48).toString('hex') };
  await writeAuth(next);
  return true;
}

export function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key]) => key));
}

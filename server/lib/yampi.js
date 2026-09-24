/**
 * Yampi API v2 integration helpers.
 * Docs: https://api.dooki.com.br/v2
 */

export const YAMPI_BASE = 'https://api.dooki.com.br/v2';

/**
 * Build the authentication headers required by every Yampi API call.
 * @param {string} token  - User-Token from the Yampi dashboard
 * @param {string} secret  - User-Secret-Key from the Yampi dashboard
 */
export function yampiHeaders(token, secret) {
  return {
    'Content-Type': 'application/json',
    'User-Token': token,
    'User-Secret-Key': secret,
  };
}

/**
 * Extract a plain string from a Yampi multi-language field.
 * Yampi often returns fields as { pt_BR: "...", en_US: "..." } or as a plain string.
 */
export function extractLocalizedString(field) {
  if (!field) return '';
  if (typeof field === 'string') return field.trim();
  if (typeof field === 'object') {
    return (field.pt_BR || field.pt || field.en_US || field.en || Object.values(field)[0] || '').trim();
  }
  return String(field).trim();
}

/**
 * Remove all non-digit characters from a CPF or phone number.
 */
export function cleanDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/**
 * Centralised fetch wrapper that injects auth headers and the alias prefix.
 * Every Yampi endpoint is prefixed with /{alias}/...
 */
async function yampiRequest(path, { method = 'GET', body, alias, token, secret } = {}) {
  const url = `${YAMPI_BASE}/${alias}${path}`;
  const response = await fetch(url, {
    method,
    headers: yampiHeaders(token, secret),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    const message = data?.message || data?.error || `Yampi API error ${response.status}`;
    throw new Error(message);
  }
  return data;
}

/**
 * Return the Yampi credentials from the environment.
 */
export function getYampiConfig() {
  const alias = process.env.YAMPI_ALIAS;
  const token = process.env.YAMPI_API_TOKEN;
  const secret = process.env.YAMPI_SECRET_KEY;
  if (!alias || !token || !secret) {
    throw new Error('Credenciais Yampi não configuradas. Defina YAMPI_ALIAS, YAMPI_API_TOKEN e YAMPI_SECRET_KEY.');
  }
  return { alias, token, secret };
}

/**
 * Search for a customer by email.
 * GET /customers?q=email
 */
export async function findCustomerByEmail(email, config) {
  const data = await yampiRequest(`/customers?q=${encodeURIComponent(email)}`, config);
  const customers = data?.data || data?.customers || [];
  return Array.isArray(customers) && customers.length > 0 ? customers[0] : null;
}

/**
 * Create a customer in Yampi.
 * POST /customers
 */
export async function createCustomer(customerData, config) {
  const payload = {
    name: customerData.name,
    email: customerData.email,
    phone: cleanDigits(customerData.phone),
    document: cleanDigits(customerData.cpf),
    type: 'individual',
  };
  const data = await yampiRequest('/customers', { method: 'POST', body: payload, ...config });
  return data?.data || data;
}

/**
 * Find or create a customer by email.
 */
export async function ensureCustomer(customerData, config) {
  const existing = await findCustomerByEmail(customerData.email, config);
  if (existing) return existing;
  return createCustomer(customerData, config);
}

/**
 * Search for a SKU by its code.
 * GET /catalog/skus?q=code
 */
export async function findSkuByCode(skuCode, config) {
  const data = await yampiRequest(`/catalog/skus?q=${encodeURIComponent(skuCode)}`, config);
  const skus = data?.data || data?.skus || [];
  return Array.isArray(skus) && skus.length > 0 ? skus[0] : null;
}

/**
 * Create an order in Yampi.
 * POST /orders
 */
export async function createOrder(orderPayload, config) {
  const data = await yampiRequest('/orders', { method: 'POST', body: orderPayload, ...config });
  return data?.data || data;
}

/**
 * List orders for a given customer.
 * GET /orders?customer_id=X
 */
export async function listOrdersByCustomer(customerId, config) {
  const data = await yampiRequest(`/orders?customer_id=${encodeURIComponent(customerId)}`, config);
  return data?.data || data?.orders || [];
}

/**
 * Get order details including items.
 * GET /orders/{id}
 */
export async function getOrderDetails(orderId, config) {
  const data = await yampiRequest(`/orders/${encodeURIComponent(orderId)}`, config);
  return data?.data || data;
}

/**
 * Search customers by CPF.
 * GET /customers?q={cpf}
 */
export async function findCustomersByCpf(cpf, config) {
  const cleanCpf = cleanDigits(cpf);
  const data = await yampiRequest(`/customers?q=${encodeURIComponent(cleanCpf)}`, config);
  const customers = data?.data || data?.customers || [];
  return Array.isArray(customers) ? customers.filter((c) => cleanDigits(c.document) === cleanCpf) : [];
}

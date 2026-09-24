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
    const detail = data?.message || data?.error || data?.errors?.[0]?.message || data?.raw || `Yampi API error ${response.status}`;
    const fullDetail = JSON.stringify(data).slice(0, 1000);
    console.error(`Yampi API ${response.status} for ${method} ${url}`, fullDetail);
    throw new Error(detail);
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
    active: true,
    type: 'f',
    name: customerData.name,
    email: customerData.email,
    cpf: cleanDigits(customerData.cpf || '11144477735'),
    cnpj: null,
    razao_social: null,
    homephone: cleanDigits(customerData.phone || '') || '11999999999',
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
  // The q parameter searches by SKU code, not by token.
  // Our products store Yampi tokens, so we paginate all SKUs and match by token.
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const data = await yampiRequest(`/catalog/skus?page=${page}`, config);
    const skus = data?.data || [];
    totalPages = data?.meta?.pagination?.total_pages || 1;
    const match = skus.find((s) => s.token === skuCode || s.sku === skuCode);
    if (match) return match;
    page++;
  }
  return null;
}

/**
 * Create a payment link (checkout) in Yampi.
 * POST /checkout/payment-link
 * Sends the cart SKUs to Yampi; Yampi handles customer, payment and order creation
 * on their hosted checkout page. Returns { id, link_url, name }.
 */
export async function createPaymentLink(payload, config) {
  const data = await yampiRequest('/checkout/payment-link', { method: 'POST', body: payload, ...config });
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

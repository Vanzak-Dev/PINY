import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const dataDirectory = process.env.DATA_DIR || path.resolve('data');
const ordersPath = path.join(dataDirectory, 'orders.json');

async function writeJson(filePath, value) {
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(value, null, 2));
  await rename(temporaryPath, filePath);
}

async function ensureOrdersFile() {
  await mkdir(dataDirectory, { recursive: true });
  try {
    await readFile(ordersPath, 'utf8');
  } catch {
    await writeJson(ordersPath, []);
  }
}

export async function readOrders() {
  await ensureOrdersFile();
  return JSON.parse(await readFile(ordersPath, 'utf8'));
}

export async function saveOrders(orders) {
  await writeJson(ordersPath, orders);
}

/**
 * Find a local order by its Yampi order id.
 */
export async function findOrderByYampiId(yampiOrderId) {
  const orders = await readOrders();
  return orders.find((order) => order.yampi_order_id === String(yampiOrderId)) || null;
}

/**
 * Upsert an order by yampi_order_id.
 * If an order with the same yampi_order_id exists, merge the provided fields;
 * otherwise create a new order record.
 */
export async function upsertOrder(partial) {
  const orders = await readOrders();
  const now = new Date().toISOString();
  const yampiId = String(partial.yampi_order_id || '');
  const index = orders.findIndex((order) => order.yampi_order_id === yampiId);

  if (index >= 0) {
    orders[index] = { ...orders[index], ...partial, updatedAt: now };
    await saveOrders(orders);
    return orders[index];
  }

  const newOrder = {
    id: randomUUID(),
    customer_name: partial.customer_name || '',
    customer_email: partial.customer_email || '',
    customer_phone: partial.customer_phone || '',
    customer_cpf: partial.customer_cpf || '',
    shipping_address: partial.shipping_address || {},
    product_name: partial.product_name || '',
    quantity: partial.quantity || 1,
    total_price: partial.total_price || 0,
    yampi_order_id: yampiId,
    yampi_checkout_url: partial.yampi_checkout_url || '',
    status: partial.status || 'pending',
    payment_method: partial.payment_method || '',
    tracking_code: partial.tracking_code || '',
    tracking_url: partial.tracking_url || '',
    estimated_delivery_date: partial.estimated_delivery_date || '',
    shipped_at: partial.shipped_at || '',
    tracking_history: partial.tracking_history || [],
    createdAt: now,
    updatedAt: now,
  };
  orders.push(newOrder);
  await saveOrders(orders);
  return newOrder;
}

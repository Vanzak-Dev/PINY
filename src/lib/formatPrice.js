const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatPrice(value) {
  return typeof value === 'number' ? currency.format(value) : value;
}

export function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const normalized = value.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:,|$))/g, '').replace(',', '.');
  return parseFloat(normalized) || 0;
}

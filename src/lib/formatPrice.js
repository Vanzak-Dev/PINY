const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatPrice(value) {
  return typeof value === 'number' ? currency.format(value) : value;
}

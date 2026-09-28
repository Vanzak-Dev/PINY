export function productsInCollection(products, collections, collectionName) {
  const collection = collections.find((item) => item.name === collectionName);
  if (!collection) return [];
  const ids = new Set(collection.productIds || []);
  return products.filter((product) => ids.has(product.id));
}

export function productsNotInCollection(products, collections, collectionName) {
  const collection = collections.find((item) => item.name === collectionName);
  const ids = new Set(collection?.productIds || []);
  return products.filter((product) => !ids.has(product.id));
}

export function isProductInCollection(product, collections, collectionName) {
  const collection = collections.find((item) => item.name === collectionName);
  if (!collection || !product) return false;
  return (collection.productIds || []).includes(product.id);
}

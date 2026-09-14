async function request(path, options = {}) {
  const response = await fetch(path, { credentials: 'include', ...options });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.error || 'Não foi possível concluir a operação.');
  return data;
}

export const catalogApi = {
  getSettings: () => request('/api/settings'),
  getAdminSettings: () => request('/api/admin/settings'),
  updateSettings: (settings) => request('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }),
  listProducts: ({ featuredOnly = false } = {}) => request(`/api/products${featuredOnly ? '?featured=true' : ''}`),
  listFeatured: () => request('/api/products?featured=true'),
  getProduct: (identifier) => request(`/api/products/${encodeURIComponent(identifier)}`),
  listAdmin: () => request('/api/admin/products'),
  listReviews: () => request('/api/reviews'),
  listReviewsAdmin: () => request('/api/admin/reviews'),
  session: () => request('/api/auth/session'),
  login: (credentials) => request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  changePassword: (passwords) => request('/api/auth/password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passwords) }),
  create: (formData) => request('/api/admin/products', { method: 'POST', body: formData }),
  duplicate: (id) => request(`/api/admin/products/${id}/duplicate`, { method: 'POST' }),
  update: (id, formData) => request(`/api/admin/products/${id}`, { method: 'PUT', body: formData }),
  remove: (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
  createReview: (formData) => request('/api/admin/reviews', { method: 'POST', body: formData }),
  updateReview: (id, formData) => request(`/api/admin/reviews/${id}`, { method: 'PUT', body: formData }),
  removeReview: (id) => request(`/api/admin/reviews/${id}`, { method: 'DELETE' }),
};

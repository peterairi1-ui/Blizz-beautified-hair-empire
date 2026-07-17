const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const PRODUCT_CACHE_KEY = 'bbhe-product-cache';

function getCachedProducts() {
  if (typeof window === 'undefined') return [];
  try {
    const cached = window.localStorage.getItem(PRODUCT_CACHE_KEY);
    const parsed = cached ? JSON.parse(cached) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setCachedProducts(products) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event('bbhe-products-updated'));
}

async function fetchJson(url, options = {}, authToken = '') {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data ?? payload;
}

export async function getProducts() {
  const cachedProducts = getCachedProducts();
  if (cachedProducts.length) {
    return cachedProducts;
  }

  const products = await fetchJson('/api/products');
  if (Array.isArray(products)) {
    setCachedProducts(products);
  }
  return products;
}

export function readCachedProducts() {
  return getCachedProducts();
}

export function writeCachedProducts(products) {
  setCachedProducts(products);
}

export async function getAllProducts(token) {
  return fetchJson('/api/products/all', { method: 'GET' }, token);
}

export async function getCategories() {
  return fetchJson('/api/categories');
}

export async function adminLogin(email, password) {
  return fetchJson('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminDashboard(token) {
  return fetchJson('/admin/dashboard', {
    method: 'GET',
  }, token);
}

export async function createProduct(payload, token) {
  return fetchJson('/api/products', {
    method: 'POST',
    body: payload,
  }, token);
}

export async function updateProduct(id, payload, token) {
  return fetchJson(`/api/products/${id}`, {
    method: 'PUT',
    body: payload,
  }, token);
}

export async function deleteProduct(id, token) {
  return fetchJson(`/api/products/${id}`, {
    method: 'DELETE',
  }, token);
}

export async function submitContact(payload) {
  return fetchJson('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
}

export async function subscribeNewsletter(email) {
  return fetchJson('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function customerLogin(email, password) {
  return fetchJson('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function customerRegister(name, email, password, phone, address) {
  return fetchJson('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone, address }) });
}

export async function customerForgotPassword(email) {
  return fetchJson('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function customerResetPassword(token, password) {
  return fetchJson(`/api/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) });
}

export async function getCustomerProfile(token) {
  return fetchJson('/api/auth/me', { method: 'GET' }, token);
}

export async function adminForgotPassword(email) {
  return fetchJson('/admin/forgot', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function adminResetPassword(token, password) {
  return fetchJson(`/admin/reset/${token}`, { method: 'POST', body: JSON.stringify({ password }) });
}

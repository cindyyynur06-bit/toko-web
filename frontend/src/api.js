// frontend/src/api.js
/**
 * api.js — semua pemanggilan HTTP ke backend.
 * Publik: api | Admin: adminApi | Pembeli: pembeliApi
 */
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function authHeaders() {
  const token = localStorage.getItem('toko_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...options.headers,
  };
  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch {
    throw new Error(
      'Backend tidak jalan. Buka terminal di folder backend, lalu jalankan: npm run dev (port 5000).'
    );
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || 'Permintaan gagal');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

// ============================================================
// UPLOAD GAMBAR
// ============================================================
async function uploadGambar(endpoint, fileOrFormData) {
  const fd = fileOrFormData instanceof FormData 
    ? fileOrFormData 
    : (() => {
        const data = new FormData();
        data.append('gambar', fileOrFormData);
        return data;
      })();

  const token = localStorage.getItem('toko_token');

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: fd,
    });
  } catch {
    throw new Error('Backend tidak jalan. Buka terminal di folder backend, lalu jalankan: npm run dev.');
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || 'Upload gagal');
    err.status = res.status;
    throw err;
  }
  return body;
}

/** API publik + login/register */
export const api = {
  getProduk: () => apiRequest('/api/users/produk'),
  getProdukById: (id) => apiRequest(`/api/users/produk/${id}`),
  getArtikel: () => apiRequest('/api/users/artikel'),
  getArtikelById: (id) => apiRequest(`/api/users/artikel/${id}`),
  login: (credential, passwd) =>
    apiRequest('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ credential, passwd }),
    }),
  register: (payload) =>
    apiRequest('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getPembeliMe: () => apiRequest('/api/users/me'),
  getAdminMe: () => apiRequest('/api/admin/me'),
};

/** API panel admin */
export const adminApi = {
  getStats: () => apiRequest('/api/admin/stats'),
  getMe: () => apiRequest('/api/admin/me'),
  putMe: (payload) =>
    apiRequest('/api/admin/me', { method: 'PUT', body: JSON.stringify(payload) }),
  
  // PEMBELI
  getPembeli: () => apiRequest('/api/admin/pembeli'),
  getPembeliById: (id) => apiRequest(`/api/admin/pembeli/${id}`),
  createPembeli: (payload) =>
    apiRequest('/api/admin/pembeli', { method: 'POST', body: JSON.stringify(payload) }),
  updatePembeli: (id, payload) =>
    apiRequest(`/api/admin/pembeli/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePembeli: (id) => apiRequest(`/api/admin/pembeli/${id}`, { method: 'DELETE' }),
  
  // USERS (untuk keperluan lain)
  getUsers: (role) => apiRequest(`/api/admin/users${role ? `?role=${role}` : ''}`),
  getUser: (id) => apiRequest(`/api/admin/users/${id}`),
  createUser: (payload) =>
    apiRequest('/api/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) =>
    apiRequest(`/api/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: (id) => apiRequest(`/api/admin/users/${id}`, { method: 'DELETE' }),
  
  // PRODUK
  getProduk: () => apiRequest('/api/admin/produk'),
  getProdukById: (id) => apiRequest(`/api/admin/produk/${id}`),
  createProduk: (payload) =>
    apiRequest('/api/admin/produk', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduk: (id, payload) =>
    apiRequest(`/api/admin/produk/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduk: (id) => apiRequest(`/api/admin/produk/${id}`, { method: 'DELETE' }),
  
  // PEMBELIAN
  getPembelian: () => apiRequest('/api/admin/pembelian'),
  getPembelianById: (id) => apiRequest(`/api/admin/pembelian/${id}`),
  updatePembelian: (id, payload) =>
    apiRequest(`/api/admin/pembelian/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePembelian: (id) => apiRequest(`/api/admin/pembelian/${id}`, { method: 'DELETE' }),
  
  // ARTIKEL
  getArtikel: () => apiRequest('/api/admin/artikel'),
  getArtikelById: (id) => apiRequest(`/api/admin/artikel/${id}`),
  createArtikel: (payload) =>
    apiRequest('/api/admin/artikel', { method: 'POST', body: JSON.stringify(payload) }),
  updateArtikel: (id, payload) =>
    apiRequest(`/api/admin/artikel/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteArtikel: (id) => apiRequest(`/api/admin/artikel/${id}`, { method: 'DELETE' }),
  
  // UPLOAD
  uploadGambar: (fileOrFormData) => uploadGambar('/api/admin/upload-gambar', fileOrFormData),
};

/** API area pembeli */
export const pembeliApi = {
  getDashboard: () => apiRequest('/api/users/dashboard'),
  getMe: () => apiRequest('/api/users/me'),
  putMe: (payload) =>
    apiRequest('/api/users/me', { method: 'PUT', body: JSON.stringify(payload) }),
  getProduk: () => apiRequest('/api/users/produk'),
  getProdukById: (id) => apiRequest(`/api/users/produk/${id}`),
  getPembelian: () => apiRequest('/api/users/pembelian'),
  getPembelianById: (id) => apiRequest(`/api/users/pembelian/${id}`),
  createPembelian: (payload) =>
    apiRequest('/api/users/pembelian', { method: 'POST', body: JSON.stringify(payload) }),
  uploadGambar: (fileOrFormData) => uploadGambar('/api/users/upload-gambar', fileOrFormData),
};
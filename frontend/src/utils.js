// frontend/src/utils.js
/**
 * utils.js — format tampilan, media, kategori, sesi, profil.
 */
import { KELAMIN } from './constants';

const TOKEN_KEY = 'toko_token';
const ROLE_KEY = 'toko_role';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const EMPTY_MEDIA = new Set(['', 'default.jpg', 'default-logo.png', 'null', 'undefined']);

export const PLACEHOLDER_IMAGE = '/Logo.png';
export const LABEL_SEMUA = 'Semua';

export function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}

export function formatTanggal(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function toDateInputValue(value) {
  if (value == null || value === '') return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value).trim();
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return '';
}

export function jamOperasional(jamBuka, jamTutup) {
  if (jamBuka == null || jamTutup == null) return '';
  return `${jamBuka}:00 – ${jamTutup}:00 WIB`;
}

export function hasMedia(path) {
  if (path == null) return false;
  const p = String(path).trim().toLowerCase();
  return p !== '' && !EMPTY_MEDIA.has(p);
}

// ✅ PERBAIKI FUNGSI INI
export function mediaUrl(path) {
  console.log('🖼️ mediaUrl input:', path);
  
  if (!path || path === "" || path === "default.jpg" || path === "default-logo.png") {
    console.log('🖼️ Path kosong/default, pakai placeholder');
    return PLACEHOLDER_IMAGE;
  }

  const p = String(path).trim();

  // Jika sudah URL lengkap
  if (p.startsWith("http://") || p.startsWith("https://")) {
    console.log('🖼️ Path URL lengkap:', p);
    return p;
  }

  // Jika path dimulai dengan /uploads
  if (p.startsWith("/uploads")) {
    const fullUrl = `${API_BASE}${p}`;
    console.log('🖼️ Path /uploads:', fullUrl);
    return fullUrl;
  }

  // Jika path dimulai dengan uploads/
  if (p.startsWith("uploads/")) {
    const fullUrl = `${API_BASE}/${p}`;
    console.log('🖼️ Path uploads/:', fullUrl);
    return fullUrl;
  }

  // Jika hanya nama file (images.jpeg, dll)
  if (!p.startsWith("/") && !p.startsWith("http")) {
    const fullUrl = `${API_BASE}/uploads/images/${p}`;
    console.log('🖼️ Path relatif (nama file):', fullUrl);
    return fullUrl;
  }

  console.log('🖼️ Path lainnya:', p);
  return p;
}

export function onImgError(e) {
  const el = e.currentTarget;
  if (el.dataset.ph === '1') return;
  el.dataset.ph = '1';
  console.log('❌ Gambar error, pakai logo');
  el.src = '/Logo.png';
}

export function kategoriDariProduk(produk = []) {
  const set = new Set();
  for (const p of produk) {
    if (p.kategori) set.add(p.kategori);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'id'));
}

export function produkPerKategori(produk = []) {
  const map = new Map();
  for (const p of produk) {
    if (p.kategori && !map.has(p.kategori)) map.set(p.kategori, p);
  }
  return [...map.entries()].map(([kategori, item]) => ({ kategori, produk: item }));
}

export function kategoriGridData(produk = [], limit = 3) {
  return produkPerKategori(produk)
    .slice(0, limit)
    .map(({ kategori, produk: item }) => ({
      kategori,
      produk: item,
      jumlah: produk.filter((p) => p.kategori === kategori).length,
    }));
}

export function belanjaUrl(idProduk) {
  return `/akun/belanja?produk=${idProduk}`;
}

export function taglineBeranda(info, kategoriList = []) {
  const tentang = String(info?.tentang || '').trim();
  if (tentang) return tentang;
  const nama = info?.nama_toko || 'Toko kami';
  if (kategoriList.length >= 2) {
    const cats = kategoriList.slice(0, 3).join(', ');
    const sisa = kategoriList.length > 3 ? ', dan produk lainnya' : '';
    return `${nama} menyediakan ${cats}${sisa} — pilihan lengkap, kualitas terbaik.`;
  }
  return `${nama} menyediakan berbagai produk segar dan berkualitas.`;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}
export function saveSession(token, role) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}
export function isLoggedIn() {
  return Boolean(getToken());
}
export function isAdmin() {
  return getRole() === 'admin';
}
export function isPembeli() {
  return getRole() === 'pembeli';
}

export function normalizeKelamin(value) {
  const s = String(value || '').trim();
  if (s === 'L') return 'Laki-laki';
  if (s === 'P') return 'Perempuan';
  if (KELAMIN.includes(s)) return s;
  return KELAMIN[0];
}

export function buildProfilePayload(form) {
  const { passwd_lama, passwd, passwd_confirm, ...profile } = form;
  const payload = { ...profile };
  const newPass = String(passwd || '').trim();
  if (!newPass) return payload;
  if (!String(passwd_lama || '').trim()) {
    throw new Error('Password lama wajib diisi untuk mengganti password.');
  }
  if (newPass.length < 6) throw new Error('Password baru minimal 6 karakter.');
  if (newPass !== String(passwd_confirm || '').trim()) {
    throw new Error('Konfirmasi password baru tidak cocok.');
  }
  payload.passwd = newPass;
  payload.passwd_lama = passwd_lama;
  return payload;
}

export const emptyPasswordFields = {
  passwd_lama: '',
  passwd: '',
  passwd_confirm: '',
};
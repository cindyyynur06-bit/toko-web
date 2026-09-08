// frontend/src/constants.js

export const SITE = {
  logo_toko: '/logo.png',
  nama_toko: 'Cindy Rajut',
  tentang: 'Toko rajut yang menyediakan berbagai produk rajutan berkualitas tinggi, mulai dari baju rajut, tas rajut, mainan rajut, hingga aksesoris rajut. Semua produk dibuat dengan tangan terampil dan bahan berkualitas.',
  foto_banner: '/si.jpg',
  alamat_toko: 'Jl. Rajut No. 123, Kelurahan Kreatif, Kecamatan Rajutan, Kota Bandung, Jawa Barat 40123',
  email_toko: 'info@cindyrajut.com',
  tlp_toko: '+6281234567890',
  nama_bank_a: 'BCA',
  nama_bank_b: 'Mandiri',
  no_rek_a: 1234567890,
  no_rek_b: 9876543210,
  jam_buka: 8,
  jam_tutup: 20,
  logo_wa: '',
  logo_ig: '',
  logo_fb: '',
  link_wa: 'https://wa.me/6281234567890',
  link_ig: 'https://www.instagram.com/cindyrajut',
  link_fb: 'https://www.facebook.com/cindyrajut',
};

export const PUBLIC_NAV = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/toko', label: 'Toko' },
  { to: '/artikel', label: 'Artikel' },
];

export const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Produk', path: '/admin/produk' },
  { label: 'Pembeli', path: '/admin/pembeli' },
  { label: 'Pesanan', path: '/admin/pembelian' },
  { label: 'Artikel', path: '/admin/artikel' },
  { label: 'Profil', path: '/admin/profil' },
];

export const KELAMIN = ['Laki-laki', 'Perempuan'];

export const KATEGORI_PRODUK = [
  'Baju Rajut',
  'Tas Rajut',
  'Mainan Rajut',
  'Aksesoris Rajut'
];

export const KATEGORI_DETAIL = [
  {
    id: 1,
    nama: 'Baju Rajut',
    deskripsi: 'Baju rajut berkualitas tinggi dengan berbagai model dan ukuran. Nyaman dipakai, hangat, dan stylish untuk segala kesempatan.',
    gambar: '/baju.jpg',
  },
  {
    id: 2,
    nama: 'Tas Rajut',
    deskripsi: 'Tas rajut cantik dan unik dengan berbagai warna dan motif. Cocok untuk gaya sehari-hari maupun acara spesial.',
    gambar: '/tas.jpg',
  },
  {
    id: 3,
    nama: 'Mainan Rajut',
    deskripsi: 'Mainan rajut lucu dan aman untuk anak-anak. Tersedia berbagai karakter hewan dan boneka yang menggemaskan.',
    gambar: '/mainan.jpg', 
  },
  {
    id: 4,
    nama: 'Aksesoris Rajut',
    deskripsi: 'Aksesoris rajut seperti syal, topi, sarung tangan, dan selendang dengan motif menarik. Hangat dan fashionable.',
    gambar: '/aksesoris.jpg',
  },
];

export const METODE_BAYAR = ['Bank Transfer', 'COD'];
export const SHIPPING = ['JNT Express', 'JNE'];
export const STATUS_PROSES = ['Tertunda', 'Dikemas', 'Dikirim', 'Diterima', 'Selesai'];
export const STATUS_BAYAR = ['Belum', 'Dibayar'];

export const STATUS_PROSES_COLOR = {
  Tertunda: 'warning',
  Dikemas: 'info',
  Dikirim: 'primary',
  Diterima: 'success',
  Selesai: 'secondary',
};

export const STATUS_BAYAR_COLOR = {
  Belum: 'danger',
  Dibayar: 'success',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DEFAULT_IMAGE = '/images/default-product.jpg';
export const DEFAULT_AVATAR = '/images/default-avatar.png';

export default {
  SITE,
  PUBLIC_NAV,
  ADMIN_NAV,
  KELAMIN,
  KATEGORI_PRODUK,
  KATEGORI_DETAIL,
  METODE_BAYAR,
  SHIPPING,
  STATUS_PROSES,
  STATUS_BAYAR,
  STATUS_PROSES_COLOR,
  STATUS_BAYAR_COLOR,
  API_BASE_URL,
  DEFAULT_IMAGE,
  DEFAULT_AVATAR,
};
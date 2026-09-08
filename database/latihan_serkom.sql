-- =============================================
-- DATABASE: latihan_serkom
-- SKEMA LENGKAP UNTUK TOKO RAJUT
-- UJI SERKOM JUNIOR WEB DEVELOPER
-- =============================================

-- Hapus database jika ada (opsional, hati-hati!)
-- DROP DATABASE IF EXISTS latihan_serkom;

-- Buat database
CREATE DATABASE IF NOT EXISTS latihan_serkom;
USE latihan_serkom;

-- =============================================
-- 1. TABEL users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_d VARCHAR(50) NOT NULL,
  nama_b VARCHAR(50) NOT NULL,
  kelamin TEXT NOT NULL,
  lahir TEXT NOT NULL,
  alamat TEXT NOT NULL,
  phone BIGINT NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE,
  role ENUM('admin', 'pembeli') NOT NULL DEFAULT 'pembeli',
  uname VARCHAR(30) NOT NULL UNIQUE,
  passwd VARCHAR(256) NOT NULL,
  foto VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 2. TABEL produk
-- =============================================
CREATE TABLE IF NOT EXISTS produk (
  id_produk INT AUTO_INCREMENT PRIMARY KEY,
  nama_produk VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  harga INT NOT NULL,
  gambar VARCHAR(500) NULL,
  kategori ENUM('Baju Rajut', 'Tas Rajut', 'Mainan Rajut', 'Aksesoris Rajut') NOT NULL DEFAULT 'Baju Rajut',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 3. TABEL artikel
-- =============================================
CREATE TABLE IF NOT EXISTS artikel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(225) NOT NULL,
  ringkasan TEXT NOT NULL,
  isi TEXT NOT NULL,
  gambar VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 4. TABEL pembelian (dengan Foreign Key)
-- =============================================
CREATE TABLE IF NOT EXISTS pembelian (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pembeli INT NOT NULL,
  id_produk INT NOT NULL,
  nama_pembeli VARCHAR(50) NULL,
  alamat_pembeli TEXT NULL,
  phone_pembeli BIGINT NULL,
  metode_pembayaran ENUM('Bank Transfer', 'COD') NOT NULL DEFAULT 'COD',
  pembayaran ENUM('Belum', 'Dibayar') NOT NULL DEFAULT 'Belum',
  pengiriman ENUM('JNT Express', 'JNE') NOT NULL DEFAULT 'JNT Express',
  status ENUM('Tertunda', 'Dikemas', 'Dikirim', 'Diterima', 'Selesai') NOT NULL DEFAULT 'Tertunda',
  catatan TEXT NULL,
  foto_bukti VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
  -- Foreign Keys
  CONSTRAINT fk_pembelian_user
    FOREIGN KEY (id_pembeli) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
 
  CONSTRAINT fk_pembelian_produk
    FOREIGN KEY (id_produk) REFERENCES produk(id_produk)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
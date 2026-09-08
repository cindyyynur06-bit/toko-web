// backend/models/produkModel.js
const db = require("../config/db");

/**
 * Ambil semua produk
 */
const findAllProduk = async (limit = 100, offset = 0) => {
    const [rows] = await db.query(
        `SELECT id_produk, nama_produk, deskripsi, harga, gambar, kategori, created_at, updated_at 
        FROM produk 
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
};

/**
 * Cari produk berdasarkan ID
 */
const findProdukById = async (id) => {
    const [rows] = await db.query(
        `SELECT id_produk, nama_produk, deskripsi, harga, gambar, kategori, created_at, updated_at 
        FROM produk 
        WHERE id_produk = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Tambah produk baru
 */
const insertProduk = async (produkData) => {
    const { nama_produk, deskripsi, harga, gambar, kategori } = produkData;
    const [result] = await db.query(
        `INSERT INTO produk (nama_produk, deskripsi, harga, gambar, kategori) 
        VALUES (?, ?, ?, ?, ?)`,
        [nama_produk, deskripsi, harga, gambar || null, kategori]
    );
    return result;
};

/**
 * Update produk
 */
const updateProduk = async (id, produkData) => {
    const { nama_produk, deskripsi, harga, gambar, kategori } = produkData;
    const [result] = await db.query(
        `UPDATE produk 
        SET 
            nama_produk = ?, 
            deskripsi = ?, 
            harga = ?, 
            gambar = ?, 
            kategori = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_produk = ?`,
        [nama_produk, deskripsi, harga, gambar || null, kategori, id]
    );
    return result;
};

/**
 * Hapus produk berdasarkan ID
 */
const deleteProduk = async (id) => {
    const [result] = await db.query(
        `DELETE FROM produk WHERE id_produk = ?`,
        [id]
    );
    return result;
};

// ========================================
// TAMBAHKAN INI!
// ========================================
/**
 * Hitung total produk
 * @returns {Promise<number>} - Total produk
 */
const countProduk = async () => {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM produk`);
    return rows[0].total;
};

module.exports = {
    findAllProduk,
    findProdukById,
    insertProduk,
    updateProduk,
    deleteProduk,
    countProduk,
};
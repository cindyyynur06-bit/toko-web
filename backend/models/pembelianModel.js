// backend/models/pembelianModel.js
const db = require("../config/db");

/**
 * Ambil semua pembelian dengan detail (admin)
 * @param {number} limit - Batas jumlah data
 * @param {number} offset - Offset untuk pagination
 * @returns {Promise<Array>} - Array pembelian dengan detail
 */
const findAllPembelianWithDetail = async (limit = 100, offset = 0) => {
    const [rows] = await db.query(
        `SELECT 
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,
            u.nama_d AS user_nama_d,
            u.nama_b AS user_nama_b,
            u.email AS user_email,
            pr.nama_produk,
            pr.harga,
            pr.gambar AS produk_gambar
        FROM pembelian p
        LEFT JOIN users u ON p.id_pembeli = u.id
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
};

/**
 * Cari pembelian berdasarkan ID (admin)
 * @param {number} id - ID pembelian
 * @returns {Promise<Object|null>} - Data pembelian atau null
 */
const findPembelianById = async (id) => {
    const [rows] = await db.query(
        `SELECT 
            p.id,
            p.id_pembeli,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,
            u.nama_d AS user_nama_d,
            u.nama_b AS user_nama_b,
            u.email AS user_email,
            pr.nama_produk,
            pr.harga,
            pr.gambar AS produk_gambar
        FROM pembelian p
        LEFT JOIN users u ON p.id_pembeli = u.id
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
        WHERE p.id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update pembelian (admin)
 * @param {number} id - ID pembelian
 * @param {Object} data - Data yang diupdate
 * @returns {Promise<Object>} - Hasil update
 */
const updatePembelian = async (id, data) => {
    const { 
        metode_pembayaran, 
        pembayaran, 
        pengiriman, 
        status, 
        catatan,
        foto_bukti 
    } = data;
    const [result] = await db.query(
        `UPDATE pembelian 
        SET 
            metode_pembayaran = COALESCE(?, metode_pembayaran),
            pembayaran = COALESCE(?, pembayaran),
            pengiriman = COALESCE(?, pengiriman),
            status = COALESCE(?, status),
            catatan = COALESCE(?, catatan),
            foto_bukti = COALESCE(?, foto_bukti),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti, id]
    );
    return result;
};

/**
 * Hapus pembelian (admin)
 * @param {number} id - ID pembelian
 * @returns {Promise<Object>} - Hasil delete
 */
const deletePembelian = async (id) => {
    const [result] = await db.query(
        `DELETE FROM pembelian WHERE id = ?`,
        [id]
    );
    return result;
};

/**
 * Tambah pembelian baru (pembeli)
 * @param {Object} data - Data pembelian
 * @returns {Promise<Object>} - Hasil insert
 */
const insertPembelian = async (data) => {
    const { 
        id_pembeli, 
        id_produk, 
        nama_pembeli, 
        alamat_pembeli, 
        phone_pembeli, 
        metode_pembayaran,
        catatan,
        foto_bukti
    } = data;
    const [result] = await db.query(
        `INSERT INTO pembelian (
            id_pembeli, 
            id_produk, 
            nama_pembeli, 
            alamat_pembeli, 
            phone_pembeli, 
            metode_pembayaran,
            catatan,
            foto_bukti
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_pembeli, 
            id_produk, 
            nama_pembeli || null, 
            alamat_pembeli || null, 
            phone_pembeli || null, 
            metode_pembayaran || 'COD',
            catatan || null,
            foto_bukti || null
        ]
    );
    return result;
};

/**
 * Ambil pembelian berdasarkan ID pembeli dengan detail
 * @param {number} id_pembeli - ID pembeli
 * @param {number} limit - Batas jumlah data
 * @param {number} offset - Offset untuk pagination
 * @returns {Promise<Array>} - Array pembelian
 */
const findPembelianByPembeliIdWithDetail = async (id_pembeli, limit = 100, offset = 0) => {
    const [rows] = await db.query(
        `SELECT 
            p.id,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,
            pr.nama_produk,
            pr.harga,
            pr.gambar AS produk_gambar
        FROM pembelian p
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
        WHERE p.id_pembeli = ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?`,
        [id_pembeli, limit, offset]
    );
    return rows;
};

/**
 * Cari pembelian berdasarkan ID dan ID pembeli (pembeli)
 * @param {number} id - ID pembelian
 * @param {number} id_pembeli - ID pembeli
 * @returns {Promise<Object|null>} - Data pembelian atau null
 */
const findPembelianByIdAndPembeliId = async (id, id_pembeli) => {
    const [rows] = await db.query(
        `SELECT 
            p.id,
            p.id_produk,
            p.nama_pembeli,
            p.alamat_pembeli,
            p.phone_pembeli,
            p.metode_pembayaran,
            p.pembayaran,
            p.pengiriman,
            p.status,
            p.catatan,
            p.foto_bukti,
            p.created_at,
            p.updated_at,
            pr.nama_produk,
            pr.harga,
            pr.gambar AS produk_gambar
        FROM pembelian p
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
        WHERE p.id = ? AND p.id_pembeli = ?`,
        [id, id_pembeli]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Statistik pembelian per pembeli
 * @param {number} id_pembeli - ID pembeli
 * @returns {Promise<Object>} - Statistik
 */
const getStatsByPembeliId = async (id_pembeli) => {
    const [rows] = await db.query(
        `SELECT 
            COUNT(*) AS total_pembelian,
            SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) AS tertunda,
            SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) AS dikemas,
            SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) AS dikirim,
            SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) AS diterima,
            SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS selesai,
            SUM(CASE WHEN status = 'Dibatalkan' THEN 1 ELSE 0 END) AS dibatalkan,
            SUM(CASE WHEN pembayaran = 'Belum' THEN 1 ELSE 0 END) AS belum_dibayar,
            SUM(CASE WHEN pembayaran = 'Dibayar' THEN 1 ELSE 0 END) AS sudah_dibayar
        FROM pembelian
        WHERE id_pembeli = ?`,
        [id_pembeli]
    );
    return rows[0];
};

/**
 * Statistik admin (semua pembelian)
 * @returns {Promise<Object>} - Statistik
 */
const getAdminStats = async () => {
    const [rows] = await db.query(
        `SELECT 
            COUNT(*) AS total_pembelian,
            SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) AS tertunda,
            SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) AS dikemas,
            SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) AS dikirim,
            SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) AS diterima,
            SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS selesai,
            SUM(CASE WHEN status = 'Dibatalkan' THEN 1 ELSE 0 END) AS dibatalkan,
            SUM(CASE WHEN pembayaran = 'Belum' THEN 1 ELSE 0 END) AS belum_dibayar,
            SUM(CASE WHEN pembayaran = 'Dibayar' THEN 1 ELSE 0 END) AS sudah_dibayar,
            SUM(CASE WHEN metode_pembayaran = 'COD' THEN 1 ELSE 0 END) AS cod,
            SUM(CASE WHEN metode_pembayaran = 'Bank Transfer' THEN 1 ELSE 0 END) AS bank_transfer
        FROM pembelian`
    );
    return rows[0];
};

/**
 * Ambil pembelian terbaru
 * @param {number} limit - Jumlah data
 * @returns {Promise<Array>} - Array pembelian terbaru
 */
const getRecentPembelian = async (limit = 5) => {
    const [rows] = await db.query(
        `SELECT 
            p.id,
            p.nama_pembeli,
            p.status,
            p.pembayaran,
            p.created_at,
            pr.nama_produk,
            pr.harga
        FROM pembelian p
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
        ORDER BY p.created_at DESC
        LIMIT ?`,
        [limit]
    );
    return rows;
};

/**
 * Hitung total pendapatan (total harga produk yang sudah dibayar)
 * @returns {Promise<number>} - Total pendapatan
 */
const getTotalPendapatan = async () => {
    const [rows] = await db.query(
        `SELECT SUM(pr.harga) AS total 
        FROM pembelian p
        LEFT JOIN produk pr ON p.id_produk = pr.id_produk
        WHERE p.pembayaran = 'Dibayar'`
    );
    return rows[0]?.total || 0;
};

/**
 * Hitung total produk terjual (jumlah transaksi berstatus Selesai/Diterima/Dibayar)
 * @returns {Promise<number>} - Total produk terjual
 */
const getTotalProdukTerjual = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total_terjual 
        FROM pembelian 
        WHERE status IN ('Selesai', 'Diterima') OR pembayaran = 'Dibayar'`
    );
    return rows[0]?.total_terjual || 0;
};

module.exports = {
    findAllPembelianWithDetail,
    findPembelianById,
    updatePembelian,
    deletePembelian,
    insertPembelian,
    findPembelianByPembeliIdWithDetail,
    findPembelianByIdAndPembeliId,
    getStatsByPembeliId,
    getAdminStats,
    getRecentPembelian,
    getTotalPendapatan,
    getTotalProdukTerjual, 
};
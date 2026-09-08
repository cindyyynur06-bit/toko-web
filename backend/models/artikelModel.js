// backend/models/artikelModel.js
const db = require("../config/db");

const findAllArtikel = async (limit = 100, offset = 0) => {
    const [rows] = await db.query(
        `SELECT id, judul, ringkasan, isi, gambar, created_at, updated_at 
        FROM artikel 
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
};

const findArtikelById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, judul, ringkasan, isi, gambar, created_at, updated_at 
        FROM artikel 
        WHERE id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

const insertArtikel = async (artikelData) => {
    const { judul, ringkasan, isi, gambar } = artikelData;
    const [result] = await db.query(
        `INSERT INTO artikel (judul, ringkasan, isi, gambar) 
        VALUES (?, ?, ?, ?)`,
        [judul, ringkasan, isi, gambar]
    );
    return result;
};

const updateArtikel = async (id, artikelData) => {
    const { judul, ringkasan, isi, gambar } = artikelData;
    const [result] = await db.query(
        `UPDATE artikel 
        SET judul = ?, ringkasan = ?, isi = ?, gambar = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [judul, ringkasan, isi, gambar, id]
    );
    return result;
};

const deleteArtikel = async (id) => {
    const [result] = await db.query(`DELETE FROM artikel WHERE id = ?`, [id]);
    return result;
};

const countArtikel = async () => {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM artikel`);
    return rows[0].total;
};

module.exports = {
    findAllArtikel,
    findArtikelById,
    insertArtikel,
    updateArtikel,
    deleteArtikel,
    countArtikel,
};
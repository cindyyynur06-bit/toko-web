// backend/models/usersModel.js
const db = require("../config/db");

const createUser = async (userData) => {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto } = userData;
    const [result] = await db.query(
        `INSERT INTO users 
        (nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nama_d, nama_b, kelamin, lahir, alamat, phone, email, role || 'pembeli', uname, passwd, foto || '']
    );
    return result;
};

const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    return rows.length > 0 ? rows[0] : null;
};

const findUserByCredential = async (credential) => {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ? OR uname = ?`,
        [credential, credential]
    );
    return rows.length > 0 ? rows[0] : null;
};

const findUserById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at 
        FROM users 
        WHERE id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

const findPasswdHashById = async (id) => {
    const [rows] = await db.query(`SELECT passwd FROM users WHERE id = ?`, [id]);
    return rows.length > 0 ? rows[0].passwd : null;
};

const updateUserProfile = async (id, userData) => {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, foto } = userData;
    const [result] = await db.query(
        `UPDATE users 
        SET nama_d = ?, nama_b = ?, kelamin = ?, lahir = ?, alamat = ?, 
            phone = ?, email = ?, uname = ?, foto = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, foto, id]
    );
    return result;
};

const deleteUser = async (id) => {
    const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    return result;
};

const isEmailExists = async (email, excludeId = null) => {
    let query = `SELECT id FROM users WHERE email = ?`;
    const params = [email];
    if (excludeId) {
        query += ` AND id != ?`;
        params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows.length > 0;
};

const isUnameExists = async (uname, excludeId = null) => {
    let query = `SELECT id FROM users WHERE uname = ?`;
    const params = [uname];
    if (excludeId) {
        query += ` AND id != ?`;
        params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows.length > 0;
};

const findAllUsers = async (limit = 100, offset = 0) => {
    const [rows] = await db.query(
        `SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at 
        FROM users 
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
};

const countPembeli = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total FROM users WHERE role = 'pembeli'`
    );
    return rows[0].total;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByCredential,
    findUserById,
    findPasswdHashById,
    updateUserProfile,
    deleteUser,
    isEmailExists,
    isUnameExists,
    findAllUsers,
    countPembeli,
};
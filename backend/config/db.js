// backend/config/db.js
require('dotenv').config();
const mysql = require('mysql2');

// =============================================================================
// MEMBUAT CONNECTION POOL
// =============================================================================

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// =============================================================================
// UJI KONEKSI (getConnection)
// =============================================================================

pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        console.error('Please check your .env configuration');
        process.exit(1);
    } else {
        console.log('MySQL connected successfully!');
        connection.release();
    }
});

// =============================================================================
// EXPORT POOL (Bisa dipakai dengan callback atau promise)
// =============================================================================

// Untuk callback style
// module.exports = pool;

// Untuk promise/async-await style (lebih modern)
const db = pool.promise();
module.exports = db;7
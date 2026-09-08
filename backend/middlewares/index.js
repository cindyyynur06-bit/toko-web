// backend/middlewares/index.js
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =============================================================================
// AUTENTIKASI & OTORISASI
// =============================================================================

/**
 * Middleware autentikasi JWT
 * Memverifikasi token Bearer dari header Authorization
 * Menambahkan req.user jika valid
 */
const authenticate = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cari user berdasarkan ID dari token
    const user = await usersModel.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Simpan data user ke req.user
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      uname: user.uname,
      nama_d: user.nama_d,
      nama_b: user.nama_b,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Middleware otorisasi role
 * Memastikan user memiliki role yang diizinkan
 * @param {...string} roles - Role yang diizinkan
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    // Cek apakah user sudah terautentikasi
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Please authenticate first" });
    }

    // Cek apakah role user diizinkan
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden: Insufficient permissions",
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
};

// =============================================================================
// UPLOAD GAMBAR (MULTER)
// =============================================================================

// Buat folder uploads/images jika belum ada
const uploadDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Buat nama file unik: timestamp + original name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan (jpeg, jpg, png, gif, webp)"));
  }
};

// Middleware upload gambar
const uploadGambar = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
}).single("gambar");

/**
 * Middleware upload gambar dengan multer
 * Field: "gambar"
 * Folder: uploads/images
 * Max: 5MB
 */
const middlewareUploadGambar = (req, res, next) => {
  uploadGambar(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: "Ukuran file terlalu besar. Maksimal 5MB",
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
      return res.status(400).json({
        success: false,
       error: err.message,
      });
    }
    next();
  });
};

/**
 * Helper untuk mengirim response upload sukses
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const sendHasilUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "Tidak ada file yang diupload",
    });
  }

  const filePath = `/uploads/images/${req.file.filename}`;
  res.json({
    success: true,
    message: "File berhasil diupload",
    data: {
      filename: req.file.filename,
      path: filePath,
      url: `${req.protocol}://${req.get("host")}${filePath}`,
    },
  });
};

module.exports = {
  authenticate,
  requireRole,
  middlewareUploadGambar,
  sendHasilUpload,
};
const express = require("express");
const router = express.Router();
const { authenticate, requireRole, middlewareUploadGambar, sendHasilUpload } = require("../middlewares");
const usersController = require("../controllers/usersController");
const adminController = require("../controllers/adminController");

// Semua route admin wajib authenticate + role admin
router.use(authenticate);
router.use(requireRole("admin"));

// ==================== PROFIL ADMIN ====================
router.get("/me", usersController.getMyProfile);
router.put("/me", usersController.updateMyProfile);

// ==================== STATISTIK ====================
router.get("/stats", adminController.getStats);

// ==================== MANAJEMEN PEMBELI ====================
router.get("/pembeli", adminController.listPembeli);
router.post("/pembeli", adminController.createPembeli);
router.get("/pembeli/:id", adminController.getPembeliById);
router.put("/pembeli/:id", adminController.updatePembeli);
router.delete("/pembeli/:id", adminController.deletePembeli);

// ==================== MANAJEMEN PRODUK ====================
router.get("/produk", adminController.listProduk);
router.get("/produk/:id", adminController.getProdukById);
router.post("/produk", adminController.createProduk);
router.put("/produk/:id", adminController.updateProduk);
router.delete("/produk/:id", adminController.deleteProduk);

// ==================== MANAJEMEN PEMBELIAN ====================
router.get("/pembelian", adminController.listPembelian);
router.get("/pembelian/:id", adminController.getPembelianById);
router.put("/pembelian/:id", adminController.updatePembelian);
router.delete("/pembelian/:id", adminController.deletePembelian);

// ==================== MANAJEMEN ARTIKEL ====================
router.get("/artikel", adminController.listArtikel);
router.get("/artikel/:id", adminController.getArtikelById);
router.post("/artikel", adminController.createArtikel);
router.put("/artikel/:id", adminController.updateArtikel);
router.delete("/artikel/:id", adminController.deleteArtikel);

// ==================== UPLOAD GAMBAR ====================
router.post("/upload-gambar", middlewareUploadGambar, sendHasilUpload);

module.exports = router;
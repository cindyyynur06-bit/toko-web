// backend/routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authenticate, middlewareUploadGambar, sendHasilUpload } = require("../middlewares");

// =============================================================================
// AUTH ROUTES (public)
// =============================================================================

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);

// =============================================================================
// PUBLIC ROUTES (tanpa login)
// =============================================================================

router.get("/produk", usersController.listProduk);
router.get("/produk/:id_produk", usersController.getProdukById);
router.get("/artikel", usersController.listArtikelPublik);
router.get("/artikel/:id", usersController.getArtikelPublikById);

// =============================================================================
// PROTECTED ROUTES (harus login)
// =============================================================================

// Profile
router.get("/me", authenticate, usersController.getMyProfile);
router.put("/me", authenticate, usersController.updateMyProfile);

// Upload gambar
router.post("/upload-gambar", authenticate, middlewareUploadGambar, sendHasilUpload);

// Dashboard
router.get("/dashboard", authenticate, usersController.getDashboard);

// Pembelian
router.post("/pembelian", authenticate, usersController.createPembelian);
router.get("/pembelian", authenticate, usersController.listMyPembelian);
router.get("/pembelian/:id", authenticate, usersController.getMyPembelianById);

module.exports = router;
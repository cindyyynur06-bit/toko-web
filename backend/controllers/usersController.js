// backend/controllers/usersController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const produkModel = require("../models/produkModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");

const registerUser = async (req, res) => {
  try {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto } = req.body;

    // Cek email sudah terdaftar
    const existingEmail = await usersModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(passwd, 10);

    // Buat user baru
    const result = await usersModel.createUser({
      nama_d,
      nama_b,
      kelamin,
      lahir,
      alamat,
      phone,
      email,
      role: role || "pembeli",
      uname,
      passwd: hashedPassword,
      foto: foto || "",
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { credential, passwd } = req.body;

    // Cari user berdasarkan credential (email atau username)
    const user = await usersModel.findUserByCredential(credential);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(passwd, user.passwd);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Hapus password dari response
    delete user.passwd;

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get profile user sendiri (berdasarkan token)
 */
const getMyProfile = async (req, res) => {
  try {
    // req.user sudah terisi oleh middleware authenticate
    const user = await usersModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update profile user sendiri
 * Ganti password butuh passwd_lama
 */
const updateMyProfile = async (req, res) => {
  try {
    const { id } = req.user; // dari middleware authenticate
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, foto, passwd_lama, passwd_baru } = req.body;

    // Cek user exists
    const user = await usersModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Jika ingin ganti password
    if (passwd_baru) {
      // Wajib kirim passwd_lama
      if (!passwd_lama) {
        return res.status(400).json({ error: "Password lama wajib diisi untuk mengganti password" });
      }

      // Verifikasi password lama
      const isValidPassword = await bcrypt.compare(passwd_lama, user.passwd);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Password lama salah" });
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(passwd_baru, 10);
      await usersModel.updateUserPassword(id, hashedPassword);
    }

    // Update profile (tanpa password)
    const result = await usersModel.updateUserProfile(id, {
      nama_d: nama_d || user.nama_d,
      nama_b: nama_b || user.nama_b,
      kelamin: kelamin || user.kelamin,
      lahir: lahir || user.lahir,
      alamat: alamat || user.alamat,
      phone: phone || user.phone,
      email: email || user.email,
      uname: uname || user.uname,
      foto: foto !== undefined ? foto : user.foto,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Ambil data user terbaru (tanpa password)
    const updatedUser = await usersModel.findUserById(id);

    res.json({
      success: true,
      message: "Profile berhasil diupdate",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================================================
// PUBLIC - PRODUK
// =============================================================================

/**
 * List semua produk (public)
 */
const listProduk = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const produk = await produkModel.findAllProduk(parseInt(limit), parseInt(offset));
    res.json({
      success: true,
      data: produk,
      meta: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: produk.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get produk by ID (public)
 */
const getProdukById = async (req, res) => {
  try {
    const { id_produk } = req.params;
    const produk = await produkModel.findProdukById(id_produk);
    if (!produk) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }
    res.json({ success: true, data: produk });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================================================
// PUBLIC - ARTIKEL
// =============================================================================

/**
 * List semua artikel (public)
 */
const listArtikelPublik = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const artikel = await artikelModel.findAllArtikel(parseInt(limit), parseInt(offset));
    res.json({
      success: true,
      data: artikel,
      meta: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: artikel.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get artikel by ID (public)
 */
const getArtikelPublikById = async (req, res) => {
  try {
    const { id } = req.params;
    const artikel = await artikelModel.findArtikelById(id);
    if (!artikel) {
      return res.status(404).json({ success: false, error: "Artikel tidak ditemukan" });
    }
    res.json({ success: true, data: artikel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================================================
// PEMBELIAN (USER)
// =============================================================================

/**
 * Dashboard user (statistik + pembelian terbaru)
 */
const getDashboard = async (req, res) => {
  try {
    const id_pembeli = req.user.id;

    // Statistik pembelian
    const stats = await pembelianModel.getStatsByPembeliId(id_pembeli);

    // 5 pembelian terbaru
    const recent = await pembelianModel.findPembelianByPembeliIdWithDetail(id_pembeli, 5, 0);

    res.json({
      success: true,
      data: {
        stats,
        recent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Buat pembelian baru
 * id_pembeli dari JWT (req.user.id)
 * Metode: Bank Transfer | COD
 * Kurir: JNT Express | JNE
 */
const createPembelian = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    const { id_produk, metode_pembayaran, catatan, foto_bukti } = req.body;

    // Validasi required
    if (!id_produk || !metode_pembayaran) {
      return res.status(400).json({
        success: false,
        error: "Field wajib: id_produk, metode_pembayaran",
      });
    }

    // Validasi metode_pembayaran
    const allowedMetode = ["Bank Transfer", "COD"];
    if (!allowedMetode.includes(metode_pembayaran)) {
      return res.status(400).json({
        success: false,
        error: `Metode pembayaran harus: ${allowedMetode.join(", ")}`,
      });
    }

    // Cek produk exists
    const produk = await produkModel.findProdukById(id_produk);
    if (!produk) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }

    // Cek user exists
    const user = await usersModel.findUserById(id_pembeli);
    if (!user) {
      return res.status(404).json({ success: false, error: "User tidak ditemukan" });
    }

    // Data pembelian
    const pembelianData = {
      id_pembeli,
      id_produk,
      nama_pembeli: `${user.nama_d} ${user.nama_b}`,
      alamat_pembeli: user.alamat,
      phone_pembeli: user.phone,
      metode_pembayaran,
      catatan: catatan || null,
      foto_bukti: foto_bukti || null,
    };

    const result = await pembelianModel.insertPembelian(pembelianData);

    res.status(201).json({
      success: true,
      message: "Pembelian berhasil dibuat",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * List pembelian user sendiri
 */
const listMyPembelian = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    const { limit = 100, offset = 0 } = req.query;

    const pembelian = await pembelianModel.findPembelianByPembeliIdWithDetail(
      id_pembeli,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      success: true,
      data: pembelian,
      meta: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: pembelian.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get detail pembelian user sendiri
 */
const getMyPembelianById = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    const { id } = req.params;

    const pembelian = await pembelianModel.findPembelianByIdAndPembeliId(id, id_pembeli);
    if (!pembelian) {
      return res.status(404).json({ success: false, error: "Pembelian tidak ditemukan" });
    }

    res.json({ success: true, data: pembelian });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  listProduk,
  getProdukById,
  listArtikelPublik,
  getArtikelPublikById,
  getDashboard,
  createPembelian,
  listMyPembelian,
  getMyPembelianById,
};
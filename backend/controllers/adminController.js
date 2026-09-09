// backend/controllers/adminController.js
const produkModel = require("../models/produkModel");
const usersModel = require("../models/usersModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");

// =============================================================================
// CRUD PRODUK
// =============================================================================

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

const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const produk = await produkModel.findProdukById(id);
    if (!produk) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }
    res.json({ success: true, data: produk });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createProduk = async (req, res) => {
  try {
    const { nama_produk, deskripsi, harga, gambar, kategori } = req.body;

    if (!nama_produk || !deskripsi || !harga) {
      return res.status(400).json({
        success: false,
        error: "Field wajib: nama_produk, deskripsi, harga",
      });
    }

    const allowedKategori = [
      "Bouquet Balon Bunga",
      "Bouquet Hadiah (Gift Bouquet)",
      "Bouquet Custom"
    ];
    if (kategori && !allowedKategori.includes(kategori)) {
      return res.status(400).json({
        success: false,
        error: `Kategori harus salah satu: ${allowedKategori.join(", ")}`,
      });
    }

    const result = await produkModel.insertProduk({
      nama_produk,
      deskripsi,
      harga: parseInt(harga),
      gambar: gambar || null,
      kategori: kategori || "Bouquet Custom",
    });

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      id_produk: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, deskripsi, harga, gambar, kategori } = req.body;

    const existing = await produkModel.findProdukById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }

    const allowedKategori = [
      "Bouquet Balon Bunga",
      "Bouquet Hadiah (Gift Bouquet)",
      "Bouquet Custom"
    ];
    if (kategori && !allowedKategori.includes(kategori)) {
      return res.status(400).json({
        success: false,
        error: `Kategori harus salah satu: ${allowedKategori.join(", ")}`,
      });
    }

    const result = await produkModel.updateProduk(id, {
      nama_produk: nama_produk || existing.nama_produk,
      deskripsi: deskripsi || existing.deskripsi,
      harga: harga ? parseInt(harga) : existing.harga,
      gambar: gambar !== undefined ? gambar : existing.gambar,
      kategori: kategori || existing.kategori,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Produk berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await produkModel.findProdukById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }

    const result = await produkModel.deleteProduk(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Produk tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================================================
// CRUD PEMBELI (USERS) - sama seperti sebelumnya
// =============================================================================

const listPembeli = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const users = await usersModel.findAllUsers(parseInt(limit), parseInt(offset));
    const pembeli = users.filter(user => user.role === 'pembeli');
    res.json({
      success: true,
      data: pembeli,
      meta: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: pembeli.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPembeliById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: "Pembeli tidak ditemukan" });
    }
    if (user.role !== 'pembeli') {
      return res.status(404).json({ success: false, error: "User bukan pembeli" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createPembeli = async (req, res) => {
  try {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto } = req.body;

    if (!nama_d || !nama_b || !email || !uname || !passwd) {
      return res.status(400).json({
        success: false,
        error: "Field wajib: nama_d, nama_b, email, uname, passwd",
      });
    }

    const existingEmail = await usersModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, error: "Email sudah terdaftar" });
    }

    const existingUser = await usersModel.findUserByCredential(uname);
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Username sudah terdaftar" });
    }

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(passwd, 10);

    const result = await usersModel.createUser({
      nama_d,
      nama_b,
      kelamin: kelamin || '',
      lahir: lahir || '',
      alamat: alamat || '',
      phone: phone || 0,
      email,
      role: 'pembeli',
      uname,
      passwd: hashedPassword,
      foto: foto || '',
    });

    res.status(201).json({
      success: true,
      message: "Pembeli berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePembeli = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, foto } = req.body;

    const existing = await usersModel.findUserById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Pembeli tidak ditemukan" });
    }
    if (existing.role !== 'pembeli') {
      return res.status(404).json({ success: false, error: "User bukan pembeli" });
    }

    if (email && email !== existing.email) {
      const emailExists = await usersModel.isEmailExists(email, id);
      if (emailExists) {
        return res.status(400).json({ success: false, error: "Email sudah digunakan" });
      }
    }

    if (uname && uname !== existing.uname) {
      const unameExists = await usersModel.isUnameExists(uname, id);
      if (unameExists) {
        return res.status(400).json({ success: false, error: "Username sudah digunakan" });
      }
    }

    const result = await usersModel.updateUserProfile(id, {
      nama_d: nama_d || existing.nama_d,
      nama_b: nama_b || existing.nama_b,
      kelamin: kelamin || existing.kelamin,
      lahir: lahir || existing.lahir,
      alamat: alamat || existing.alamat,
      phone: phone || existing.phone,
      email: email || existing.email,
      uname: uname || existing.uname,
      foto: foto !== undefined ? foto : existing.foto,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Pembeli tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Pembeli berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePembeli = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await usersModel.findUserById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Pembeli tidak ditemukan" });
    }
    if (existing.role !== 'pembeli') {
      return res.status(404).json({ success: false, error: "User bukan pembeli" });
    }

    const result = await usersModel.deleteUser(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Pembeli tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Pembeli berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================================================
// CRUD ARTIKEL - sama seperti sebelumnya
// =============================================================================

const listArtikel = async (req, res) => {
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

const getArtikelById = async (req, res) => {
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

const createArtikel = async (req, res) => {
  try {
    const { judul, ringkasan, isi, gambar } = req.body;

    if (!judul || !ringkasan || !isi) {
      return res.status(400).json({
        success: false,
        error: "Field wajib: judul, ringkasan, isi",
      });
    }

    const result = await artikelModel.insertArtikel({
      judul,
      ringkasan,
      isi,
      gambar: gambar || '',
    });

    res.status(201).json({
      success: true,
      message: "Artikel berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateArtikel = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, ringkasan, isi, gambar } = req.body;

    const existing = await artikelModel.findArtikelById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Artikel tidak ditemukan" });
    }

    const result = await artikelModel.updateArtikel(id, {
      judul: judul || existing.judul,
      ringkasan: ringkasan || existing.ringkasan,
      isi: isi || existing.isi,
      gambar: gambar !== undefined ? gambar : existing.gambar,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Artikel tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Artikel berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteArtikel = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await artikelModel.findArtikelById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Artikel tidak ditemukan" });
    }

    const result = await artikelModel.deleteArtikel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Artikel tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Artikel berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================================================
// STATISTIK & PEMBELIAN - sama seperti sebelumnya
// =============================================================================

const getStats = async (req, res) => {
  try {
    const stats = await pembelianModel.getAdminStats();
    const recent = await pembelianModel.getRecentPembelian(5);
    
    const totalProduk = await produkModel.countProduk();
    const totalPembeli = await usersModel.countPembeli();
    const totalArtikel = await artikelModel.countArtikel();

    const totalPembelian = stats.total_pembelian || 0;
    const selesai = stats.selesai || 0;
    const diterima = stats.diterima || 0;
    const dibatalkan = stats.dibatalkan || 0;
    const pesananAktif = totalPembelian - selesai - diterima - dibatalkan;

    const pendapatan = await pembelianModel.getTotalPendapatan();
    const produkTerjual = await pembelianModel.getTotalProdukTerjual();

    res.json({
      success: true,
      data: {
        stats: {
          total_pembelian: totalPembelian,
          tertunda: stats.tertunda || 0,
          dikemas: stats.dikemas || 0,
          dikirim: stats.dikirim || 0,
          diterima: diterima,
          selesai: selesai,
          dibatalkan: dibatalkan,
          belum_dibayar: stats.belum_dibayar || 0,
          sudah_dibayar: stats.sudah_dibayar || 0,
          cod: stats.cod || 0,
          bank_transfer: stats.bank_transfer || 0,
          
          total_produk: totalProduk || 0,
          total_pembeli: totalPembeli || 0,
          total_artikel: totalArtikel || 0,
          
          pesanan_aktif: pesananAktif,
          pendapatan: pendapatan || 0,
          produk_terjual: produkTerjual || 0,
        },
        recent,
      },
    });
  } catch (error) {
    console.error("❌ Error getStats:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const listPembelian = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const pembelian = await pembelianModel.findAllPembelianWithDetail(
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

const getPembelianById = async (req, res) => {
  try {
    const { id } = req.params;
    const pembelian = await pembelianModel.findPembelianById(id);
    if (!pembelian) {
      return res.status(404).json({ success: false, error: "Pembelian tidak ditemukan" });
    }
    res.json({ success: true, data: pembelian });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePembelian = async (req, res) => {
  try {
    const { id } = req.params;
    const { metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti } = req.body;

    const existing = await pembelianModel.findPembelianById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Pembelian tidak ditemukan" });
    }

    const result = await pembelianModel.updatePembelian(id, {
      metode_pembayaran: metode_pembayaran || existing.metode_pembayaran,
      pembayaran: pembayaran || existing.pembayaran,
      pengiriman: pengiriman || existing.pengiriman,
      status: status || existing.status,
      catatan: catatan !== undefined ? catatan : existing.catatan,
      foto_bukti: foto_bukti !== undefined ? foto_bukti : existing.foto_bukti,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Pembelian tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Pembelian berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePembelian = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pembelianModel.findPembelianById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Pembelian tidak ditemukan" });
    }

    const result = await pembelianModel.deletePembelian(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Pembelian tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Pembelian berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  listProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
  listPembeli,
  getPembeliById,
  createPembeli,
  updatePembeli,
  deletePembeli,
  listArtikel,
  getArtikelById,
  createArtikel,
  updateArtikel,
  deleteArtikel,
  getStats,
  listPembelian,
  getPembelianById,
  updatePembelian,
  deletePembelian,
};
// frontend/src/pages/pembeli/PembeliBelanjaPage.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { pembeliApi } from "../../api";
import { formatRupiah, mediaUrl, onImgError } from "../../utils";

export default function PembeliBelanjaPage() {
  const location = useLocation();
  const [produk, setProduk] = useState([]);
  const [filteredProduk, setFilteredProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("SEMUA");
  const [categories, setCategories] = useState(["SEMUA"]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [previewBukti, setPreviewBukti] = useState("");
  const [form, setForm] = useState({ nama_penerima: "", alamat: "", telepon: "", metode_bayar: "Bank Transfer", kurir: "JNT Express", catatan: "", bukti_bayar: "" });

  useEffect(() => { fetchProduk(); fetchUser(); }, []);

  useEffect(() => {
    if (location.state?.buyProduct) openModal(location.state.buyProduct);
  }, [location.state]);

  const fetchProduk = async () => {
    setLoading(true);
    try {
      const res = await pembeliApi.getProduk();
      const data = res.data || [];
      setProduk(data);
      setFilteredProduk(data);
      const uniqueCategories = [...new Set(data.map(item => item.kategori).filter(Boolean))];
      setCategories(["SEMUA", ...uniqueCategories]);
    } catch (err) { console.error("Error fetching produk:", err); }
    finally { setLoading(false); }
  };

  const fetchUser = async () => {
    try {
      const res = await pembeliApi.getMe();
      const userData = res.data || res;
      setUser(userData);
      setForm(prev => ({ ...prev, nama_penerima: `${userData.nama_d || ""} ${userData.nama_b || ""}`.trim(), alamat: userData.alamat || "", telepon: userData.phone || "" }));
    } catch (err) { console.error("Error fetching user:", err); }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "SEMUA") setFilteredProduk(produk);
    else setFilteredProduk(produk.filter(item => item.kategori === category));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setError("");
    setSuccess("");
    setPreviewBukti("");
    setForm(prev => ({ ...prev, catatan: "", bukti_bayar: "" }));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setPreviewBukti("");
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => { setPreviewBukti(reader.result); };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("gambar", file);

    pembeliApi.uploadGambar(formData)
      .then((res) => {
        const path = res.data?.path || res.data?.filename || res.data;
        setForm(prev => ({ ...prev, bukti_bayar: path }));
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setError(err.body?.message || "Gagal upload bukti bayar");
        setPreviewBukti("");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        id_produk: selectedProduct.id_produk,
        metode_pembayaran: form.metode_bayar,
        catatan: form.catatan || "",
        foto_bukti: form.bukti_bayar || "",
        nama_penerima: form.nama_penerima,
        alamat_pengiriman: form.alamat,
        telepon_penerima: form.telepon,
        kurir: form.kurir,
      };

      await pembeliApi.createPembelian(payload);
      setSuccess("Pesanan berhasil dibuat!");
      setTimeout(() => { closeModal(); }, 1500);
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.body?.message || err.message || "Gagal membuat pesanan");
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">

          {/* ===== HEADER ===== */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Belanja</h5>
            <span className="text-secondary small">{filteredProduk.length} produk tersedia</span>
          </div>

          {/* ===== KATEGORI ===== */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {categories.map((category) => (
              <button key={category} className={`btn btn-sm ${selectedCategory === category ? "btn-dark" : "btn-outline-dark"}`} onClick={() => handleCategoryFilter(category)}>
                {category}
              </button>
            ))}
          </div>

          {/* ===== LIST PRODUK ===== */}
          {filteredProduk.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <p className="text-secondary">Belum ada produk di kategori ini</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredProduk.map((item) => (
                <div key={item.id_produk} className="col-md-4 col-sm-6">
                  <div className="bg-white p-3 rounded shadow-sm h-100">
                    <img src={mediaUrl(item.gambar)} alt={item.nama_produk} className="img-fluid rounded mb-2" style={{ width: "100%", height: "150px", objectFit: "cover" }} onError={onImgError} />
                    <h6 className="fw-bold mb-1">{item.nama_produk}</h6>
                    <p className="text-secondary small mb-2" style={{ fontSize: "12px" }}>{item.deskripsi?.slice(0, 60)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark">{formatRupiah(item.harga)}</span>
                      <button onClick={() => openModal(item)} className="btn btn-dark btn-sm">Pesan</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL PESAN ===== */}
      {showModal && selectedProduct && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "900px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Checkout: {selectedProduct.nama_produk}</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
                  </div>
                )}

                <div className="row g-4">

                  {/* KIRI: FORM */}
                  <div className="col-md-7">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Nama Penerima</label>
                        <input type="text" name="nama_penerima" className="form-control" value={form.nama_penerima} onChange={handleChange} required />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Alamat Pengiriman</label>
                        <textarea name="alamat" className="form-control" rows="2" value={form.alamat} onChange={handleChange} required />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Telepon</label>
                        <input type="text" name="telepon" className="form-control" value={form.telepon} onChange={handleChange} required />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Metode Bayar</label>
                        <select name="metode_bayar" className="form-select" value={form.metode_bayar} onChange={handleChange}>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="COD">COD</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Kurir</label>
                        <select name="kurir" className="form-select" value={form.kurir} onChange={handleChange}>
                          <option value="JNT Express">JNT Express</option>
                          <option value="JNE">JNE</option>
                          <option value="SiCepat">SiCepat</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Catatan (opsional)</label>
                        <textarea name="catatan" className="form-control" rows="2" placeholder="Tambahkan catatan untuk pesanan..." value={form.catatan} onChange={handleChange} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Bukti Bayar (opsional)</label>
                        <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                        {previewBukti && <img src={previewBukti} alt="Bukti Bayar" className="mt-2 rounded" style={{ width: 80, height: 80, objectFit: "cover" }} />}
                      </div>

                      <button type="submit" className="btn btn-dark w-100 py-2" disabled={submitting}>
                        {submitting ? "Memproses..." : "Buat Pesanan"}
                      </button>
                    </form>
                  </div>

                  {/* KANAN: INFO PRODUK */}
                  <div className="col-md-5">
                    <div className="bg-light p-3 rounded">
                      <img src={mediaUrl(selectedProduct.gambar)} alt={selectedProduct.nama_produk} className="img-fluid rounded mb-3" style={{ width: "100%", height: "180px", objectFit: "cover" }} onError={onImgError} />
                      <h6 className="fw-bold">{selectedProduct.nama_produk}</h6>
                      <p className="text-secondary small">{selectedProduct.deskripsi?.slice(0, 80)}...</p>
                      <h5 className="fw-bold text-dark">{formatRupiah(selectedProduct.harga)}</h5>

                      <hr />

                      <h6 className="fw-bold">Ringkasan Pesanan</h6>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary">Produk</span>
                        <span>{selectedProduct.nama_produk}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary">Harga</span>
                        <span>{formatRupiah(selectedProduct.harga)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary">Pengiriman</span>
                        <span>{form.kurir}</span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total</span>
                        <span>{formatRupiah(selectedProduct.harga)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
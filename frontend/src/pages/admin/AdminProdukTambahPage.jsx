// frontend/src/pages/admin/AdminProdukTambahPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../api";
import { KATEGORI_PRODUK } from "../../constants";

export default function AdminProdukTambahPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama_produk: "",
    deskripsi: "",
    harga: "",
    kategori: "",
    gambar: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    // Cek ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 5MB");
      e.target.value = "";
      return;
    }

    // Cek format file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const fileExt = file.name.split(".").pop().toLowerCase();
    const isValidType = validTypes.includes(file.type) || ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt);

    if (!isValidType) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("gambar", file);
    adminApi
      .uploadGambar(formData)
      .then((res) => {
        setForm({ ...form, gambar: res.data.path });
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Gagal upload gambar");
        e.target.value = "";
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await adminApi.createProduk({
        nama_produk: form.nama_produk,
        deskripsi: form.deskripsi,
        harga: parseInt(form.harga),
        kategori: form.kategori,
        gambar: form.gambar,
      });
      alert("Produk berhasil ditambahkan");
      navigate(`/admin/produk/${result.id_produk}`);
    } catch (err) {
      setError(err.message || "Gagal menambahkan produk");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Tambah Produk</h5>
        <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm">
          Kembali
        </Link>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Nama Produk</label>
            <input
              type="text"
              name="nama_produk"
              className="form-control"
              value={form.nama_produk}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Deskripsi</label>
            <textarea
              name="deskripsi"
              className="form-control"
              rows="4"
              value={form.deskripsi}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">Harga</label>
              <input
                type="number"
                name="harga"
                className="form-control"
                value={form.harga}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">Kategori</label>
              <select
                name="kategori"
                className="form-select"
                value={form.kategori}
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                {KATEGORI_PRODUK.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Gambar</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            <small className="text-secondary">Pilih file gambar (maks 5MB)</small>
            {form.gambar && (
              <div className="mt-2">
                <span className="text-success small">✓ File terupload: {form.gambar}</span>
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-dark" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Tambah Produk"}
            </button>
            <Link to="/admin/produk" className="btn btn-outline-secondary">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
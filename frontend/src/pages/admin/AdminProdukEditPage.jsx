// frontend/src/pages/admin/AdminProdukEditPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api";
import { KATEGORI_PRODUK } from "../../constants";
import { mediaUrl, onImgError } from "../../utils";  

export default function AdminProdukEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nama_produk: "",
    deskripsi: "",
    harga: "",
    kategori: "",
    gambar: "",
  });

  // Load Data Produk Berdasarkan ID
  useEffect(() => {
    adminApi
      .getProdukById(id)
      .then((res) => {
        const p = res.data?.data || res.data || res;
        if (p) {
          setForm({
            nama_produk: p.nama_produk || "",
            deskripsi: p.deskripsi || "",
            harga: p.harga || "",
            kategori: p.kategori || "",
            gambar: p.gambar || "",
          });
        }
      })
      .catch((err) => {
        console.error("Fetch product error:", err);
        setError(err.message || "Gagal memuat data produk");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload Gambar Baru
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // Validasi Ukuran (Maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 5MB");
      e.target.value = "";
      return;
    }

    // Validasi Ekstensi File
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const fileExt = file.name.split(".").pop().toLowerCase();
    const isValidType = validTypes.includes(file.type) || ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt);

    if (!isValidType) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP");
      e.target.value = "";
      return;
    }

    // Kirim File ke Helper API
    setUploadingImage(true);
    try {
      const res = await adminApi.uploadGambar(file);
      const path = res.path || res.url || res.data?.path || res.data;
      setForm((prev) => ({ ...prev, gambar: path }));
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Gagal upload gambar");
      e.target.value = "";
    } finally {
      setUploadingImage(false);
    }
  };

  // Simpan Perubahan Produk
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await adminApi.updateProduk(id, {
        nama_produk: form.nama_produk,
        deskripsi: form.deskripsi,
        harga: Number(form.harga),
        kategori: form.kategori,
        gambar: form.gambar,
      });

      alert("Produk berhasil diperbarui!");
      navigate("/admin/produk");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Gagal mengupdate produk");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Memuat data produk...</div>;
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Ubah Produk</h4>
        <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm">
          Kembali
        </Link>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>
          {/* Nama Produk */}
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

          {/* Deskripsi */}
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

          {/* Harga & Kategori */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">Harga (Rp)</label>
              <input type="number" name="harga" className="form-control" value={form.harga} onChange={handleChange} required min="0"/>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">Kategori</label>
              <select
                name="kategori"
                className="form-select"
                value={form.kategori}
                onChange={handleChange}
                required
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

          {/* Upload Gambar & Tampilan Foto */}
          <div className="mb-4">
            <label className="form-label fw-medium">Gambar Produk</label>
            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploadingImage}
            />
            <small className="text-muted d-block mb-2">
              Pilih file gambar baru jika ingin mengganti (Maks. 5MB)
            </small>

            {uploadingImage && (
              <div className="text-primary small mb-2">Mengunggah gambar...</div>
            )}

            {/* ✅ PERBAIKAN: Pakai mediaUrl dari utils */}
            {form.gambar && (
              <div className="mt-2">
                <img
                  src={mediaUrl(form.gambar)}
                  alt={form.nama_produk || "Foto Produk"}
                  style={{ maxHeight: "140px", objectFit: "cover" }}
                  className="rounded border p-1 shadow-sm"
                  onError={onImgError}  // ✅ PAKAI onImgError DARI UTILS
                />
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || uploadingImage}
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
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
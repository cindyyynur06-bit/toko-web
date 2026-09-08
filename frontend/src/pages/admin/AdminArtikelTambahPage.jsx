import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api";

export default function AdminArtikelTambahPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewGambar, setPreviewGambar] = useState("");
  const [form, setForm] = useState({ judul: "", ringkasan: "", isi: "", gambar: "" });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => { setPreviewGambar(reader.result); };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("gambar", file);

    adminApi.uploadGambar(formData)
      .then((res) => {
        // Response dari backend: { success: true, data: { path: "filename.jpg" } }
        const gambarPath = res.data?.path || res.data?.filename || res.data;
        setForm((prevForm) => ({ ...prevForm, gambar: gambarPath }));
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setError(err.body?.message || err.message || "Gagal upload gambar");
        setPreviewGambar("");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Validasi
      if (!form.judul || !form.ringkasan || !form.isi) {
        throw new Error("Judul, ringkasan, dan isi wajib diisi");
      }

      // Kirim ke backend
      const payload = { judul: form.judul, ringkasan: form.ringkasan, isi: form.isi, gambar: form.gambar || "" };

      const response = await adminApi.createArtikel(payload);

      alert(response.message || "Artikel berhasil ditambahkan");
      navigate("/admin/artikel");
    } catch (err) {
      console.error("Error creating artikel:", err);
      setError(err.body?.message || err.message || "Gagal menambahkan artikel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Tambah Artikel Baru</h5>
        <button onClick={() => navigate("/admin/artikel")} className="btn btn-outline-secondary btn-sm">Kembali</button>
      </div>

      <div className="panel-card p-4">
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-12">
              <label className="form-label fw-medium">Judul *</label>
              <input type="text" name="judul" className="form-control" placeholder="Masukkan judul artikel" value={form.judul} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Ringkasan *</label>
              <textarea name="ringkasan" className="form-control" rows="3" placeholder="Masukkan ringkasan artikel (deskripsi singkat)" value={form.ringkasan} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Isi Artikel *</label>
              <textarea name="isi" className="form-control" rows="10" placeholder="Masukkan isi artikel lengkap" value={form.isi} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Gambar Artikel</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
              {previewGambar && <img src={previewGambar} alt="Preview" className="mt-2 rounded" style={{ width: 200, height: 150, objectFit: "cover" }} />}
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-dark" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : (
                  "Tambah Artikel"
                )}
              </button>

              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/artikel")} disabled={submitting}>Batal</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
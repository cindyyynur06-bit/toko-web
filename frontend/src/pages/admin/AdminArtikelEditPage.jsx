import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api";
import { mediaUrl } from "../../utils";

export default function AdminArtikelEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewGambar, setPreviewGambar] = useState("");
  const [form, setForm] = useState({ judul: "", ringkasan: "", isi: "", gambar: "" });

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = () => {
    setLoading(true);
    adminApi.getArtikelById(id)
      .then((res) => {
        const data = res.data || res;
        setForm({ judul: data.judul || "", ringkasan: data.ringkasan || "", isi: data.isi || "", gambar: data.gambar || "" });
        setPreviewGambar(data.gambar ? mediaUrl(data.gambar) : "");
      })
      .catch((err) => {
        console.error("Error fetching artikel:", err);
        setError("Gagal memuat data artikel");
      })
      .finally(() => setLoading(false));
  };

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
      if (!form.judul || !form.ringkasan || !form.isi) throw new Error("Judul, ringkasan, dan isi wajib diisi");

      const payload = { judul: form.judul, ringkasan: form.ringkasan, isi: form.isi, gambar: form.gambar || "" };

      const response = await adminApi.updateArtikel(id, payload);

      alert(response.message || "Artikel berhasil diupdate");
      navigate("/admin/artikel");
    } catch (err) {
      console.error("Error updating artikel:", err);
      setError(err.body?.message || err.message || "Gagal mengupdate artikel");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Ubah Artikel</h5>
        <button onClick={() => navigate("/admin/artikel")} className="btn btn-outline-secondary btn-sm">Kembali</button>
      </div>

      <div className="panel-card p-4">
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-12">
              <label className="form-label fw-medium">Judul *</label>
              <input type="text" name="judul" className="form-control" value={form.judul} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Ringkasan *</label>
              <textarea name="ringkasan" className="form-control" rows="3" value={form.ringkasan} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Isi Artikel *</label>
              <textarea name="isi" className="form-control" rows="10" value={form.isi} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Gambar Artikel</label>
              {previewGambar && (
                <img src={previewGambar} alt="Preview" className="d-block mb-2 rounded" style={{ width: 200, height: 150, objectFit: "cover" }} />
              )}
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : "Simpan Perubahan"}
              </button>

              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/artikel")} disabled={submitting}>Batal</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
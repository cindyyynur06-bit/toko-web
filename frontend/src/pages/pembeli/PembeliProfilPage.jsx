import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pembeliApi } from "../../api";
import { mediaUrl, onImgError } from "../../utils";

export default function PembeliProfilPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");
  const [form, setForm] = useState({
    nama_d: "", nama_b: "", kelamin: "", lahir: "", alamat: "", phone: "", email: "", uname: "", foto: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    passwd_lama: "", passwd_baru: "", passwd_baru_confirm: ""
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = () => {
    setLoading(true);
    pembeliApi.getMe()
      .then((res) => {
        const data = res.data || res;
        setForm({
          nama_d: data.nama_d || "", nama_b: data.nama_b || "", kelamin: data.kelamin || "",
          lahir: data.lahir || "", alamat: data.alamat || "", phone: data.phone || "",
          email: data.email || "", uname: data.uname || "", foto: data.foto || ""
        });
        setPreviewFoto(data.foto ? mediaUrl(data.foto) : "");
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(err.body?.message || "Gagal memuat profil");
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const handlePasswordChange = (e) => { setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value }); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => { setPreviewFoto(reader.result); };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("gambar", file);

    pembeliApi.uploadGambar(formData)
      .then((res) => {
        const fotoPath = res.data?.path || res.data?.filename || res.data;
        setForm((prevForm) => ({ ...prevForm, foto: fotoPath }));
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setError(err.body?.message || err.message || "Gagal upload gambar");
        setPreviewFoto("");
      });
  };

  const handleHapusFoto = () => {
    setForm((prevForm) => ({ ...prevForm, foto: "" }));
    setPreviewFoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        nama_d: form.nama_d, nama_b: form.nama_b || "", kelamin: form.kelamin || "",
        lahir: form.lahir || "", alamat: form.alamat || "", phone: form.phone || "",
        email: form.email, uname: form.uname, foto: form.foto || ""
      };

      if (passwordForm.passwd_baru) {
        if (passwordForm.passwd_baru !== passwordForm.passwd_baru_confirm) {
          throw new Error("Konfirmasi password tidak cocok");
        }
        if (passwordForm.passwd_baru.length < 6) {
          throw new Error("Password minimal 6 karakter");
        }
        payload.passwd_lama = passwordForm.passwd_lama;
        payload.passwd_baru = passwordForm.passwd_baru;
      }

      const response = await pembeliApi.putMe(payload);
      setSuccess(response.message || "Profil berhasil diupdate");

      setPasswordForm({
        passwd_lama: "", passwd_baru: "", passwd_baru_confirm: ""
      });

      setTimeout(() => { fetchProfile(); }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.body?.message || err.message || "Gagal mengupdate profil");
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
    <div className="container" style={{ maxWidth: "1000px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Profil Saya</h5>
        <span className="text-secondary small">Ubah data akun pembeli</span>
      </div>

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

      <div className="bg-white p-4 rounded shadow-sm">
        <h6 className="fw-bold mb-3">Edit Profil</h6>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label fw-medium">Email (tidak bisa diubah)</label>
              <input type="email" className="form-control bg-light" value={form.email} disabled />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Username (tidak bisa diubah)</label>
              <input type="text" className="form-control bg-light" value={form.uname} disabled />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Nama Depan</label>
              <input type="text" name="nama_d" className="form-control" value={form.nama_d} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Nama Belakang</label>
              <input type="text" name="nama_b" className="form-control" value={form.nama_b} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Jenis Kelamin</label>
              <select name="kelamin" className="form-select" value={form.kelamin} onChange={handleChange}>
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Tanggal Lahir</label>
              <input type="date" name="lahir" className="form-control" value={form.lahir} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Telepon</label>
              <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Foto Profil</label>
              <div className="d-flex align-items-center gap-2">
                <img
                  src={previewFoto || mediaUrl(form.foto)}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: 60, height: 60, objectFit: "cover", border: "2px solid #ddd" }}
                  onError={onImgError}
                />
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleFileChange} />
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleHapusFoto}>Hapus</button>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Alamat</label>
              <textarea name="alamat" className="form-control" rows="2" value={form.alamat} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium">Ganti Password</label>
              <p className="text-secondary small mb-2">Kosongkan semua jika tidak ingin mengubah password.</p>

              <div className="row g-2">
                <div className="col-md-4">
                  <input type="password" name="passwd_lama" className="form-control" placeholder="Password lama" value={passwordForm.passwd_lama} onChange={handlePasswordChange} />
                </div>
                <div className="col-md-4">
                  <input type="password" name="passwd_baru" className="form-control" placeholder="Password baru (minimal 6 karakter)" value={passwordForm.passwd_baru} onChange={handlePasswordChange} minLength="6" />
                </div>
                <div className="col-md-4">
                  <input type="password" name="passwd_baru_confirm" className="form-control" placeholder="Ulangi password baru" value={passwordForm.passwd_baru_confirm} onChange={handlePasswordChange} minLength="6" />
                </div>
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
// frontend/src/pages/admin/AdminProfilPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api";
import { mediaUrl, onImgError } from "../../utils";

export default function AdminProfilPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");
  const [form, setForm] = useState({
    nama_d: "",
    nama_b: "",
    email: "",
    uname: "",
    foto: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    passwd_lama: "",
    passwd_baru: "",
    passwd_baru_confirm: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    adminApi
      .getMe()
      .then((res) => {
        const data = res.data || res;
        setForm({
          nama_d: data.nama_d || "",
          nama_b: data.nama_b || "",
          email: data.email || "",
          uname: data.uname || "",
          foto: data.foto || "",
        });
        setPreviewFoto(data.foto ? mediaUrl(data.foto) : "");
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(err.body?.message || "Gagal memuat profil");
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewFoto(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("gambar", file);
    
    adminApi.uploadGambar(formData)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        nama_d: form.nama_d,
        nama_b: form.nama_b || "",
        email: form.email,
        uname: form.uname,
        foto: form.foto || "",
      };

      const response = await adminApi.putMe(payload);
      setSuccess(response.message || "Profil berhasil diupdate");
      
      // Refresh data
      setTimeout(() => {
        fetchProfile();
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.body?.message || err.message || "Gagal mengupdate profil");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (passwordForm.passwd_baru !== passwordForm.passwd_baru_confirm) {
        throw new Error("Konfirmasi password tidak cocok");
      }

      if (passwordForm.passwd_baru.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      const payload = {
        passwd_lama: passwordForm.passwd_lama,
        passwd_baru: passwordForm.passwd_baru,
      };

      const response = await adminApi.putMe(payload);
      setSuccess(response.message || "Password berhasil diubah");
      
      // Reset form password
      setPasswordForm({
        passwd_lama: "",
        passwd_baru: "",
        passwd_baru_confirm: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.body?.message || err.message || "Gagal mengubah password");
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
        <h5 className="mb-0">Profil Admin</h5>
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

      <div className="row g-4">
        {/* ===== FORM EDIT PROFIL ===== */}
        <div className="col-md-6">
          <div className="panel-card p-4">
            <h6 className="fw-bold mb-3">Edit Profil</h6>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <img
                  src={previewFoto || mediaUrl(form.foto)}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: 100, height: 100, objectFit: "cover", border: "3px solid #ddd" }}
                  onError={onImgError}
                />
                <div className="mt-2">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Nama Depan</label>
                <input
                  type="text"
                  name="nama_d"
                  className="form-control"
                  value={form.nama_d}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Nama Belakang</label>
                <input
                  type="text"
                  name="nama_b"
                  className="form-control"
                  value={form.nama_b}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Username</label>
                <input
                  type="text"
                  name="uname"
                  className="form-control"
                  value={form.uname}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== FORM GANTI PASSWORD ===== */}
        <div className="col-md-6">
          <div className="panel-card p-4">
            <h6 className="fw-bold mb-3">Ganti Password</h6>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Password Lama</label>
                <input
                  type="password"
                  name="passwd_lama"
                  className="form-control"
                  placeholder="Masukkan password lama"
                  value={passwordForm.passwd_lama}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Password Baru</label>
                <input
                  type="password"
                  name="passwd_baru"
                  className="form-control"
                  placeholder="Minimal 6 karakter"
                  value={passwordForm.passwd_baru}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  name="passwd_baru_confirm"
                  className="form-control"
                  placeholder="Ulangi password baru"
                  value={passwordForm.passwd_baru_confirm}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Ganti Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
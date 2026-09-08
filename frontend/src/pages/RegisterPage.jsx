// frontend/src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ nama_d: "", nama_b: "", kelamin: "", lahir: "", alamat: "", phone: "", email: "", uname: "", passwd: "", passwd_confirm: "" });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!form.nama_d || !form.email || !form.uname || !form.passwd) throw new Error("Nama, email, username, dan password wajib diisi");
      if (form.passwd !== form.passwd_confirm) throw new Error("Konfirmasi password tidak cocok");
      if (form.passwd.length < 6) throw new Error("Password minimal 6 karakter");

      const payload = { nama_d: form.nama_d, nama_b: form.nama_b || "", kelamin: form.kelamin || "", lahir: form.lahir || "", alamat: form.alamat || "", phone: form.phone || "", email: form.email, uname: form.uname, passwd: form.passwd, role: "pembeli" };

      const response = await api.register(payload);
      setSuccess(response.message || "Pendaftaran berhasil! Silakan login.");

      setForm({ nama_d: "", nama_b: "", kelamin: "", lahir: "", alamat: "", phone: "", email: "", uname: "", passwd: "", passwd_confirm: "" });

      setTimeout(() => { navigate("/login"); }, 2000);
    } catch (err) {
      console.error("Error registering:", err);
      setError(err.body?.message || err.message || "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%", borderRadius: "16px", border: "none", backgroundColor: "#FAF6F0" }}>
        <Link to="/" className="text-decoration-none mb-3" style={{ color: "#8B6B4A" }}>← Kembali ke Beranda</Link>
        <h2 className="fw-bold text-center" style={{ color: "#2C1810" }}>Daftar Akun</h2>
        <p className="text-center mb-4" style={{ color: "#5D4037" }}>Buat akun Toko Rajut Nusantara</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Nama Depan *</label>
              <input type="text" name="nama_d" className="form-control" placeholder="Masukkan nama depan" value={form.nama_d} onChange={handleChange} required style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Nama Belakang</label>
              <input type="text" name="nama_b" className="form-control" placeholder="Masukkan nama belakang" value={form.nama_b} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Email *</label>
              <input type="email" name="email" className="form-control" placeholder="email@example.com" value={form.email} onChange={handleChange} required style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Username *</label>
              <input type="text" name="uname" className="form-control" placeholder="Masukkan username" value={form.uname} onChange={handleChange} required style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Password *</label>
              <input type="password" name="passwd" className="form-control" placeholder="Minimal 6 karakter" value={form.passwd} onChange={handleChange} required minLength="6" style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Konfirmasi Password *</label>
              <input type="password" name="passwd_confirm" className="form-control" placeholder="Ulangi password" value={form.passwd_confirm} onChange={handleChange} required minLength="6" style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Telepon</label>
              <input type="text" name="phone" className="form-control" placeholder="08123456789" value={form.phone} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Kelamin</label>
              <select name="kelamin" className="form-select" value={form.kelamin} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#8B6B4A" }}>
                <option value="">Pilih kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Tanggal Lahir</label>
              <input type="date" name="lahir" className="form-control" value={form.lahir} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Alamat</label>
              <textarea name="alamat" className="form-control" rows="2" placeholder="Masukkan alamat lengkap" value={form.alamat} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
            </div>

            <div className="col-12">
              <button type="submit" className="btn w-100 py-2 fw-semibold rounded-pill" disabled={loading} style={{ backgroundColor: "#2C1810", color: "#F5E6D3", border: "none" }}>
                {loading ? "Memproses..." : "DAFTAR"}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-3" style={{ color: "#5D4037" }}>
          Sudah punya akun? <Link to="/login" className="fw-bold" style={{ color: "#8B6B4A" }}>MASUK</Link>
        </p>
      </div>
    </div>
  );
}
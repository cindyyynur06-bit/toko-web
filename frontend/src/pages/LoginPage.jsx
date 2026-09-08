// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(credential, password);
      if (result.success) {
        if (result.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/akun");
        }
      } else {
        setError(result.error || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "16px", border: "none", backgroundColor: "#FAF6F0" }}>
        <Link to="/" className="text-decoration-none mb-3" style={{ color: "#8B6B4A" }}>← Kembali ke Beranda</Link>
        <h2 className="fw-bold text-center" style={{ color: "#2C1810" }}>Masuk</h2>
        <p className="text-center mb-4" style={{ color: "#5D4037" }}>Masuk ke akun Toko Rajut Nusantara</p>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Username atau Email</label>
            <input type="text" className="form-control" placeholder="Masukkan username atau email" value={credential} onChange={(e) => setCredential(e.target.value)} required style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium" style={{ color: "#2C1810" }}>Password</label>
            <input type="password" className="form-control" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderRadius: "10px", borderColor: "#8B6B4A" }} />
          </div>

          <button type="submit" className="btn w-100 py-2 fw-semibold rounded-pill" disabled={loading} style={{ backgroundColor: "#2C1810", color: "#F5E6D3", border: "none" }}>
            {loading ? "Memproses..." : "MASUK"}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: "#5D4037" }}>
          Belum punya akun? <Link to="/register" className="fw-bold" style={{ color: "#8B6B4A" }}>DAFTAR PEMBELI</Link>
        </p>
      </div>
    </div>
  );
}
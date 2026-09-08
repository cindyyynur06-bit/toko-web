// frontend/src/layouts/PublicLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SITE, PUBLIC_NAV } from "../constants";

export default function PublicLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* ===== HEADER / NAVBAR ===== */}
        <div className="col-12 bg-light d-flex align-items-center justify-content-between" style={{height:"70px", padding: "0 30px"}}>
          <div className="d-flex align-items-center gap-2">
            <img 
              src={SITE.logo_toko} 
              style={{width:"auto", height:"40px"}} 
              alt={SITE.nama_toko} 
            />
            <span className="fw-bold" style={{ fontSize: "18px" }}>{SITE.nama_toko}</span>
          </div>
          
          <div className="d-flex gap-4">
            {PUBLIC_NAV.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="text-decoration-none text-dark"
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
          </div>
          
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/akun" className="btn btn-outline-dark btn-sm">AKUN SAYA</Link>
                <button onClick={handleLogout} className="btn btn-dark btn-sm">KELUAR</button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-outline-dark btn-sm">DAFTAR</Link>
                <Link to="/login" className="btn btn-dark btn-sm">MASUK</Link>
              </>
            )}
          </div>
        </div>
        
        {/* ===== CONTENT ===== */}
        <div className="col-12">
          <Outlet /> 
        </div>

        {/* ===== FOOTER ===== */}
        <div className="col-12 p-0">
          <footer className="bg-dark text-white pt-5 pb-3">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <img 
                    src={SITE.logo_toko} 
                    className="rounded-5 mb-3" 
                    style={{width:"auto", height:"40px"}} 
                    alt={SITE.nama_toko} 
                  />
                  <p className="text-white-50" style={{ fontSize: '14px' }}>
                    {SITE.tentang}
                  </p>
                  <hr className="border-secondary" style={{ maxWidth: "300px", margin: "20px auto" }} />
                  <p className="text-white-50 mb-0 small">© 2024 {SITE.nama_toko}. Seluruh hak cipta dilindungi.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
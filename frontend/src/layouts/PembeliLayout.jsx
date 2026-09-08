// frontend/src/layouts/PembeliLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { mediaUrl } from "../utils";

const TITLES = {
  "/akun": "Dashboard",
  "/akun/belanja": "Belanja",
  "/akun/pesanan": "Pesanan Saya",
  "/akun/profil": "Profil Saya",
};

const PEMBELI_NAV = [
  { label: "Dashboard", path: "/akun" },
  { label: "Belanja", path: "/akun/belanja" },
  { label: "Pesanan Saya", path: "/akun/pesanan" },
  { label: "Profil Saya", path: "/akun/profil" },
];

export default function PembeliLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userFoto, setUserFoto] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const title = TITLES[location.pathname] || "Dashboard";

  useEffect(() => {
    let alive = true;
    api
      .getPembeliMe()
      .then((r) => {
        if (!alive) return;
        const p = r.data;
        setUserName(`${p.nama_d || ""} ${p.nama_b || ""}`.trim() || p.uname);
        setUserFoto(p.foto || "");
      })
      .catch((err) => {
        if (alive) {
          console.error("Error fetching user:", err);
          if (err.status === 401 || err.status === 403) {
            logout();
            navigate("/login");
          }
        }
      });
    return () => {
      alive = false;
    };
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex min-vh-100">
      {/* ===== SIDEBAR KIRI ===== */}
      <aside
        className={`text-white ${sidebarOpen ? "d-block" : "d-none d-md-block"}`}
        style={{
          width: "250px",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1050,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2C1810",
        }}
      >
        <button
          className="d-md-none btn btn-light btn-sm position-absolute top-0 end-0 m-2"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="p-3 border-bottom text-center" style={{ borderColor: "#5D4037" }}>
          <div className="mb-2">
            <img
              src={mediaUrl(userFoto)}
              alt="User"
              className="rounded-circle"
              style={{ width: 60, height: 60, objectFit: "cover", border: "2px solid #F5E6D3" }}
            />
          </div>
          <small className="fw-bold d-block" style={{ color: "#F5E6D3" }}>{userName || "Pembeli"}</small>
          <small style={{ fontSize: "11px", color: "#D4C5B2" }}>Area Pembeli</small>
        </div>

        <nav className="px-2 py-3 flex-grow-1">
          {PEMBELI_NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`d-block text-white text-decoration-none py-2 px-3 rounded mb-1 ${
                location.pathname === item.path ? "active" : ""
              }`}
              style={{
                transition: "0.3s",
                backgroundColor: location.pathname === item.path ? "#8B6B4A" : "transparent",
                color: location.pathname === item.path ? "#F5E6D3" : "#D4C5B2",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = "#5D4037";
                  e.currentTarget.style.color = "#F5E6D3";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#D4C5B2";
                }
              }}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-top px-2 py-3 mt-auto" style={{ borderColor: "#5D4037" }}>
          <Link
            to="/"
            className="d-block text-white text-decoration-none py-2 px-3 rounded mb-1"
            style={{
              transition: "0.3s",
              color: "#D4C5B2",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5D4037";
              e.currentTarget.style.color = "#F5E6D3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#D4C5B2";
            }}
            onClick={() => setSidebarOpen(false)}
          >
            Lihat Beranda Toko
          </Link>
          <button
            onClick={handleLogout}
            className="d-block w-100 text-start bg-transparent border-0 py-2 px-3 rounded"
            style={{
              transition: "0.3s",
              color: "#D4C5B2",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5D4037";
              e.currentTarget.style.color = "#F5E6D3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#D4C5B2";
            }}
          >
            Keluar
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-grow-1" style={{ marginLeft: "250px", minHeight: "100vh", backgroundColor: "#FAF6F0" }}>
        <header className="shadow-sm p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#F5EDE6" }}>
          <div className="d-flex align-items-center gap-3">
            <button
              className="d-md-none btn border-0"
              style={{ backgroundColor: "#2C1810", color: "#F5E6D3" }}
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h5 className="fw-bold m-0" style={{ color: "#2C1810" }}>{title}</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small d-none d-sm-inline" style={{ color: "#5D4037" }}>{userName}</span>
            <img
              src={mediaUrl(userFoto)}
              alt="User"
              width={32}
              height={32}
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
// frontend/src/layouts/AdminLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminApi } from "../api";
import { mediaUrl } from "../utils";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/produk": "Kelola Produk",
  "/admin/pembeli": "Kelola Pembeli",
  "/admin/pembelian": "Kelola Pesanan",
  "/admin/artikel": "Kelola Artikel",
  "/admin/profil": "Profil Admin",
};

const ADMIN_NAV = [
  { label: "Dashboard", path: "/admin" },
  { label: "Produk", path: "/admin/produk" },
  { label: "Pembeli", path: "/admin/pembeli" },
  { label: "Pesanan", path: "/admin/pembelian" },
  { label: "Artikel", path: "/admin/artikel" },
  { label: "Profil Saya", path: "/admin/profil" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminFoto, setAdminFoto] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const title = TITLES[location.pathname] || "";

  useEffect(() => {
    let alive = true;
    adminApi
      .getMe()
      .then((r) => {
        if (!alive) return;
        const p = r.data;
        setAdminName(`${p.nama_d || ""} ${p.nama_b || ""}`.trim() || p.uname);
        setAdminFoto(p.foto || "");
      })
      .catch((err) => {
        if (alive) {
          console.error("Error fetching admin:", err);
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

        <div className="p-3 border-bottom" style={{ borderColor: "#5D4037" }}>
          <div className="d-flex align-items-center">
            <img 
              src="/logo.png"
              alt="Logo Cindy Rajut"
              style={{ width: "40px", height: "40px", objectFit: "contain", marginRight: "12px" }}
            />
            <small className="fs-5" style={{ fontFamily: "Times New Roman, serif", color: "#F5E6D3" }}>
              Cindy Rajut
            </small>
          </div>
        </div>

        <nav className="px-2 py-3 flex-grow-1">
          {ADMIN_NAV.map((item) => (
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

        <div className="border-top px-2 py-3" style={{ borderColor: "#5D4037" }}>
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
            Lihat Beranda
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

      <main className="flex-grow-1" style={{ marginLeft: "250px", backgroundColor: "#FAF6F0" }}>
        <header className="shadow-sm p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#F5EDE6" }}>
          <div className="d-flex align-items-center gap-3">
            <button
              className="d-md-none btn border-0"
              style={{ backgroundColor: "#2C1810", color: "#F5E6D3" }}
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h5 className="fw-bold m-0 fs-3" style={{ fontFamily: "Times New Roman, serif", color: "#2C1810" }}>
              {title}
            </h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <img
              src={mediaUrl(adminFoto)}
              alt="Admin"
              width={32}
              height={32}
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
            <span className="small d-none d-sm-inline" style={{ color: "#5D4037" }}>{adminName}</span>
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 
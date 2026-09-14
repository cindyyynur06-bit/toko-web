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

  const COLORS = {
    dark: "#3B1F1C",
    cream: "#E8DDD3",
    soft: "#B8A398",
    pink: "#E8A0A8",
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* ===== HEADER / NAVBAR ===== */}
        <div
          className="col-12 d-flex align-items-center justify-content-between"
          style={{
            height: "70px",
            padding: "0 30px",
            backgroundColor: COLORS.dark,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <img
              src={SITE.logo_toko}
              style={{ width: "auto", height: "40px" }}
              alt={SITE.nama_toko}
            />
            <span
              className="fw-bold"
              style={{ fontSize: "18px", color: COLORS.cream }}
            >
              {SITE.nama_toko}
            </span>
          </div>

          <div className="d-flex gap-4">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-decoration-none"
                style={{ fontSize: "14px", fontWeight: "500", color: COLORS.cream }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.cream)}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/akun"
                  className="btn btn-sm"
                  style={{
                    border: `1px solid ${COLORS.cream}`,
                    color: COLORS.cream,
                    backgroundColor: "transparent",
                  }}
                >
                  AKUN SAYA
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: COLORS.cream,
                    color: COLORS.dark,
                    border: `1px solid ${COLORS.cream}`,
                  }}
                >
                  KELUAR
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn btn-sm"
                  style={{
                    border: `1px solid ${COLORS.cream}`,
                    color: COLORS.cream,
                    backgroundColor: "transparent",
                  }}
                >
                  DAFTAR
                </Link>
                <Link
                  to="/login"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: COLORS.cream,
                    color: COLORS.dark,
                    border: `1px solid ${COLORS.cream}`,
                  }}
                >
                  MASUK
                </Link>
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
          <footer style={{ backgroundColor: COLORS.dark }} className="pt-5 pb-3">
            <div className="container">
              <div className="row gy-4">
                {/* Kolom 1: Brand + Deskripsi */}
                <div className="col-12 col-md-5">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <img
                      src={SITE.logo_toko}
                      style={{ width: "auto", height: "40px" }}
                      alt={SITE.nama_toko}
                    />
                    <span
                      className="fw-bold"
                      style={{
                        color: COLORS.cream,
                        fontFamily: "Georgia, serif",
                        fontSize: "18px",
                        letterSpacing: "1px",
                      }}
                    >
                      CINDY RAJUT
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: COLORS.soft,
                      lineHeight: "1.8",
                      maxWidth: "380px",
                    }}
                  >
                    Di Cindy Rajut, setiap rajutan dibuat dengan cinta dan
                    ketelitian. Kami menghadirkan pakaian, tas, mainan, hingga
                    aksesoris buatan tangan (handmade) yang membawa kehangatan
                    dan sentuhan estetik di setiap momenmu.
                  </p>
                </div>

                {/* Kolom 2: Navigasi */}
                <div className="col-6 col-md-3">
                  <h6
                    className="fw-bold mb-3"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "1px",
                      color: COLORS.pink,
                      textTransform: "uppercase",
                    }}
                  >
                    Navigasi
                  </h6>
                  <ul className="list-unstyled">
                    {PUBLIC_NAV.map((item) => (
                      <li key={item.to} className="mb-2">
                        <Link
                          to={item.to}
                          className="text-decoration-none"
                          style={{ fontSize: "13px", color: COLORS.cream }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = COLORS.pink)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = COLORS.cream)
                          }
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolom 3: Informasi Kontak */}
                <div className="col-6 col-md-4">
                  <h6
                    className="fw-bold mb-3"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "1px",
                      color: COLORS.pink,
                      textTransform: "uppercase",
                    }}
                  >
                    Informasi Kontak
                  </h6>
                  <ul className="list-unstyled" style={{ fontSize: "13px" }}>
                    <li
                      className="mb-3 d-flex align-items-center gap-2"
                      style={{ color: COLORS.cream }}
                    >
                      <i
                        className="bi bi-geo-alt-fill"
                        style={{ color: COLORS.pink }}
                      ></i>
                      <span>Jl. Merdeka, No.10 Ponorogo</span>
                    </li>
                    <li
                      className="mb-3 d-flex align-items-center gap-2"
                      style={{ color: COLORS.cream }}
                    >
                      <i
                        className="bi bi-envelope-fill"
                        style={{ color: COLORS.pink }}
                      ></i>
                      <span>admin@cindyrajut.my.id</span>
                    </li>
                    <li
                      className="mb-3 d-flex align-items-center gap-2"
                      style={{ color: COLORS.cream }}
                    >
                      <i
                        className="bi bi-telephone-fill"
                        style={{ color: COLORS.pink }}
                      ></i>
                      <span>621234567890</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Garis pemisah */}
              <hr
                className="my-4"
                style={{ borderColor: "rgba(232,221,211,0.15)" }}
              />

              {/* Copyright */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                <p
                  className="mb-0"
                  style={{
                    fontSize: "12px",
                    color: "rgba(232,221,211,0.5)",
                  }}
                >
                  © 2026 CINDY RAJUT. Seluruh hak cipta dilindungi.
                </p>
                <p
                  className="mb-0"
                  style={{
                    fontSize: "12px",
                    color: "rgba(232,221,211,0.5)",
                  }}
                >
                  Handcrafted with{" "}
                  <i className="bi bi-heart-fill" style={{ color: COLORS.pink }}></i>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
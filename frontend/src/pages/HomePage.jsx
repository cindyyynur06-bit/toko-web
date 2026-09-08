// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import ArtikelCard from "../components/ArtikelCard";
import { KATEGORI_DETAIL, SITE } from "../constants";
import { mediaUrl, onImgError } from "../utils";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [produk, setProduk] = useState([]);
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkRes, artikelRes] = await Promise.all([api.getProduk(), api.getArtikel()]);
        setProduk(produkRes.data || []);
        setArtikel(artikelRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBelanja = () => {
    if (isAuthenticated) navigate("/akun/belanja");
    else navigate("/login");
  };

  const handleCategoryClick = (namaKategori) => {
    navigate(`/toko?kategori=${encodeURIComponent(namaKategori)}`);
  };

  const getLatestProducts = () =>
    [...produk]
      .sort((a, b) => (b.id_produk || b.id || 0) - (a.id_produk || a.id || 0))
      .slice(0, 3);

  const getLatestArticles = () =>
    [...artikel].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);

  const latestProducts = getLatestProducts();
  const latestArticles = getLatestArticles();

  return (
    <div className="container-fluid px-0">

      {/* ===== HERO SECTION ===== */}
      <div className="row" style={{ height: "630px" }}>
        <div className="col-6" style={{ padding: "80px 0" }}>
          <small className="fw-medium ms-5" style={{ letterSpacing: "3px", color: "#8B6B4A" }}>
            {SITE.nama_toko}
          </small>
          <p className="display-3 ms-5" style={{ fontFamily: "times-new-roman", color: "#2C1810" }}>
            Kehangatan di Setiap Rajutan
          </p>
          <p className="ms-5 mb-4" style={{ maxWidth: "450px", color: "#5D4037" }}>
            {SITE.tentang}
          </p>
          <div className="d-flex gap-3">
            <button onClick={handleBelanja} className="btn ms-5" style={{ backgroundColor: "#2C1810", color: "#F5E6D3", border: "none", padding: "10px 30px", borderRadius: "30px" }}>
              BELANJA SEKARANG
            </button>
            {!isAuthenticated && (
              <Link to="/register" className="btn" style={{ backgroundColor: "transparent", color: "#2C1810", border: "2px solid #2C1810", padding: "10px 30px", borderRadius: "30px" }}>
                DAFTAR PEMBELI
              </Link>
            )}
          </div>
        </div>

        <div className="col-6" style={{ padding: "55px 200px" }}>
          <img src={SITE.foto_banner} style={{ width: "auto", height: "440px" }} alt="Hero" />
        </div>
      </div>

      {/* ===== KATEGORI - 4 KOLOM ===== */}
      <div className="ms-5">
        <p className="fw-medium" style={{ letterSpacing: "3px", color: "#8B6B4A" }}>KATEGORI</p>
        <p className="display-4" style={{ fontFamily: "times-new-roman", color: "#2C1810" }}>Kategori</p>
      </div>

      <section className="px-3">
        <div className="row g-3">
          {KATEGORI_DETAIL.map((cat) => (
            <div key={cat.id} className="col-lg-3 col-md-6 col-sm-6">
              <div
                className="card h-100 border-0 shadow-sm"
                onClick={() => handleCategoryClick(cat.nama)}
                style={{ cursor: "pointer", borderRadius: "12px", overflow: "hidden", backgroundColor: "#FAF6F0" }}
              >
                <img
                  src={mediaUrl(cat.gambar)}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                  alt={cat.nama}
                  onError={onImgError}
                />
                <div className="card-body d-flex flex-column p-3">
                  <h5 className="card-title fw-bold" style={{ fontSize: "16px", color: "#2C1810" }}>{cat.nama}</h5>
                  <p className="card-text flex-grow-1" style={{ fontSize: "13px", color: "#5D4037" }}>{cat.deskripsi}</p>
                  <div className="fw-bold mt-2" style={{ fontSize: "13px", color: "#8B6B4A" }}>
                    LIHAT KOLEKSI &rarr;
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUK TERBARU ===== */}
      <div className="pt-5 ms-5">
        <p className="fw-medium mb-0" style={{ letterSpacing: "3px", color: "#8B6B4A" }}>UNGGULAN</p>
        <p className="display-4 mt-0" style={{ fontFamily: "times-new-roman", color: "#2C1810" }}>Produk Terbaru</p>
      </div>

      <section className="px-5 mt-4">
        {loading ? (
          <p className="text-center" style={{ color: "#5D4037" }}>Loading produk...</p>
        ) : latestProducts.length === 0 ? (
          <p className="text-center" style={{ color: "#5D4037" }}>Belum ada produk</p>
        ) : (
          <div className="row g-4">
            {latestProducts.map((item) => (
              <ProductCard key={item.id_produk || item.id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* ===== ARTIKEL TERBARU ===== */}
      <section className="px-5 mt-5 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="fw-medium mb-0" style={{ letterSpacing: "3px", color: "#8B6B4A" }}>BLOG</p>
            <h3 className="display-4" style={{ fontFamily: "times-new-roman", color: "#2C1810" }}>Artikel Terbaru</h3>
          </div>
          <Link to="/artikel" className="btn btn-sm" style={{ backgroundColor: "transparent", color: "#2C1810", border: "1px solid #2C1810" }}>
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <p className="text-center" style={{ color: "#5D4037" }}>Loading artikel...</p>
        ) : latestArticles.length === 0 ? (
          <p className="text-center" style={{ color: "#5D4037" }}>Belum ada artikel</p>
        ) : (
          <div className="row g-4">
            {latestArticles.map((item) => (
              <ArtikelCard key={item.id || item.artikel_id} artikel={item} showButton={false} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
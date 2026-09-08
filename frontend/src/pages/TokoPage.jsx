// frontend/src/pages/TokoPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import { KATEGORI_PRODUK } from "../constants";

export default function TokoPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kataKunci, setKataKunci] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const kategoriAktif = searchParams.get("kategori") || "Semua";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getProduk();
        setProduk(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const produkTampil = useMemo(() => {
    let hasil = produk;
    if (kategoriAktif !== "Semua") {
      hasil = hasil.filter((p) => p.kategori === kategoriAktif);
    }
    if (kataKunci) {
      hasil = hasil.filter((p) => p.nama_produk.toLowerCase().includes(kataKunci.toLowerCase()));
    }
    return hasil;
  }, [produk, kategoriAktif, kataKunci]);

  const handleSelectKategori = (namaKategori) => {
    if (namaKategori === "Semua") {
      setSearchParams({});
    } else {
      setSearchParams({ kategori: namaKategori });
    }
  };

  return (
    <div className="container py-4">

      {/* BACK BUTTON */}
      <div className="mb-3">
        <Link to="/" className="text-decoration-none" style={{ color: "#8B6B4A" }}>
          <span style={{ fontSize: "14px" }}>← Kembali ke Beranda</span>
        </Link>
      </div>

      {/* HEADER */}
      <div className="mb-4">
        <p className="text-uppercase fw-bold mb-0" style={{ letterSpacing: "4px", fontSize: "13px", color: "#8B6B4A" }}>
          KATALOG
        </p>
        <h1 className="fw-bold" style={{ fontFamily: "times-new-roman", fontSize: "42px", color: "#2C1810" }}>
          Toko
        </h1>
      </div>

      {/* SEARCH & FILTER */}
      <div className="mb-4 d-flex align-items-center gap-3 flex-wrap">
        <input 
          type="text" 
          placeholder="Cari produk..." 
          value={kataKunci} 
          onChange={(e) => setKataKunci(e.target.value)} 
          className="form-control rounded-pill" 
          style={{ width: "250px", borderColor: "#8B6B4A", padding: "10px 18px" }}
        />

        <div className="d-flex gap-2 flex-wrap">
          <button 
            className={`btn btn-sm rounded-pill px-3 ${kategoriAktif === "Semua" ? "btn-dark" : "btn-outline-dark"}`} 
            style={kategoriAktif === "Semua" ? { backgroundColor: "#2C1810", color: "#F5E6D3", border: "none" } : { color: "#2C1810", borderColor: "#2C1810" }}
            onClick={() => handleSelectKategori("Semua")}
          >
            Semua
          </button>

          {KATEGORI_PRODUK.map((kategori) => (
            <button 
              key={kategori} 
              className={`btn btn-sm rounded-pill px-3 ${kategoriAktif === kategori ? "btn-dark" : "btn-outline-dark"}`}
              style={kategoriAktif === kategori ? { backgroundColor: "#8B6B4A", color: "#F5E6D3", border: "none" } : { color: "#2C1810", borderColor: "#2C1810" }}
              onClick={() => handleSelectKategori(kategori)}
            >
              {kategori}
            </button>
          ))}
        </div>
      </div>

      {/* GRID PRODUK */}
      <section className="mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: "#8B6B4A" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2" style={{ color: "#5D4037" }}>Memuat produk...</p>
          </div>
        ) : produkTampil.length === 0 ? (
          <p className="text-center py-5" style={{ color: "#5D4037" }}>Belum ada produk yang cocok</p>
        ) : (
          <div className="row g-4">
            {produkTampil.map((item) => (
              <ProductCard key={item.id_produk} product={item} />  // ← HAPUS PEMBUNGKUS col
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
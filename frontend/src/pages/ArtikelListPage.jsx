// frontend/src/pages/ArtikelListPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import ArtikelCard from "../components/ArtikelCard";

export default function ArtikelListPage() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getArtikel();
        setArtikel(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal memuat artikel. Periksa koneksi atau backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          BLOG
        </p>
        <h1 className="fw-bold" style={{ fontFamily: "times-new-roman", fontSize: "42px", color: "#2C1810" }}>
          Artikel
        </h1>
      </div>

      {/* GRID ARTIKEL */}
      <section className="mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: "#8B6B4A" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2" style={{ color: "#5D4037" }}>Memuat artikel...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger">{error}</p>
          </div>
        ) : artikel.length === 0 ? (
          <p className="text-center py-5" style={{ color: "#5D4037" }}>Belum ada artikel</p>
        ) : (
          <div className="row g-4">
            {artikel.map((item) => (
              <ArtikelCard key={item.id} artikel={item} showButton={true} />  // ← TANPA PEMBUNGKUS
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
// frontend/src/pages/ArtikelDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { formatTanggal, mediaUrl, onImgError } from "../utils";

export default function ArtikelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArtikel();
  }, [id]);

  const fetchArtikel = async () => {
    setLoading(true);
    try {
      const res = await api.getArtikelById(id);
      setArtikel(res.data || res);
    } catch (err) {
      console.error("Error fetching artikel:", err);
      setError(err.body?.message || err.message || "Artikel tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading artikel...</p>
      </div>
    );
  }

  if (error || !artikel) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "Artikel tidak ditemukan"}</div>
        <Link to="/artikel" className="btn btn-dark">Kembali ke Artikel</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          {/* Back Button - HANYA 1 DI ATAS */}
          <Link to="/artikel" className="text-decoration-none text-dark">
            <span style={{ fontSize: "14px" }}>← Kembali ke Artikel</span>
          </Link>

          {/* Content */}
          <div className="mt-4">
            {artikel.gambar && (
              <img
                src={mediaUrl(artikel.gambar)}
                alt={artikel.judul}
                className="rounded mb-4"
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                onError={onImgError}
              />
            )}

            <h1 className="fw-bold" style={{ fontSize: "2.5rem" }}>{artikel.judul}</h1>
            <p className="text-secondary">{formatTanggal(artikel.created_at)}</p>

            <div className="mt-4">
              <h5 className="fw-bold">Ringkasan</h5>
              <p className="text-secondary" style={{ fontSize: "1.1rem" }}>
                {artikel.ringkasan}
              </p>
              
              <hr className="my-4" />
              
              <h5 className="fw-bold">Isi Artikel</h5>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", fontSize: "1.05rem" }}>
                {artikel.isi}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
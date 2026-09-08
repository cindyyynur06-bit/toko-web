// frontend/src/pages/admin/AdminArtikelDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api";
import { formatTanggal, mediaUrl, onImgError } from "../../utils";

export default function AdminArtikelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = () => {
    setLoading(true);
    adminApi
      .getArtikelById(id)
      .then((res) => {
        setArtikel(res.data || res);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching detail:", err);
        setError(err.body?.message || "Gagal memuat detail artikel");
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">{error}</div>
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={() => navigate("/admin/artikel")}
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning">Data tidak ditemukan</div>
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={() => navigate("/admin/artikel")}
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* ===== HEADER ===== */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Detail Artikel</h5>
            <button 
              onClick={() => navigate("/admin/artikel")} 
              className="btn btn-outline-secondary btn-sm"
            >
              ← Kembali
            </button>
          </div>

          {/* ===== CONTENT ===== */}
          <div className="bg-white rounded shadow-sm p-4">
            {/* Gambar */}
            {artikel.gambar && (
              <div className="text-center mb-4">
                <img
                  src={mediaUrl(artikel.gambar)}
                  alt={artikel.judul}
                  className="rounded"
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                  onError={onImgError}
                />
              </div>
            )}

            {/* Judul */}
            <h2 className="fw-bold mb-3">{artikel.judul}</h2>

            {/* Tanggal */}
            <p className="text-secondary small mb-3">
              <strong>Dibuat:</strong> {formatTanggal(artikel.created_at)}
            </p>

            {/* Ringkasan */}
            <div className="mb-4">
              <h6 className="fw-bold">Ringkasan</h6>
              <p className="text-secondary">{artikel.ringkasan}</p>
            </div>

            {/* Isi */}
            <div>
              <h6 className="fw-bold">Isi Artikel</h6>
              <div className="text-secondary" style={{ whiteSpace: "pre-wrap" }}>
                {artikel.isi}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
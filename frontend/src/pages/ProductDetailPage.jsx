// frontend/src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // ✅ PASTIKAN Link DIIMPORT
import { api } from "../api";
import { formatRupiah, mediaUrl, onImgError } from "../utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ProductDetailPage - ID:", id);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.getProdukById(id);
      console.log("Product response:", res);
      setProduct(res.data || res);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.body?.message || err.message || "Produk tidak ditemukan");
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
        <p className="mt-3">Loading produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "Produk tidak ditemukan"}</div>
        <Link to="/toko" className="btn btn-dark">Kembali ke Toko</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to="/toko" className="btn btn-outline-dark mb-4">← Kembali ke Toko</Link>
      
      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={mediaUrl(product.gambar)}
            alt={product.nama_produk}
            className="img-fluid rounded"
            style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
            onError={onImgError}
          />
        </div>
        <div className="col-md-6">
          <p className="text-secondary mb-2" style={{ letterSpacing: "1px" }}>{product.kategori}</p>
          <h1 className="display-5 fw-bold mb-3">{product.nama_produk}</h1>
          <p className="display-6 fw-bold text-dark mb-4">{formatRupiah(product.harga)}</p>
          
          <div className="mb-4">
            <h5>Deskripsi</h5>
            <p className="text-secondary">{product.deskripsi}</p>
          </div>
          
          <div className="d-flex gap-3">
            <button className="btn btn-dark btn-lg flex-fill">
              BELI SEKARANG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
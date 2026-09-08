// frontend/src/components/ProductCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { mediaUrl, formatRupiah } from "../utils";  // ← HAPUS onImgError
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBeli = () => {
    if (isAuthenticated) {
      navigate('/akun/belanja', { state: { buyProduct: product } }); 
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="col-md-4 col-sm-6">
      <div className="card h-100 border-0 shadow-sm" style={{ padding: "16px", borderRadius: "14px" }}>
        <Link to={`/produk/${product.id_produk}`}>
          <img 
            src={mediaUrl(product.gambar)} 
            className="card-img-top" 
            style={{ height: "250px", objectFit: "cover", borderRadius: "12px", cursor: "pointer" }} 
            alt={product.nama_produk} 
            // onError={onImgError}  ← HAPUS BARIS INI
          />
        </Link>
        <div className="card-body d-flex flex-column p-3">
          <p className="text-secondary mb-1" style={{ fontSize: "13px", letterSpacing: "1px" }}>{product.kategori}</p>
          <h5 className="card-title fw-bold" style={{ fontSize: "18px" }}>{product.nama_produk}</h5>
          <p className="fw-bold" style={{ fontSize: "18px", color: "#2c3e50" }}>{formatRupiah(product.harga)}</p>
          <div className="d-flex gap-2 mt-auto" style={{ fontSize: "13px" }}>
            <Link to={`/produk/${product.id_produk}`} className="btn btn-outline-dark btn-sm flex-fill" style={{ padding: "8px 14px" }}>DETAIL</Link>
            <button onClick={handleBeli} className="btn btn-dark btn-sm flex-fill" style={{ padding: "8px 14px" }}>BELI</button>
          </div>
        </div>
      </div>
    </div>
  );
}
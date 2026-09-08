// frontend/src/pages/admin/AdminProdukDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api";
import { formatRupiah, mediaUrl, formatTanggal, onImgError } from "../../utils";

export default function AdminProdukDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await adminApi.getProdukById(id);
        console.log("Response produk:", res);
        
        const p = res.data || res;
        console.log("Data produk:", p);
        
        if (p && (p.id_produk || p.id)) {
          setProduk(p);
        } else {
          setError("Data produk tidak valid");
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        setError(err.message || "Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await adminApi.deleteProduk(id);
      navigate("/admin/produk");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus produk");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Memuat detail produk...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="text-danger mb-3">{error}</div>
        <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm">
          Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  if (!produk) {
    return <div className="text-center py-5">Produk tidak ditemukan</div>;
  }

  const idProduk = produk.id_produk || produk.id;

  console.log("Gambar path:", produk.gambar);
  console.log("Media URL:", mediaUrl(produk.gambar));

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Detail Produk</h5>
        <div className="d-flex gap-2">
          <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm">
            Kembali
          </Link>
          <Link to={`/admin/produk/edit/${idProduk}`} className="btn btn-primary btn-sm">
            Ubah
          </Link>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            Hapus
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-2 shadow-sm text-center">
            {produk.gambar ? (
              <img
                src={mediaUrl(produk.gambar)}
                alt={produk.nama_produk || "Gambar Produk"}
                className="img-fluid rounded"
                style={{ width: "100%", maxHeight: "320px", objectFit: "cover" }}
                onError={onImgError}
              />
            ) : (
              <div className="py-5 text-secondary">
                <p>Tidak ada gambar</p>
              </div>
            )}
            <small className="text-muted mt-1">
              Path: {produk.gambar || "Tidak ada gambar"}
            </small>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <table className="table table-bordered mb-0">
              <tbody>
                <tr>
                  <th style={{ width: "160px" }} className="bg-light">Nama Produk</th>
                  <td>{produk.nama_produk}</td>
                </tr>
                <tr>
                  <th className="bg-light">Kategori</th>
                  <td>{produk.kategori || "-"}</td>
                </tr>
                <tr>
                  <th className="bg-light">Harga</th>
                  <td className="fw-bold text-success">{formatRupiah(produk.harga)}</td>
                </tr>
                <tr>
                  <th className="bg-light">Deskripsi</th>
                  <td style={{ whiteSpace: "pre-line" }}>{produk.deskripsi || "-"}</td>
                </tr>
                {produk.created_at && (
                  <tr>
                    <th className="bg-light">Dibuat</th>
                    <td>{formatTanggal(produk.created_at)}</td>
                  </tr>
                )}
                {produk.updated_at && (
                  <tr>
                    <th className="bg-light">Diperbarui</th>
                    <td>{formatTanggal(produk.updated_at)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
// frontend/src/components/ArtikelCard.jsx
import { Link } from "react-router-dom";
import { mediaUrl, formatTanggal } from "../utils";

export default function ArtikelCard({ artikel, showButton = false }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "12px" }}>
        <Link to={`/artikel/${artikel.id}`} className="text-decoration-none text-dark">
          <img
            src={mediaUrl(artikel.gambar)}
            alt={artikel.judul}
            className="card-img-top"
            style={{ height: "160px", width: "100%", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
          />
        </Link>

        <div className="card-body">
          <p className="text-secondary mb-1" style={{ fontSize: "12px" }}>
            {formatTanggal(artikel.created_at)}
          </p>
          <h5 className="card-title fw-bold">
            <Link to={`/artikel/${artikel.id}`} className="text-decoration-none text-dark">
              {artikel.judul}
            </Link>
          </h5>
          <p className="card-text text-secondary">{artikel.ringkasan}</p>

          {showButton ? (
            <Link to={`/artikel/${artikel.id}`} className="btn btn-dark btn-sm mt-2">
              Baca
            </Link>
          ) : (
            <Link to={`/artikel/${artikel.id}`} className="text-dark fw-bold text-decoration-none mt-2" style={{ fontSize: "13px" }}>
              BACA SELENGKAPNYA &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
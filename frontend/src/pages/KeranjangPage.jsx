// frontend/src/pages/KeranjangPage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mediaUrl, formatRupiah, onImgError } from "../utils";

export default function KeranjangPage() {
  const {
    cart,
    removeFromCart,
    updateQty,
    clearCart,
    totalHarga,
    totalItem,
  } = useAuth();

  const handleCheckoutWA = () => {
    const noAdmin = "621234567890"; // ganti sesuai nomor admin
    const pesan =
      `Halo, saya mau pesan:%0A%0A` +
      cart
        .map((i) => `- ${i.nama_produk} (${i.qty}x) = ${formatRupiah(i.harga * i.qty)}`)
        .join("%0A") +
      `%0A%0A*Total: ${formatRupiah(totalHarga)}*`;
    window.open(`https://wa.me/${noAdmin}?text=${pesan}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x" style={{ fontSize: "80px", color: "#B8A398" }}></i>
        <h3 className="mt-3" style={{ fontFamily: "Georgia, serif", color: "#2C1810" }}>
          Keranjang masih kosong
        </h3>
        <p style={{ color: "#5D4037" }}>Yuk, pilih rajutan favoritmu dulu ✨</p>
        <Link
          to="/toko"
          className="btn mt-3"
          style={{ backgroundColor: "#2C1810", color: "#F5E6D3", borderRadius: "30px", padding: "10px 30px" }}
        >
          MULAI BELANJA
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <p className="text-uppercase fw-bold mb-0" style={{ letterSpacing: "4px", fontSize: "13px", color: "#8B6B4A" }}>
          KERANJANG
        </p>
        <h1 className="fw-bold" style={{ fontFamily: "Georgia, serif", fontSize: "42px", color: "#2C1810" }}>
          Keranjang Belanja
        </h1>
        <p style={{ color: "#5D4037" }}>{totalItem} item di keranjang</p>
      </div>

      <div className="row g-4">
        {/* LIST ITEM */}
        <div className="col-lg-8">
          {cart.map((item) => {
            const id = item.id_produk || item.id;
            return (
              <div key={id} className="card mb-3 border-0 shadow-sm" style={{ borderRadius: "14px" }}>
                <div className="card-body d-flex gap-3 align-items-center flex-wrap">
                  <img
                    src={mediaUrl(item.gambar)}
                    alt={item.nama_produk}
                    onError={onImgError}
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "10px" }}
                  />
                  <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                    <p className="mb-1" style={{ fontSize: "12px", color: "#8B6B4A", letterSpacing: "1px" }}>
                      {item.kategori}
                    </p>
                    <h6 className="fw-bold mb-1" style={{ color: "#2C1810" }}>{item.nama_produk}</h6>
                    <p className="mb-0 fw-bold" style={{ color: "#2C1810" }}>{formatRupiah(item.harga)}</p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-dark" style={{ width: "32px", height: "32px", padding: 0 }} onClick={() => updateQty(id, item.qty - 1)}>−</button>
                    <span className="fw-bold" style={{ minWidth: "24px", textAlign: "center" }}>{item.qty}</span>
                    <button className="btn btn-sm btn-outline-dark" style={{ width: "32px", height: "32px", padding: 0 }} onClick={() => updateQty(id, item.qty + 1)}>+</button>
                  </div>

                  <div className="text-end" style={{ minWidth: "120px" }}>
                    <p className="fw-bold mb-1" style={{ color: "#2C1810" }}>{formatRupiah(item.harga * item.qty)}</p>
                    <button className="btn btn-sm btn-link text-danger p-0" style={{ fontSize: "12px" }} onClick={() => removeFromCart(id)}>Hapus</button>
                  </div>
                </div>
              </div>
            );
          })}

          <button className="btn btn-sm btn-link text-secondary p-0" onClick={clearCart}>
            Kosongkan keranjang
          </button>
        </div>

        {/* RINGKASAN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "14px", backgroundColor: "#FAF6F0" }}>
            <h5 className="fw-bold mb-3" style={{ color: "#2C1810", fontFamily: "Georgia, serif" }}>Ringkasan</h5>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: "#5D4037" }}>Total Item</span>
              <span className="fw-bold">{totalItem}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold" style={{ color: "#2C1810" }}>Total</span>
              <span className="fw-bold" style={{ color: "#2C1810", fontSize: "18px" }}>{formatRupiah(totalHarga)}</span>
            </div>
            <button className="btn w-100" style={{ backgroundColor: "#2C1810", color: "#F5E6D3", borderRadius: "30px", padding: "12px" }} onClick={handleCheckoutWA}>
              CHECKOUT VIA WHATSAPP
            </button>
            <Link to="/toko" className="btn w-100 mt-2" style={{ border: "1px solid #2C1810", color: "#2C1810", borderRadius: "30px" }}>
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
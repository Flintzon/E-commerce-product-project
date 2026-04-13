// ===== KONFIGURASI =====
const WHATSAPP_NUMBER = "6281234567890"; // ganti nomor kamu

// ===== FUNGSI FORMAT RUPIAH =====
function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(n || 0));
}

// ===== AMBIL DATA KERANJANG =====
function getCartData() {
  try {
    return JSON.parse(localStorage.getItem("lm_cart")) || {};
  } catch {
    return {};
  }
}

// ===== CHECKOUT KE WHATSAPP =====
function checkoutToWhatsApp() {
  const cart = getCartData();
  const items = Object.values(cart);

  if (!items.length) {
    alert("Keranjang kosong!");
    return;
  }

  let message = "Halo, saya ingin memesan:%0A%0A";

  let subtotal = 0;
  let totalItem = 0;

  items.forEach((item, index) => {
    const itemTotal = item.price * item.qty;

    subtotal += itemTotal;
    totalItem += item.qty;

    message += `${index + 1}. ${item.name}%0A`;
    message += `   Jumlah: ${item.qty}%0A`;
    message += `   Harga: ${formatRupiah(item.price)}%0A`;
    message += `   Subtotal: ${formatRupiah(itemTotal)}%0A%0A`;
  });

  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;

  message += `Total Item: ${totalItem}%0A`;
  message += `Subtotal: ${formatRupiah(subtotal)}%0A`;
  message += `Pajak (10%): ${formatRupiah(tax)}%0A`;
  message += `Grand Total: ${formatRupiah(grandTotal)}%0A%0A`;
  message += "Terima kasih 🙏";

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank");
}

// ===== HUBUNGKAN KE TOMBOL =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("checkoutBtn");

  if (btn) {
    btn.addEventListener("click", checkoutToWhatsApp);
  }
});

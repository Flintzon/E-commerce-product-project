// ===== KONFIGURASI =====
const WHATSAPP_NUMBER = "6281266990566"; 
const API_URL = "https://script.google.com/macros/s/AKfycbyGOIpbJsVomEjnrZWkgJ5ZWtEIhsRxdZygdwc23droXFRna9z3l9oQcoibnQU5RTbVjQ/exec"; // ganti punyamu

// ===== FORMAT RUPIAH =====
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

// ===== KIRIM KE DATABASE =====
async function sendToDatabase(items, total) {
  const data = {
    nama: "Customer",
    produk: items.map(i => `${i.name} (${i.qty})`).join(", "),
    jumlah: items.reduce((s, i) => s + i.qty, 0),
    total: total
  };

  try {
 await fetch(API_URL, {
  method: "POST",
  mode: "no-cors", // 🔥 WAJIB
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});
  } catch (err) {
    console.error("Gagal kirim database", err);
  }
}

// ===== CHECKOUT =====
async function checkoutToWhatsApp() {
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
    message += `Jumlah: ${item.qty}%0A`;
    message += `Harga: ${formatRupiah(item.price)}%0A`;
    message += `Subtotal: ${formatRupiah(itemTotal)}%0A%0A`;
  });

  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;

  message += `Total Item: ${totalItem}%0A`;
  message += `Grand Total: ${formatRupiah(grandTotal)}%0A%0A`;
  message += "Terima kasih !";

  // 🔥 kirim ke Google Sheets
  await sendToDatabase(items, grandTotal);

  // 🔥 buka WhatsApp
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank");

  // 🔥 kosongkan keranjang
  localStorage.removeItem("lm_cart");
}

// ===== EVENT =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("checkoutBtn");

  if (btn) {
    btn.addEventListener("click", checkoutToWhatsApp);
  }
});

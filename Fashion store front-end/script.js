/* ==========================================================
   [1] KONSTANTA & DATA MASTER
   Digunakan sebagai referensi data di seluruh aplikasi.
   ========================================================== */

// Kunci unik untuk penyimpanan LocalStorage agar tidak bentrok
const STORAGE_KEYS = {
  likes: "lm_likes",
  cart: "lm_cart",
  comments: "lm_comments"
};

// Daftar produk statis yang akan ditampilkan di katalog
const PRODUCTS = [
  {
    id: 1,
    name: "Luxury Powder Palette",
    description: "Palet bedak wajah eksklusif dengan hasil akhir natural untuk riasan yang sempurna.",
    price: 749000,
    category: "beauty",
    image: "img/2.avif"
  },
  {
    id: 2,
    name: "Signature Artisan Perfume",
    description: "Wewangian premium dengan aroma botani yang elegan dan tahan lama sepanjang hari.",
    price: 629000,
    category: "fragrance",
    image: "img/3.avif"
  },
  {
    id: 3,
    name: "Bioglow Skin Revitalize",
    description: "Krim perawatan wajah yang diformulasikan untuk mencerahkan dan menghidrasi kulit secara maksimal.",
    price: 459000,
    category: "skincare",
    image: "img/4.avif"
  },
  {
    id: 4,
    name: "Lumin Charcoal Cleanser Set",
    description: "Rangkaian pembersih wajah pria dengan kandungan charcoal untuk kulit bersih dan segar.",
    price: 389000,
    category: "grooming",
    image: "img/5.avif"
  },
  {
    id: 5,
    name: "Complete Botanical Skincare",
    description: "Set lengkap perawatan kulit berbasis bahan alami untuk menutrisi kulit dari dalam.",
    price: 529000,
    category: "skincare",
    image: "img/6.avif"
  },
  {
    id: 6,
    name: "Curology Custom Formula",
    description: "Serum perawatan wajah khusus yang dirancang untuk mengatasi masalah kulit secara spesifik.",
    price: 899000,
    category: "skincare",
    image: "img/7.avif"
  }
];

// Objek untuk menampung referensi elemen HTML (DOM) berdasarkan ID
const els = {
  productGrid: document.getElementById("productGrid"), // Grid utama produk
  homeProductGrid: document.getElementById("homeProductGrid"), // Grid produk di beranda
  cartList: document.getElementById("cartList"), // Daftar belanja di sidebar/modal
  cartItems: document.getElementById("cartItems"), // Daftar belanja di halaman keranjang
  cartPreview: document.getElementById("cartPreview"), // Ringkasan kecil keranjang
  cartCount: document.getElementById("cartCount"), // Badge jumlah item di navbar
  summaryItems: document.getElementById("summaryItems"), // Total qty di ringkasan
  summaryTotal: document.getElementById("summaryTotal"), // Total harga di ringkasan
  subtotal: document.getElementById("subtotal"), // Harga sebelum pajak
  tax: document.getElementById("tax"), // Nilai pajak
  total: document.getElementById("total"), // Harga akhir (Grand total)
  likeTotal: document.getElementById("likeTotal"), // Total semua like di statistik
  searchInput: document.getElementById("searchInput"), // Input cari produk
  filterCategory: document.getElementById("filterCategory"), // Dropdown kategori
  clearCart: document.getElementById("clearCart"), // Tombol hapus semua keranjang
  checkoutBtn: document.getElementById("checkoutBtn"), // Tombol proses bayar
  commentText: document.getElementById("commentText"), // Area ketik komentar
  commentImage: document.getElementById("commentImage"), // Input upload foto komentar
  postComment: document.getElementById("postComment"), // Tombol kirim komentar cepat
  commentFeed: document.getElementById("commentFeed"), // Wadah daftar komentar
  commentList: document.getElementById("commentList"), // Wadah komentar di halaman khusus
  commentForm: document.getElementById("commentForm"), // Form lengkap komentar
  userName: document.getElementById("userName"), // Input nama pemberi komentar
  starRating: document.getElementById("starRating"), // Wadah bintang rating
  commentRating: document.getElementById("commentRating"), // Input nilai angka rating (hidden)
  homeCommentFeed: document.getElementById("homeCommentFeed") // Wadah komentar di beranda
};

/* ==========================================================
   [2] FUNGSI FORMATTER & KEAMANAN
   ========================================================== */

// Mengubah angka menjadi format mata uang Rupiah
function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n);
}

// Membersihkan teks dari karakter HTML agar tidak terkena serangan XSS
function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

/* ==========================================================
   [3] FUNGSI AKSES LOCAL STORAGE
   Menghubungkan data JavaScript dengan penyimpanan permanen browser.
   ========================================================== */

// Mengambil data Like dari storage (return objek kosong jika tidak ada)
function getLikes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.likes)) || {};
  } catch {
    return {};
  }
}

// Menyimpan perubahan data Like ke storage
function setLikes(likes) {
  localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify(likes));
}

// Mengambil data Keranjang dari storage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || {};
  } catch {
    return {};
  }
}

// Menyimpan perubahan data Keranjang ke storage
function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

// Mengambil komentar (memberikan 1 komentar awal jika storage masih kosong)
function getComments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.comments)) || [
      {
        name: "Alya",
        text: "Desainnya terlihat premium dan cocok untuk katalog fashion modern.",
        rating: 5,
        image: null,
        date: new Date().toISOString()
      }
    ];
  } catch {
    return [];
  }
}

// Menyimpan daftar komentar terbaru ke storage
function setComments(comments) {
  localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments));
}

/* ==========================================================
   [4] LOGIKA DATA & FILTER PRODUK
   ========================================================== */

// Mencari satu objek produk berdasarkan ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

// Menghasilkan daftar produk yang sudah dibubuhi status 'liked' (true/false)
function getProductStateList() {
  const likes = getLikes();
  return PRODUCTS.map(p => ({
    ...p,
    liked: Boolean(likes[p.id])
  }));
}

// Menyaring produk berdasarkan kata kunci pencarian dan kategori yang dipilih
function filteredProducts() {
  const q = (els.searchInput?.value || "").trim().toLowerCase();
  const category = els.filterCategory?.value || "";
  return getProductStateList().filter(p => {
    const matchText =
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchCategory = !category || p.category === category;
    return matchText && matchCategory;
  });
}

/* ==========================================================
   [5] FUNGSI RENDER (MENAMPILKAN KE LAYAR)
   ========================================================== */

// Menampilkan kartu produk ke dalam grid HTML yang ditentukan
function renderProducts(list, target = els.productGrid) {
  if (!target) return; // Jika elemen target tidak ada di halaman ini, batalkan

  target.innerHTML = list.map(product => `
    <article class="product-card" data-name="${escapeHtml(product.name.toLowerCase())}">
      <div class="image-wrapper">
        <img class="product-image" src="${product.image}" alt="${escapeHtml(product.name)}">
        <div class="image-overlay">
          <span>${escapeHtml(product.name)}</span>
        </div>
      </div>
      
      <div class="product-body">
        <h4>${escapeHtml(product.name)}</h4>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-meta">
          <span class="price">${rupiah(product.price)}</span>
          <span>★ <span id="likeCount-${product.id}">${product.liked ? 1 : 0}</span></span>
        </div>
        <div class="action-row">
          <button class="icon-btn ${product.liked ? "active" : ""}" onclick="toggleLike(${product.id})" id="likeBtn-${product.id}">
            ${product.liked ? "Liked" : "Like"}
          </button>
          <button class="icon-btn" onclick="addToCart(${product.id})">Tambah</button>
        </div>
      </div>
    </article>
  `).join("");
}

// Mengelola tampilan keranjang belanja dan kalkulasi total harga
function renderCart() {
  const cart = getCart();
  const entries = Object.values(cart);

  // Render list untuk sidebar/modal keranjang jika ada
  if (els.cartList) {
    if (!entries.length) {
      els.cartList.innerHTML = '<p class="empty-state">Keranjang Anda kosong. Silakan tambahkan produk.</p>';
    } else {
      els.cartList.innerHTML = entries.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${escapeHtml(item.name)}">
          <div>
            <h4>${escapeHtml(item.name)}</h4>
            <p>${rupiah(item.price)} × ${item.qty}</p>
          </div>
          <div class="qty-controls">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <strong>${item.qty}</strong>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join("");
    }
  }

  // Render list untuk halaman utama keranjang jika ada
  if (els.cartItems) {
    if (!entries.length) {
      els.cartItems.innerHTML = '<p class="empty-state">Keranjang Anda kosong. <a href="produk.html">Mulai belanja sekarang</a></p>';
    } else {
      els.cartItems.innerHTML = entries.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${escapeHtml(item.name)}">
          <div>
            <h4>${escapeHtml(item.name)}</h4>
            <p>${rupiah(item.price)} × ${item.qty}</p>
          </div>
          <div class="qty-controls">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <strong>${item.qty}</strong>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join("");
    }
  }

  // Menghitung angka-angka untuk ringkasan belanja
  const itemCount = entries.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxValue = Math.round(subtotal * 0.1); // Pajak 10%
  const total = subtotal + taxValue;

  // Memperbarui teks pada elemen-elemen ringkasan
  if (els.cartCount) els.cartCount.textContent = itemCount;
  if (els.summaryItems) els.summaryItems.textContent = itemCount;
  if (els.summaryTotal) els.summaryTotal.textContent = rupiah(total);
  if (els.subtotal) els.subtotal.textContent = rupiah(subtotal);
  if (els.tax) els.tax.textContent = rupiah(taxValue);
  if (els.total) els.total.textContent = rupiah(total);
  if (els.checkoutBtn) els.checkoutBtn.disabled = itemCount === 0; // Matikan tombol jika kosong
}

// Memperbarui tampilan tombol like dan angka statistik like di layar
function renderLikes() {
  const likes = getLikes();
  const likedCount = Object.values(likes).filter(Boolean).length;

  if (els.likeTotal) els.likeTotal.textContent = likedCount;

  PRODUCTS.forEach(product => {
    const btn = document.getElementById(`likeBtn-${product.id}`);
    const cnt = document.getElementById(`likeCount-${product.id}`);
    const liked = Boolean(likes[product.id]);

    if (btn) {
      btn.textContent = liked ? "Liked" : "Like";
      btn.classList.toggle("active", liked);
    }
    if (cnt) cnt.textContent = liked ? 1 : 0;
  });
}

// Menampilkan daftar komentar dari komunitas
function renderComments(target = els.commentFeed) {
  if (!target) return;

  const comments = getComments();

  target.innerHTML = comments.map(comment => `
    <div class="comment-item">
      <h4>${escapeHtml(comment.name || "Anonim")}</h4>
      <div>${"⭐".repeat(Math.max(0, Math.min(5, comment.rating || 0)))}</div>
      ${comment.image ? `<img src="${comment.image}" alt="Komentar gambar">` : ""}
      <p>${escapeHtml(comment.text || "")}</p>
    </div>
  `).join("");
}

// Fungsi render khusus untuk halaman Beranda (Index)
function renderHome() {
  if (els.homeProductGrid) {
    renderProducts(getProductStateList().slice(0, 3), els.homeProductGrid); // Hanya tampilkan 3 produk
  }

  if (els.cartPreview) {
    const cart = Object.values(getCart()).slice(0, 2); // Hanya tampilkan 2 item keranjang
    if (!cart.length) {
      els.cartPreview.innerHTML = '<p class="empty-state">Keranjang kosong. Mulai belanja sekarang!</p>';
    } else {
      els.cartPreview.innerHTML = cart.map(item => `
        <div class="cart-preview-item">
          <img src="${item.image}" alt="${escapeHtml(item.name)}">
          <div>
            <strong>${escapeHtml(item.name)}</strong><br>
            <span>${item.qty} item</span>
          </div>
        </div>
      `).join("");
    }
  }

  if (els.homeCommentFeed) {
    const comments = getComments().slice(0, 3); // Hanya tampilkan 3 komentar terbaru
    els.homeCommentFeed.innerHTML = comments.map(comment => `
      <div class="comment-item">
        <h4>${escapeHtml(comment.name || "Anonim")}</h4>
        <div>${"⭐".repeat(Math.max(0, Math.min(5, comment.rating || 0)))}</div>
        <p>${escapeHtml(comment.text || "")}</p>
      </div>
    `).join("");
  }
}

// Menjalankan penyegaran tampilan untuk semua komponen
function refreshAll() {
  renderLikes();
  renderCart();
  renderComments();
  renderHome();
}

/* ==========================================================
   [6] AKSI GLOBAL (DAPAT DIPANGGIL DARI HTML)
   ========================================================== */

// Menangani klik tombol Like
window.toggleLike = function(id) {
  const likes = getLikes();
  likes[id] = !likes[id]; // Balikkan status like
  setLikes(likes);
  renderLikes();
  renderHome();
};

// Menangani klik tombol tambah ke keranjang
window.addToCart = function(id) {
  const product = getProductById(id);
  if (!product) return;

  const cart = getCart();
  if (!cart[id]) {
    cart[id] = { ...product, qty: 1 }; // Tambah item baru
  } else {
    cart[id].qty += 1; // Tambah jumlah jika sudah ada
  }

  setCart(cart);
  renderCart();
  renderHome();
};

// Mengubah kuantitas item di dalam keranjang
window.changeQty = function(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;

  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id]; // Hapus item jika qty jadi 0 atau kurang
  }

  setCart(cart);
  renderCart();
  renderHome();
};

/* ==========================================================
   [7] PEMROSESAN MEDIA (GAMBAR)
   ========================================================== */

// Mengonversi file gambar dari input menjadi string teks (Data URL) agar bisa disimpan di storage
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ==========================================================
   [8] EVENT LISTENERS (PENANGAN KEJADIAN)
   ========================================================== */

// Deteksi saat user mengetik di kolom pencarian
if (els.searchInput) {
  els.searchInput.addEventListener("input", () => {
    renderProducts(filteredProducts());
    renderLikes();
  });
}

// Deteksi saat user mengubah kategori produk
if (els.filterCategory) {
  els.filterCategory.addEventListener("change", () => {
    renderProducts(filteredProducts());
    renderLikes();
  });
}

// Deteksi klik tombol kosongkan keranjang
if (els.clearCart) {
  els.clearCart.addEventListener("click", () => {
    setCart({}); // Set storage jadi objek kosong
    renderCart();
    renderHome();
  });
}

// Deteksi klik tombol checkout
if (els.checkoutBtn) {
  els.checkoutBtn.addEventListener("click", () => {
    alert("Demo front-end: checkout belum dihubungkan ke backend.");
  });
}

// Logika interaksi rating bintang (klik bintang untuk memberi nilai)
if (els.starRating && els.commentRating) {
  const stars = [...els.starRating.querySelectorAll(".star")];

  const updateStars = (value) => {
    stars.forEach(star => {
      const starValue = Number(star.dataset.value);
      star.classList.toggle("active", starValue <= value); // Aktifkan bintang jika nilai <= yang dipilih
    });
  };

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.value);
      els.commentRating.value = String(value); // Simpan nilai ke hidden input
      updateStars(value);
    });
  });
}

// Menangani pengiriman form komentar lengkap
if (els.commentForm) {
  els.commentForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Jangan refresh halaman

    const name = (els.userName?.value || "").trim();
    const text = (els.commentText?.value || "").trim();
    const rating = Number(els.commentRating?.value || 0);
    const file = els.commentImage?.files?.[0] || null;

    if (!name || !text) return; // Validasi minimal

    let imageData = null;
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Batas 2MB agar storage tidak penuh
        alert("Ukuran gambar maksimal 2MB.");
        return;
      }
      imageData = await readFileAsDataURL(file);
    }

    const comments = getComments();
    comments.unshift({ // Tambah ke awal daftar agar muncul paling atas
      name,
      text,
      rating,
      image: imageData,
      date: new Date().toISOString()
    });
    setComments(comments);

    // Reset form setelah sukses
    els.commentForm.reset();
    if (els.commentRating) els.commentRating.value = "0";
    if (els.starRating) {
      [...els.starRating.querySelectorAll(".star")].forEach(s => s.classList.remove("active"));
    }

    renderComments();
    renderHome();
  });
}

// Menangani posting komentar cepat (hanya teks/gambar tanpa nama penuh)
if (els.postComment) {
  els.postComment.addEventListener("click", async () => {
    const text = (els.commentText?.value || "").trim();
    const file = els.commentImage?.files?.[0] || null;

    if (!text && !file) return;

    let imageData = null;
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB.");
        return;
      }
      imageData = await readFileAsDataURL(file);
    }

    const comments = getComments();
    comments.unshift({
      name: "Pengunjung",
      text: text || "Komentar gambar",
      rating: 0,
      image: imageData,
      date: new Date().toISOString()
    });
    setComments(comments);

    if (els.commentText) els.commentText.value = "";
    if (els.commentImage) els.commentImage.value = "";

    renderComments();
    renderHome();
  });
}

/* ==========================================================
   [9] INISIALISASI AWAL
   Berjalan otomatis saat halaman selesai dimuat.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(filteredProducts()); // Tampilkan produk awal
  refreshAll(); // Sinkronkan semua data UI
});
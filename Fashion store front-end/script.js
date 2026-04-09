const STORAGE_KEYS = {
  likes: "lm_likes",
  cart: "lm_cart",
  comments: "lm_comments"
};

const PRODUCTS = [
  {
    id: 1,
    name: "Silk Evening Dress",
    description: "Gaun satin mewah dengan siluet elegan untuk tampilan premium.",
    price: 749000,
    category: "women",
    image: svgImage("Silk Evening Dress", "#f1dfc4", "#241c18")
  },
  {
    id: 2,
    name: "Urban Tailored Set",
    description: "Set modern dengan potongan rapi untuk gaya formal kasual.",
    price: 629000,
    category: "men",
    image: svgImage("Urban Tailored Set", "#d8d1c5", "#17171d")
  },
  {
    id: 3,
    name: "Classic Leather Bag",
    description: "Tas fashion minimalis yang cocok untuk outfit harian dan acara khusus.",
    price: 459000,
    category: "accessories",
    image: svgImage("Classic Leather Bag", "#c7a26a", "#111116")
  },
  {
    id: 4,
    name: "Premium Knit Sweater",
    description: "Sweater hangat dengan tekstur lembut dan nuansa clean luxury.",
    price: 389000,
    category: "women",
    image: svgImage("Premium Knit Sweater", "#e8d9c2", "#1b1b22")
  },
  {
    id: 5,
    name: "Minimal Sneaker",
    description: "Sepatu kasual serbaguna dengan tampilan bersih dan nyaman dipakai.",
    price: 529000,
    category: "accessories",
    image: svgImage("Minimal Sneaker", "#f5efe8", "#202028")
  },
  {
    id: 6,
    name: "Gold Accent Jacket",
    description: "Jaket statement dengan aksen mewah yang menonjolkan karakter fashion.",
    price: 899000,
    category: "men",
    image: svgImage("Gold Accent Jacket", "#f1dfc4", "#2b2014")
  }
];

const els = {
  productGrid: document.getElementById("productGrid"),
  homeProductGrid: document.getElementById("homeProductGrid"),
  cartList: document.getElementById("cartList"),
  cartItems: document.getElementById("cartItems"),
  cartPreview: document.getElementById("cartPreview"),
  cartCount: document.getElementById("cartCount"),
  summaryItems: document.getElementById("summaryItems"),
  summaryTotal: document.getElementById("summaryTotal"),
  subtotal: document.getElementById("subtotal"),
  tax: document.getElementById("tax"),
  total: document.getElementById("total"),
  likeTotal: document.getElementById("likeTotal"),
  searchInput: document.getElementById("searchInput"),
  filterCategory: document.getElementById("filterCategory"),
  clearCart: document.getElementById("clearCart"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  commentText: document.getElementById("commentText"),
  commentImage: document.getElementById("commentImage"),
  postComment: document.getElementById("postComment"),
  commentFeed: document.getElementById("commentFeed"),
  commentList: document.getElementById("commentList"),
  commentForm: document.getElementById("commentForm"),
  userName: document.getElementById("userName"),
  starRating: document.getElementById("starRating"),
  commentRating: document.getElementById("commentRating"),
  homeCommentFeed: document.getElementById("homeCommentFeed")
};

function svgImage(title, bg, fg) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg}"/>
          <stop offset="100%" stop-color="${fg}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" rx="48" fill="url(#g)"/>
      <circle cx="650" cy="120" r="90" fill="rgba(255,255,255,0.12)"/>
      <circle cx="180" cy="860" r="170" fill="rgba(255,255,255,0.08)"/>
      <text x="60" y="150" font-family="Arial" font-size="60" fill="#fff" font-weight="700">LuxeMode</text>
      <text x="60" y="230" font-family="Arial" font-size="28" fill="#f6f1ea" opacity="0.92">Fashion collection</text>
      <rect x="185" y="290" width="430" height="510" rx="180" fill="rgba(255,255,255,0.88)"/>
      <path d="M300 350 C260 500, 250 630, 265 780 C270 840, 330 890, 400 900 C470 890, 530 840, 535 780 C550 630, 540 500, 500 350 Z" fill="#111116" opacity="0.22"/>
      <text x="60" y="930" font-family="Arial" font-size="26" fill="#fff" opacity="0.75">${title}</text>
    </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n);
}

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function getLikes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.likes)) || {};
  } catch {
    return {};
  }
}

function setLikes(likes) {
  localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify(likes));
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || {};
  } catch {
    return {};
  }
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

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

function setComments(comments) {
  localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments));
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getProductStateList() {
  const likes = getLikes();
  return PRODUCTS.map(p => ({
    ...p,
    liked: Boolean(likes[p.id])
  }));
}

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

function renderProducts(list, target = els.productGrid) {
  if (!target) return;

  target.innerHTML = list.map(product => `
    <article class="product-card" data-name="${escapeHtml(product.name.toLowerCase())}">
      <img class="product-image" src="${product.image}" alt="${escapeHtml(product.name)}">
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

function renderCart() {
  const cart = getCart();
  const entries = Object.values(cart);

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

  const itemCount = entries.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxValue = Math.round(subtotal * 0.1);
  const total = subtotal + taxValue;

  if (els.cartCount) els.cartCount.textContent = itemCount;
  if (els.summaryItems) els.summaryItems.textContent = itemCount;
  if (els.summaryTotal) els.summaryTotal.textContent = rupiah(total);
  if (els.subtotal) els.subtotal.textContent = rupiah(subtotal);
  if (els.tax) els.tax.textContent = rupiah(taxValue);
  if (els.total) els.total.textContent = rupiah(total);
  if (els.checkoutBtn) els.checkoutBtn.disabled = itemCount === 0;
}

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

function renderHome() {
  if (els.homeProductGrid) {
    renderProducts(getProductStateList().slice(0, 3), els.homeProductGrid);
  }

  if (els.cartPreview) {
    const cart = Object.values(getCart()).slice(0, 2);
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
    const comments = getComments().slice(0, 3);
    els.homeCommentFeed.innerHTML = comments.map(comment => `
      <div class="comment-item">
        <h4>${escapeHtml(comment.name || "Anonim")}</h4>
        <div>${"⭐".repeat(Math.max(0, Math.min(5, comment.rating || 0)))}</div>
        <p>${escapeHtml(comment.text || "")}</p>
      </div>
    `).join("");
  }
}

function refreshAll() {
  renderLikes();
  renderCart();
  renderComments();
  renderHome();
}

window.toggleLike = function(id) {
  const likes = getLikes();
  likes[id] = !likes[id];
  setLikes(likes);
  renderLikes();
  renderHome();
};

window.addToCart = function(id) {
  const product = getProductById(id);
  if (!product) return;

  const cart = getCart();
  if (!cart[id]) {
    cart[id] = { ...product, qty: 1 };
  } else {
    cart[id].qty += 1;
  }

  setCart(cart);
  renderCart();
  renderHome();
};

window.changeQty = function(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;

  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }

  setCart(cart);
  renderCart();
  renderHome();
};

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

if (els.searchInput) {
  els.searchInput.addEventListener("input", () => {
    renderProducts(filteredProducts());
    renderLikes();
  });
}

if (els.filterCategory) {
  els.filterCategory.addEventListener("change", () => {
    renderProducts(filteredProducts());
    renderLikes();
  });
}

if (els.clearCart) {
  els.clearCart.addEventListener("click", () => {
    setCart({});
    renderCart();
    renderHome();
  });
}

if (els.checkoutBtn) {
  els.checkoutBtn.addEventListener("click", () => {
    alert("Demo front-end: checkout belum dihubungkan ke backend.");
  });
}

if (els.starRating && els.commentRating) {
  const stars = [...els.starRating.querySelectorAll(".star")];

  const updateStars = (value) => {
    stars.forEach(star => {
      const starValue = Number(star.dataset.value);
      star.classList.toggle("active", starValue <= value);
    });
  };

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.value);
      els.commentRating.value = String(value);
      updateStars(value);
    });
  });
}

if (els.commentForm) {
  els.commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (els.userName?.value || "").trim();
    const text = (els.commentText?.value || "").trim();
    const rating = Number(els.commentRating?.value || 0);
    const file = els.commentImage?.files?.[0] || null;

    if (!name || !text) return;

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
      name,
      text,
      rating,
      image: imageData,
      date: new Date().toISOString()
    });
    setComments(comments);

    els.commentForm.reset();
    if (els.commentRating) els.commentRating.value = "0";
    if (els.starRating) {
      [...els.starRating.querySelectorAll(".star")].forEach(s => s.classList.remove("active"));
    }

    renderComments();
    renderHome();
  });
}

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

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(filteredProducts());
  refreshAll();
});
const products = [
  {
    id: 1,
    name: "Silk Evening Dress",
    description: "Gaun satin mewah dengan siluet elegan untuk tampilan premium.",
    price: 749000,
    liked: false,
    image: svgImage("Silk Evening Dress", "#f1dfc4", "#241c18")
  },
  {
    id: 2,
    name: "Urban Tailored Set",
    description: "Set modern dengan potongan rapi untuk gaya formal kasual.",
    price: 629000,
    liked: false,
    image: svgImage("Urban Tailored Set", "#d8d1c5", "#17171d")
  },
  {
    id: 3,
    name: "Classic Leather Bag",
    description: "Tas fashion minimalis yang cocok untuk outfit harian dan acara khusus.",
    price: 459000,
    liked: false,
    image: svgImage("Classic Leather Bag", "#c7a26a", "#111116")
  },
  {
    id: 4,
    name: "Premium Knit Sweater",
    description: "Sweater hangat dengan tekstur lembut dan nuansa clean luxury.",
    price: 389000,
    liked: false,
    image: svgImage("Premium Knit Sweater", "#e8d9c2", "#1b1b22")
  },
  {
    id: 5,
    name: "Minimal Sneaker",
    description: "Sepatu kasual serbaguna dengan tampilan bersih dan nyaman dipakai.",
    price: 529000,
    liked: false,
    image: svgImage("Minimal Sneaker", "#f5efe8", "#202028")
  },
  {
    id: 6,
    name: "Gold Accent Jacket",
    description: "Jaket statement dengan aksen mewah yang menonjolkan karakter fashion.",
    price: 899000,
    liked: false,
    image: svgImage("Gold Accent Jacket", "#f1dfc4", "#2b2014")
  }
];

const cart = new Map();
const comments = [
  {
    text: "Desainnya terlihat premium dan cocok untuk katalog fashion modern.",
    image: null
  }
];

const els = {
  productGrid: document.getElementById("productGrid"),
  cartList: document.getElementById("cartList"),
  cartCount: document.getElementById("cartCount"),
  summaryItems: document.getElementById("summaryItems"),
  summaryTotal: document.getElementById("summaryTotal"),
  likeTotal: document.getElementById("likeTotal"),
  searchInput: document.getElementById("searchInput"),
  clearCart: document.getElementById("clearCart"),
  commentText: document.getElementById("commentText"),
  commentImage: document.getElementById("commentImage"),
  postComment: document.getElementById("postComment"),
  commentFeed: document.getElementById("commentFeed"),
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

function renderProducts(list) {
  els.productGrid.innerHTML = list.map(product => `
    <article class="product-card" data-name="${product.name.toLowerCase()}">
      <img class="product-image" src="${product.image}" alt="${product.name}">
      <div class="product-body">
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="price">${rupiah(product.price)}</span>
          <span>★ <span id="likeCount-${product.id}">${product.liked ? 1 : 0}</span></span>
        </div>
        <div class="action-row">
          <button class="icon-btn" onclick="toggleLike(${product.id})" id="likeBtn-${product.id}">
            ${product.liked ? "Liked" : "Like"}
          </button>
          <button class="icon-btn" onclick="addToCart(${product.id})">Tambah</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const items = [...cart.values()];
  if (!items.length) {
    els.cartList.innerHTML = '<p class="empty-state">Keranjang masih kosong. Tambahkan produk dari atas.</p>';
  } else {
    els.cartList.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
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

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  els.cartCount.textContent = itemCount;
  els.summaryItems.textContent = itemCount;
  els.summaryTotal.textContent = rupiah(total);
}

function renderLikes() {
  const likedCount = products.filter(p => p.liked).length;
  els.likeTotal.textContent = likedCount;
  products.forEach(product => {
    const btn = document.getElementById(`likeBtn-${product.id}`);
    const cnt = document.getElementById(`likeCount-${product.id}`);
    if (btn) btn.textContent = product.liked ? "Liked" : "Like";
    if (cnt) cnt.textContent = product.liked ? 1 : 0;
  });
}

function renderComments() {
  els.commentFeed.innerHTML = comments.map(comment => `
    <div class="comment-item">
      ${comment.image ? `<img src="${comment.image}" alt="Komentar gambar">` : ""}
      <p>${escapeHtml(comment.text)}</p>
    </div>
  `).join("");
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

window.toggleLike = function(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  product.liked = !product.liked;
  renderProducts(filterProducts());
  renderLikes();
};

window.addToCart = function(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const current = cart.get(id) || { ...product, qty: 0 };
  current.qty += 1;
  cart.set(id, current);
  renderCart();
};

window.changeQty = function(id, delta) {
  const item = cart.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.delete(id);
  renderCart();
};

function filterProducts() {
  const q = els.searchInput.value.trim().toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

els.searchInput.addEventListener("input", () => {
  renderProducts(filterProducts());
  renderLikes();
});

els.clearCart.addEventListener("click", () => {
  cart.clear();
  renderCart();
});

els.postComment.addEventListener("click", async () => {
  const text = els.commentText.value.trim();
  const file = els.commentImage.files[0];

  if (!text && !file) return;

  let imageData = null;
  if (file) {
    imageData = await readFileAsDataURL(file);
  }

  comments.unshift({
    text: text || "Komentar gambar",
    image: imageData
  });

  els.commentText.value = "";
  els.commentImage.value = "";
  renderComments();
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

renderProducts(products);
renderCart();
renderLikes();
renderComments();

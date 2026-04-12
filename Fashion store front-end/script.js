const STORAGE_KEYS = {
  likes: "lm_likes",
  cart: "lm_cart",
  comments: "lm_comments"
};

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

const els = {
  productGrid: document.getElementById("productGrid"),
  homeProductGrid: document.getElementById("homeProductGrid"),
  cartList: document.getElementById("cartList"),
  cartItems: document.getElementById("cartItems"),
  cartPreview: document.getElementById("cartPreview"),
  cartSummary: document.querySelector(".cart-summary"),
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
  imagePreview: document.getElementById("imagePreview"),
  commentFeed: document.getElementById("commentList") || document.getElementById("commentFeed"),
  commentList: document.getElementById("commentList"),
  commentForm: document.getElementById("commentForm"),
  userName: document.getElementById("userName"),
  starRating: document.getElementById("starRating"),
  commentRating: document.getElementById("commentRating"),
  homeCommentFeed: document.getElementById("homeCommentFeed")
};

function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(n || 0));
}

function escapeHtml(text = "") {
  return String(text).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function safeParse(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function getLikes() {
  return safeParse(STORAGE_KEYS.likes, {});
}

function setLikes(likes) {
  localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify(likes));
}

function getCart() {
  return safeParse(STORAGE_KEYS.cart, {});
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function getComments() {
  const stored = safeParse(STORAGE_KEYS.comments, null);
  if (Array.isArray(stored) && stored.length) {
    return stored.map((comment) => ({
      ...comment,
      rating: Number(comment.rating ?? 0),
      images: Array.isArray(comment.images)
        ? comment.images
        : comment.image
        ? [comment.image]
        : []
    }));
  }

  return [
    {
      name: "Alya",
      text: "Desainnya terlihat premium dan cocok untuk katalog fashion modern.",
      rating: 5,
      images: [],
      date: new Date().toISOString()
    }
  ];
}

function setComments(comments) {
  localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments));
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getProductStateList() {
  const likes = getLikes();
  return PRODUCTS.map((p) => ({
    ...p,
    liked: Boolean(likes[p.id])
  }));
}

function filteredProducts() {
  const q = (els.searchInput?.value || "").trim().toLowerCase();
  const category = els.filterCategory?.value || "";

  return getProductStateList().filter((p) => {
    const matchText =
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchCategory = !category || p.category === category;
    return matchText && matchCategory;
  });
}

function renderProducts(list, target = els.productGrid) {
  if (!target) return;

  target.innerHTML = list.map((product) => `
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
          <button class="icon-btn ${product.liked ? "active" : ""}" onclick="toggleLike(${product.id})" id="likeBtn-${product.id}" type="button">
            ${product.liked ? "Liked" : "Like"}
          </button>
          <button class="icon-btn" onclick="addToCart(${product.id})" type="button">Tambah</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const cart = getCart();
  const entries = Object.values(cart);

  const renderList = (target) => {
    if (!target) return;

    if (!entries.length) {
      target.innerHTML = '<p class="empty-state">Keranjang Anda kosong. Silakan tambahkan produk.</p>';
      return;
    }

    target.innerHTML = entries.map((item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <div>
          <h4>${escapeHtml(item.name)}</h4>
          <p>${rupiah(item.price)} × ${item.qty}</p>
        </div>
        <div class="qty-controls">
          <button type="button" onclick="changeQty(${item.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button type="button" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  };

  renderList(els.cartList);
  renderList(els.cartItems);

  if (els.cartSummary) {
    els.cartSummary.classList.toggle("hidden", entries.length === 0);
  }

  const itemCount = entries.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxValue = Math.round(subtotal * 0.1);
  const totalValue = subtotal + taxValue;

  if (els.cartCount) els.cartCount.textContent = itemCount;
  if (els.summaryItems) els.summaryItems.textContent = itemCount;
  if (els.summaryTotal) els.summaryTotal.textContent = rupiah(totalValue);
  if (els.subtotal) els.subtotal.textContent = rupiah(subtotal);
  if (els.tax) els.tax.textContent = rupiah(taxValue);
  if (els.total) els.total.textContent = rupiah(totalValue);
  if (els.checkoutBtn) els.checkoutBtn.disabled = itemCount === 0;
}

function renderLikes() {
  const likes = getLikes();
  const likedCount = Object.values(likes).filter(Boolean).length;

  if (els.likeTotal) els.likeTotal.textContent = likedCount;

  PRODUCTS.forEach((product) => {
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

function renderCommentImages(comment) {
  const images = Array.isArray(comment.images) ? comment.images : [];
  const legacy = comment.image ? [comment.image] : [];
  const allImages = images.length ? images : legacy;

  if (!allImages.length) return "";

  return `
    <div class="comment-images">
      ${allImages.map((img) => `
        <img src="${img}" alt="Komentar gambar">
      `).join("")}
    </div>
  `;
}

function renderComments(target = els.commentFeed, showAll = false) {
  if (!target) return;

  const allComments = getComments();
  const limit = 5;
  
  const visibleComments = showAll ? allComments : allComments.slice(0, limit);
  const hasMore = !showAll && allComments.length > limit;

  let html = visibleComments
    .map((comment) => {
      const rating = Math.max(0, Math.min(5, Number(comment.rating || 0)));
      return `
        <div class="comment-item">
          <h4>${escapeHtml(comment.name || "Anonim")}</h4>
          <div>${"⭐".repeat(rating)}</div>
          ${renderCommentImages(comment)}
          <p>${escapeHtml(comment.text || "")}</p>
        </div>
      `;
    })
    .join("");

  if (hasMore) {
    html += `
      <div class="more-comments">
        <button id="btnLanjut" class="btn-lanjut">
          Lihat ${allComments.length - limit} komentar lainnya...
        </button>
      </div>
    `;
  }

  target.innerHTML = html;

  const btn = document.getElementById('btnLanjut');
  if (btn) {
    btn.addEventListener('click', () => {
      renderComments(target, true);
    });
  }

};


function renderHome() {
  if (els.homeProductGrid) {
    renderProducts(getProductStateList().slice(0, 3), els.homeProductGrid);
  }

  if (els.cartPreview) {
    const cart = Object.values(getCart()).slice(0, 2);
    if (!cart.length) {
      els.cartPreview.innerHTML = '<p class="empty-state">Keranjang kosong. Mulai belanja sekarang!</p>';
    } else {
      els.cartPreview.innerHTML = cart.map((item) => `
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
    els.homeCommentFeed.innerHTML = comments
      .map((comment) => {
        const rating = Math.max(0, Math.min(5, Number(comment.rating || 0)));
        return `
          <div class="comment-item">
            <h4>${escapeHtml(comment.name || "Anonim")}</h4>
            <div>${"⭐".repeat(rating)}</div>
            ${renderCommentImages(comment)}
            <p>${escapeHtml(comment.text || "")}</p>
          </div>
        `;
      })
      .join("");
  }
}

function refreshAll() {
  renderLikes();
  renderCart();
  renderComments();
  renderHome();
}

window.toggleLike = function (id) {
  const likes = getLikes();
  likes[id] = !likes[id];
  setLikes(likes);
  renderLikes();
  renderHome();
};

window.addToCart = function (id) {
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

window.changeQty = function (id, delta) {
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
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal memuat gambar."));
    };

    img.src = objectUrl;
  });
}

function drawToCanvas(img, maxWidth = 1024, maxHeight = 1024) {
  let { width, height } = img;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas tidak tersedia.");
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(canvas, mimeType = "image/jpeg", quality = 0.9) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Gagal mengompres gambar."));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}

async function compressImage(file, options = {}) {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    targetSizeMB = 1,
    minQuality = 0.35,
    startQuality = 0.9
  } = options;

  const img = await loadImageFromFile(file);
  const canvas = drawToCanvas(img, maxWidth, maxHeight);

  let quality = startQuality;
  let blob = await canvasToBlob(canvas, "image/jpeg", quality);
  const targetSizeBytes = targetSizeMB * 1024 * 1024;

  while (blob.size > targetSizeBytes && quality > minQuality) {
    quality = Math.max(minQuality, +(quality - 0.1).toFixed(2));
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
  }

  return blob;
}

function fileLikeFromBlob(blob, originalName = "image.jpg") {
  try {
    return new File([blob], originalName, {
      type: blob.type || "image/jpeg",
      lastModified: Date.now()
    });
  } catch {
    return blob;
  }
}

class ImageUploader {
  constructor({ input, previewContainer, maxFiles = 3, maxFileSizeMB = 3 }) {
    this.input = input;
    this.previewContainer = previewContainer;
    this.maxFiles = maxFiles;
    this.maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
    this.items = [];
    this.onChange = this.onChange.bind(this);

    if (this.input && this.previewContainer) {
      this.input.addEventListener("change", this.onChange);
      this.syncState();
    }
  }

  async onChange(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      if (this.items.length >= this.maxFiles) {
        alert(`Maksimal ${this.maxFiles} gambar.`);
        break;
      }

      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar.");
        continue;
      }

      if (file.size > this.maxFileSizeBytes) {
        alert("Ukuran gambar maksimal 3MB.");
        continue;
      }

      try {
        const compressedBlob = await compressImage(file, {
          maxWidth: 1024,
          maxHeight: 1024,
          targetSizeMB: 1
        });

        const previewUrl = URL.createObjectURL(compressedBlob);
        const storedFile = fileLikeFromBlob(compressedBlob, file.name || "image.jpg");

        this.items.push({
          file: storedFile,
          previewUrl,
          name: file.name || "image.jpg"
        });

        this.render();
      } catch (error) {
        console.error(error);
        alert("Gagal memproses gambar.");
      }
    }

    this.input.value = "";
    this.syncState();
  }

  remove(index) {
    const item = this.items[index];
    if (item?.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }

    this.items.splice(index, 1);
    this.render();
    this.syncState();
  }

  render() {
    if (!this.previewContainer) return;

    if (!this.items.length) {
      this.previewContainer.innerHTML = "";
      return;
    }

    this.previewContainer.innerHTML = this.items.map((item, index) => `
      <div class="img-preview">
        <img src="${item.previewUrl}" alt="${escapeHtml(item.name)}">
        <button type="button" class="remove-btn" data-index="${index}" aria-label="Hapus gambar">×</button>
      </div>
    `).join("");

    this.previewContainer.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        if (!Number.isNaN(index)) {
          this.remove(index);
        }
      });
    });
  }

  syncState() {
    if (!this.input) return;
    this.input.disabled = this.items.length >= this.maxFiles;
  }

  getFiles() {
    return this.items.map((item) => item.file);
  }

  async getDataURLs() {
    const result = [];
    for (const item of this.items) {
      const dataUrl = await readFileAsDataURL(item.file);
      result.push(dataUrl);
    }
    return result;
  }

  reset() {
    for (const item of this.items) {
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    }

    this.items = [];
    if (this.input) {
      this.input.value = "";
      this.input.disabled = false;
    }
    this.render();
  }

  destroy() {
    this.reset();
    if (this.input) {
      this.input.removeEventListener("change", this.onChange);
    }
  }
}

let uploader = null;

function updateStarUI(value) {
  if (!els.starRating) return;

  const stars = [...els.starRating.querySelectorAll(".star")];
  stars.forEach((star) => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle("active", starValue <= value);
  });
}

if (els.starRating && els.commentRating) {
  const stars = [...els.starRating.querySelectorAll(".star")];

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.value);
      els.commentRating.value = String(value);
      updateStarUI(value);
    });
  });
}

if (els.commentImage && els.imagePreview) {
  uploader = new ImageUploader({
    input: els.commentImage,
    previewContainer: els.imagePreview,
    maxFiles: 3,
    maxFileSizeMB: 3
  });
}

function clearCommentForm() {
  if (els.commentForm) els.commentForm.reset();
  if (els.commentRating) els.commentRating.value = "5";
  updateStarUI(5);
  if (uploader) uploader.reset();
}

async function handleCommentSubmit(event) {
  event.preventDefault();

  const name = (els.userName?.value || "").trim() || "Anonim";
  const text = (els.commentText?.value || "").trim();
  const rating = Number(els.commentRating?.value || 0);

  if (!text && (!uploader || uploader.getFiles().length === 0)) {
    alert("Tulis komentar atau unggah gambar.");
    return;
  }

  let images = [];
  if (uploader && uploader.getFiles().length) {
    images = await uploader.getDataURLs();
  }

  const comments = getComments();
  comments.unshift({
    name,
    text,
    rating,
    images,
    date: new Date().toISOString()
  });

  setComments(comments);

  clearCommentForm();
  renderComments();
  renderHome();
}

if (els.commentForm) {
  els.commentForm.addEventListener("submit", (event) => {
    handleCommentSubmit(event).catch((error) => {
      console.error(error);
      alert("Gagal mengirim komentar.");
    });
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

function init() {
  renderProducts(filteredProducts());
  refreshAll();

  if (els.commentRating) {
    const initialRating = Number(els.commentRating.value || 5);
    if (!initialRating) {
      els.commentRating.value = "5";
    }
    updateStarUI(initialRating || 5);
  }
}

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("beforeunload", () => {
  if (uploader) uploader.destroy();
});

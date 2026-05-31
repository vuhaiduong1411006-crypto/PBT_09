// ─── Data ─────────────────────────────────────────────────────────────────────

const products = [
  { id: 1, name: "iPhone 16", price: 25990000, category: "phone", image: "https://placehold.co/200", rating: 4.5, inStock: true },
  { id: 2, name: "Samsung Galaxy S24", price: 21990000, category: "phone", image: "https://placehold.co/200", rating: 4.3, inStock: true },
  { id: 3, name: "Xiaomi 14", price: 14990000, category: "phone", image: "https://placehold.co/200", rating: 4.1, inStock: false },
  { id: 4, name: "Oppo Reno 12", price: 9990000, category: "phone", image: "https://placehold.co/200", rating: 3.9, inStock: true },
  { id: 5, name: "MacBook Air M3", price: 32990000, category: "laptop", image: "https://placehold.co/200", rating: 4.8, inStock: true },
  { id: 6, name: "Dell XPS 15", price: 28990000, category: "laptop", image: "https://placehold.co/200", rating: 4.4, inStock: true },
  { id: 7, name: "Asus ROG Zephyrus", price: 35990000, category: "laptop", image: "https://placehold.co/200", rating: 4.6, inStock: false },
  { id: 8, name: "Lenovo ThinkPad", price: 19990000, category: "laptop", image: "https://placehold.co/200", rating: 4.2, inStock: true },
  { id: 9, name: "iPad Pro M4", price: 23990000, category: "tablet", image: "https://placehold.co/200", rating: 4.7, inStock: true },
  { id: 10, name: "Samsung Tab S9", price: 18990000, category: "tablet", image: "https://placehold.co/200", rating: 4.3, inStock: true },
  { id: 11, name: "Xiaomi Pad 6", price: 7990000, category: "tablet", image: "https://placehold.co/200", rating: 4.0, inStock: true },
  { id: 12, name: "Sony WH-1000XM5", price: 8990000, category: "accessory", image: "https://placehold.co/200", rating: 4.9, inStock: true },
  { id: 13, name: "AirPods Pro 2", price: 6490000, category: "accessory", image: "https://placehold.co/200", rating: 4.6, inStock: false },
  { id: 14, name: "Logitech MX Master", price: 2490000, category: "accessory", image: "https://placehold.co/200", rating: 4.5, inStock: true },
];

// ─── State ────────────────────────────────────────────────────────────────────

let currentCategory = "all";
let currentSearch = "";
let currentSort = "default";
let cartCount = 0;

// ─── DOM refs (set after build) ───────────────────────────────────────────────

let productGrid, cartBadge, modalOverlay;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty) + " " + rating;
}

// ─── Core render functions ────────────────────────────────────────────────────

function getFilteredProducts() {
  let list = [...products];

  if (currentCategory !== "all") {
    list = list.filter((p) => p.category === currentCategory);
  }

  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  list = sortProducts(list);
  return list;
}

function sortProducts(list) {
  if (currentSort === "price-asc") return list.sort((a, b) => a.price - b.price);
  if (currentSort === "price-desc") return list.sort((a, b) => b.price - a.price);
  if (currentSort === "name-az") return list.sort((a, b) => a.name.localeCompare(b.name));
  if (currentSort === "rating") return list.sort((a, b) => b.rating - a.rating);
  return list;
}

function renderProducts() {
  productGrid.innerHTML = "";

  const list = getFilteredProducts();

  if (list.length === 0) {
    const msg = document.createElement("p");
    msg.classList.add("no-result");
    msg.textContent = "Không tìm thấy sản phẩm nào.";
    productGrid.appendChild(msg);
    return;
  }

  list.forEach((product) => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;

  const body = document.createElement("div");
  body.classList.add("card-body");

  const cat = document.createElement("p");
  cat.classList.add("card-category");
  cat.textContent = product.category;

  const name = document.createElement("p");
  name.classList.add("card-name");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.classList.add("card-price");
  price.textContent = formatPrice(product.price);

  const rating = document.createElement("p");
  rating.classList.add("card-rating");
  rating.textContent = renderStars(product.rating);

  const stock = document.createElement("p");
  stock.classList.add("card-stock");
  stock.textContent = product.inStock ? "Còn hàng" : "Hết hàng";
  stock.classList.add(product.inStock ? "in-stock" : "out-stock");

  const addBtn = document.createElement("button");
  addBtn.classList.add("add-cart-btn");
  addBtn.textContent = "Thêm giỏ hàng";
  addBtn.disabled = !product.inStock;

  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart();
  });

  body.appendChild(cat);
  body.appendChild(name);
  body.appendChild(price);
  body.appendChild(rating);
  body.appendChild(stock);
  body.appendChild(addBtn);

  card.appendChild(img);
  card.appendChild(body);

  card.addEventListener("click", () => openModal(product));

  return card;
}

// ─── Filter by category ───────────────────────────────────────────────────────

function filterByCategory(category) {
  currentCategory = category;

  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  renderProducts();
}

// ─── Search ───────────────────────────────────────────────────────────────────

function searchProducts(query) {
  currentSearch = query;
  renderProducts();
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

function addToCart() {
  cartCount++;
  cartBadge.textContent = cartCount;
  cartBadge.classList.remove("hidden");
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function openModal(product) {
  const modal = modalOverlay.querySelector(".modal");
  modal.innerHTML = "";

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("modal-close");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", closeModal);

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;

  const cat = document.createElement("p");
  cat.textContent = "Danh mục: " + product.category;

  const name = document.createElement("h2");
  name.textContent = product.name;

  const rating = document.createElement("p");
  rating.style.color = "#f39c12";
  rating.textContent = renderStars(product.rating);

  const stock = document.createElement("p");
  stock.textContent = product.inStock ? "✅ Còn hàng" : "❌ Hết hàng";

  const price = document.createElement("p");
  price.classList.add("modal-price");
  price.textContent = formatPrice(product.price);

  const addBtn = document.createElement("button");
  addBtn.classList.add("modal-add-btn");
  addBtn.textContent = "Thêm vào giỏ hàng";
  addBtn.disabled = !product.inStock;
  addBtn.addEventListener("click", () => {
    addToCart();
    closeModal();
  });

  modal.appendChild(closeBtn);
  modal.appendChild(img);
  modal.appendChild(cat);
  modal.appendChild(name);
  modal.appendChild(rating);
  modal.appendChild(stock);
  modal.appendChild(price);
  modal.appendChild(addBtn);

  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

// ─── Build UI ─────────────────────────────────────────────────────────────────

function buildUI() {
  const app = document.querySelector("#app");

  // Header
  const header = document.createElement("div");
  header.classList.add("header");

  const title = document.createElement("h1");
  title.textContent = "🛍️ Sản phẩm";

  const headerRight = document.createElement("div");
  headerRight.classList.add("header-right");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.classList.add("search-input");
  searchInput.placeholder = "Tìm kiếm...";
  searchInput.addEventListener("input", (e) => searchProducts(e.target.value));

  const sortSelect = document.createElement("select");
  sortSelect.classList.add("sort-select");
  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
    { value: "name-az", label: "Tên A-Z" },
    { value: "rating", label: "Đánh giá cao nhất" },
  ];
  sortOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    sortSelect.appendChild(option);
  });
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  const darkToggle = document.createElement("button");
  darkToggle.classList.add("dark-toggle");
  darkToggle.textContent = "🌙 Dark";
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light" : "🌙 Dark";
  });

  const cartBtn = document.createElement("button");
  cartBtn.classList.add("cart-btn");
  cartBtn.textContent = "🛒";

  cartBadge = document.createElement("span");
  cartBadge.classList.add("cart-badge", "hidden");
  cartBtn.appendChild(cartBadge);

  headerRight.appendChild(searchInput);
  headerRight.appendChild(sortSelect);
  headerRight.appendChild(darkToggle);
  headerRight.appendChild(cartBtn);

  header.appendChild(title);
  header.appendChild(headerRight);

  // Category bar
  const categoryBar = document.createElement("div");
  categoryBar.classList.add("category-bar");

  const categories = ["all", "phone", "laptop", "tablet", "accessory"];
  const catLabels = { all: "Tất cả", phone: "Điện thoại", laptop: "Laptop", tablet: "Máy tính bảng", accessory: "Phụ kiện" };

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.classList.add("cat-btn");
    btn.dataset.category = cat;
    btn.textContent = catLabels[cat];
    if (cat === "all") btn.classList.add("active");
    btn.addEventListener("click", () => filterByCategory(cat));
    categoryBar.appendChild(btn);
  });

  // Main grid
  const main = document.createElement("div");
  main.classList.add("main");

  productGrid = document.createElement("div");
  productGrid.classList.add("product-grid");

  main.appendChild(productGrid);

  // Modal overlay
  modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay", "hidden");

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modalOverlay.appendChild(modal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  app.appendChild(header);
  app.appendChild(categoryBar);
  app.appendChild(main);
  app.appendChild(modalOverlay);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

buildUI();
renderProducts();

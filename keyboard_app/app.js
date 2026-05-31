// ─── Data ─────────────────────────────────────────────────────────────────────

const images = [
  { src: "https://placehold.co/800x600/1a1a2e/4a90e2?text=Photo+1", label: "Bầu trời đêm" },
  { src: "https://placehold.co/800x600/16213e/e74c3c?text=Photo+2", label: "Hoàng hôn đỏ" },
  { src: "https://placehold.co/800x600/0f3460/27ae60?text=Photo+3", label: "Rừng xanh" },
  { src: "https://placehold.co/800x600/533483/f39c12?text=Photo+4", label: "Sa mạc vàng" },
  { src: "https://placehold.co/800x600/2d6a4f/eee?text=Photo+5", label: "Biển xanh" },
  { src: "https://placehold.co/800x600/6d2b2b/eee?text=Photo+6", label: "Núi tuyết" },
  { src: "https://placehold.co/800x600/1b4332/f1c40f?text=Photo+7", label: "Đồng lúa" },
  { src: "https://placehold.co/800x600/212529/e67e22?text=Photo+8", label: "Thành phố" },
  { src: "https://placehold.co/800x600/003049/eee?text=Photo+9", label: "Đại dương" },
];

const commands = [
  { icon: "🖼️", label: "Mở ảnh đầu tiên", desc: "Gallery", action: () => openModal(0) },
  { icon: "▶️", label: "Bắt đầu slideshow", desc: "Space", action: () => startSlideshow() },
  { icon: "⏸️", label: "Dừng slideshow", desc: "Space", action: () => stopSlideshow() },
  {
    icon: "⬅️",
    label: "Ảnh trước",
    desc: "←",
    action: () => {
      if (!modalHidden()) navigate(-1);
    },
  },
  {
    icon: "➡️",
    label: "Ảnh tiếp theo",
    desc: "→",
    action: () => {
      if (!modalHidden()) navigate(1);
    },
  },
  { icon: "❌", label: "Đóng modal", desc: "Esc", action: () => closeModal() },
  { icon: "🔢", label: "Nhảy đến ảnh 1", desc: "Phím 1", action: () => openModal(0) },
  { icon: "🔢", label: "Nhảy đến ảnh 2", desc: "Phím 2", action: () => openModal(1) },
  { icon: "🔢", label: "Nhảy đến ảnh 3", desc: "Phím 3", action: () => openModal(2) },
  { icon: "🔢", label: "Nhảy đến ảnh 4", desc: "Phím 4", action: () => openModal(3) },
  { icon: "🔢", label: "Nhảy đến ảnh 5", desc: "Phím 5", action: () => openModal(4) },
  { icon: "🎨", label: "Về trang chủ", desc: "Home", action: () => closeModal() },
];

// ─── State ────────────────────────────────────────────────────────────────────

let currentIndex = 0;
let slideshowTimer = null;
let cmdActiveIndex = -1;
let filteredCmds = [...commands];

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const gallery = document.querySelector("#gallery");
const modalOverlay = document.querySelector("#modalOverlay");
const modalImg = document.querySelector("#modalImg");
const modalCaption = document.querySelector("#modalCaption");
const modalCounter = document.querySelector("#modalCounter");
const modalClose = document.querySelector("#modalClose");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const slideshowStatus = document.querySelector("#slideshowStatus");
const cmdOverlay = document.querySelector("#cmdOverlay");
const cmdInput = document.querySelector("#cmdInput");
const cmdList = document.querySelector("#cmdList");
const openCmdBtn = document.querySelector("#openCmdBtn");

// ─── Gallery render ───────────────────────────────────────────────────────────

function renderGallery() {
  images.forEach((img, i) => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");
    item.setAttribute("role", "listitem");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", `Ảnh ${i + 1}: ${img.label}`);

    const num = document.createElement("span");
    num.classList.add("item-num");
    num.textContent = i + 1;

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.label;
    image.loading = "lazy";

    const label = document.createElement("span");
    label.classList.add("item-label");
    label.textContent = img.label;

    item.appendChild(num);
    item.appendChild(image);
    item.appendChild(label);

    item.addEventListener("click", () => openModal(i));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(i);
      }
    });

    gallery.appendChild(item);
  });
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function modalHidden() {
  return modalOverlay.classList.contains("hidden");
}

function openModal(index) {
  currentIndex = index;
  updateModal();
  modalOverlay.classList.remove("hidden");
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  stopSlideshow();
  // Return focus to gallery item
  const items = gallery.querySelectorAll(".gallery-item");
  if (items[currentIndex]) items[currentIndex].focus();
}

function updateModal() {
  const img = images[currentIndex];
  modalImg.src = img.src;
  modalImg.alt = img.label;
  modalCaption.textContent = img.label;
  modalCounter.textContent = currentIndex + 1 + " / " + images.length;
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + images.length) % images.length;
  updateModal();
}

// ─── Slideshow ────────────────────────────────────────────────────────────────

function startSlideshow() {
  if (slideshowTimer) return;
  if (modalHidden()) openModal(currentIndex);
  slideshowTimer = setInterval(() => navigate(1), 2000);
  slideshowStatus.textContent = "▶ Slideshow đang chạy... (Space để dừng)";
  slideshowStatus.classList.add("playing");
}

function stopSlideshow() {
  if (!slideshowTimer) return;
  clearInterval(slideshowTimer);
  slideshowTimer = null;
  slideshowStatus.textContent = "⏸ Slideshow đã dừng.";
  slideshowStatus.classList.remove("playing");
}

function toggleSlideshow() {
  if (slideshowTimer) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
}

// ─── Command Palette ──────────────────────────────────────────────────────────

function openCmdPalette() {
  cmdOverlay.classList.remove("hidden");
  cmdInput.value = "";
  cmdActiveIndex = -1;
  filteredCmds = [...commands];
  renderCmdList();
  cmdInput.focus();
}

function closeCmdPalette() {
  cmdOverlay.classList.add("hidden");
  openCmdBtn.focus();
}

function renderCmdList() {
  cmdList.innerHTML = "";

  if (filteredCmds.length === 0) {
    const empty = document.createElement("li");
    empty.classList.add("cmd-empty");
    empty.textContent = "Không tìm thấy lệnh.";
    cmdList.appendChild(empty);
    return;
  }

  filteredCmds.forEach((cmd, i) => {
    const li = document.createElement("li");
    li.classList.add("cmd-item");
    li.setAttribute("role", "option");
    li.setAttribute("aria-label", cmd.label);
    if (i === cmdActiveIndex) li.classList.add("active");

    const icon = document.createElement("span");
    icon.classList.add("cmd-icon");
    icon.textContent = cmd.icon;
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = cmd.label;

    const desc = document.createElement("span");
    desc.classList.add("cmd-desc");
    desc.textContent = cmd.desc;

    li.appendChild(icon);
    li.appendChild(text);
    li.appendChild(desc);

    li.addEventListener("click", () => {
      cmd.action();
      closeCmdPalette();
    });

    cmdList.appendChild(li);
  });
}

function filterCommands(query) {
  const q = query.toLowerCase();
  filteredCmds = commands.filter((c) => c.label.toLowerCase().includes(q));
  cmdActiveIndex = filteredCmds.length > 0 ? 0 : -1;
  renderCmdList();
}

function moveCmdSelection(dir) {
  if (filteredCmds.length === 0) return;
  cmdActiveIndex = (cmdActiveIndex + dir + filteredCmds.length) % filteredCmds.length;
  renderCmdList();
  // Scroll active item into view
  const items = cmdList.querySelectorAll(".cmd-item");
  if (items[cmdActiveIndex]) items[cmdActiveIndex].scrollIntoView({ block: "nearest" });
}

function selectActiveCmd() {
  if (cmdActiveIndex >= 0 && filteredCmds[cmdActiveIndex]) {
    filteredCmds[cmdActiveIndex].action();
    closeCmdPalette();
  }
}

// ─── Keyboard events ──────────────────────────────────────────────────────────

document.addEventListener("keydown", (e) => {
  // Ctrl+K — open command palette
  if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    if (cmdOverlay.classList.contains("hidden")) {
      openCmdPalette();
    } else {
      closeCmdPalette();
    }
    return;
  }

  // Command palette is open — handle its own keys
  if (!cmdOverlay.classList.contains("hidden")) return;

  // Gallery / modal keys
  switch (e.key) {
    case "ArrowLeft":
      if (!modalHidden()) {
        e.preventDefault();
        navigate(-1);
      }
      break;
    case "ArrowRight":
      if (!modalHidden()) {
        e.preventDefault();
        navigate(1);
      }
      break;
    case " ":
      e.preventDefault();
      toggleSlideshow();
      break;
    case "Escape":
      if (!modalHidden()) closeModal();
      break;
    default:
      // Number keys 1-9
      if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key) - 1;
        if (idx < images.length) openModal(idx);
      }
  }
});

// Command palette input events
cmdInput.addEventListener("input", (e) => filterCommands(e.target.value));

cmdInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    moveCmdSelection(1);
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    moveCmdSelection(-1);
  }
  if (e.key === "Enter") {
    e.preventDefault();
    selectActiveCmd();
  }
  if (e.key === "Escape") closeCmdPalette();
});

// Close cmd palette clicking outside
cmdOverlay.addEventListener("click", (e) => {
  if (e.target === cmdOverlay) closeCmdPalette();
});

// Close modal clicking outside
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Modal buttons
modalClose.addEventListener("click", closeModal);
prevBtn.addEventListener("click", () => navigate(-1));
nextBtn.addEventListener("click", () => navigate(1));

// Header button
openCmdBtn.addEventListener("click", openCmdPalette);

// ─── Init ─────────────────────────────────────────────────────────────────────

renderGallery();

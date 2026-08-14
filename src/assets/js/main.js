// --- Nav shadow při scrollu ---
const nav = document.getElementById("site-nav");
function updateNav() {
  if (window.scrollY > 40) nav.classList.add("shadow-md");
  else nav.classList.remove("shadow-md");
}
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// --- Produktový modal (hlavní foto + náhledy + šipky + detail) ---
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-main-img");
const modalThumbs = document.getElementById("modal-thumbs");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalSpecs = document.getElementById("modal-specs");
const btnPrev = document.getElementById("modal-prev");
const btnNext = document.getElementById("modal-next");
const btnClose = document.getElementById("modal-close");

let currentImages = [];
let currentIndex = 0;

function renderThumbs() {
  modalThumbs.innerHTML = "";
  currentImages.forEach((src, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "w-12 h-12 border overflow-hidden shrink-0 " +
      (i === currentIndex ? "border-coral" : "border-ink/10");
    b.innerHTML = '<img src="' + src + '" class="w-full h-full object-cover" alt="" />';
    b.addEventListener("click", () => showImage(i));
    modalThumbs.appendChild(b);
  });
}

function showImage(i) {
  currentIndex = (i + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
  renderThumbs();
}

function specRow(label, value) {
  if (!value) return "";
  return '<div class="flex gap-2"><dt class="font-medium text-ink shrink-0">' + label + ':</dt><dd>' + value + '</dd></div>';
}

function openModal(images, startIndex, product) {
  currentImages = images;
  modalName.textContent = product.name || "";
  modalPrice.textContent = product.price || "";

  const descParts = [product.desc, product.desc1, product.desc2].filter(Boolean);
  modalDesc.textContent = descParts.join("\n\n");

  modalSpecs.innerHTML =
    specRow("Typ", product.type) +
    specRow("Barva", product.color) +
    specRow("Materiál", product.material) +
    specRow("Velikost", product.size);

  showImage(startIndex);

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

document.querySelectorAll(".product-card").forEach((card) => {
  const images = JSON.parse(card.dataset.images || "[]");
  const dataEl = card.querySelector(".product-data");
  const product = dataEl ? JSON.parse(dataEl.textContent) : {};

  card.querySelectorAll(".product-img-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(images, parseInt(btn.dataset.index, 10) || 0, product);
    });
  });

  const detailBtn = card.querySelector(".product-details-btn");
  if (detailBtn) {
    detailBtn.addEventListener("click", () => openModal(images, 0, product));
  }
});

btnPrev.addEventListener("click", () => showImage(currentIndex - 1));
btnNext.addEventListener("click", () => showImage(currentIndex + 1));
btnClose.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (modal.classList.contains("hidden")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});

(function () {
  "use strict";

  var modal = document.getElementById("product-modal");
  if (!modal) return;

  var mainImg = document.getElementById("modal-main-img");
  var thumbsWrap = document.getElementById("modal-thumbs");
  var prevBtn = document.getElementById("modal-prev");
  var nextBtn = document.getElementById("modal-next");
  var closeBtn = document.getElementById("modal-close");
  var nameEl = document.getElementById("modal-name");
  var priceEl = document.getElementById("modal-price");
  var descEl = document.getElementById("modal-desc");
  var specsEl = document.getElementById("modal-specs");

  var currentImages = [];
  var currentIndex = 0;

  function specRow(label, value) {
    if (!value) return "";
    return (
      '<div class="flex justify-between gap-4"><dt class="text-ink/50">' +
      label +
      "</dt><dd>" +
      value +
      "</dd></div>"
    );
  }

  function renderThumbs() {
    thumbsWrap.innerHTML = "";
    if (currentImages.length <= 1) return;
    currentImages.forEach(function (src, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-14 h-14 shrink-0 border overflow-hidden " +
        (i === currentIndex ? "border-coral" : "border-ink/10");
      btn.setAttribute("aria-label", "Fotka " + (i + 1));
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.className = "w-full h-full object-cover";
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        setIndex(i);
      });
      thumbsWrap.appendChild(btn);
    });
  }

  function setIndex(i) {
    if (currentImages.length === 0) return;
    currentIndex = (i + currentImages.length) % currentImages.length;
    mainImg.src = currentImages[currentIndex];
    renderThumbs();
  }

  function openModal(card, startIndex) {
    var dataScript = card.querySelector(".product-data");
    var product = {};
    try {
      product = JSON.parse(dataScript.textContent);
    } catch (err) {
      console.error("Nepodařilo se přečíst data produktu.", err);
    }

    try {
      currentImages = JSON.parse(card.getAttribute("data-images") || "[]");
    } catch (err) {
      currentImages = [];
    }

    nameEl.textContent = product.name || "";
    priceEl.textContent = product.sold ? product.price + " · Prodáno" : product.price || "";
    descEl.textContent = [product.desc, product.desc1, product.desc2]
      .filter(Boolean)
      .join("\n\n");
    specsEl.innerHTML =
      specRow("Vhodné pro", product.type) +
      specRow("Barva", product.color) +
      specRow("Materiál", product.material) +
      specRow("Velikost", product.size);

    setIndex(startIndex || 0);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  // Delegated click handling — product cards are static-generated at build
  // time, so one listener on the document covers all of them.
  document.addEventListener("click", function (e) {
    var imgBtn = e.target.closest(".product-img-btn");
    var detailsBtn = e.target.closest(".product-details-btn");

    if (imgBtn) {
      var card = imgBtn.closest(".product-card");
      if (!card) return;
      openModal(card, parseInt(imgBtn.getAttribute("data-index"), 10) || 0);
      return;
    }

    if (detailsBtn) {
      var card2 = detailsBtn.closest(".product-card");
      if (!card2) return;
      openModal(card2, 0);
      return;
    }

    // Click on the dark backdrop (not on the dialog box itself) closes it.
    if (e.target === modal) {
      closeModal();
    }
  });

  closeBtn.addEventListener("click", closeModal);
  prevBtn.addEventListener("click", function () {
    setIndex(currentIndex - 1);
  });
  nextBtn.addEventListener("click", function () {
    setIndex(currentIndex + 1);
  });

  document.addEventListener("keydown", function (e) {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") setIndex(currentIndex - 1);
    if (e.key === "ArrowRight") setIndex(currentIndex + 1);
  });
})();

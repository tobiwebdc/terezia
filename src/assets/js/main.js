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
  var specsBody = document.querySelector("#modal-specs tbody");
  var poptatBtn = document.getElementById("modal-poptat");

  var currentImages = [];
  var currentIndex = 0;
  var currentProductName = "";

  function specRow(label, value) {
    if (!value) return "";
    return (
      '<tr><th scope="row" class="text-left align-top pr-4 py-1 font-normal text-ink/50 whitespace-nowrap">' +
      label +
      '</th><td class="align-top py-1">' +
      value +
      "</td></tr>"
    );
  }

  function renderThumbs() {
    thumbsWrap.innerHTML = "";
    if (currentImages.length <= 1) return;
    currentImages.forEach(function (src, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-14 h-14 shrink-0 border overflow-hidden transition-colors " +
        (i === currentIndex ? "border-coral" : "border-ink/10");
      btn.setAttribute("aria-label", "Fotka " + (i + 1));
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.className = "w-full h-full object-cover";
      btn.appendChild(img);

      // Hover ukáže náhled velké fotky okamžitě, ale nemění "potvrzený"
      // index — po odjetí myší se vrátí zpět. Klik teprve výběr potvrdí
      // (důležité na dotykových zařízeních, kde hover neexistuje).
      btn.addEventListener("mouseenter", function () {
        mainImg.src = src;
      });
      btn.addEventListener("mouseleave", function () {
        mainImg.src = currentImages[currentIndex];
      });
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
    currentProductName = product.name || "";
    priceEl.textContent = product.sold ? product.price + " · Prodáno" : product.price || "";
    descEl.textContent = [product.desc, product.desc1, product.desc2]
      .filter(Boolean)
      .join("\n\n");
    specsBody.innerHTML =
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

  poptatBtn.addEventListener("click", function () {
    closeModal();
    var zprava = document.getElementById("zprava");
    var kontaktSection = document.getElementById("kontakt");
    if (zprava && currentProductName) {
      zprava.value = 'Dobrý den, mám zájem o produkt "' + currentProductName + '". ';
    }
    if (kontaktSection) {
      kontaktSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (zprava) {
      // Až doscrolluje (smooth scroll trvá chvíli), teprve pak zaostřit —
      // jinak by focus přerušil probíhající animaci scrollování.
      window.setTimeout(function () {
        zprava.focus();
        zprava.setSelectionRange(zprava.value.length, zprava.value.length);
      }, 500);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") setIndex(currentIndex - 1);
    if (e.key === "ArrowRight") setIndex(currentIndex + 1);
  });

  // --- Kontaktní formulář (Formspree, AJAX — bez opuštění stránky) ---
  var form = document.getElementById("poptavka-form");
  var statusEl = document.getElementById("poptavka-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      statusEl.textContent = "Odesílám…";
      statusEl.className = "label-caps mt-4 text-ink/60";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            statusEl.textContent = "Díky za zprávu! Ozvu se co nejdřív.";
            statusEl.className = "label-caps mt-4 text-coral";
            form.reset();
          } else {
            return response.json().then(function (data) {
              var message =
                data && data.errors
                  ? data.errors.map(function (err) { return err.message; }).join(", ")
                  : "Něco se pokazilo, zkus to prosím znovu.";
              throw new Error(message);
            });
          }
        })
        .catch(function (err) {
          statusEl.textContent = err.message || "Odeslání se nezdařilo, zkus to prosím znovu.";
          statusEl.className = "label-caps mt-4 text-red-300";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();

let cart = [];

function money(value) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function countWords(value) {
  const text = String(value || "").trim();

  if (!text) {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
}

function countDigits(value) {
  return (String(value || "").match(/\d/g) || []).length;
}

function calculateUnitPrice(product, extraName, extraNumber) {
  const nameExtra = product.extraName
    ? countWords(extraName) * 70
    : 0;

  const numberExtra = product.extraNumber
    ? countDigits(extraNumber) * 60
    : 0;

  return product.basePrice + nameExtra + numberExtra;
}

function cartId() {
  return Date.now() + "-" + Math.random().toString(16).slice(2);
}

function renderProducts() {
  const container = document.getElementById("products");

  if (!container) {
    return;
  }

  let html = "";

  PRODUCTS.forEach(product => {
    let sizeOptions = "";

    product.sizes.forEach(size => {
      sizeOptions += `
        <option value="${escapeHtml(size)}">
          ${escapeHtml(size)}
        </option>
      `;
    });

    let sizeField = "";

    if (product.sizeRequired) {
      sizeField = `
        <div class="field">
          <label>Velikost *</label>
          <select class="size">
            <option value="">Vyberte velikost</option>
            ${sizeOptions}
          </select>
        </div>
      `;
    }

    let nameField = "";

    if (product.extraName) {
      nameField = `
        <div class="field">
          <label>Jméno navíc <small>(+70 Kč za slovo)</small></label>
          <input class="extra-name" type="text" placeholder="Nepovinné">
        </div>
      `;
    }

    let numberField = "";

    if (product.extraNumber) {
      numberField = `
        <div class="field">
          <label>Číslo navíc <small>(+60 Kč za cifru)</small></label>
          <input
            class="extra-number"
            type="text"
            inputmode="numeric"
            maxlength="3"
            placeholder="Nepovinné"
          >
        </div>
      `;
    }

    html += `
      <article class="product-card" data-product-id="${product.id}">
        <img
          class="product-image"
          src="${product.image}"
          alt="${escapeHtml(product.name)}"
        >

        <div class="product-body">
          <div class="product-head">
            <h3 class="product-title">${escapeHtml(product.name)}</h3>
            <span class="brand">${escapeHtml(product.brand)}</span>
          </div>

          <div class="base-price">
            Základní cena: ${money(product.basePrice)}
          </div>

          <p class="description">
            ${escapeHtml(product.description)}
          </p>

          ${sizeField}

          <div class="field">
            <label>Iniciály *</label>
            <input
              class="initials"
              type="text"
              maxlength="5"
              placeholder="Např. FB"
            >
          </div>

          ${nameField}
          ${numberField}

          <div class="two-col">
            <div class="field">
              <label>Množství *</label>
              <div class="quantity">
                <input
                  class="quantity-input"
                  type="number"
                  min="1"
                  max="20"
                  value="1"
                >
              </div>
            </div>

            <div class="field">
              <label>Cena položky</label>
              <div class="price-preview">
                <span class="line-price">
                  ${money(product.basePrice)}
                </span>
              </div>
            </div>
          </div>

          <button type="button" class="add-to-cart">
            Přidat do košíku
          </button>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;

  document.querySelectorAll(".product-card").forEach(card => {
    const product = PRODUCTS.find(item => {
      return item.id === card.dataset.productId;
    });

    const updatePrice = function () {
      const nameInput = card.querySelector(".extra-name");
      const numberInput = card.querySelector(".extra-number");
      const quantityInput = card.querySelector(".quantity-input");

      const extraName = nameInput ? nameInput.value : "";
      const extraNumber = numberInput ? numberInput.value : "";
      const quantity = Math.max(
        1,
        Number(quantityInput.value) || 1
      );

      const itemPrice = calculateUnitPrice(
        product,
        extraName,
        extraNumber
      );

      card.querySelector(".line-price").textContent = money(
        itemPrice * quantity
      );
    };

    card.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("input", updatePrice);
      input.addEventListener("change", updatePrice);
    });

    card.querySelector(".add-to-cart").addEventListener(
      "click",
      function () {
        addToCart(product, card);
      }
    );
  });
}

function addToCart(product, card) {
  const sizeSelect = card.querySelector(".size");
  const initialsInput = card.querySelector(".initials");
  const extraNameInput = card.querySelector(".extra-name");
  const extraNumberInput = card.querySelector(".extra-number");
  const quantityInput = card.querySelector(".quantity-input");

  const size = sizeSelect ? sizeSelect.value : "";
  const initials = initialsInput.value.trim().toUpperCase();
  const extraName = extraNameInput ? extraNameInput.value.trim() : "";
  const extraNumber = extraNumberInput ? extraNumberInput.value.trim() : "";
  const quantity = Math.max(1, Number(quantityInput.value) || 1);

  if (product.sizeRequired && !size) {
    alert("Vyberte velikost produktu: " + product.name);
    return;
  }

  if (!initials) {
    alert("Doplňte iniciály produktu: " + product.name);
    return;
  }

  const unitPrice = calculateUnitPrice(
    product,
    extraName,
    extraNumber
  );

  cart.push({
    id: cartId(),
    productId: product.id,

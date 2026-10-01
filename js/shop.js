let cart = [];

function money(value) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function countWords(value) {
  const text = String(value || "").trim();

  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function countDigits(value) {
  return (String(value || "").match(/\d/g) || []).length;
}

function calculateUnitPrice(product, extraName, extraNumber) {
  const extraNamePrice = product.extraName
    ? countWords(extraName) * 70
    : 0;

  const extraNumberPrice = product.extraNumber
    ? countDigits(extraNumber) * 60
    : 0;

  return product.basePrice + extraNamePrice + extraNumberPrice;
}

function createCartItemId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderProducts() {
  const container = document.getElementById("products");

  if (!container) {
    return;
  }

  container.innerHTML = PRODUCTS.map(product => {
    const sizeField = product.sizeRequired
      ? `
        <div class="field">
          <label>Velikost *</label>

          <select class="size">
            <option value="">Vyberte velikost</option>

            ${product.sizes.map(size => `
              <option value="${escapeHtml(size)}">
                ${escapeHtml(size)}
              </option>
            `).join("")}
          </select>

          <small class="size-guide">
            <a
              href="${product.brand === "JAKO"
                ? APP_CONFIG.jakoSizeGuide
                : APP_CONFIG.jomaSizeGuide}"
              target="_blank"
              rel="noopener"
            >
              Tabulka velikostí ${product.brand}
            </a>
          </small>
        </div>
      `
      : "";

    const extraNameField = product.extraName
      ? `
        <div class="field">
          <label>Jméno navíc <small>(+70 Kč za slovo)</small></label>

          <input
            class="extra-name"
            type="text"
            placeholder="Nepovinné"
          >
        </div>
      `
      : "";

    const extraNumberField = product.extraNumber
      ? `
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
      `
      : "";

    return `
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
              autocomplete="off"
            >
          </div>

          ${extraNameField}
          ${extraNumberField}

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
  }).join("");

  document.querySelectorAll(".product-card").forEach(card => {
    const product = PRODUCTS.find(
      item => item.id === card.dataset.productId
    );

    const updateCardPrice = () => {
      const extraName = card.querySelector(".extra-name")?.value || "";
      const extraNumber = card.querySelector(".extra-number")?.value || "";
      const quantity = Math.max(
        1,
        Number(card.querySelector(".quantity-input").value) || 1
      );

      const unitPrice = calculateUnitPrice(
        product,
        extraName,
        extraNumber
      );

      card.querySelector(".line-price").textContent = money(
        unitPrice * quantity
      );
    };

    card.querySelectorAll("input, select").forEach(input => {
      input.addEventListener("input", updateCardPrice);
      input.addEventListener("change", updateCardPrice);
    });

    card.querySelector(".add-to-cart").addEventListener("click", () => {
      addToCart(product, card);
    });
  });
}

function addToCart(product, card) {
  const size = card.querySelector(".size")?.value || "";
  const initials = card.querySelector(".initials").value
    .trim()
    .toUpperCase();

  const extraName = card.querySelector(".extra-name")?.value
    .trim() || "";

  const extraNumber = card.querySelector(".extra-number")?.value
    .trim() || "";

  const quantity = Math.max(
    1,
    Number(card.querySelector(".quantity-input").value) || 1
  );

  if (product.sizeRequired && !size) {
    alert(`Vyberte velikost produktu: ${product.name}`);
    return;
  }

  if (!initials) {
    alert(`Doplňte iniciály produktu: ${product.name}`);
    return;
  }

  const unitPrice = calculateUnitPrice(
    product,
    extraName,
    extraNumber
  );

  cart.push({
    cartItemId: createCartItemId(),
    productId: product.id,
    product: product.name,
    brand: product.brand,
    size: size,
    initials: initials,
    extraName: extraName,
    extraNumber: extraNumber,
    quantity: quantity,
    unitPrice: unitPrice,
    lineTotal: unitPrice * quantity
  });

  renderCart();
  resetProductCard(card, product);
}

function resetProductCard(card, product) {
  const sizeField = card.querySelector(".size");
  const initialsField = card.querySelector(".initials");
  const extraNameField = card.querySelector(".extra-name");
  const extraNumberField = card.querySelector(".extra-number");
  const quantityField = card.querySelector(".quantity-input");

  if (sizeField) {
    sizeField.value = "";
  }

  initialsField.value = "";

  if (extraNameField) {
    extraNameField.value = "";
  }

  if (extraNumberField) {
    extraNumberField.value = "";
  }

  quantityField.value = 1;

  card.querySelector(".line-price").textContent = money(
    product.basePrice
  );
}

function renderCart() {
  const cartItemsElement = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutForm = document.getElementById("checkout");

  if (!cartItemsElement || !cartTotalElement || !checkoutForm) {
    return;
  }

  const total = cart.reduce((sum, item) => {
    return sum + item.lineTotal;
  }, 0);

  if (cart.length === 0) {
    cartItemsElement.innerHTML = `
      <div class="cart-empty">
        Košík je zatím prázdný.
      </div>
    `;
  } else {
    cartItemsElement.innerHTML = cart.map(item => {
      const details = [
        item.size ? `Velikost: ${escapeHtml(item.size)}` : "",
        `Iniciály: ${escapeHtml(item.initials)}`,
        item.extraName
          ? `Jméno: ${escapeHtml(item.extraName)}`
          : "",
        item.extraNumber
          ? `Číslo: ${escapeHtml(item.extraNumber)}`
          : ""
      ].filter(Boolean).join(" · ");

      return `
        <div class="cart-item">
          <div class="cart-name">
            ${escapeHtml(item.product)}
          </div>

          <div class="cart-meta">
            ${details}
          </div>

          <div class="cart-meta">
            ${item.quantity}× ${money(item.unitPrice)}
            = <strong>${money(item.lineTotal)}</strong>
          </div>

          <button
            type="button"
            class="remove-item"
            data-cart-item-id="${item.cartItemId}"
          >
            Odebrat
          </button>
        </div>
      `;
    }).join("");
  }

  cartTotalElement.textContent = money(total);

  if (cart.length > 0) {
    checkoutForm.classList.remove("hidden");
  } else {
    checkoutForm.classList.add("hidden");
  }

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      cart = cart.filter(item => {
        return item.cartItemId !== button.dataset.cartItemId;
      });

      renderCart();
    });
  });
}

function showStatus(type, message) {
  const statusElement = document.getElementById("status");

  if (!statusElement) {
    return;
  }

  statusElement.className = `status ${type}`;
  statusElement.innerHTML = message;
}

async function submitOrder(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (cart.length === 0) {
    showStatus(
      "error",
      "<strong>Košík je prázdný.</strong>"
    );
    return;
  }

  if (!form.reportValidity()) {
    return;
  }

  if (
    !APP_CONFIG.apiUrl ||
    APP_CONFIG.apiUrl === "DOPLNTE_URL_GOOGLE_APPS_SCRIPT_WEB_APP"
  ) {
    showStatus(
      "error",
      "<strong>E-shop ještě není připojený k objednávkovému systému.</strong>"
    );
    return;
  }

  const orderTotal = cart.reduce((sum, item) => {
    return sum + item.lineTotal;
  }, 0);

  const payload = {
    playerName: form.playerName.value.trim(),
    guardianName: form.guardianName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    note: form.note.value.trim(),
    orderTotal: orderTotal,

    items: cart.map(item => ({
      productId: item.productId,
      product: item.product,
      brand: item.brand,
      size: item.size,
      initials: item.initials,
      extraName: item.extraName,
      extraNumber: item.extraNumber,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal
    }))
  };

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  submitButton.disabled = true;

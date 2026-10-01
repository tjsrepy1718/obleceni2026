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

  if (sizeSelect) {
    sizeSelect.value = "";
  }

  initialsInput.value = "";

  if (extraNameInput) {
    extraNameInput.value = "";
  }

  if (extraNumberInput) {
    extraNumberInput.value = "";
  }

  quantityInput.value = 1;

  card.querySelector(".line-price").textContent = money(
    product.basePrice
  );
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkout = document.getElementById("checkout");

  if (!cartItems || !cartTotal || !checkout) {
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.lineTotal;
  });

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        Košík je zatím prázdný.
      </div>
    `;
  } else {
    let html = "";

    cart.forEach(item => {
      const details = [];

      if (item.size) {
        details.push("Velikost: " + escapeHtml(item.size));
      }

      details.push("Iniciály: " + escapeHtml(item.initials));

      if (item.extraName) {
        details.push("Jméno: " + escapeHtml(item.extraName));
      }

      if (item.extraNumber) {
        details.push("Číslo: " + escapeHtml(item.extraNumber));
      }

      html += `
        <div class="cart-item">
          <div class="cart-name">
            ${escapeHtml(item.product)}
          </div>

          <div class="cart-meta">
            ${details.join(" · ")}
          </div>

          <div class="cart-meta">
            ${item.quantity}× ${money(item.unitPrice)}
            = <strong>${money(item.lineTotal)}</strong>
          </div>

          <button
            type="button"
            class="remove-item"
            data-id="${item.id}"
          >
            Odebrat
          </button>
        </div>
      `;
    });

    cartItems.innerHTML = html;
  }

  cartTotal.textContent = money(total);

  if (cart.length > 0) {
    checkout.classList.remove("hidden");
  } else {
    checkout.classList.add("hidden");
  }

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", function () {
      cart = cart.filter(item => {
        return item.id !== button.dataset.id;
      });

      renderCart();
    });
  });
}

function showStatus(type, message) {
  const status = document.getElementById("status");

  if (!status) {
    return;
  }

  status.className = "status " + type;
  status.innerHTML = message;
}

async function submitOrder(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (cart.length === 0) {
    showStatus("error", "<strong>Košík je prázdný.</strong>");
    return;
  }

  if (!form.reportValidity()) {
    return;
  }

  const button = form.querySelector('button[type="submit"]');

  let orderTotal = 0;

  cart.forEach(item => {
    orderTotal += item.lineTotal;
  });

  const payload = {
    playerName: form.playerName.value.trim(),
    guardianName: form.guardianName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    note: form.note.value.trim(),
    orderTotal: orderTotal,
    items: cart
  };

  button.disabled = true;
  button.textContent = "Odesílám objednávku…";

  showStatus(
    "sending",
    "Objednávka se odesílá. Počkejte prosím…"
  );

  try {
    const response = await fetch(APP_CONFIG.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Server vrátil chybu HTTP " + response.status);
    }

    const result = await response.json();

    if (!result.ok) {
      throw new Error(
        result.error || "Objednávku se nepodařilo uložit."
      );
    }

    cart = [];
    renderCart();
    form.reset();

    showStatus(
      "ok",
      `
        <strong>Objednávka byla úspěšně přijata.</strong><br>
        Číslo objednávky: <strong>${escapeHtml(result.orderId)}</strong><br>
        Potvrzení bylo odesláno na:
        <strong>${escapeHtml(payload.email)}</strong>
      `
    );

    document.getElementById("status").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  } catch (error) {
    showStatus(
      "error",
      `
        <strong>Objednávku se nepodařilo odeslat.</strong><br>
        ${escapeHtml(error.message)}<br>
        Položky zůstaly v košíku. Zkuste to prosím znovu.
      `
    );
  } finally {
    button.disabled = false;
    button.textContent = "Závazně odeslat objednávku";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  renderCart();

  const checkout = document.getElementById("checkout");

  if (checkout) {
    checkout.addEventListener("submit", submitOrder);
  }
});

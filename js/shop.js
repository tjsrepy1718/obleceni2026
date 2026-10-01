document.getElementById("products").innerHTML =
  "<h2 style='color:red'>JavaScript funguje</h2>";
let cart = [];

function money(value) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(value);
}

function numberOfWords(value) {
  const text = value.trim();

  return text ? text.split(/\s+/).length : 0;
}

function numberOfDigits(value) {
  return (value.match(/\d/g) || []).length;
}

function calculatePrice(product, extraName, extraNumber) {
  const nameExtra = product.extraName
    ? numberOfWords(extraName) * 70
    : 0;

  const numberExtra = product.extraNumber
    ? numberOfDigits(extraNumber) * 60
    : 0;

  return product.basePrice + nameExtra + numberExtra;
}

function renderProducts() {
  const container = document.getElementById("products");

  container.innerHTML = PRODUCTS.map(product => {
    const sizeField = product.sizeRequired
      ? `
        <div class="field">
          <label>Velikost *</label>
          <select class="size">
            <option value="">Vyberte velikost</option>
            ${product.sizes.map(size => `
              <option value="${size}">${size}</option>
            `).join("")}
          </select>
        </div>
      `
      : "";

    const nameField = product.extraName
      ? `
        <div class="field">
          <label>Jméno navíc (+70 Kč za slovo)</label>
          <input class="extra-name" placeholder="Nepovinné">
        </div>
      `
      : "";

    const numberField = product.extraNumber
      ? `
        <div class="field">
          <label>Číslo navíc (+60 Kč za cifru)</label>
          <input
            class="extra-number"
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
          alt="${product.name}"
        >

        <div class="product-body">
          <div class="product-head">
            <h3 class="product-title">${product.name}</h3>
            <span class="brand">${product.brand}</span>
          </div>

          <div class="base-price">
            Základní cena: ${money(product.basePrice)}
          </div>

          <p class="description">${product.description}</p>

          ${sizeField}

          <div class="field">
            <label>Iniciály *</label>
            <input class="initials" maxlength="5" placeholder="Např. FB">
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
  }).join("");

  document.querySelectorAll(".product-card").forEach(card => {
    const product = PRODUCTS.find(
      item => item.id === card.dataset.productId
    );

    function updateCardPrice() {
      const extraName = card.querySelector(".extra-name")?.value || "";
      const extraNumber = card.querySelector(".extra-number")?.value || "";
      const quantity = Math.max(
        1,
        Number(card.querySelector(".quantity-input").value) || 1
      );

      const pricePerItem = calculatePrice(
        product,
        extraName,
        extraNumber
      );

      card.querySelector(".line-price").textContent = money(
        pricePerItem * quantity
      );
    }

    card.querySelectorAll("input, select").forEach(field => {
      field.addEventListener("input", updateCardPrice);
      field.addEventListener("change", updateCardPrice);
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

  const unitPrice = calculatePrice(
    product,
    extraName,
    extraNumber
  );

  cart.push({
    id: `${Date.now()}-${Math.random()}`,
    product: product.name,
    size: size,
    initials: initials,
    extraName: extraName,
    extraNumber: extraNumber,
    quantity: quantity,
    unitPrice: unitPrice,
    total: unitPrice * quantity
  });

  renderCart();

  card.querySelector(".initials").value = "";

  if (card.querySelector(".size")) {
    card.querySelector(".size").value = "";
  }

  if (card.querySelector(".extra-name")) {
    card.querySelector(".extra-name").value = "";
  }

  if (card.querySelector(".extra-number")) {
    card.querySelector(".extra-number").value = "";
  }

  card.querySelector(".quantity-input").value = 1;
  card.querySelector(".line-price").textContent = money(product.basePrice);
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkout = document.getElementById("checkout");

  const total = cart.reduce((sum, item) => {
    return sum + item.total;
  }, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        Košík je zatím prázdný.
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => {
      const details = [
        item.size ? `Velikost: ${item.size}` : "",
        `Iniciály: ${item.initials}`,
        item.extraName ? `Jméno: ${item.extraName}` : "",
        item.extraNumber ? `Číslo: ${item.extraNumber}` : ""
      ].filter(Boolean).join(" · ");

      return `
        <div class="cart-item">
          <div class="cart-name">${item.product}</div>

          <div class="cart-meta">${details}</div>

          <div class="cart-meta">
            ${item.quantity}× ${money(item.unitPrice)}
            = <strong>${money(item.total)}</strong>
          </div>

          <button
            type="button"
            class="remove-item"
            data-id="${item.id}"
            style="margin-top: 8px;"
          >
            Odebrat
          </button>
        </div>
      `;
    }).join("");
  }

  cartTotal.textContent = money(total);

  if (cart.length > 0) {
    checkout.classList.remove("hidden");
  } else {
    checkout.classList.add("hidden");
  }

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      cart = cart.filter(item => item.id !== button.dataset.id);
      renderCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});

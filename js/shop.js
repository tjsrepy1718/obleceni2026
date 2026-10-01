let cart = [];

function money(value) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0
  }).format(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function countWords(text) {
  const cleanText = text.trim();

  if (!cleanText) {
    return 0;
  }

  return cleanText.split(/\s+/).filter(Boolean).length;
}

function countDigits(text) {
  return (text.match(/\d/g) || []).length;
}

function calculateUnitPrice(product, extraName, extraNumber) {
  const namePrice = product.extraName
    ? countWords(extraName) * 70
    : 0;

  const numberPrice = product.extraNumber
    ? countDigits(extraNumber) * 60
    : 0;

  return product.basePrice + namePrice + numberPrice;
}

function createLineId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderProducts() {
  const productsElement = document.getElementById("products");

  productsElement.innerHTML = PRODUCTS.map(product => {
    const sizeSelect = product.sizeRequired
      ? `
        <div

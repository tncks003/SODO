const shopProductGrid = document.getElementById("shopProductGrid");
const productSearch = document.getElementById("productSearch");
const productSort = document.getElementById("productSort");
const productCount = document.getElementById("productCount");
const categoryButtons = document.querySelectorAll(".shop-category-tabs button");

let selectedCategory = "ALL";

function getProductPriceNumber(priceText) {
  return Number(String(priceText).replace(/[^\d]/g, ""));
}

function renderShopProducts() {
  if (!shopProductGrid || typeof products === "undefined") return;

  const keyword = productSearch ? productSearch.value.toLowerCase().trim() : "";
  const sortValue = productSort ? productSort.value : "default";

  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "ALL" || product.type === selectedCategory;

    const matchesKeyword =
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword) ||
      product.color.toLowerCase().includes(keyword);

    return matchesCategory && matchesKeyword;
  });

  if (sortValue === "low") {
    filteredProducts.sort((a, b) => getProductPriceNumber(a.price) - getProductPriceNumber(b.price));
  }

  if (sortValue === "high") {
    filteredProducts.sort((a, b) => getProductPriceNumber(b.price) - getProductPriceNumber(a.price));
  }

  if (sortValue === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (productCount) {
    productCount.textContent = `${filteredProducts.length} ITEMS`;
  }

  if (filteredProducts.length === 0) {
    shopProductGrid.innerHTML = `
      <div class="coming-soon-box">
        <p class="coming-label">${selectedCategory}</p>
        <h2>COMING SOON</h2>
        <p>
          SODO is preparing new pieces for this category.
          Please check the next drop.
        </p>
      </div>
    `;
    return;
  }

  shopProductGrid.innerHTML = filteredProducts
    .map((product) => {
      return `
        <a href="product.html?id=${product.id}" class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-placeholder">SODO</div>
          </div>

          <div class="product-info">
            <p class="product-meta">${product.category}</p>
            <h2>${product.name}</h2>
            <p>${product.price}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedCategory = button.dataset.category;

    if (productSearch) {
      productSearch.value = "";
    }

    renderShopProducts();
  });
});

if (productSearch) {
  productSearch.addEventListener("input", renderShopProducts);
}

if (productSort) {
  productSort.addEventListener("change", renderShopProducts);
}

renderShopProducts();
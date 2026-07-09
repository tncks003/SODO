const shopProductGrid = document.getElementById("shopProductGrid");
const productSearch = document.getElementById("productSearch");
const productSort = document.getElementById("productSort");
const productCount = document.getElementById("productCount");

function getProductPriceNumber(priceText) {
  return Number(String(priceText).replace(/[^\d]/g, ""));
}

function renderShopProducts() {
  if (!shopProductGrid || typeof products === "undefined") return;

  const keyword = productSearch ? productSearch.value.toLowerCase().trim() : "";
  const sortValue = productSort ? productSort.value : "default";

  let filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword)
    );
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
      <div class="no-products">
        <p>No products found.</p>
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
            <h2>${product.name}</h2>
            <p>${product.price}</p>
          </div>
        </a>
      `;
    })
    .join("");
}

if (productSearch) {
  productSearch.addEventListener("input", renderShopProducts);
}

if (productSort) {
  productSort.addEventListener("change", renderShopProducts);
}

renderShopProducts();
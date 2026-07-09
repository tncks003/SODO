const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* 상품 상세페이지 자동 변경 */

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (productId && typeof products !== "undefined") {
  const product = products.find((item) => item.id === productId);

  if (product) {
    const productImage = document.getElementById("productImage");
    const productImageFallback = document.getElementById("productImageFallback");
    const productCategory = document.getElementById("productCategory");
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const productDescription = document.getElementById("productDescription");
    const productMaterial = document.getElementById("productMaterial");
    const productColor = document.getElementById("productColor");
    const productMade = document.getElementById("productMade");

    document.title = `${product.name} - SODO`;

    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.name;

      productImage.onerror = function () {
        productImage.style.display = "none";
        if (productImageFallback) {
          productImageFallback.style.display = "block";
        }
      };
    }

    if (productCategory) productCategory.textContent = product.category;
    if (productName) productName.textContent = product.name;
    if (productPrice) productPrice.textContent = product.price;
    if (productDescription) productDescription.textContent = product.description;
    if (productMaterial) productMaterial.textContent = `Material: ${product.material}`;
    if (productColor) productColor.textContent = `Color: ${product.color}`;
    if (productMade) productMade.textContent = product.made;
  }
}

/* 사이즈 선택 */

const sizeButtons = document.querySelectorAll(".size-list button");

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sizeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

/* 장바구니 버튼 임시 기능 */

const cartButton = document.querySelector(".cart-button");

if (cartButton) {
  cartButton.addEventListener("click", () => {
    alert("현재는 데모 사이트입니다. 장바구니 기능은 다음 단계에서 추가할 수 있습니다.");
  });
}
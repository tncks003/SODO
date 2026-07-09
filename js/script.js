/* YEAR */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

/* CART STORAGE */

const CART_KEY = "sodoCart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function priceToNumber(priceText) {
  return Number(String(priceText).replace(/[^\d]/g, ""));
}

function formatPrice(number) {
  return "₩" + number.toLocaleString("ko-KR");
}

/* PRODUCT DETAIL PAGE */

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
let currentProduct = null;

if (productId && typeof products !== "undefined") {
  const product = products.find((item) => item.id === productId);

  if (product) {
    currentProduct = product;

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

/* SIZE SELECT */

const sizeButtons = document.querySelectorAll(".size-list button");

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sizeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

/* ADD TO CART */

const cartButton = document.querySelector(".cart-button");

if (cartButton) {
  cartButton.addEventListener("click", () => {
    if (!currentProduct) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    const selectedSizeButton = document.querySelector(".size-list button.active");

    if (!selectedSizeButton) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    const selectedSize = selectedSizeButton.textContent;
    const cart = getCart();

    const existingItem = cart.find(
      (item) => item.id === currentProduct.id && item.size === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        priceNumber: priceToNumber(currentProduct.price),
        image: currentProduct.image,
        size: selectedSize,
        quantity: 1
      });
    }

    saveCart(cart);

    alert(`${currentProduct.name} / ${selectedSize} 사이즈가 장바구니에 담겼습니다.`);
  });
}

/* CART PAGE RENDER */

const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartSummary = document.getElementById("cartSummary");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");

function renderCart() {
  if (!cartItems) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    if (emptyCart) emptyCart.style.display = "block";
    if (cartSummary) cartSummary.style.display = "none";
    return;
  }

  if (emptyCart) emptyCart.style.display = "none";
  if (cartSummary) cartSummary.style.display = "block";

  cartItems.innerHTML = cart
    .map((item, index) => {
      return `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <span>SODO</span>
          </div>

          <div class="cart-item-info">
            <h2>${item.name}</h2>
            <p>Size: ${item.size}</p>
            <p>${item.price}</p>

            <div class="quantity-control">
              <button type="button" data-action="decrease" data-index="${index}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-index="${index}">+</button>
            </div>

            <button type="button" class="remove-button" data-action="remove" data-index="${index}">
              REMOVE
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  const subtotal = cart.reduce((sum, item) => {
    return sum + item.priceNumber * item.quantity;
  }, 0);

  if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
  if (cartTotal) cartTotal.textContent = formatPrice(subtotal);
}

if (cartItems) {
  renderCart();

  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const index = Number(button.dataset.index);
    const cart = getCart();

    if (!cart[index]) return;

    if (action === "increase") {
      cart[index].quantity += 1;
    }

    if (action === "decrease") {
      cart[index].quantity -= 1;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }

    if (action === "remove") {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  });
}

/* CHECKOUT DEMO */

const checkoutButton = document.querySelector(".checkout-button");

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    alert("현재는 데모 사이트입니다. 실제 결제 기능은 추후 추가할 수 있습니다.");
  });
}
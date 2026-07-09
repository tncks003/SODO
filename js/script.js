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
  updateCartCount();
}

function priceToNumber(priceText) {
  return Number(String(priceText).replace(/[^\d]/g, ""));
}

function formatPrice(number) {
  return "₩" + number.toLocaleString("ko-KR");
}

/* CART COUNT */

function updateCartCount() {
  const cartLink = document.querySelector('a[href="cart.html"]');

  if (!cartLink) return;

  const cart = getCart();

  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  if (totalQuantity > 0) {
    cartLink.textContent = `CART (${totalQuantity})`;
  } else {
    cartLink.textContent = "CART";
  }
}

updateCartCount();

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

    updateCartCount();
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

  updateCartCount();
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

/* GO TO CHECKOUT */

const checkoutButton = document.querySelector(".checkout-button");

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    window.location.href = "checkout.html";
  });
}

/* CHECKOUT PAGE */

const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");

if (checkoutItems) {
  const cart = getCart();

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="checkout-empty">
        <p>주문할 상품이 없습니다.</p>
        <a href="shop.html">GO TO SHOP</a>
      </div>
    `;
  } else {
    checkoutItems.innerHTML = cart
      .map((item) => {
        return `
          <div class="checkout-item">
            <div class="checkout-item-image">
              <img src="${item.image}" alt="${item.name}" />
            </div>

            <div>
              <h3>${item.name}</h3>
              <p>Size: ${item.size}</p>
              <p>Qty: ${item.quantity}</p>
              <strong>${formatPrice(item.priceNumber * item.quantity)}</strong>
            </div>
          </div>
        `;
      })
      .join("");

    const subtotal = cart.reduce((sum, item) => {
      return sum + item.priceNumber * item.quantity;
    }, 0);

    if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(subtotal);
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(subtotal);
  }
}

/* PLACE ORDER DEMO */

const placeOrderButton = document.getElementById("placeOrderButton");

if (placeOrderButton) {
  placeOrderButton.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    localStorage.removeItem(CART_KEY);
    updateCartCount();

    window.location.href = "order-complete.html";
  });
}/* MOBILE MENU */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");

    if (navMenu.classList.contains("open")) {
      menuToggle.textContent = "CLOSE";
    } else {
      menuToggle.textContent = "MENU";
    }
  });

  const navLinks = navMenu.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.textContent = "MENU";
    });
  });
}/* RELATED PRODUCTS */

const relatedProducts = document.getElementById("relatedProducts");

if (relatedProducts && typeof products !== "undefined" && currentProduct) {
  const relatedItems = products
    .filter((item) => item.id !== currentProduct.id)
    .slice(0, 3);

  relatedProducts.innerHTML = relatedItems
    .map((item) => {
      return `
        <a href="product.html?id=${item.id}" class="related-card">
          <div class="related-image">
            <img src="${item.image}" alt="${item.name}" />
            <span>SODO</span>
          </div>

          <div class="related-info">
            <h3>${item.name}</h3>
            <p>${item.price}</p>
          </div>
        </a>
      `;
    })
    .join("");
}/* NEWSLETTER DEMO */

const newsletterButton = document.getElementById("newsletterButton");
const newsletterEmail = document.getElementById("newsletterEmail");

if (newsletterButton && newsletterEmail) {
  newsletterButton.addEventListener("click", () => {
    const email = newsletterEmail.value.trim();

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    alert("뉴스레터 구독이 완료된 것처럼 처리되었습니다. 현재는 데모 버전입니다.");
    newsletterEmail.value = "";
  });
}
```javascript
const PRODUCTS_KEY = "autoMartProducts";
const CART_KEY = "autoMartCart";

const demoProducts = [
  {
    id: "1",
    name: "Engine Air Filter",
    price: 45000,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
    description: "High-quality engine air filter."
  },
  {
    id: "2",
    name: "Brake Disc",
    price: 165000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    description: "Durable replacement brake disc."
  },
  {
    id: "3",
    name: "Car Battery",
    price: 380000,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80",
    description: "Reliable battery for everyday driving."
  },
  {
    id: "4",
    name: "LED Headlight",
    price: 85000,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    description: "Bright and modern LED replacement bulb."
  },
  {
    id: "5",
    name: "Oil Filter",
    price: 28000,
    image: "https://images.unsplash.com/photo-1632823469462-2c7c5e4b1a0a?auto=format&fit=crop&w=900&q=80",
    description: "Engine oil filtration replacement."
  },
  {
    id: "6",
    name: "Brake Pad Set",
    price: 125000,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
    description: "Reliable replacement brake pad set."
  }
];

function getProducts() {
  try {
    const products = JSON.parse(
      localStorage.getItem(PRODUCTS_KEY)
    );

    return Array.isArray(products)
      ? products
      : demoProducts;

  } catch {
    return demoProducts;
  }
}

function saveProducts(products) {
  localStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(products)
  );
}

function getCart() {
  try {
    const cart = JSON.parse(
      localStorage.getItem(CART_KEY)
    );

    return Array.isArray(cart) ? cart : [];

  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
}

function money(number) {
  return new Intl.NumberFormat("mn-MN").format(
    Number(number) || 0
  ) + "₮";
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================
   STOREFRONT
========================= */

function renderProducts(search = "") {

  const grid = document.getElementById("productGrid");

  if (!grid) return;

  const query = search.toLowerCase().trim();

  const products = getProducts().filter(product => {

    const text =
      product.name +
      " " +
      (product.description || "");

    return text.toLowerCase().includes(query);

  });

  grid.innerHTML = products.map(product => `

    <article class="product-card">

      <div class="product-image">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          onerror="this.src='https://placehold.co/800x600?text=Auto+Part'"
        >
      </div>

      <div class="product-content">

        <small>AUTO PART</small>

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <p>
          ${escapeHTML(product.description)}
        </p>

        <div class="product-bottom">

          <strong>
            ${money(product.price)}
          </strong>

          <button
            class="btn primary small"
            onclick="addToCart('${product.id}')"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </article>

  `).join("");

  const empty =
    document.getElementById("noProducts");

  if (empty) {
    empty.classList.toggle(
      "hidden",
      products.length !== 0
    );
  }
}

function addToCart(id) {

  const product =
    getProducts().find(p => p.id === id);

  if (!product) return;

  const cart = getCart();

  const existing =
    cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id,
      quantity: 1
    });
  }

  saveCart(cart);

  renderCart();

  openCart();

  showToast(
    `${product.name} added to cart`
  );
}

function changeQuantity(id, amount) {

  const cart = getCart();

  const item =
    cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  saveCart(cart);

  renderCart();
}

function removeFromCart(id) {

  const cart =
    getCart().filter(item => item.id !== id);

  saveCart(cart);

  renderCart();
}

function renderCart() {

  const itemsElement =
    document.getElementById("cartItems");

  if (!itemsElement) return;

  const products = getProducts();
  const cart = getCart();

  let total = 0;
  let count = 0;

  if (cart.length === 0) {

    itemsElement.innerHTML = `
      <div class="cart-empty">
        <div>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some auto parts to get started.</p>
      </div>
    `;

  } else {

    itemsElement.innerHTML =
      cart.map(item => {

        const product =
          products.find(p => p.id === item.id);

        if (!product) return "";

        const itemTotal =
          product.price * item.quantity;

        total += itemTotal;
        count += item.quantity;

        return `

          <div class="cart-item">

            <img
              src="${escapeHTML(product.image)}"
              alt=""
            >

            <div class="cart-info">

              <strong>
                ${escapeHTML(product.name)}
              </strong>

              <span>
                ${money(product.price)}
              </span>

              <div class="quantity">

                <button
                  onclick="changeQuantity('${product.id}', -1)"
                >
                  −
                </button>

                <b>${item.quantity}</b>

                <button
                  onclick="changeQuantity('${product.id}', 1)"
                >
                  +
                </button>

                <button
                  class="remove"
                  onclick="removeFromCart('${product.id}')"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        `;

      }).join("");
  }

  const countElement =
    document.getElementById("cartCount");

  const totalElement =
    document.getElementById("cartTotal");

  if (countElement)
    countElement.textContent = count;

  if (totalElement)
    totalElement.textContent = money(total);

  const checkout =
    document.getElementById("checkoutBtn");

  if (checkout)
    checkout.disabled = cart.length === 0;
}

function openCart() {

  const cart =
    document.getElementById("cart");

  const overlay =
    document.getElementById("cartOverlay");

  if (!cart) return;

  cart.classList.add("open");

  overlay.classList.remove("hidden");
}

function closeCart() {

  document
    .getElementById("cart")
    ?.classList.remove("open");

  document
    .getElementById("cartOverlay")
    ?.classList.add("hidden");
}

/* =========================
   CHECKOUT
========================= */

function openCheckout() {

  const cart = getCart();

  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const products = getProducts();

  const summary =
    document.getElementById("checkoutSummary");

  let total = 0;

  summary.innerHTML =
    cart.map(item => {

      const product =
        products.find(p => p.id === item.id);

      const itemTotal =
        product.price * item.quantity;

      total += itemTotal;

      return `
        <div>
          <span>
            ${escapeHTML(product.name)}
            × ${item.quantity}
          </span>

          <strong>
            ${money(itemTotal)}
          </strong>
        </div>
      `;

    }).join("") +

    `
      <div class="checkout-total">
        <span>Total</span>
        <strong>${money(total)}</strong>
      </div>
    `;

  closeCart();

  document
    .getElementById("checkoutModal")
    .classList.remove("hidden");
}

function closeCheckout() {

  document
    .getElementById("checkoutModal")
    ?.classList.add("hidden");
}

function submitOrder(event) {

  event.preventDefault();

  const form = event.target;

  const formData =
    new FormData(form);

  const name =
    formData.get("name");

  const payment =
    formData.get("payment");

  const orderNumber =
    "AM-" +
    Math.floor(
      100000 + Math.random() * 900000
    );

  saveCart([]);

  renderCart();

  closeCheckout();

  form.reset();

  showToast(
    `Order ${orderNumber} placed successfully!`
  );

  console.log({
    orderNumber,
    customer: name,
    payment
  });
}

/* =========================
   ADMIN
========================= */

function renderAdminProducts() {

  const container =
    document.getElementById("adminProducts");

  if (!container) return;

  const products =
    getProducts();

  if (!products.length) {

    container.innerHTML = `
      <div class="empty">
        No products available.
      </div>
    `;

    return;
  }

  container.innerHTML =
    products.map(product => `

      <div class="admin-product">

        <img
          src="${escapeHTML(product.image)}"
          alt=""
          onerror="this.src='https://placehold.co/300x200?text=Part'"
        >

        <div class="admin-info">

          <strong>
            ${escapeHTML(product.name)}
          </strong>

          <span>
            ${money(product.price)}
          </span>

          <small>
            ${escapeHTML(product.description)}
          </small>

        </div>

        <div class="admin-actions">

          <button
            class="btn small"
            onclick="editProduct('${product.id}')"
          >
            Edit
          </button>

          <button
            class="btn small danger"
            onclick="deleteProduct('${product.id}')"
          >
            Delete
          </button>

        </div>

      </div>

    `).join("");
}

function saveProduct(event) {

  event.preventDefault();

  const editId =
    document.getElementById("editId").value;

  const product = {

    id:
      editId ||
      "product-" + Date.now(),

    name:
      document
        .getElementById("productName")
        .value
        .trim(),

    price:
      Number(
        document
          .getElementById("productPrice")
          .value
      ),

    image:
      document
        .getElementById("productImage")
        .value
        .trim(),

    description:
      document
        .getElementById("productDescription")
        .value
        .trim()

  };

  const products =
    getProducts();

  if (editId) {

    const index =
      products.findIndex(
        p => p.id === editId
      );

    if (index !== -1) {
      products[index] = product;
    }

  } else {

    products.unshift(product);

  }

  saveProducts(products);

  resetProductForm();

  renderAdminProducts();

  showToast(
    editId
      ? "Product updated."
      : "Product added."
  );
}

function editProduct(id) {

  const product =
    getProducts().find(
      p => p.id === id
    );

  if (!product) return;

  document.getElementById("editId").value =
    product.id;

  document.getElementById("productName").value =
    product.name;

  document.getElementById("productPrice").value =
    product.price;

  document.getElementById("productImage").value =
    product.image;

  document.getElementById("productDescription").value =
    product.description || "";

  document.getElementById("formTitle")
    .textContent = "Edit Product";

  document.getElementById("saveBtn")
    .textContent = "Save Changes";

  document.getElementById("cancelBtn")
    .classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteProduct(id) {

  const product =
    getProducts().find(
      p => p.id === id
    );

  if (!product) return;

  const confirmed =
    confirm(
      `Delete "${product.name}"?`
    );

  if (!confirmed) return;

  saveProducts(
    getProducts().filter(
      p => p.id !== id
    )
  );

  saveCart(
    getCart().filter(
      item => item.id !== id
    )
  );

  renderAdminProducts();

  showToast("Product deleted.");
}

function resetProductForm() {

  document
    .getElementById("productForm")
    ?.reset();

  const id =
    document.getElementById("editId");

  if (id) id.value = "";

  const title =
    document.getElementById("formTitle");

  if (title)
    title.textContent = "Add Product";

  const save =
    document.getElementById("saveBtn");

  if (save)
    save.textContent = "Add Product";

  document
    .getElementById("cancelBtn")
    ?.classList.add("hidden");
}

function resetProducts() {

  const confirmed =
    confirm(
      "Reset products to demo catalog?"
    );

  if (!confirmed) return;

  saveProducts(demoProducts);

  renderAdminProducts();

  showToast("Demo products restored.");
}

/* =========================
   TOAST
========================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
}

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (
      !localStorage.getItem(
        PRODUCTS_KEY
      )
    ) {
      saveProducts(demoProducts);
    }

    renderProducts();

    renderCart();

    renderAdminProducts();

    document
      .getElementById("searchInput")
      ?.addEventListener(
        "input",
        event => {
          renderProducts(
            event.target.value
          );
        }
      );

    document
      .getElementById("checkoutForm")
      ?.addEventListener(
        "submit",
        submitOrder
      );

    document
      .getElementById("productForm")
      ?.addEventListener(
        "submit",
        saveProduct
      );

    document
      .getElementById("cancelBtn")
      ?.addEventListener(
        "click",
        resetProductForm
      );

  }
);
```

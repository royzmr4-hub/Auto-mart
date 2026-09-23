// ============================================
// AUTO MART - Supabase Version
// ============================================

// 1. SUPABASE CONFIG
const SUPABASE_URL = "https://gavemonetsfnpfzsmzyv.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_aK8QLBFOiAcmX6KQh1SJeg_M6vMd_ZU";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ============================================
// 2. GLOBAL STATE
// ============================================

let products = [];
let cart = JSON.parse(localStorage.getItem("autoMartCart")) || [];


// ============================================
// 3. HELPERS
// ============================================

function formatPrice(price) {
  return new Intl.NumberFormat("mn-MN").format(Number(price)) + " ₮";
}

function saveCart() {
  localStorage.setItem("autoMartCart", JSON.stringify(cart));
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// ============================================
// 4. LOAD PRODUCTS FROM SUPABASE
// ============================================

async function loadProducts() {
  const productGrid = document.getElementById("productGrid");

  if (productGrid) {
    productGrid.innerHTML = `
      <div class="loading">
        Loading products...
      </div>
    `;
  }

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);

    if (productGrid) {
      productGrid.innerHTML = `
        <div class="empty-state">
          <h3>Products ачааллахад алдаа гарлаа</h3>
          <p>Supabase тохиргоогоо шалгана уу.</p>
        </div>
      `;
    }

    return;
  }

  products = data || [];

  renderProducts(products);
  renderCart();
}


// ============================================
// 5. RENDER PRODUCTS
// ============================================

function renderProducts(list) {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  if (!list.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>Бараа олдсонгүй</h3>
        <p>Өөр хайлт хийж үзнэ үү.</p>
      </div>
    `;

    return;
  }

  productGrid.innerHTML = list.map(product => {
    const stock = Number(product.stock || 0);

    return `
      <article class="product-card">

        <div class="product-image">
          <img
            src="${escapeHTML(product.image_url || "https://via.placeholder.com/600x400?text=Auto+Mart")}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'"
          />
        </div>

        <div class="product-info">

          <span class="product-category">
            ${escapeHTML(product.category || "Auto Parts")}
          </span>

          <h3>${escapeHTML(product.name)}</h3>

          <p class="product-description">
            ${escapeHTML(product.description || "")}
          </p>

          <div class="product-bottom">

            <strong class="product-price">
              ${formatPrice(product.price)}
            </strong>

            ${
              stock > 0
                ? `
                  <button
                    class="add-cart-btn"
                    onclick="addToCart(${product.id})"
                  >
                    Сагсанд нэмэх
                  </button>
                `
                : `
                  <button class="add-cart-btn disabled" disabled>
                    Дууссан
                  </button>
                `
            }

          </div>

        </div>

      </article>
    `;
  }).join("");
}


// ============================================
// 6. SEARCH
// ============================================

function searchProducts() {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product => {
    return (
      String(product.name || "").toLowerCase().includes(query) ||
      String(product.description || "").toLowerCase().includes(query) ||
      String(product.category || "").toLowerCase().includes(query)
    );
  });

  renderProducts(filtered);
}


// ============================================
// 7. ADD TO CART
// ============================================

function addToCart(productId) {
  const product = products.find(
    item => Number(item.id) === Number(productId)
  );

  if (!product) {
    showToast("Бараа олдсонгүй.");
    return;
  }

  const stock = Number(product.stock || 0);

  if (stock <= 0) {
    showToast("Энэ бараа дууссан байна.");
    return;
  }

  const existing = cart.find(
    item => Number(item.id) === Number(productId)
  );

  if (existing) {

    if (existing.quantity >= stock) {
      showToast("Үлдэгдэл хүрэлцэхгүй байна.");
      return;
    }

    existing.quantity += 1;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity: 1
    });

  }

  saveCart();
  renderCart();

  showToast("Сагсанд нэмэгдлээ ✓");
}


// ============================================
// 8. CART
// ============================================

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(totalPrice);
  }

  if (!cartItems) return;

  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Сагс хоосон байна</h3>
        <p>Бүтээгдэхүүн нэмээд эндээс хараарай.</p>
      </div>
    `;

    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">

      <img
        src="${escapeHTML(
          item.image_url ||
          "https://via.placeholder.com/100x100?text=Auto"
        )}"
        alt="${escapeHTML(item.name)}"
      />

      <div class="cart-item-info">

        <h4>${escapeHTML(item.name)}</h4>

        <strong>
          ${formatPrice(item.price)}
        </strong>

        <div class="quantity-controls">

          <button onclick="changeQuantity(${item.id}, -1)">
            −
          </button>

          <span>${item.quantity}</span>

          <button onclick="changeQuantity(${item.id}, 1)">
            +
          </button>

        </div>

        <button
          class="remove-cart"
          onclick="removeFromCart(${item.id})"
        >
          Устгах
        </button>

      </div>

    </div>
  `).join("");
}


// ============================================
// 9. CHANGE QUANTITY
// ============================================

function changeQuantity(productId, amount) {
  const item = cart.find(
    item => Number(item.id) === Number(productId)
  );

  if (!item) return;

  const product = products.find(
    product => Number(product.id) === Number(productId)
  );

  const maxStock = product
    ? Number(product.stock || 0)
    : 999;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(
      cartItem => Number(cartItem.id) !== Number(productId)
    );
  }

  if (item.quantity > maxStock) {
    item.quantity = maxStock;
    showToast("Үлдэгдэл хүрэлцэхгүй байна.");
  }

  saveCart();
  renderCart();
}


// ============================================
// 10. REMOVE FROM CART
// ============================================

function removeFromCart(productId) {
  cart = cart.filter(
    item => Number(item.id) !== Number(productId)
  );

  saveCart();
  renderCart();

  showToast("Сагснаас хасагдлаа.");
}


// ============================================
// 11. OPEN / CLOSE CART
// ============================================

function openCart() {
  const cartDrawer = document.getElementById("cartDrawer");

  if (cartDrawer) {
    cartDrawer.classList.add("open");
  }
}

function closeCart() {
  const cartDrawer = document.getElementById("cartDrawer");

  if (cartDrawer) {
    cartDrawer.classList.remove("open");
  }
}


// ============================================
// 12. CHECKOUT
// ============================================

function openCheckout() {
  if (!cart.length) {
    showToast("Эхлээд бараа сагсанд нэмнэ үү.");
    return;
  }

  const checkoutModal = document.getElementById("checkoutModal");

  if (!checkoutModal) return;

  updateCheckoutSummary();

  checkoutModal.classList.add("open");

  closeCart();
}

function closeCheckout() {
  const checkoutModal = document.getElementById("checkoutModal");

  if (checkoutModal) {
    checkoutModal.classList.remove("open");
  }
}

function updateCheckoutSummary() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  if (checkoutTotal) {
    checkoutTotal.textContent = formatPrice(total);
  }

  if (!checkoutItems) return;

  checkoutItems.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>
        ${escapeHTML(item.name)} × ${item.quantity}
      </span>

      <strong>
        ${formatPrice(item.price * item.quantity)}
      </strong>
    </div>
  `).join("");
}


// ============================================
// 13. CREATE ORDER
// ============================================

async function submitOrder(event) {
  event.preventDefault();

  if (!cart.length) {
    showToast("Сагс хоосон байна.");
    return;
  }

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const addressInput = document.getElementById("customerAddress");

  const paymentInput = document.querySelector(
    'input[name="payment"]:checked'
  );

  if (!nameInput || !phoneInput || !addressInput) {
    showToast("Захиалгын form олдсонгүй.");
    return;
  }

  const customerName = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  const paymentMethod = paymentInput
    ? paymentInput.value
    : "cod";

  if (!customerName || !phone || !address) {
    showToast("Мэдээллээ бүрэн бөглөнө үү.");
    return;
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  // Create order
  const { data: order, error: orderError } =
    await supabaseClient
      .from("orders")
      .insert({
        customer_name: customerName,
        phone: phone,
        address: address,
        payment_method: paymentMethod,
        total: total,
        status: "pending"
      })
      .select()
      .single();

  if (orderError) {
    console.error(orderError);
    showToast("Захиалга үүсгэхэд алдаа гарлаа.");
    return;
  }

  // Create order items
  const orderItems = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: Number(item.price)
  }));

  const { error: itemsError } =
    await supabaseClient
      .from("order_items")
      .insert(orderItems);

  if (itemsError) {
    console.error(itemsError);

    // Remove incomplete order
    await supabaseClient
      .from("orders")
      .delete()
      .eq("id", order.id);

    showToast("Захиалгын бараануудыг хадгалахад алдаа гарлаа.");
    return;
  }

  // Success
  cart = [];

  saveCart();
  renderCart();

  closeCheckout();

  const form = document.getElementById("checkoutForm");

  if (form) {
    form.reset();
  }

  showToast(
    `Захиалга амжилттай! #${order.id}`
  );
}


// ============================================
// 14. ADMIN - ADD PRODUCT
// ============================================

async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("productName");
  const price = document.getElementById("productPrice");
  const image = document.getElementById("productImage");
  const description = document.getElementById("productDescription");
  const category = document.getElementById("productCategory");
  const stock = document.getElementById("productStock");

  if (!name || !price) return;

  const product = {
    name: name.value.trim(),
    price: Number(price.value),
    image_url: image ? image.value.trim() : "",
    description: description ? description.value.trim() : "",
    category: category ? category.value.trim() : "Auto Parts",
    stock: stock ? Number(stock.value) : 0
  };

  if (!product.name || !product.price) {
    showToast("Барааны нэр болон үнэ оруулна уу.");
    return;
  }

  const { error } = await supabaseClient
    .from("products")
    .insert(product);

  if (error) {
    console.error(error);
    showToast("Бараа нэмэхэд алдаа гарлаа.");
    return;
  }

  showToast("Бараа амжилттай нэмэгдлээ ✓");

  const form = document.getElementById("productForm");

  if (form) {
    form.reset();
  }

  loadAdminProducts();
}


// ============================================
// 15. ADMIN - LOAD PRODUCTS
// ============================================

async function loadAdminProducts() {
  const adminProductList =
    document.getElementById("adminProductList");

  if (!adminProductList) return;

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    adminProductList.innerHTML = `
      <p>Бараа ачааллахад алдаа гарлаа.</p>
    `;

    return;
  }

  if (!data.length) {
    adminProductList.innerHTML = `
      <p>Одоогоор бараа алга.</p>
    `;

    return;
  }

  adminProductList.innerHTML = data.map(product => `
    <div class="admin-product">

      <img
        src="${escapeHTML(
          product.image_url ||
          "https://via.placeholder.com/100"
        )}"
        alt="${escapeHTML(product.name)}"
      />

      <div>
        <h3>${escapeHTML(product.name)}</h3>

        <p>
          ${formatPrice(product.price)}
        </p>

        <p>
          Stock: ${product.stock}
        </p>
      </div>

      <button
        onclick="deleteProduct(${product.id})"
      >
        Delete
      </button>

    </div>
  `).join("");
}


// ============================================
// 16. ADMIN - DELETE PRODUCT
// ============================================

async function deleteProduct(productId) {

  const confirmed = confirm(
    "Энэ бүтээгдэхүүнийг устгах уу?"
  );

  if (!confirmed) return;

  const { error } = await supabaseClient
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error(error);
    showToast("Устгахад алдаа гарлаа.");
    return;
  }

  showToast("Бараа устгагдлаа.");

  loadAdminProducts();
}


// ============================================
// 17. EVENT LISTENERS
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // Storefront
  if (document.getElementById("productGrid")) {

    loadProducts();

    const searchInput =
      document.getElementById("searchInput");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        searchProducts
      );
    }

    renderCart();
  }


  // Admin
  if (document.getElementById("adminProductList")) {
    loadAdminProducts();
  }


  // Checkout form
  const checkoutForm =
    document.getElementById("checkoutForm");

  if (checkoutForm) {
    checkoutForm.addEventListener(
      "submit",
      submitOrder
    );
  }

});


// ============================================
// 18. MAKE FUNCTIONS AVAILABLE TO HTML
// ============================================

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;

window.openCart = openCart;
window.closeCart = closeCart;

window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;

window.addProduct = addProduct;
window.deleteProduct = deleteProduct;

window.loadProducts = loadProducts;
window.loadAdminProducts = loadAdminProducts;
// =========================
// ADMIN LOGIN
// =========================

async function checkAdminSession() {
  const loginSection = document.getElementById("loginSection");
  const adminSection = document.getElementById("adminSection");

  if (!loginSection || !adminSection) return;

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    loginSection.style.display = "none";
    adminSection.style.display = "block";

    loadAdminProducts();
  } else {
    loginSection.style.display = "block";
    adminSection.style.display = "none";
  }
}


async function loginAdmin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showToast("Login амжилтгүй: " + error.message);
    return;
  }

  showToast("Амжилттай нэвтэрлээ!");

  checkAdminSession();
}


async function logoutAdmin() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showToast(error.message);
    return;
  }

  showToast("Гарлаа");

  checkAdminSession();
}


// Login form
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", loginAdmin);
}


// Logout button
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutAdmin);
}


// Check session when page opens
checkAdminSession();

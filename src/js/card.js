const menuButton = document.querySelector(".menu-button");

//charge les items au chargement de la page
document.addEventListener("DOMContentLoaded", loadData);

menuButton.addEventListener("click", () => { 
  location.reload();
});
//fonc load data
function loadData() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      generateDessertItems(data);
      attachEventListeners();
    })
    .catch((error) => console.error("Error loading data:", error));
}
function generateDessertItems(items) {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = ""; // Clear any existing content

  items.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.setAttribute("data-id", index + 1);
    itemElement.setAttribute("data-name", item.name);
    itemElement.setAttribute("data-price", item.price.toFixed(2));

    itemElement.innerHTML = `
                <img src="${item.image.desktop}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <button>Add to Cart</button>
            `;
    gridContainer.appendChild(itemElement);
  });
}

function attachEventListeners() {
  document.querySelectorAll(".item button").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

const cart = {};

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  for (const id in cart) {
    const item = cart[id];
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} (${item.quantity}x) <span>$${itemTotal.toFixed(
      2
    )}</span>`;
    cartItems.appendChild(li);
  }

  cartCount.textContent = itemCount;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function addToCart(event) {
  const button = event.target;
  const itemElement = button.closest(".item");
  const id = itemElement.getAttribute("data-id");
  const name = itemElement.getAttribute("data-name");
  const price = parseFloat(itemElement.getAttribute("data-price"));

  if (!cart[id]) {
    cart[id] = { name, price, quantity: 0 };
  }
  cart[id].quantity += 1;

  updateCartDisplay();
}

let nav = document.querySelector("nav");
let section = document.querySelector("section");

// პროდუქტის ბარათის HTML
function cartPrint(product) {
  return `
    <div class="card" data-id="${product.id}" data-price="${
    product.price
  }" data-name="${product.name}">
      <div class="card-image-container">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        ${
          product.vegeterian
            ? '<span class="veg-badge">🌱 ვეგეტარიანული</span>'
            : ""
        }
      </div>
      <div class="card-body">
        <div class="card-header">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-price">₾${product.price.toFixed(2)}</p>
        </div>
        <div class="card-details">
          <div class="detail-item">
            <span class="detail-label">სიმწარე:</span>
            <span class="detail-value">${"🌶️".repeat(product.spiciness)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">თხილი:</span>
            <span class="detail-value">${product.nuts ? "✅" : "❌"}</span>
          </div>
        </div>
        <div class="card-actions">
          <div class="quantity-control">
            <button class="quantity-btn minus">-</button>
            <input type="number" class="quantity-input" value="1" min="1" />
            <button class="quantity-btn plus">+</button>
          </div>
          <button class="add-to-basket">
            <span class="basket-icon">🛒</span>
            კალათაში დამატება
          </button>
        </div>
      </div>
    </div>
  `;
}

// ყველა პროდუქტის წამოღება
function getAll() {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((res) => res.json())
    .then((data) => {
      section.innerHTML = "";
      data.forEach((product) => {
        section.innerHTML += cartPrint(product);
      });
      setupBasket();
    });
}

// კატეგორიების წამოღება
fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then((res) => res.json())
  .then((categories) => {
    categories.forEach((category) => {
      nav.innerHTML += `<button onclick="filterCategory(${category.id})">${category.name}</button>`;
    });
  });

// კონკრეტული კატეგორიის ფილტრაცია
function filterCategory(id) {
  fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${id}`)
    .then((res) => res.json())
    .then((category) => {
      section.innerHTML = "";
      category.products.forEach((product) => {
        section.innerHTML += cartPrint(product);
      });
      setupBasket();
    });
}

// მომხმარებლის ფილტრი
function filter() {
  const vegetarian = document.getElementById("vegetarian").checked;
  const nuts = document.getElementById("nuts").checked;
  const spiciness = document.getElementById("spiciness").value;

  let url = `https://restaurant.stepprojects.ge/api/Products/GetFiltered?`;
  if (vegetarian) url += `vegeterian=true&`;
  if (nuts) url += `nuts=true&`;
  if (spiciness) url += `spiciness=${spiciness}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      section.innerHTML = "";
      data.forEach((product) => {
        section.innerHTML += cartPrint(product);
      });
      setupBasket();
    });
}

// კალათაში დამატება + მოდალი
function setupBasket() {
  document.querySelectorAll(".add-to-basket").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const card = e.target.closest(".card");
      const productId = +card.dataset.id;
      const price = +card.dataset.price;
      const quantity = +card.querySelector(".quantity-input").value;

      const payload = {
        productId,
        quantity,
        price: price * quantity,
      };

      try {
        const existingItems = await fetch(
          "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
        ).then((r) => r.json());
        const existing = existingItems.find(
          (item) => item.product.id === productId
        );

        const endpoint = existing
          ? "https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket"
          : "https://restaurant.stepprojects.ge/api/Baskets/AddToBasket";
        const method = existing ? "PUT" : "POST";

        if (existing) {
          payload.quantity += existing.quantity;
          payload.price = payload.quantity * price;
        }

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          // After successful API call, update localStorage
          const updatedCart = await fetch(
            "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
          ).then((r) => r.json());

          localStorage.setItem("cartItems", JSON.stringify(updatedCart));

          document.getElementById("modalImage").src =
            card.querySelector("img").src;
          document.getElementById("modalName").textContent = card.dataset.name;
          document.getElementById("modalMessage").textContent = existing
            ? "რაოდენობა განახლდა კალათაში"
            : "პროდუქტი დაემატა კალათაში";
          document.getElementById("deliveryTime").value = "";
          document.getElementById("chestDelivery").checked = false;

          const finalPriceEl = document.getElementById("finalPrice");
          const updateFinal = () => {
            const extra = document.getElementById("chestDelivery").checked
              ? 5
              : 0;
            finalPriceEl.textContent = `ჯამური ფასი: $${(
              price * quantity +
              extra
            ).toFixed(2)} (${card.dataset.name})`;
          };

          document.getElementById("chestDelivery").onchange = updateFinal;
          updateFinal();

          document.getElementById("productModal").style.display = "block";

          document.getElementById("confirmOrderBtn").onclick = () => {
            document.getElementById("productModal").style.display = "none";
            document.getElementById("paymentModal").style.display = "block";
          };

          document.getElementById("closeModal").onclick = () => {
            document.getElementById("productModal").style.display = "none";
          };
        }
      } catch (err) {
        console.error(err);
        alert("დაფიქსირდა შეცდომა");
      }
    });
  });

  // Add quantity control functionality
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const input = card.querySelector(".quantity-input");
      const currentValue = parseInt(input.value);

      if (e.target.classList.contains("plus")) {
        input.value = currentValue + 1;
      } else if (e.target.classList.contains("minus") && currentValue > 1) {
        input.value = currentValue - 1;
      }

      // Trigger input event to ensure any listeners are notified
      input.dispatchEvent(new Event("input"));
    });
  });
}

async function clearBasket() {
  try {
    const res = await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
    );
    const data = await res.json();

    if (data.length === 0) {
      console.log("კალათა უკვე ცარიელია.");
      return;
    }

    const deletePromises = data.map((item) =>
      fetch(
        `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${item.product.id}`,
        {
          method: "DELETE",
          headers: {
            accept: "text/plain",
          },
        }
      )
    );

    await Promise.all(deletePromises);
    localStorage.removeItem("cartItems");

    // გაწმენდა UI-ზე
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer) {
      cartContainer.innerHTML = "";
    }
    const cartTotal = document.getElementById("cart-total");
    if (cartTotal) {
      cartTotal.textContent = "სულ: 0 ₾";
    }

    // დაელოდე API განახლებას და განაახლე localStorage
    setTimeout(async () => {
      try {
        const updatedCart = await fetch(
          "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
        ).then((r) => r.json());

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));

        if (typeof loadBasket === "function") {
          loadBasket();
        }
      } catch (error) {
        console.error("Failed to update cart after clearing:", error);
      }
    }, 300);
  } catch (error) {
    console.error("კალათის გასუფთავების შეცდომა:", error);
  }
}

// Add payment modal close functionality
document.addEventListener("DOMContentLoaded", function () {
  const closePaymentModal = document.getElementById("closePaymentModal");
  if (closePaymentModal) {
    closePaymentModal.onclick = function () {
      document.getElementById("paymentModal").style.display = "none";
    };
  }

  // Initialize filter panel toggle
  const filterToggleBtn = document.getElementById("filterToggleBtn");
  const filterPanel = document.getElementById("filterPanel");
  const closeFilterBtn = document.getElementById("closeFilterBtn");

  if (filterToggleBtn && filterPanel) {
    filterToggleBtn.addEventListener("click", function () {
      filterPanel.classList.add("open");
      filterToggleBtn.style.display = "none";
    });
  }

  if (closeFilterBtn && filterPanel) {
    closeFilterBtn.addEventListener("click", function () {
      filterPanel.classList.remove("open");
      filterToggleBtn.style.display = "block";
    });
  }
});

// ბურგერ მენიუს ფუნქციონალი
const burgerMenuBtn = document.querySelector(".burger-menu-btn");
const closeBtn = document.querySelector(".close-btn");
const navMenu = document.querySelector("nav");
const overlay = document.querySelector(".overlay");

burgerMenuBtn.addEventListener("click", () => {
  navMenu.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  navMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
});

overlay.addEventListener("click", () => {
  navMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
});

// მენიუს ღილაკებზე დაჭერისას მენიუს დახურვა
const menuButtons = navMenu.querySelectorAll("button, a");
menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });
});

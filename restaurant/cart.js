async function clearBasket() {
  try {
    const res = await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
    );
    const data = await res.json();

    console.log("წაშლელი მონაცემები:", data);

    if (data.length === 0) {
      alert("კალათა უკვე ცარიელია.");
      return;
    }

    for (const item of data) {
      try {
        const response = await fetch(
          `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${item.product.id}`,
          {
            method: "DELETE",
            headers: {
              accept: "text/plain",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(
            `Failed to delete product ${item.product.id}: ${response.status}`
          );
        }
      } catch (error) {
        console.error(`Error deleting product ${item.product.id}:`, error);
      }
    }

    localStorage.removeItem("cartItems");
    console.log("კალათა და localStorage გასუფთავდა!");

    window.location.reload();
  } catch (error) {
    console.error("კალათის გასუფთავების შეცდომა:", error);
  }
}

async function loadBasket() {
  try {
    const res = await fetch(
      "https://restaurant.stepprojects.ge/api/Baskets/GetAll",
      {
        method: "GET",
        headers: {
          accept: "text/plain",
        },
      }
    );

    const data = await res.json();
    console.log("Cart data:", data);

    const container = document.getElementById("cart-container");
    const totalDisplay = document.getElementById("cart-total");

    localStorage.setItem("cartItems", JSON.stringify(data));

    container.innerHTML = "";
    let totalPrice = 0;

    if (data.length === 0) {
      container.innerHTML = "<div class='empty-cart'>კალათა ცარიელია</div>";
      totalDisplay.textContent = `სულ: 0.00 ₾`;
      return;
    }

    data.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      const itemPrice = item.price;
      totalPrice += itemPrice;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.dataset.itemId = item.id;
      itemDiv.dataset.productId = product.id;

      itemDiv.innerHTML = `
  <div class="cart-item-details">
    <img src="${product.image}" alt="${product.name}" class="product-image" />
    <div class="cart-item-text">
      <p class="product-name">პროდუქტი: ${product.name}</p>
      <p class="quantity">რაოდენობა: ${quantity}</p>
      <p class="price">ფასი: ${itemPrice.toFixed(2)} ₾</p>
    </div>
  </div>
  <button class="delete-btn" data-product-id="${product.id}">წაშლა</button>
`;

      container.appendChild(itemDiv);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = handleDeleteClick;
    });

    totalDisplay.textContent = `სულ: ${totalPrice.toFixed(2)} ₾`;
  } catch (error) {
    console.error("დატვირთვის შეცდომა:", error);
  }
}

function handleDeleteClick(event) {
  const productId = event.target.dataset.productId;
  if (productId) {
    deleteProduct(productId);
  } else {
    console.error("Product ID not found on delete button");
  }
}

async function deleteProduct(productId) {
  try {
    console.log(`Attempting to delete product with ID: ${productId}`);

    const response = await fetch(
      `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`,
      {
        method: "DELETE",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Delete response status: ${response.status}`);

    if (response.ok) {
      console.log("Product deleted successfully");

      window.location.reload();
    } else {
      const errorText = await response.text();
      console.error(`Failed to delete product: ${errorText}`);
      alert(`წაშლის შეცდომა: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert(`წაშლის შეცდომა: ${error.message}`);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadBasket();

  const clearCartBtn = document.getElementById("clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearBasket);
  }
});

if (
  !document.getElementById("clear-cart-btn") &&
  document.getElementById("cart-container")
) {
  const clearBtn = document.createElement("button");
  clearBtn.id = "clear-cart-btn";
  clearBtn.textContent = "კალათის გასუფთავება";
  clearBtn.style.marginTop = "20px";
  clearBtn.addEventListener("click", clearBasket);

  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    cartContainer.parentNode.insertBefore(clearBtn, cartContainer.nextSibling);
  }
}

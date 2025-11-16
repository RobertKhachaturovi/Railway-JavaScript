document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".section");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      const targetSection = item.dataset.section;
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetSection) {
          section.classList.add("active");
        }
      });
    });
  });

  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("დარწმუნებული ხართ, რომ გსურთ გასვლა?")) {
        window.location.href = "../index.html";
      }
    });
  }

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".info-card");
      const currentValue = card.querySelector("p").textContent;
      const newValue = prompt("შეიყვანეთ ახალი მნიშვნელობა:", currentValue);

      if (newValue && newValue !== currentValue) {
        card.querySelector("p").textContent = newValue;

        showNotification("ინფორმაცია წარმატებით განახლდა");
      }
    });
  });

  const saveBtn = document.querySelector(".save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;

      if (username && password) {
        showNotification("პარამეტრები წარმატებით შენახულია");
      } else {
        showNotification("გთხოვთ შეავსოთ ყველა ველი", "error");
      }
    });
  }

  function loadRatings() {
    const ratingsList = document.querySelector(".ratings-list");
    const ratings = JSON.parse(localStorage.getItem("ratings")) || [];

    if (ratings.length === 0) {
      ratingsList.innerHTML = '<p class="no-data">ჯერ არ არის შეფასებები</p>';
      return;
    }

    ratingsList.innerHTML = ratings
      .map(
        (rating) => `
          <div class="rating-card ${rating.isNegative ? "negative" : ""}">
            ${
              rating.isNegative
                ? `<div class="negative-rating">
                <i class="fas fa-times-circle"></i>
                <span>მომხმარებელი არ არის კმაყოფილი</span>
              </div>`
                : `<div class="rating-stars">
                ${"★".repeat(rating.rating)}${"☆".repeat(5 - rating.rating)}
              </div>
              <p>${rating.comment || "კომენტარი არ არის"}</p>`
            }
            <div class="rating-meta">
              <span class="date">${rating.date}</span>
              <button class="delete-rating-btn" data-id="${rating.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `
      )
      .join("");

    // წაშლის ღილაკების ივენთების დამატება
    document.querySelectorAll(".delete-rating-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const ratingId = parseInt(this.dataset.id);
        deleteRating(ratingId);
      });
    });
  }

  function deleteRating(ratingId) {
    let ratings = JSON.parse(localStorage.getItem("ratings")) || [];
    ratings = ratings.filter((rating) => rating.id !== ratingId);
    localStorage.setItem("ratings", JSON.stringify(ratings));
    loadRatings(); // სიის განახლება
    showNotification("შეფასება წარმატებით წაიშალა");
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const style = document.createElement("style");
    style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .notification.success {
                background-color: #2ecc71;
            }
            .notification.error {
                background-color: #e74c3c;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // 3 წამის შემდეგ შეტყობინების წაშლა
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);
  }

  function loadUsers() {
    const usersList = document.querySelector(".users-list");

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (users.length === 0) {
      usersList.innerHTML =
        '<p class="no-data">ჯერ არ არის დარეგისტრირებული მომხმარებლები</p>';
      return;
    }

    usersList.innerHTML = users
      .map(
        (user) => `
      <div class="user-card">
        <div class="user-info">
          <h3>${user.name}</h3>
          <p>${user.email}</p>
          <div class="user-meta">
            <span>რეგისტრაცია: ${user.registrationDate}</span>
            <span>ტელეფონი: ${user.phone || "არ არის მითითებული"}</span>
          </div>
        </div>
        <div class="user-actions">
          <button class="view-btn" data-id="${user.id}">დეტალები</button>
          <button class="delete-user-btn" data-id="${user.id}">წაშლა</button>
        </div>
      </div>
    `
      )
      .join("");

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = this.dataset.id;
        const user = users.find((u) => u.id === parseInt(userId));
        if (user) {
          showUserDetails(user);
        }
      });
    });

    document.querySelectorAll(".delete-user-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = this.dataset.id;
        if (confirm("დარწმუნებული ხართ, რომ გსურთ ამ მომხმარებლის წაშლა?")) {
          deleteUser(userId);
        }
      });
    });
  }

  function showUserDetails(user) {
    const details = `
      სახელი: ${user.name}
      ელ-ფოსტა: ${user.email}
      ტელეფონი: ${user.phone || "არ არის მითითებული"}
      რეგისტრაციის თარიღი: ${user.registrationDate}
    `;
    alert(details);
  }

  function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    users = users.filter((user) => user.id !== parseInt(userId));
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    loadUsers(); // სიის განახლება
    showNotification("მომხმარებელი წარმატებით წაიშალა");
  }

  function initDarkMode() {
    const darkModeToggle = document.createElement("button");
    darkModeToggle.className = "dark-mode-toggle";
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector(".admin-info").prepend(darkModeToggle);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      darkModeToggle.innerHTML =
        newTheme === "dark"
          ? '<i class="fas fa-sun"></i>'
          : '<i class="fas fa-moon"></i>';
    });
  }

  loadRatings();
  loadUsers();

  initDarkMode();
});

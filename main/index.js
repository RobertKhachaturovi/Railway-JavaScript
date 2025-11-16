// ბურგერ მენიუს ფუნქციონალი
const burgerMenuBtn = document.querySelector(".burger-menu-btn");
const burgerMenu = document.querySelector(".burger-menu");
const closeBtn = document.querySelector(".close-btn");
const burgerLoginBtn = document.getElementById("burgerLoginBtn");
const burgerRegisterBtn = document.getElementById("burgerRegisterBtn");
const burgerLanguageBtn = document.getElementById("burgerLanguageBtn");

burgerMenuBtn.addEventListener("click", () => {
  burgerMenu.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  burgerMenu.classList.remove("active");
  document.body.style.overflow = "";
});

// ბურგერ მენიუს ღილაკების ფუნქციონალი
burgerLoginBtn.addEventListener("click", () => {
  window.location.href = "../auth/login.html";
});

burgerRegisterBtn.addEventListener("click", () => {
  window.location.href = "../auth/register.html";
});

burgerLanguageBtn.addEventListener("click", () => {
  // ენის გადამრთველის ლოგიკა
  const currentLang = burgerLanguageBtn.querySelector("span").textContent;
  const newLang = currentLang === "ქარ" ? "en" : "ქარ";
  burgerLanguageBtn.querySelector("span").textContent = newLang;
});

// ჰედერის ღილაკების ფუნქციონალი
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const languageBtn = document.querySelector(".language-btn");

loginBtn.addEventListener("click", () => {
  window.location.href = "../auth/login.html";
});

registerBtn.addEventListener("click", () => {
  window.location.href = "../auth/register.html";
});

languageBtn.addEventListener("click", () => {
  // ენის გადამრთველის ლოგიკა
  const currentLang = languageBtn.querySelector("span").textContent;
  const newLang = currentLang === "ქარ" ? "en" : "ქარ";
  languageBtn.querySelector("span").textContent = newLang;
});

// ენის გადამრთველის ფუნქციონალი
const languageSwitch = document.getElementById("languageSwitch");
const languageSwitchBurger = document.getElementById("languageSwitchBurger");

function updateLanguage(button, newLang) {
  button.querySelector("span").textContent = newLang;
}

languageSwitch.addEventListener("click", () => {
  const currentLang = languageSwitch.querySelector("span").textContent;
  const newLang = currentLang === "en" ? "ქარ" : "en";
  updateLanguage(languageSwitch, newLang);
  updateLanguage(languageSwitchBurger, newLang);
});

languageSwitchBurger.addEventListener("click", () => {
  const currentLang = languageSwitchBurger.querySelector("span").textContent;
  const newLang = currentLang === "en" ? "ქარ" : "en";
  updateLanguage(languageSwitchBurger, newLang);
  updateLanguage(languageSwitch, newLang);
});

function updateProfileIcon() {
  const profileIcon = document.getElementById("profileIcon");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.photo) {
    profileIcon.src = user.photo;
  } else {
    profileIcon.src = "../auth/default-avatar.png";
  }
}

// გამოვიძახოთ ფუნქცია გვერდის ჩატვირთვისას
document.addEventListener("DOMContentLoaded", () => {
  updateProfileIcon();
});

// Burger Menu Functionality
const burgerMenuSection = document.querySelector(".burger-menu-section");

if (burgerMenu && burgerMenuSection) {
  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("active");
    burgerMenuSection.classList.toggle("active");
  });

  // Close burger menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !burgerMenu.contains(e.target) &&
      !burgerMenuSection.contains(e.target)
    ) {
      burgerMenu.classList.remove("active");
      burgerMenuSection.classList.remove("active");
    }
  });

  // Close burger menu when clicking on a menu item
  const menuItems = burgerMenuSection.querySelectorAll(".btn");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      burgerMenu.classList.remove("active");
      burgerMenuSection.classList.remove("active");
    });
  });
}

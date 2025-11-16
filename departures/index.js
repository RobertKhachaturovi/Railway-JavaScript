document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("trainList");

  if (!resultsContainer) {
    console.error("ელემენტი 'trainList' ვერ მოიძებნა!");
    return;
  }

  const searchInfo = JSON.parse(localStorage.getItem("searchInfo"));

  if (!searchInfo) {
    resultsContainer.innerHTML = "<p>ძებნის მონაცემები არ მოიძებნა.</p>";
    return;
  }

  const { from, to, date, guests } = searchInfo;

  const url = `https://railway.stepprojects.ge/api/getdeparture?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(
    date
  )}&guests=${encodeURIComponent(guests)}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("მონაცემების მიღება ვერ მოხერხდა");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        const tbody = resultsContainer.querySelector("tbody");
        tbody.innerHTML = "";

        data.forEach((item) => {
          item.trains?.forEach((train) => {
            const trainName = train.name || "უცნობია";
            const departureTime = train.departure || "უცნობია";
            const departureStation = train.from || "უცნობია";
            const arrivalTime = train.arrive || "უცნობია";
            const arrivalStation = train.to || "უცნობია";

            const selectedTrain = {
              name: trainName,
              departure: departureTime,
              from: departureStation,
              arrive: arrivalTime,
              to: arrivalStation,
            };

            const row = document.createElement("tr");

            row.innerHTML = `
              <td>#${train.number}<br>${trainName}</td>
              <td>${departureTime}<br>${departureStation}</td>

                 <td>${arrivalTime}<br>${arrivalStation}</td>
              <td><button class="bookBtn">დაჯავშნა</button></td>
            `;

            const bookBtn = row.querySelector(".bookBtn");
            bookBtn.addEventListener("click", () => {
              const trainId = train.id;
              console.log("Selected train ID:", trainId);

              window.location.href = `../ticket-registration/index.html?id=${trainId}`;
            });

            tbody.appendChild(row);
          });
        });
      } else {
        resultsContainer.innerHTML = "<p>შედეგები ვერ მოიძებნა.</p>";
      }
    })
    .catch((error) => {
      console.error("შეცდომა:", error);
      resultsContainer.innerHTML = "<p>მონაცემების ჩატვირთვა ვერ მოხერხდა.</p>";
    });
});

// Translations object
const translations = {
  ka: {
    departures: "გამგზავრებები",
    arrivals: "ჩამოსვლები",
    "dark-mode": "მუქი რეჟიმი",
    "check-ticket": "ბილეთის შემოწმება",
    help: "დახმარება",
    language: "ენა",
    "select-train": "აირჩიეთ თქვენთვის სასურველი მატარებელი",
    train: "მატარებელი",
    departure: "გამგზავრება",
    arrival: "ჩასვლა",
    "switch-to-en": "en",
  },
  en: {
    departures: "Departures",
    arrivals: "Arrivals",
    "dark-mode": "Dark Mode",
    "check-ticket": "Check Ticket",
    help: "Help",
    language: "Language",
    "select-train": "Select Your Preferred Train",
    train: "Train",
    departure: "Departure",
    arrival: "Arrival",
    "switch-to-en": "ka",
  },
};

let currentLang = "ka";
const languageSwitch = document.getElementById("languageSwitch");

function updateLanguage() {
  const elements = document.querySelectorAll(".translation-key");

  elements.forEach((element) => {
    const key = element.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  const trainList = document.getElementById("trainList");
  if (trainList) {
    const rows = trainList.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      if (cells.length >= 3) {
        const selectButton = cells[3].querySelector("button");
        if (selectButton) {
          selectButton.textContent = currentLang === "ka" ? "არჩევა" : "Select";
        }
      }
    }
  }

  languageSwitch.innerHTML = `<i class="fas fa-globe"></i> ${translations[currentLang]["switch-to-en"]}`;
}

languageSwitch.addEventListener("click", () => {
  currentLang = currentLang === "ka" ? "en" : "ka";
  document.documentElement.lang = currentLang;
  updateLanguage();
});

document.addEventListener("DOMContentLoaded", () => {
  updateLanguage();
});
document.addEventListener("DOMContentLoaded", () => {
  getStations();
});

window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Dark Mode Initialization
function initDarkMode() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    const darkModeToggleBurger = document.getElementById(
      "darkModeToggleBurger"
    );
    if (darkModeToggleBurger) {
      const icon = darkModeToggleBurger.querySelector("i");
      if (icon) {
        icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    }
  }
}

// Initialize dark mode when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
});

// Burger Menu Functionality
function initBurgerMenu() {
  const burgerMenuBtn = document.getElementById("burgerMenuBtn");
  const burgerMenu = document.querySelector(".burger-menu");
  const closeBtn = document.querySelector(".close-btn");
  const darkModeToggleBurger = document.getElementById("darkModeToggleBurger");

  if (burgerMenuBtn) {
    burgerMenuBtn.addEventListener("click", () => {
      burgerMenu.classList.add("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      burgerMenu.classList.remove("active");
    });
  }

  if (darkModeToggleBurger) {
    darkModeToggleBurger.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      const icon = darkModeToggleBurger.querySelector("i");
      if (icon) {
        icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    });
  }

  // Close burger menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!burgerMenu.contains(e.target) && !burgerMenuBtn.contains(e.target)) {
      burgerMenu.classList.remove("active");
    }
  });
}

// Initialize burger menu when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initBurgerMenu();
});

// Language Switch Functionality
function initLanguageSwitch() {
  const languageSwitch = document.getElementById("languageSwitch");
  const languageSwitchBurger = document.getElementById("languageSwitchBurger");
  let currentLang = "ka";

  function updateLanguage() {
    const elements = document.querySelectorAll(".translation-key");
    elements.forEach((element) => {
      const key = element.getAttribute("data-key");
      if (translations[currentLang] && translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });

    // Update language switch buttons
    const switchText = currentLang === "ka" ? "en" : "ka";
    if (languageSwitch)
      languageSwitch.innerHTML = `<i class="fas fa-globe"></i> ${switchText}`;
    if (languageSwitchBurger)
      languageSwitchBurger.innerHTML = `<i class="fas fa-globe"></i> ${switchText}`;
  }

  function toggleLanguage() {
    currentLang = currentLang === "ka" ? "en" : "ka";
    document.documentElement.lang = currentLang;
    updateLanguage();
  }

  if (languageSwitch) {
    languageSwitch.addEventListener("click", toggleLanguage);
  }

  if (languageSwitchBurger) {
    languageSwitchBurger.addEventListener("click", toggleLanguage);
  }

  // Initial language update
  updateLanguage();
}

// Initialize language switch when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initLanguageSwitch();
});

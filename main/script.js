const BASE_URL = "https://railway.stepprojects.ge/api";

function applyFilter() {
  let roomTypes = document.querySelectorAll("#roomType");
  let from = roomTypes[0].value;
  let to = roomTypes[1].value;
  let checkin = document.getElementById("checkin").value;
  let guests = document.getElementById("guests").value;

  alert(`დაფილტრული ინფორმაცია:
    საიდან: ${from}
    სად: ${to}
    გამგზავრება: ${checkin}
    მგზავრები: ${guests}`);
}

function resetFilter() {
  let roomTypes = document.querySelectorAll("#roomType");
  roomTypes[0].value = "all";
  roomTypes[1].value = "all";
  document.getElementById("checkin").value = "";
  document.getElementById("guests").value = "1";
}

function getDepartures(from, to, date, guests) {
  const url = `${BASE_URL}/getdeparture?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(
    date
  )}&guests=${encodeURIComponent(guests)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("departures", JSON.stringify(data));
      localStorage.setItem(
        "searchInfo",
        JSON.stringify({ from, to, date, guests })
      );

      window.location.href = "../departures/index.html";
    })
    .catch((error) => {
      console.error(error);
    });
}

function getStations() {
  const url = `${BASE_URL}/stations`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const fromSelect = document.getElementById("fromStation");
      const toSelect = document.getElementById("toStation");

      fromSelect.innerHTML = '<option value="all">საიდან</option>';
      toSelect.innerHTML = '<option value="all">სად</option>';

      data.forEach((station) => {
        const optionFrom = document.createElement("option");
        optionFrom.value = station.name;
        optionFrom.textContent = station.name;

        const optionTo = document.createElement("option");
        optionTo.value = station.name;
        optionTo.textContent = station.name;

        fromSelect.appendChild(optionFrom);
        toSelect.appendChild(optionTo);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

document
  .getElementById("searchButton")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (!isAuthenticated()) {
      const fromStation = document.getElementById("fromStation").value;
      const toStation = document.getElementById("toStation").value;
      const travelDate = document.getElementById("travelDate").value;
      const guests = document.getElementById("guests").value;

      if (fromStation && toStation && travelDate && guests) {
        sessionStorage.setItem(
          "pendingSearch",
          JSON.stringify({
            from: fromStation,
            to: toStation,
            date: travelDate,
            guests: guests,
          })
        );
      }

      window.location.href =
        "../auth/login.html?returnUrl=" +
        encodeURIComponent(window.location.href);
      return;
    }

    var fromStation = document.getElementById("fromStation").value;
    var toStation = document.getElementById("toStation").value;
    var travelDate = document.getElementById("travelDate").value;
    var guests = document.getElementById("guests").value;

    console.log(`საიდან: ${fromStation}`);
    console.log(`სად: ${toStation}`);
    console.log(`როდის: ${travelDate}`);
    console.log(`მგზავრის რაოდენობა: ${guests}`);

    getDepartures(fromStation, toStation, travelDate, guests);
  });

function getDepartures(from, to, date, guests) {
  const url = `${BASE_URL}/getdeparture?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(
    date
  )}&guests=${encodeURIComponent(guests)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        localStorage.setItem("departures", JSON.stringify(data));
        localStorage.setItem(
          "searchInfo",
          JSON.stringify({ from, to, date, guests })
        );
        window.location.href = "../departures/index.html";
      } else {
        window.location.href = "../no-train-found/index.html";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function updateAuthUI() {
  const logoutButton = document.getElementById("logoutButton");

  if (isAuthenticated()) {
    logoutButton.style.display = "inline-block";

    getCurrentUser()
      .then((user) => {
        if (user) {
          console.log("Logged in as:", user.email);
        }
      })
      .catch((err) => {
        console.error("Error fetching user info:", err);
      });
  } else {
    logoutButton.style.display = "none";
  }
}

function setupLogout() {
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", function () {
    logout();

    updateAuthUI();

    window.location.reload();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getStations();

  updateAuthUI();

  setupLogout();

  const pendingSearch = sessionStorage.getItem("pendingSearch");
  if (pendingSearch && isAuthenticated()) {
    try {
      const searchParams = JSON.parse(pendingSearch);
      getDepartures(
        searchParams.from,
        searchParams.to,
        searchParams.date,
        searchParams.guests
      );
      sessionStorage.removeItem("pendingSearch");
    } catch (e) {
      console.error("Error processing pending search:", e);
    }
  }
});

window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const translations = {
  ka: {
    "check-ticket": "ბილეთის შემოწმება/დაბრუნება",
    "buy-tickets": "შეიძინეთ მატარებლის ბილეთები ონლაინ",
    "happy-journey": "გისურვებთ ბედნიერ მგზავრობას!",
    "book-ticket": "დაჯავშნეთ მატარებლის ბილეთი",
    "search-trains": "მატარებლების მოძებნა",
    "train-tickets": "მატარებლის ბილეთები",
    "ticket-info":
      "რკინიგზის ბილეთების შესაძენად თქვენ დაგჭირდებათ თითოეული მგზავრის პირადი ნომერი. გთხოვთ მოამზადოთ ეს ინფორმაცია წინასწარ.",
    "unlimited-offers": "შეუზღუდავი შეთავაზებები",
    secure: "100% უსაფრთხო",
    support: "24X7 მხარდაჭერა",
    "secure-payment": "100% უსაფრთხო გადახდა",
    "all-rights": "ყველა უფლება დაცულია.",
    "switch-to-en": "en",
  },
  en: {
    "check-ticket": "Check/Return Ticket",
    "buy-tickets": "Buy Train Tickets Online",
    "happy-journey": "Wish you a happy journey!",
    "book-ticket": "Book a Train Ticket",
    "search-trains": "Search Trains",
    "train-tickets": "Train Tickets",
    "ticket-info":
      "To purchase railway tickets, you will need each passenger's personal number. Please prepare this information in advance.",
    "unlimited-offers": "Unlimited Offers",
    secure: "100% Secure",
    support: "24X7 Support",
    "secure-payment": "100% Secure Payment",
    "all-rights": "All rights reserved.",
    "switch-to-en": "ka",
  },
};

let currentLang = "ka";
const languageSwitch = document.getElementById("languageSwitch");

function updateLanguage() {
  const elements = {
    "check-ticket": document.querySelector(".btn span"),
    "buy-tickets": document.querySelector(".travel-note-content h2"),
    "happy-journey": document.querySelector(".travel-note-content p"),
    "book-ticket": document.querySelector(".filter-title"),
    "search-trains": document.querySelector("#searchButton p"),
    "train-tickets": document.querySelector(".ticket-text h2"),
    "ticket-info": document.querySelector(".ticket-text p"),
    "unlimited-offers": document.querySelector(
      ".ticket-column ul li:nth-child(1)"
    ),
    secure: document.querySelector(".ticket-column ul li:nth-child(2)"),
    support: document.querySelector(
      ".ticket-column:nth-child(2) ul li:nth-child(1)"
    ),
    "secure-payment": document.querySelector(
      ".ticket-column:nth-child(2) ul li:nth-child(2)"
    ),
    "all-rights": document.querySelector(".footer-line-text p"),
  };

  for (const [key, element] of Object.entries(elements)) {
    if (element) {
      if (key === "ticket-info") {
        const spans = element.querySelectorAll("span");
        if (spans.length > 0) {
          const text = translations[currentLang][key].split(".");
          element.innerHTML =
            text[0] +
            '<span class="new-line">' +
            text[1] +
            "</span>" +
            '<span class="new-line">' +
            text[2] +
            "</span>";
        } else {
          element.textContent = translations[currentLang][key];
        }
      } else if (key === "search-trains") {
        element.innerHTML =
          translations[currentLang][key] + " <span>Search</span>";
      } else if (key === "check-ticket") {
        element.textContent = translations[currentLang][key];
      } else if (key === "all-rights") {
        element.innerHTML =
          "©2023 <span>Step Railway.</span> " + translations[currentLang][key];
      } else {
        element.textContent = translations[currentLang][key];
      }
    }
  }

  languageSwitch.innerHTML = `<i class="fas fa-globe"></i> ${translations[currentLang]["switch-to-en"]}`;
}

languageSwitch.addEventListener("click", () => {
  currentLang = currentLang === "ka" ? "en" : "ka";
  updateLanguage();
});
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileButton");
  const savedAvatar = localStorage.getItem("selectedAvatar");

  if (savedAvatar) {
    const img = profileBtn.querySelector("img.profile-icon");
    if (img) {
      img.src = savedAvatar;
      img.alt = "Selected Avatar";
      img.style.borderRadius = "50%";
      img.style.width = "35px";
      img.style.height = "35px";
      img.style.objectFit = "cover";
    }
  }
});

function showFoodOrderModal() {
  const modal = document.getElementById("foodOrderModal");
  modal.classList.add("active");
}

function hideFoodOrderModal() {
  const modal = document.getElementById("foodOrderModal");
  modal.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const yesButton = document.getElementById("yesFoodOrder");
  const noButton = document.getElementById("noFoodOrder");

  yesButton.addEventListener("click", () => {
    hideFoodOrderModal();
    window.location.href = "../restaurant/index.html";
  });

  noButton.addEventListener("click", () => {
    hideFoodOrderModal();
  });

  const logo = document.querySelector(".logo a");
  const backButton = document.querySelector(".back-button");
  const mainReturnButton = document.querySelector(".main-return-button");

  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      showFoodOrderModal();
    });
  }

  if (backButton) {
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      showFoodOrderModal();
    });
  }

  if (mainReturnButton) {
    mainReturnButton.addEventListener("click", (e) => {
      e.preventDefault();
      showFoodOrderModal();
    });
  }
});

// Dark mode functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const savedTheme = localStorage.getItem("theme");

  // Set initial theme
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (darkModeToggle) {
      darkModeToggle.querySelector("i").classList.remove("fa-moon");
      darkModeToggle.querySelector("i").classList.add("fa-sun");
    }
  }

  // Add click event listener if toggle button exists
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      // Set theme for current page
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Update icon
      const icon = darkModeToggle.querySelector("i");
      if (newTheme === "dark") {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    });
  }
}

// Initialize dark mode when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  // ... existing initialization code ...
});

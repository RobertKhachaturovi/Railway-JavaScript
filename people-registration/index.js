window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const cardNumberInput = document.getElementById("cardNumber");
const expiryDateInput = document.getElementById("expiryDate");
const cvvInput = document.getElementById("cvv");
const cardHolderInput = document.getElementById("cardHolder");
const backButton = document.getElementById("backButton");
const totalPriceElement = document.getElementById("totalPrice");

const translations = {
  ka: {
    "check-ticket": "ბილეთის შემოწმება/დაბრუნება",
    payment: "გადახდა",
    "fill-payment": "გთხოვთ შეავსოთ გადახდის დეტალები",
    "registration-info": "რეგისტრაციის ინფორმაცია",
    "total-payable": "სულ გადასახდელი:",
    "card-number": "ბარათის ნომერი*",
    "expiry-date": "მოქმედების ვადა*",
    cvv: "CVC / CVV*",
    "card-holder": "ბარათის მფლობელი*",
    "go-back": "უკან დაბრუნება",
    "view-ticket": "ბილეთის ნახვა",
    "all-rights": "©2023 Step Railway. ყველა უფლება დაცულია.",
    passenger: "მგზავრი",
    seat: "ადგილი",
    price: "ფასი",
  },
  en: {
    "check-ticket": "Check/Return Ticket",
    payment: "Payment",
    "fill-payment": "Please fill in payment details",
    "registration-info": "Registration Information",
    "total-payable": "Total Payable:",
    "card-number": "Card Number*",
    "expiry-date": "Expiry Date*",
    cvv: "CVC / CVV*",
    "card-holder": "Card Holder*",
    "go-back": "Go Back",
    "view-ticket": "View Ticket",
    "all-rights": "©2023 Step Railway. All rights reserved.",
    passenger: "Passenger",
    seat: "Seat",
    price: "Price",
  },
};

function updateLanguage() {
  const currentLang = document.documentElement.lang;
  const elements = document.querySelectorAll(".translation-key");

  elements.forEach((element) => {
    const key = element.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      if (element.tagName === "INPUT") {
        element.placeholder = translations[currentLang][key];
      } else {
        if (element.tagName === "H3" && element.querySelector("#totalPrice")) {
          const totalPrice = element.querySelector("#totalPrice").textContent;
          element.innerHTML = `${translations[currentLang][key]} <span id="totalPrice">${totalPrice}</span>`;
        } else {
          element.textContent = translations[currentLang][key];
        }
      }
    }
  });

  const registrationDetails = document.getElementById("registrationDetails");
  if (registrationDetails) {
    const passengerElements =
      registrationDetails.querySelectorAll(".passenger-detail");
    passengerElements.forEach((element, index) => {
      const passengerTitle = element.querySelector(".passenger-title");
      if (passengerTitle) {
        passengerTitle.textContent = `${
          translations[currentLang]["passenger"]
        } ${index + 1}`;
      }

      const seatLabel = element.querySelector(".seat-label");
      if (seatLabel) {
        seatLabel.textContent = translations[currentLang]["seat"];
      }

      const priceLabel = element.querySelector(".price-label");
      if (priceLabel) {
        priceLabel.textContent = translations[currentLang]["price"];
      }
    });
  }
}

function initLanguageSwitch() {
  const languageSwitch = document.getElementById("languageSwitch");
  if (languageSwitch) {
    languageSwitch.addEventListener("click", () => {
      const currentLang = document.documentElement.lang;
      const newLang = currentLang === "ka" ? "en" : "ka";
      document.documentElement.lang = newLang;
      languageSwitch.innerHTML = `<i class="fas fa-globe"></i> ${
        newLang === "ka" ? "en" : "ka"
      }`;
      updateLanguage();
    });
  }
}

function loadTicketInfo() {
  let totalPrice = "0.00₾";
  const directPrice =
    sessionStorage.getItem("totalPrice") || localStorage.getItem("totalPrice");
  if (directPrice) {
    totalPrice = directPrice;
  } else {
    const ticketInfo = JSON.parse(
      sessionStorage.getItem("ticketInfo") ||
        localStorage.getItem("ticketInfo") ||
        "{}"
    );
    if (ticketInfo && ticketInfo.price) {
      totalPrice = ticketInfo.price;
    } else {
      const registeredTicket = JSON.parse(
        sessionStorage.getItem("registeredTicket") ||
          localStorage.getItem("ticket") ||
          "{}"
      );
      if (registeredTicket && registeredTicket.ticketPrice) {
        totalPrice = registeredTicket.ticketPrice + "₾";
      } else {
        const selectedSeats = JSON.parse(
          sessionStorage.getItem("selectedSeats") ||
            localStorage.getItem("selectedSeats") ||
            "{}"
        );
        if (Object.keys(selectedSeats).length > 0) {
          let calculatedPrice = 0;
          Object.keys(selectedSeats).forEach((passengerId) => {
            const selections = selectedSeats[passengerId];
            Object.keys(selections).forEach((wagonId) => {
              const seat = selections[wagonId];
              if (seat && seat.price) {
                calculatedPrice += parseFloat(seat.price);
              }
            });
          });
          if (calculatedPrice > 0) {
            totalPrice = calculatedPrice.toFixed(2) + "₾";
          }
        }
      }
    }
  }

  if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice;
  }
}

function showError(input, message) {
  const existingError = input.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";
  errorDiv.textContent = message;

  input.parentElement.appendChild(errorDiv);
  input.style.borderColor = "red";
}

function clearError(input) {
  const existingError = input.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
  input.style.borderColor = "#ddd";
}

function displayRegistrationInfo() {
  const ticket = JSON.parse(localStorage.getItem("ticket") || "{}");
  const passengers = JSON.parse(localStorage.getItem("passengers") || "[]");
  const trainId = localStorage.getItem("trainId");
  const email = localStorage.getItem("passEmail");
  const phone = localStorage.getItem("passPhoneNum");

  console.log("=== რეგისტრაციის ინფორმაცია ===");
  console.log("მატარებლის ID:", trainId);
  console.log(
    "თარიღი:",
    ticket.date ? new Date(ticket.date).toLocaleString("ka-GE") : "მიუწვდომელია"
  );
  console.log("ელ-ფოსტა:", email);
  console.log("ტელეფონი:", phone);

  console.log("\n=== მგზავრების ინფორმაცია ===");
  console.log("მგზავრების რაოდენობა:", passengers.length);

  passengers.forEach((passenger, index) => {
    console.log(`\nმგზავრი ${index + 1}:`);
    console.log("სახელი:", passenger.name);
    console.log("გვარი:", passenger.surname);
    console.log("პირადი ნომერი:", passenger.idNumber);

    if (passenger.seats) {
      console.log("არჩეული ადგილები:");
      for (const wagonId in passenger.seats) {
        const seat = passenger.seats[wagonId];
        if (seat) {
          console.log(
            `- ვაგონი: ${seat.wagonName || wagonId}, ადგილი: ${
              seat.number
            }, ფასი: ${seat.price}₾`
          );
        }
      }
    } else {
      console.log("არჩეული ადგილები: არ არის");
    }
  });

  console.log("\n=== ბილეთის ინფორმაცია ===");
  console.log("ბილეთის მონაცემები:", ticket);
}

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

document.addEventListener("DOMContentLoaded", function () {
  loadTicketInfo();
  displayRegistrationInfo();

  if (cvvInput && cvvInput.value === "[object Object]") {
    cvvInput.value = "";
  }

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (e) {
      clearError(this);
      let value = this.value.replace(/\D/g, "");
      if (value.length > 0) {
        value = value.match(new RegExp(".{1,4}", "g")).join(" ");
      }
      this.value = value.substring(0, 19);
    });
  }

  if (expiryDateInput) {
    expiryDateInput.addEventListener("input", function (e) {
      clearError(this);
      let value = this.value.replace(/\D/g, "");
      if (value.length > 0) {
        if (value.length > 4) {
          value =
            value.substring(0, 2) +
            "/" +
            value.substring(2, 4) +
            "/" +
            value.substring(4);
        } else if (value.length > 2) {
          value = value.substring(0, 2) + "/" + value.substring(2);
        }
      }
      this.value = value.substring(0, 8);
    });
  }

  if (cvvInput) {
    cvvInput.addEventListener("input", function (e) {
      clearError(this);
      if (this.value === "[object Object]") {
        this.value = "";
      } else {
        this.value = this.value.replace(/\D/g, "").substring(0, 3);
      }
    });

    cvvInput.addEventListener("focus", function (e) {
      if (this.value === "[object Object]") {
        this.value = "";
      }
    });
  }

  if (cardHolderInput) {
    cardHolderInput.addEventListener("input", function (e) {
      clearError(this);
    });
  }

  if (backButton) {
    backButton.addEventListener("click", function () {
      window.location.href = "../main/index.html";
    });
  }

  document
    .querySelector(".primary-btn")
    .addEventListener("click", async function (e) {
      e.preventDefault();

      document
        .querySelectorAll(".error-message")
        .forEach((err) => err.remove());

      const requiredFields = [
        cardNumberInput,
        expiryDateInput,
        cvvInput,
        cardHolderInput,
      ].filter((field) => field !== null);
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          showError(field, "ეს ველი აუცილებელია");
          isValid = false;
        }
      });

      if (
        cardNumberInput &&
        cardNumberInput.value.trim() &&
        cardNumberInput.value.replace(/\s/g, "").length < 16
      ) {
        showError(cardNumberInput, "ბარათის ნომერი უნდა შეიცავდეს 16 ციფრს");
        isValid = false;
      }

      if (expiryDateInput && expiryDateInput.value.trim()) {
        const expiryValue = expiryDateInput.value;
        const expiryPattern =
          /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{2})$/;

        if (!expiryPattern.test(expiryValue)) {
          showError(expiryDateInput, "შეიყვანეთ სწორი ვადა (DD/MM/YY)");
          isValid = false;
        } else {
          const [day, month, year] = expiryValue.split("/");
          const expiryDate = new Date(
            2000 + parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
          if (expiryDate < new Date()) {
            showError(expiryDateInput, "ბარათის ვადა გასულია");
            isValid = false;
          }
        }
      }

      if (cvvInput && cvvInput.value.trim() && cvvInput.value.length < 3) {
        showError(cvvInput, "CVV უნდა შეიცავდეს 3 ციფრს");
        isValid = false;
      }

      if (isValid) {
        try {
          const ticketId = localStorage.getItem("ticket-id");
          const ticket = JSON.parse(localStorage.getItem("ticket") || "{}");

          if (!ticketId || !ticket) {
            throw new Error("ბილეთის ინფორმაცია ვერ მოიძებნა");
          }

          const ticketData = {
            cardNumber: cardNumberInput ? cardNumberInput.value : "",
            cardHolder: cardHolderInput ? cardHolderInput.value : "",
            expiryDate: expiryDateInput ? expiryDateInput.value : "",
            cvv: cvvInput ? cvvInput.value : "",
            price: totalPriceElement ? totalPriceElement.textContent : "",
            ticketId: ticketId,
          };

          sessionStorage.setItem(
            "directTicketData",
            JSON.stringify(ticketData)
          );
          localStorage.setItem("directTicketData", JSON.stringify(ticketData));

          window.location.href = "../full-ticket/index.html";
        } catch (error) {
          console.error("Error:", error);
          alert(error.message || "დაფიქსირდა შეცდომა");
        }
      }
    });

  updateLanguage();

  initLanguageSwitch();

  // Initialize dark mode when the page loads
  initDarkMode();
});

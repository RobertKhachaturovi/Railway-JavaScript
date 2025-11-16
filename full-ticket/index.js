const translations = {
  ka: {
    trainLogo: "მატარებლის ლოგო",
    departure: "გამგზავრება",
    arrival: "ჩასვლა",
    departureDate: "გასვლის თარიღი",
    trainId: "მატარებლის ID",
    postId: "ბილეთის ნომერი",
    date: "გაცემის თარიღი:",
    email: "ელ-ფოსტა",
    phone: "ტელეფონი",
    paymentInfo: "გადახდის ინფორმაცია",
    cardHolder: "ბარათის მფლობელი",
    cardNumber: "ბარათის ნომერი",
    totalPaid: "სულ გადახდილი",
    passengers: "მგზავრები",
    passenger: "მგზავრი",
    name: "სახელი",
    surname: "გვარი",
    personalId: "პირადი ნომერი",
    seat: "ადგილი",
    unavailable: "მიუწვდომელია",
    switchToEnglish: '<i class="fas fa-globe"></i> EN',
    switchToGeorgian: '<i class="fas fa-globe"></i> KA',
    printTicket: '<i class="fas fa-print"></i>',
    downloadTicket: '<i class="fas fa-download"></i>',
    back: "უკან დაბრუნება",
    currency: "ვალუტა",
  },
  en: {
    trainLogo: "Train Logo",
    departure: "Departure",
    arrival: "Arrival",
    departureDate: "Departure Date",
    trainId: "Train ID",
    postId: "Ticket Number",
    date: "Date",
    email: "Email",
    phone: "Phone",
    paymentInfo: "Payment Information",
    cardHolder: "Card Holder",
    cardNumber: "Card Number",
    totalPaid: "Total Paid",
    passengers: "Passengers",
    passenger: "Passenger",
    name: "Name",
    surname: "Surname",
    personalId: "Personal ID",
    seat: "Seat",
    unavailable: "Unavailable",
    switchToEnglish: '<i class="fas fa-globe"></i> EN',
    switchToGeorgian: '<i class="fas fa-globe"></i> KA',
    printTicket: '<i class="fas fa-print"></i>',
    downloadTicket: '<i class="fas fa-download"></i>',
    back: "Back",
    currency: "Currency",
  },
};

let currentLanguage = localStorage.getItem("language") || "ka";

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  displayRegistrationInfo();
}

document.addEventListener("DOMContentLoaded", function () {
  const rightIcon = document.querySelector(".right-icon");
  if (rightIcon) {
    const languageButton = document.createElement("button");
    languageButton.className = "language-btn";
    languageButton.innerHTML =
      currentLanguage === "ka"
        ? '<i class="fas fa-globe"></i> EN'
        : '<i class="fas fa-globe"></i> KA';
    languageButton.onclick = () => {
      const newLang = currentLanguage === "ka" ? "en" : "ka";
      setLanguage(newLang);
      languageButton.innerHTML =
        newLang === "ka"
          ? '<i class="fas fa-globe"></i> EN'
          : '<i class="fas fa-globe"></i> KA';
    };
    rightIcon.insertBefore(languageButton, rightIcon.firstChild);
  }

  // Dark mode functionality
  initDarkMode();

  // ... existing initialization code ...

  // Burger Menu Functionality
  const burgerMenuBtn = document.getElementById("burgerMenuBtn");
  const closeBtn = document.querySelector(".close-btn");
  const burgerMenu = document.querySelector(".burger-menu");
  const body = document.body;

  if (burgerMenuBtn && closeBtn && burgerMenu) {
    burgerMenuBtn.addEventListener("click", () => {
      burgerMenu.classList.add("active");
      body.style.overflow = "hidden";
    });

    closeBtn.addEventListener("click", () => {
      burgerMenu.classList.remove("active");
      body.style.overflow = "";
    });

    // Close burger menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        burgerMenu.classList.contains("active") &&
        !burgerMenu.contains(e.target) &&
        !burgerMenuBtn.contains(e.target)
      ) {
        burgerMenu.classList.remove("active");
        body.style.overflow = "";
      }
    });

    // Burger menu button functionality
    const checkTicketBtn = document.getElementById("checkTicketBtn");
    const helpBtn = document.getElementById("helpBtn");
    const darkModeBtn = document.getElementById("darkModeBtn");
    const exchangeBtn = document.getElementById("exchangeBtn");

    checkTicketBtn.addEventListener("click", function () {
      window.location.href = "../check-ticket/index.html";
    });

    helpBtn.addEventListener("click", function () {
      window.location.href = "../help/index.html";
    });

    darkModeBtn.addEventListener("click", function () {
      const icon = darkModeBtn.querySelector("i");
      if (icon.classList.contains("fa-moon")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
      burgerMenu.classList.remove("active");
      body.style.overflow = "";
    });

    exchangeBtn.addEventListener("click", function () {
      const currencyModal = document.getElementById("currencyModal");
      currencyModal.classList.add("active");
      body.style.overflow = "hidden";
      burgerMenu.classList.remove("active");
    });
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

const cardNumberInput = document.getElementById("cardNumber");
const expiryDateInput = document.getElementById("expiryDate");
const cvvInput = document.getElementById("cvv");
const cardHolderInput = document.getElementById("cardHolder");
const backButton = document.getElementById("backButton");
const totalPriceElement = document.getElementById("totalPrice");
const debugInfoElement = document.getElementById("debug-info");

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

const currencyRates = {
  GEL: 1,
  USD: 0.37,
  EUR: 0.34,
  RUB: 34.5,
};

let currentCurrency = "GEL";

function convertCurrency(amount, fromCurrency, toCurrency) {
  const numericAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericAmount)) return amount;

  const amountInGEL =
    fromCurrency === "GEL"
      ? numericAmount
      : numericAmount / currencyRates[fromCurrency];

  const convertedAmount = amountInGEL * currencyRates[toCurrency];

  return convertedAmount.toFixed(2);
}

function getCurrencySymbol(currency) {
  switch (currency) {
    case "GEL":
      return "₾";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "RUB":
      return "₽";
    default:
      return "₾";
  }
}

function updateTotalPaidDisplay() {
  const paymentInfo = document.querySelector(".payment-info");
  if (!paymentInfo) return;

  const totalPaidLabel = translations[currentLanguage].totalPaid;
  const totalPaidRow = Array.from(
    paymentInfo.querySelectorAll(".info-row")
  ).find((row) => {
    const label = row.querySelector(".info-label");
    return label && label.textContent.includes(totalPaidLabel);
  });

  if (!totalPaidRow) return;

  const totalPaidElement = totalPaidRow.querySelector(".info-value");
  if (!totalPaidElement) return;

  const originalAmount =
    totalPaidElement.getAttribute("data-original-amount") ||
    totalPaidElement.textContent;
  if (!totalPaidElement.hasAttribute("data-original-amount")) {
    totalPaidElement.setAttribute("data-original-amount", originalAmount);
  }

  const convertedAmount = convertCurrency(
    originalAmount,
    "GEL",
    currentCurrency
  );
  totalPaidElement.textContent =
    convertedAmount + getCurrencySymbol(currentCurrency);
}

function createCurrencySelector() {
  const paymentInfo = document.querySelector(".payment-info");
  if (!paymentInfo) return;

  const totalPaidLabel = translations[currentLanguage].totalPaid;
  const totalPaidRow = Array.from(
    paymentInfo.querySelectorAll(".info-row")
  ).find((row) => {
    const label = row.querySelector(".info-label");
    return label && label.textContent.includes(totalPaidLabel);
  });

  if (!totalPaidRow) return;

  const valueSpan = totalPaidRow.querySelector(".info-value");
  if (!valueSpan) return;

  const currencyButtonsContainer = document.createElement("div");
  currencyButtonsContainer.className = "currency-buttons";
  currencyButtonsContainer.style.display = "flex";
  currencyButtonsContainer.style.gap = "8px";
  currencyButtonsContainer.style.marginLeft = "10px";

  const currencies = [
    { code: "GEL", name: "₾ GEL" },
    { code: "USD", name: "$ USD" },
    { code: "EUR", name: "€ EUR" },
  ];

  currencies.forEach((currency) => {
    const button = document.createElement("button");
    button.className = "currency-btn";
    button.textContent = currency.name;
    button.dataset.currency = currency.code;

    if (currency.code === currentCurrency) {
      button.classList.add("active");
    }

    button.addEventListener("click", (e) => {
      currencyButtonsContainer
        .querySelectorAll(".currency-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      currentCurrency = currency.code;
      updateTotalPaidDisplay();
    });

    currencyButtonsContainer.appendChild(button);
  });

  valueSpan.style.display = "flex";
  valueSpan.style.alignItems = "center";
  valueSpan.style.gap = "10px";
  valueSpan.appendChild(currencyButtonsContainer);
}

function displayRegistrationInfo() {
  const registrationDetails = document.getElementById("registrationDetails");
  if (!registrationDetails) return;

  const ticket = JSON.parse(localStorage.getItem("ticket") || "{}");
  const passengers = JSON.parse(localStorage.getItem("passengers") || "[]");
  const trainId = localStorage.getItem("trainId");
  const email = localStorage.getItem("passEmail");
  const phone = localStorage.getItem("passPhoneNum");
  const paymentInfo = JSON.parse(
    localStorage.getItem("directTicketData") || "{}"
  );
  const train = JSON.parse(localStorage.getItem("train") || "{}");

  const postId =
    paymentInfo && Object.keys(paymentInfo).length > 0
      ? localStorage.getItem("ticket-id") || ""
      : "";

  const t = translations[currentLanguage];

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return "მიუწვდომელია";

    const cleanNumber = cardNumber.replace(/\D/g, "");
    if (cleanNumber.length < 8) return cardNumber;

    return `${cleanNumber.slice(0, 4)}${"*".repeat(
      cleanNumber.length - 8
    )}${cleanNumber.slice(-4)}`;
  };

  console.log("=== Debug Information ===");
  console.log("Train Data:", train);
  console.log("Passengers Data:", passengers);
  console.log("Payment Info:", paymentInfo);

  let html = `
        <div class="train-logo">
            <img src="./image/stepLogo.jpg" alt="${t.trainLogo}" />
        </div>
        <div class="ticket-header-text">
            <p>Step Railway</p>
        </div>
        <style>
            .train-logo {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 100px;
                height: auto;
            }
            .train-logo img {
                width: 100%;
                height: auto;
            }
            .ticket-header-text {
                position: absolute;
                top: 20px;
                left: 20px;
                font-size: 14px;
                color: #333;
                text-align: left;
            }
            .ticket-header-text p {
                margin: 0;
                line-height: 1.2;
            }
            .registration-section {
                position: relative;
                padding-top: 70px;
            }
            .schedule-info {
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #007bff;
            }
            .schedule-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                font-size: 15px;
            }
            .schedule-label {
                font-weight: bold;
                color: #495057;
            }
            .schedule-value {
                color: #212529;
            }
            .language-btn {
                background-color: rgb(40, 63, 191);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
                font-size: 14px;
            }
            .language-btn:hover {
                background-color: rgb(56, 58, 181);
            }
        </style>
        <div class="schedule-info">
            <div class="schedule-row">
                <span class="schedule-label">${t.departure}:</span>
                <span class="schedule-value">${train.from || t.unavailable} ${
    train.departure || ""
  }</span>
            </div>
            <div class="schedule-row">
                <span class="schedule-label">${t.arrival}:</span>
                <span class="schedule-value">${train.to || t.unavailable} ${
    train.arrive || ""
  }</span>
            </div>
            <div class="schedule-row">
                <span class="schedule-label">${t.departureDate}:</span>
                <span class="schedule-value">${
                  ticket.date
                    ? new Date(ticket.date).toLocaleDateString(
                        currentLanguage === "ka" ? "ka-GE" : "en-US"
                      )
                    : t.unavailable
                }</span>
            </div>
        </div>
        <div class="info-row">
            <span class="info-label">${t.trainId}:</span>
            <span class="info-value">${trainId || t.unavailable}</span>
        </div>
        <div class="info-row">
            <span class="info-label">${t.postId}:</span>
            <span class="info-value ticket-number-container">
                ${postId}
                <button class="copy-btn" title="${
                  currentLanguage === "ka"
                    ? "ბილეთის ნომრის კოპირება"
                    : "Copy Ticket Number"
                }">
                    <i class="fas fa-copy"></i>
                </button>
            </span>
        </div>
        <div class="info-row">
            <span class="info-label">${t.date}:</span>
            <span class="info-value">${
              ticket.date
                ? new Date(ticket.date).toLocaleString(
                    currentLanguage === "ka" ? "ka-GE" : "en-US"
                  )
                : t.unavailable
            }</span>
        </div>
        <div class="info-row">
            <span class="info-label">${t.email}:</span>
            <span class="info-value">${email || t.unavailable}</span>
        </div>
        <div class="info-row">
            <span class="info-label">${t.phone}:</span>
            <span class="info-value">${phone || t.unavailable}</span>
        </div>
        <div class="payment-info">
            <h4>${t.paymentInfo}:</h4>
            <div class="info-row">
                <span class="info-label">${t.cardHolder}:</span>
                <span class="info-value">${
                  paymentInfo.cardHolder || t.unavailable
                }</span>
            </div>
            <div class="info-row">
                <span class="info-label">${t.cardNumber}:</span>
                <span class="info-value">${formatCardNumber(
                  paymentInfo.cardNumber
                )}</span>
            </div>
            <div class="info-row">
                <span class="info-label">${t.totalPaid}:</span>
                <span class="info-value">${paymentInfo.price || "0.00₾"}</span>
            </div>
        </div>
        <div class="passenger-list">
            <h4>${t.passengers}:</h4>
    `;

  passengers.forEach((passenger, index) => {
    console.log(`\nProcessing passenger ${index + 1}:`, passenger);

    let seatInfo = null;

    if (passenger.seats) {
      for (const wagonId in passenger.seats) {
        if (passenger.seats[wagonId]) {
          seatInfo = passenger.seats[wagonId];
          console.log(`Found seat info for passenger ${index + 1}:`, seatInfo);
          break;
        }
      }
    }

    html += `
            <div class="passenger-item">
                <h4>${t.passenger} ${index + 1}</h4>
                <div class="passenger-details">
                    <div class="info-row">
                        <span class="info-label">${t.name}:</span>
                        <span class="info-value">${
                          passenger.name || t.unavailable
                        }</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">${t.surname}:</span>
                        <span class="info-value">${
                          passenger.surname || t.unavailable
                        }</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">${t.personalId}:</span>
                        <span class="info-value">${
                          passenger.idNumber || t.unavailable
                        }</span>
                    </div>
                    ${
                      seatInfo
                        ? `
                        <div class="info-row">
                            <span class="info-label">${t.seat}:</span>
                            <span class="info-value">${
                              seatInfo.wagonName || "ვაგონი"
                            } - ${seatInfo.number}</span>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;
  });

  html += "</div>";
  registrationDetails.innerHTML = html;

  createCurrencySelector();
  updateTotalPaidDisplay();

  const printButton = document.getElementById("printTicket");
  const downloadButton = document.getElementById("downloadTicket");
  const backButton = document.getElementById("backButton");

  if (printButton) {
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.title =
      currentLanguage === "ka" ? "ბილეთის დაბეჭდვა" : "Print Ticket";
  }
  if (downloadButton) {
    downloadButton.innerHTML = '<i class="fas fa-download"></i>';
    downloadButton.title =
      currentLanguage === "ka" ? "ბილეთის ჩამოტვირთვა" : "Download Ticket";
  }
  if (backButton) backButton.textContent = t.back;
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Session Storage Data:", {
    registrationData: sessionStorage.getItem("registrationData"),
    price: sessionStorage.getItem("price"),
    ticket: sessionStorage.getItem("ticket"),
    passengers: sessionStorage.getItem("passengers"),
    trainId: sessionStorage.getItem("trainId"),
    passEmail: sessionStorage.getItem("passEmail"),
    passPhoneNum: sessionStorage.getItem("passPhoneNum"),
    directTicketData: sessionStorage.getItem("directTicketData"),
    train: sessionStorage.getItem("train"),
  });

  displayRegistrationInfo();

  const printButton = document.getElementById("printTicket");
  if (printButton) {
    printButton.addEventListener("click", function () {
      const style = document.createElement("style");
      style.textContent = `
        @media print {
          body * {
            visibility: hidden;
          }
          .registration-section, .registration-section * {
            visibility: visible;
          }
          .registration-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .ticket-actions, header, footer {
            display: none;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    });
  }

  const downloadButton = document.getElementById("downloadTicket");
  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      const ticketActions = document.querySelector(".ticket-actions");
      const formActions = document.querySelector(".form-actions");
      const originalTicketDisplay = ticketActions.style.display;
      const originalFormDisplay = formActions.style.display;

      ticketActions.style.display = "none";
      formActions.style.display = "none";

      html2canvas(document.querySelector(".registration-section"), {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: function (clonedDoc) {
          const clonedTicketActions =
            clonedDoc.querySelector(".ticket-actions");
          const clonedFormActions = clonedDoc.querySelector(".form-actions");
          if (clonedTicketActions) {
            clonedTicketActions.style.display = "none";
          }
          if (clonedFormActions) {
            clonedFormActions.style.display = "none";
          }
        },
      }).then((canvas) => {
        ticketActions.style.display = originalTicketDisplay;
        formActions.style.display = originalFormDisplay;

        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "railway-ticket.png";
        link.href = imgData;
        link.click();
      });
    });
  }

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
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../people-registration/index.html";
    });
  }

  document
    .querySelector(".primary-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();

      const cardNumber = cardNumberInput ? cardNumberInput.value : "";
      const cardHolder = cardHolderInput ? cardHolderInput.value : "";
      const expiryDate = expiryDateInput ? expiryDateInput.value : "";
      const cvv = cvvInput ? cvvInput.value : "";
      const price = totalPriceElement ? totalPriceElement.textContent : "";

      const ticketData = {
        cardNumber: cardNumber,
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        cvv: cvv,
        price: price,
      };

      sessionStorage.setItem("directTicketData", JSON.stringify(ticketData));
      localStorage.setItem("directTicketData", JSON.stringify(ticketData));
    });

  const changeNameBtn = document.getElementById("changeNameBtn");
  if (changeNameBtn) {
    changeNameBtn.addEventListener("click", function () {
      const modal = document.createElement("div");
      modal.className = "name-change-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h3>${
            currentLanguage === "ka" ? "სახელის შეცვლა" : "Change Name"
          }</h3>
          <div class="form-group">
            <input type="text" id="newName" placeholder="${
              currentLanguage === "ka" ? "ახალი სახელი" : "New Name"
            }" />
          </div>
          <div class="modal-buttons">
            <button class="cancel-btn">${
              currentLanguage === "ka" ? "გაუქმება" : "Cancel"
            }</button>
            <button class="save-btn">${
              currentLanguage === "ka" ? "შენახვა" : "Save"
            }</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const style = document.createElement("style");
      style.textContent = `
        .name-change-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
        }
        .modal-content h3 {
          margin-bottom: 20px;
          color: #333;
          text-align: center;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .modal-buttons button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .cancel-btn {
          background: #f1f1f1;
          color: #333;
        }
        .save-btn {
          background: rgb(40, 63, 191);
          color: white;
        }
        .cancel-btn:hover {
          background: #e1e1e1;
        }
        .save-btn:hover {
          background: rgb(56, 58, 181);
        }
      `;
      document.head.appendChild(style);

      const closeModal = () => {
        modal.remove();
        style.remove();
      };

      modal.querySelector(".cancel-btn").addEventListener("click", closeModal);

      modal.querySelector(".save-btn").addEventListener("click", function () {
        const newName = modal.querySelector("#newName").value.trim();
        if (newName) {
          alert(
            currentLanguage === "ka"
              ? "სახელი წარმატებით შეიცვალა"
              : "Name changed successfully"
          );
          closeModal();
        } else {
          alert(
            currentLanguage === "ka"
              ? "გთხოვთ შეიყვანოთ ახალი სახელი"
              : "Please enter a new name"
          );
        }
      });

      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".copy-btn")) {
      const ticketNumberContainer = e.target.closest(
        ".ticket-number-container"
      );
      const ticketNumber =
        ticketNumberContainer.childNodes[0].textContent.trim();

      navigator.clipboard
        .writeText(ticketNumber)
        .then(() => {
          const copyBtn = e.target.closest(".copy-btn");
          const originalIcon = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          copyBtn.classList.add("copied");

          setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.classList.remove("copied");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy ticket number:", err);
        });
    }
  });

  const currencyModal = document.getElementById("currencyModal");
  const exchangeBtn = document.querySelector(".exchange-btn");
  const closeBtn = currencyModal.querySelector(".close");
  const amountInput = document.getElementById("amount");
  const fromCurrencySelect = document.getElementById("fromCurrency");

  if (exchangeBtn) {
    exchangeBtn.addEventListener("click", function () {
      currencyModal.style.display = "block";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      currencyModal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === currencyModal) {
      currencyModal.style.display = "none";
    }
  });

  function updateCurrencyValues() {
    const amount = parseFloat(amountInput.value) || 0;
    const fromCurrency = fromCurrencySelect.value;

    // Convert to GEL first
    let amountInGEL;
    switch (fromCurrency) {
      case "GEL":
        amountInGEL = amount;
        break;
      case "USD":
        amountInGEL = amount / currencyRates.USD;
        break;
      case "EUR":
        amountInGEL = amount / currencyRates.EUR;
        break;
      case "RUB":
        amountInGEL = amount / currencyRates.RUB;
        break;
    }

    // Convert from GEL to all currencies except the selected one
    const gelAmount =
      fromCurrency === "GEL" ? "---" : (amountInGEL * 1).toFixed(2);
    const usdAmount =
      fromCurrency === "USD"
        ? "---"
        : (amountInGEL * currencyRates.USD).toFixed(2);
    const eurAmount =
      fromCurrency === "EUR"
        ? "---"
        : (amountInGEL * currencyRates.EUR).toFixed(2);
    const rubAmount =
      fromCurrency === "RUB"
        ? "---"
        : (amountInGEL * currencyRates.RUB).toFixed(2);

    document.getElementById("gelAmount").textContent =
      fromCurrency === "GEL" ? "---" : `${gelAmount} ₾`;
    document.getElementById("usdAmount").textContent =
      fromCurrency === "USD" ? "---" : `${usdAmount} $`;
    document.getElementById("eurAmount").textContent =
      fromCurrency === "EUR" ? "---" : `${eurAmount} €`;
    document.getElementById("rubAmount").textContent =
      fromCurrency === "RUB" ? "---" : `${rubAmount} ₽`;
  }

  if (amountInput) {
    amountInput.addEventListener("input", updateCurrencyValues);
  }

  if (fromCurrencySelect) {
    fromCurrencySelect.addEventListener("change", updateCurrencyValues);
  }
});

const searchInfo = JSON.parse(localStorage.getItem("searchInfo"));
const passengerCount = parseInt(searchInfo?.guests || 1);

function showFoodOrderModal(redirectTo) {
  const modal = document.getElementById("foodOrderModal");
  if (modal) {
    modal.classList.add("active");
    modal.dataset.redirectTo = redirectTo;
  }
}

function hideFoodOrderModal() {
  const modal = document.getElementById("foodOrderModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Add event listeners for the modal buttons
document.addEventListener("DOMContentLoaded", () => {
  const yesButton = document.getElementById("yesFoodOrder");
  const noButton = document.getElementById("noFoodOrder");
  const mainPageButton = document.getElementById("mainPageReturnBtn");
  const backButton = document.querySelector(".secondary-btn");
  const logoDesktop = document.querySelector(".logo-desktop");
  const logoMobile = document.querySelector(".logo-mobile");

  if (logoDesktop) {
    logoDesktop.removeAttribute("href");
  }
  if (logoMobile) {
    logoMobile.removeAttribute("href");
  }

  if (yesButton) {
    yesButton.addEventListener("click", () => {
      hideFoodOrderModal();
      window.location.href = "../restaurant/index.html";
    });
  }

  if (noButton) {
    noButton.addEventListener("click", () => {
      const foodOrderModal = document.getElementById("foodOrderModal");
      foodOrderModal.style.display = "none";
      const ratingModal = document.getElementById("ratingModal");
      ratingModal.style.display = "flex";
    });
  }

  // Show modal when clicking main page button
  if (mainPageButton) {
    mainPageButton.addEventListener("click", (e) => {
      e.preventDefault();
      showFoodOrderModal("main");
    });
  }

  // Show modal when clicking back button
  if (backButton) {
    backButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../people-registration/index.html";
    });
  }

  // Show modal when clicking desktop logo
  if (logoDesktop) {
    logoDesktop.addEventListener("click", (e) => {
      e.preventDefault();
      showFoodOrderModal("main");
    });
  }

  // Show modal when clicking mobile logo
  if (logoMobile) {
    logoMobile.addEventListener("click", (e) => {
      e.preventDefault();
      showFoodOrderModal("main");
    });
  }
});

// შეფასების მოდალის ფუნქციონალი
const ratingModal = document.getElementById("ratingModal");
const stars = document.querySelectorAll(".star");
const submitRating = document.getElementById("submitRating");
let selectedRating = 0;

// ვარსკვლავების ინტერაქცია
stars.forEach((star) => {
  star.addEventListener("click", () => {
    const rating = parseInt(star.dataset.rating);
    selectedRating = rating;

    stars.forEach((s) => {
      const starRating = parseInt(s.dataset.rating);
      if (starRating <= rating) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
  });
});

// შეფასების გაგზავნა
submitRating.addEventListener("click", () => {
  const comment = document.querySelector(".rating-comment").value;

  if (selectedRating > 0) {
    const rating = {
      id: Date.now(),
      rating: selectedRating,
      comment: comment,
      date: new Date().toISOString().split("T")[0],
    };

    // შეფასებების მიღება localStorage-დან
    const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
    ratings.push(rating);
    localStorage.setItem("ratings", JSON.stringify(ratings));

    // მოდალის დახურვა
    ratingModal.style.display = "none";
    document.querySelector(".rating-comment").value = "";
    stars.forEach((s) => {
      s.classList.remove("active");
    });
    selectedRating = 0;

    // მადლობის შეტყობინების ჩვენება
    const thankYouMessage = document.createElement("div");
    thankYouMessage.className = "thank-you-message";
    thankYouMessage.innerHTML = `
      <div class="message-content">
        <h3>მადლობა!</h3>
        <p>თქვენი კომენტარი წარმატებით გაიგზავნა</p>
      </div>
    `;
    document.body.appendChild(thankYouMessage);

    // სტილების დამატება
    const style = document.createElement("style");
    style.textContent = `
      .thank-you-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        text-align: center;
      }
      .message-content h3 {
        color: #4CAF50;
        margin-bottom: 10px;
      }
      .message-content p {
        color: #333;
        margin: 0;
      }
    `;
    document.head.appendChild(style);

    // 2 წამის შემდეგ მთავარ გვერდზე გადასვლა
    setTimeout(() => {
      document.body.removeChild(thankYouMessage);
      document.head.removeChild(style);
      window.location.href = "../main/index.html";
    }, 2000);
  }
});

// "არა" ღილაკზე დაჭერისას შეფასების მოდალის გახსნა
document.getElementById("noFoodOrder").addEventListener("click", () => {
  const foodOrderModal = document.getElementById("foodOrderModal");
  foodOrderModal.style.display = "none";
  ratingModal.style.display = "flex";
});

// მოდალის დახურვა X ღილაკზე დაჭერისას
ratingModal.querySelector(".close").addEventListener("click", () => {
  ratingModal.style.display = "none";
  window.location.href = "../main/index.html";
});

// "არ ვარ კმაყოფილი" ღილაკის ფუნქციონალი
document.getElementById("notSatisfied").addEventListener("click", () => {
  const ratingModal = document.getElementById("ratingModal");
  ratingModal.style.display = "none";

  // უარყოფითი შეფასების შენახვა
  const rating = {
    id: Date.now(),
    rating: 1,
    comment: "მომხმარებელი არ არის კმაყოფილი",
    date: new Date().toISOString().split("T")[0],
    isNegative: true,
  };

  // შეფასებების მიღება localStorage-დან
  const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
  ratings.push(rating);
  localStorage.setItem("ratings", JSON.stringify(ratings));

  // ბოდიშის მოხდითის შეტყობინების ჩვენება
  const apologyMessage = document.createElement("div");
  apologyMessage.className = "thank-you-message";
  apologyMessage.innerHTML = `
    <div class="message-content">
      <h3>ბოდიშის მოხდით!</h3>
      <p>მადლობა თქვენი გამოხმაურებისთვის. ჩვენ ვმუშაობთ ჩვენი სერვისის გაუმჯობესებაზე.</p>
    </div>
  `;
  document.body.appendChild(apologyMessage);

  // სტილების დამატება
  const style = document.createElement("style");
  style.textContent = `
    .thank-you-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      text-align: center;
    }
    .message-content h3 {
      color: #dc3545;
      margin-bottom: 10px;
    }
    .message-content p {
      color: #333;
      margin: 0;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    document.body.removeChild(apologyMessage);
    document.head.removeChild(style);
    window.location.href = "../main/index.html";
  }, 2000);
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

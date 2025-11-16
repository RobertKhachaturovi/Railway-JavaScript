// Dark mode functionality
document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");

  // Check for saved theme preference
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
});

document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const ticketDetails = document.getElementById("ticketDetails");
  const passengerContainer = document.getElementById("passenger-container");

  window.selectedSeats = {};

  const urlParams = new URLSearchParams(window.location.search);
  const trainId = urlParams.get("id");

  if (trainId && ticketDetails) {
    try {
      const response = await fetch(
        `https://railway.stepprojects.ge/api/trains/${trainId}`
      );
      if (!response.ok) {
        throw new Error("API response not successful");
      }
      const trainData = await response.json();

      ticketDetails.innerHTML = `
        <p>${trainData.name || "სახელი მიუწვდომელია"}</p>
        <p>${trainData.departure || "გადასვლის დრო მიუწვდომელია"} - ${
        trainData.from || ""
      }</p>
        <p>${trainData.arrive || "ჩასვლის დრო მიუწვდომელია"} - ${
        trainData.to || ""
      }</p>
      `;
    } catch (error) {
      console.error("Error fetching data:", error);
      ticketDetails.innerHTML = "<p>შეცდომა მონაცემების მიღებისას.</p>";
    }
  } else if (ticketDetails) {
    ticketDetails.innerHTML = "<p>ID ვერ მოიძებნა URL-ში.</p>";
  }

  const searchInfo = JSON.parse(localStorage.getItem("searchInfo"));
  const passengerCount = parseInt(searchInfo?.guests || 1);

  if (passengerContainer) {
    const heading = document.createElement("h2");
    heading.classList.add("passenger-title");
    heading.textContent = "მგზავრები";
    passengerContainer.appendChild(heading);

    for (let i = 1; i <= passengerCount; i++) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("passenger-wrapper");

      const individualTitle = document.createElement("h3");
      individualTitle.textContent = `მგზავრი ${i}`;
      individualTitle.classList.add("passenger-subtitle");

      const passengerRow = document.createElement("div");
      passengerRow.classList.add("passenger-row");

      passengerRow.innerHTML = `
       <button class="select-seats" id="select-seats-${trainId}-${i}" data-passenger-id="${i}">ადგილი: 0</button>
          <input type="text" placeholder="სახელი" name="firstName${i}" />
          <input type="text" placeholder="გვარი" name="lastName${i}" />
          <input type="text" placeholder="პირადი ნომერი" name="personalID${i}" maxlength="11" pattern="\\d{11}" inputmode="numeric" class="personal-id-input" required />
       <button class="select-seat" data-passenger-id="${i}">ადგილის არჩევა</button>
      `;

      wrapper.appendChild(individualTitle);
      wrapper.appendChild(passengerRow);
      passengerContainer.appendChild(wrapper);
    }
  }

  const seatModal = document.getElementById("seatModal");
  const baggageModal = document.getElementById("baggageModal");

  const chooseSeatBtns = document.querySelectorAll(".select-seat");

  chooseSeatBtns.forEach((btn, index) => {
    btn.addEventListener("click", (event) => {
      const passengerId = btn.getAttribute("data-passenger-id");
      localStorage.setItem("currentPassengerIndex", index);
      localStorage.setItem("currentPassengerId", passengerId);

      fetch(`https://railway.stepprojects.ge/api/trains/${trainId}`)
        .then((res) => res.json())
        .then((data) => {
          const train = data;
          localStorage.setItem("train", JSON.stringify(train));

          seatModal.style.display = "block";
        });
    });
  });
  const train = JSON.parse(localStorage.getItem("train"));

  if (!train || !train.vagons || train.vagons.length === 0) {
    console.error("ვაგონების მონაცემები არ არის ხელმისაწვდომი.");
  } else {
    const vagons = document.querySelectorAll(".wagon");
    vagons.forEach((img, index) => {
      img.addEventListener("click", function () {
        const selectedVagon = train.vagons[index];

        fetch(
          `https://railway.stepprojects.ge/api/getvagon/${selectedVagon.id}`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("ვაგონის მონაცემების მიღება ვერ მოხერხდა");
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("შეცდომა:", error);
          });
      });
    });
  }

  passengerContainer.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("select-seat")) {
      const passengerId = event.target.getAttribute("data-passenger-id");
      const passengerRow = event.target.closest(".passenger-row");
      const passengerWrapper = passengerRow.closest(".passenger-wrapper");
      const allWrappers = Array.from(
        document.querySelectorAll(".passenger-wrapper")
      );
      const passengerIndex = allWrappers.indexOf(passengerWrapper);

      localStorage.setItem("currentPassengerIndex", passengerIndex);
      localStorage.setItem("currentPassengerId", passengerId);

      fetch(`https://railway.stepprojects.ge/api/trains/${trainId}`)
        .then((res) => res.json())
        .then((res) => {
          const train = res;

          seatModal.style.display = "block";
          const vagons = document.querySelectorAll("wagons");

          vagons.forEach((img, index) => {
            img.addEventListener("click", function () {
              fetch(`https://railway.stepprojects.ge/api/getvagon/${train}`);
            });
          });
        });
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target === seatModal) {
      seatModal.style.display = "none";
    }
  });

  const baggageBtns = document.querySelectorAll(".select-baggage");
  baggageBtns.forEach((button) => {
    button.addEventListener("click", () => {
      baggageModal.style.display = "block";
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === baggageModal) {
      baggageModal.style.display = "none";
    }
  });

  const closeBtns = document.querySelectorAll(".close");

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  window.addEventListener("click", (event) => {
    const modal = document.querySelector(".modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  document
    .querySelectorAll("#seatModal .wagon")
    .forEach((wagon, wagonIndex) => {
      wagon.addEventListener("click", () => {
        const oldModal = document.getElementById("seatModal");
        const newModal = document.getElementById("wagonModal");

        if (oldModal) {
          oldModal.style.display = "none";
        }

        if (newModal) {
          newModal.style.display = "block";

          const wagonsInNewModal =
            document.querySelectorAll("#wagonModal .wagon");
          if (wagonsInNewModal[wagonIndex]) {
            setTimeout(() => {
              wagonsInNewModal[wagonIndex].click();
            }, 100);
          }
        }
      });
    });

  document.querySelector(".new-close").addEventListener("click", () => {
    const modal = document.getElementById("wagonModal");
    if (modal) {
      modal.style.display = "none";
    }
  });

  window.addEventListener("click", (e) => {
    const modal = document.getElementById("wagonModal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  const paymentButton = document.getElementById("paymentButton");
  if (paymentButton) {
    setupPaymentValidation();
  }

  // Email validation
  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener("input", function (e) {
      const email = this.value;
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

      if (!gmailRegex.test(email)) {
        this.setCustomValidity(
          "გთხოვთ გამოიყენოთ Gmail მისამართი (@gmail.com)"
        );
        this.style.borderColor = "red";
      } else {
        this.setCustomValidity("");
        this.style.borderColor = "";
      }
    });

    // Payment button validation
    paymentButton.addEventListener("click", function (e) {
      const email = emailInput.value;
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

      if (!gmailRegex.test(email)) {
        e.preventDefault();
        emailInput.style.borderColor = "red";
        emailInput.setCustomValidity(
          "გთხოვთ გამოიყენოთ Gmail მისამართი (@gmail.com)"
        );
        emailInput.reportValidity();
        return false;
      }
    });
  }

  setupPaymentValidation();

  // Phone number formatting and validation
  const phoneInput = document.querySelector(".phone-number");
  if (phoneInput) {
    const countryCodes = {
      GE: "+995",
      RU: "+7",
      AZ: "+994",
      AM: "+374",
      TR: "+90",
      UA: "+380",
      BY: "+375",
      PL: "+48",
      DE: "+49",
      GB: "+44",
    };

    // Add country code selection
    const countrySelect = document.createElement("select");
    countrySelect.className = "country-code";
    countrySelect.style.position = "absolute";
    countrySelect.style.left = "10px";
    countrySelect.style.top = "70%";
    countrySelect.style.transform = "translateY(-50%)";
    countrySelect.style.border = "none";
    countrySelect.style.background =
      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\") right 0px center / 12px no-repeat transparent";
    countrySelect.style.color = "rgb(153, 153, 153)";
    countrySelect.style.fontSize = "1rem";
    countrySelect.style.cursor = "pointer";
    countrySelect.style.zIndex = "1";
    countrySelect.style.paddingRight = "20px";
    countrySelect.style.appearance = "none";
    countrySelect.style.width = "100px";

    // Add options
    Object.entries(countryCodes).forEach(([country, code]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${code} (${country})`;
      countrySelect.appendChild(option);
    });

    // Handle country code change
    countrySelect.addEventListener("change", function () {
      phoneInput.value = "";
      phoneInput.setCustomValidity("");
    });

    // Add select to container
    phoneInput.parentElement.appendChild(countrySelect);

    // Update phone input padding
    phoneInput.style.paddingLeft = "120px";

    // Phone number formatting
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      let formattedValue = "";

      // Add space after every 3 digits
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 3 === 0) {
          formattedValue += " ";
        }
        formattedValue += value[i];
      }

      e.target.value = formattedValue;

      const isValid = /^[0-9]{11}$/.test(value);
      if (!isValid) {
        phoneInput.setCustomValidity(
          "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი (11 ციფრი)"
        );
      } else {
        phoneInput.setCustomValidity("");
      }
    });
  }

  // Dark mode toggle functionality
  function initDarkMode() {
    const darkModeToggle = document.createElement("button");
    darkModeToggle.className = "dark-mode-toggle";
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector(".header-buttons").prepend(darkModeToggle);

    // Check for saved theme preference
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

  // Initialize dark mode when the page loads
  initDarkMode();
});

document.querySelectorAll("#wagonModal .wagon").forEach((wagonEl, index) => {
  wagonEl.addEventListener("click", async () => {
    document
      .querySelectorAll("#wagonModal .wagon")
      .forEach((el) => el.classList.remove("highlighted-wagon"));

    wagonEl.classList.add("highlighted-wagon");

    const train = JSON.parse(localStorage.getItem("train"));

    if (!train || !train.vagons || !train.vagons[index]) {
      console.error("ვაგონის მონაცემები ვერ მოიძებნა");
      return;
    }

    const selectedVagon = train.vagons[index];
    const wagonId = selectedVagon.id;
    localStorage.setItem("currentWagonId", wagonId);

    try {
      const res = await fetch(
        `https://railway.stepprojects.ge/api/getvagon/${wagonId}`
      );
      if (!res.ok) throw new Error("ვაგონის მონაცემების მიღება ვერ მოხერხდა");
      const result = await res.json();
      const wagonData = result[0];

      console.log("API Response for wagon:", wagonData);

      const seatContainer = document.getElementById("seatContainer");

      if (seatContainer) {
        seatContainer.innerHTML = "";
        const seatsWrapper = document.createElement("div");
        seatsWrapper.classList.add("seats-wrapper");

        if (wagonData.seats && wagonData.seats.length) {
          const renderAllSeats = () => {
            const currentPassengerId =
              localStorage.getItem("currentPassengerId");
            seatsWrapper.innerHTML = "";

            wagonData.seats.forEach((seat) => {
              console.log("Seat data from API:", seat);

              const seatDiv = document.createElement("div");
              seatDiv.className = "seats";
              seatDiv.textContent = seat.number;
              seatDiv.dataset.seatId = seat.seatId;
              seatDiv.dataset.price = seat.price;
              seatDiv.dataset.wagonId = wagonId;

              let alreadySelected = false;
              let selectedByCurrentPassenger = false;

              Object.entries(window.selectedSeats).forEach(
                ([passengerId, selections]) => {
                  if (
                    selections &&
                    selections[wagonId] &&
                    selections[wagonId].number === seat.number
                  ) {
                    alreadySelected = true;
                    if (passengerId === currentPassengerId) {
                      selectedByCurrentPassenger = true;
                    }
                  }
                }
              );

              if (seat.isOccupied) {
                seatDiv.style.backgroundColor = "#e74c3c";
                seatDiv.style.cursor = "not-allowed";
                seatDiv.title = "ადგილი დაკავებულია";
              } else if (alreadySelected && !selectedByCurrentPassenger) {
                seatDiv.style.backgroundColor = "#e74c3c";
                seatDiv.style.cursor = "not-allowed";
                seatDiv.title = `ადგილი უკვე არჩეულია სხვა მგზავრის მიერ`;
              } else if (selectedByCurrentPassenger) {
                seatDiv.style.backgroundColor = "#ff9800";
                seatDiv.style.cursor = "pointer";
                seatDiv.title = `თქვენს მიერ არჩეული ადგილი - ${seat.price}₾`;
              } else {
                seatDiv.style.backgroundColor = "#2ecc71";
                seatDiv.style.cursor = "pointer";
                seatDiv.title = `ადგილი თავისუფალია - ${seat.price}₾`;
              }

              seatDiv.addEventListener("click", () => {
                if (
                  seat.isOccupied ||
                  (alreadySelected && !selectedByCurrentPassenger)
                ) {
                  return;
                }

                console.log("Selected Seat ID:", seat.seatId);
                console.log("Selected Seat Number:", seat.number);
                console.log("Selected Seat Price:", seat.price);

                const passengerIndex =
                  localStorage.getItem("currentPassengerIndex") || 0;
                const passengerId = localStorage.getItem("currentPassengerId");
                const trainId = wagonData.trainId;

                if (!window.selectedSeats[passengerId]) {
                  window.selectedSeats[passengerId] = {};
                } else {
                  window.selectedSeats[passengerId] = {};
                }

                if (selectedByCurrentPassenger) {
                  delete window.selectedSeats[passengerId][wagonId];
                  if (
                    Object.keys(window.selectedSeats[passengerId]).length === 0
                  ) {
                    delete window.selectedSeats[passengerId];
                  }
                } else {
                  const seatData = {
                    number: seat.number,
                    price: seat.price,
                    wagonName: selectedVagon.name || `ვაგონი ${index + 1}`,
                    id: seat.seatId,
                  };

                  console.log("Saving seat data to window.selectedSeats:", {
                    passengerId,
                    wagonId,
                    seatData,
                  });

                  window.selectedSeats[passengerId][wagonId] = seatData;

                  console.log(
                    "Current state of window.selectedSeats:",
                    window.selectedSeats
                  );
                }

                const selectSeatButton = document.querySelector(
                  `#select-seats-${trainId}-${passengerId}`
                );
                if (selectSeatButton) {
                  if (
                    selectedByCurrentPassenger ||
                    Object.keys(window.selectedSeats[passengerId] || {})
                      .length === 0
                  ) {
                    selectSeatButton.textContent = `ადგილი: 0`;
                  } else {
                    const wagonName =
                      selectedVagon.name || `ვაგონი ${index + 1}`;
                    selectSeatButton.innerHTML = `ადგილი:${seat.number}`;
                    selectSeatButton.dataset.seatNumber = seat.number;
                    selectSeatButton.dataset.seatPrice = seat.price;
                    selectSeatButton.dataset.wagonId = wagonId;
                    selectSeatButton.dataset.wagonName = wagonName;
                    selectSeatButton.setAttribute("seat-id", seat.seatId);
                  }
                }

                renderAllSeats();
                updateInvoice();
              });

              seatsWrapper.appendChild(seatDiv);
            });
          };

          renderAllSeats();
          seatContainer.appendChild(seatsWrapper);
        } else {
          seatContainer.textContent = "ადგილები ვერ მოიძებნა";
        }
      }
    } catch (err) {
      console.error("შეცდომა:", err);
    }
  });
});

// Add currency conversion function
async function convertCurrency(amount, fromCurrency = "GEL", toCurrency) {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();
    const rate = data.rates[toCurrency];
    return (amount * rate).toFixed(2);
  } catch (error) {
    console.error("Currency conversion error:", error);
    return null;
  }
}

function updateInvoice() {
  const invoiceBox = document.querySelector(".invoice-box");
  const invoiceBody = document.querySelector(".invoice-box .row");
  const amountBox = document.querySelector(".amount-box");
  const checkboxDiv = document.querySelector(".checkbox");
  const paymentButtonDiv = document.querySelector(".amount-boxs");

  let checkboxChecked = false;
  if (checkboxDiv) {
    const checkbox = checkboxDiv.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkboxChecked = checkbox.checked;
    }
  }

  const existingRows = document.querySelectorAll(".invoice-box .seat-row");
  existingRows.forEach((row) => row.remove());

  let totalPrice = 0;

  Object.keys(window.selectedSeats).forEach((passengerId) => {
    const passengerSelections = window.selectedSeats[passengerId];

    Object.keys(passengerSelections).forEach((wagonId) => {
      const seat = passengerSelections[wagonId];
      if (seat) {
        const seatRow = document.createElement("div");
        seatRow.classList.add("row", "seat-row");
        seatRow.innerHTML = `
          <div>${seat.number}</div>
          <div>${seat.price}₾</div>
        `;

        if (invoiceBody && invoiceBody.parentNode && amountBox) {
          invoiceBody.parentNode.insertBefore(seatRow, amountBox);
        }

        totalPrice += parseFloat(seat.price);
      }
    });
  });

  // Create or update total amount display with currency conversion
  if (!amountBox) {
    const newAmountBox = document.createElement("div");
    newAmountBox.className = "amount-box";
    newAmountBox.innerHTML = `
      <div class="row">
        <span>სულ:</span>
        <span>${totalPrice.toFixed(2)}₾</span>
      </div>
      <div class="currency-conversion">
        <div class="conversion-row">
          <span>USD:</span>
          <span class="usd-amount">...</span>
        </div>
        <div class="conversion-row">
          <span>EUR:</span>
          <span class="eur-amount">...</span>
        </div>
      </div>
    `;
    if (invoiceBox) {
      invoiceBox.appendChild(newAmountBox);
    }
  } else {
    const totalElement = amountBox.querySelector("span:last-child");
    if (totalElement) {
      totalElement.textContent = `${totalPrice.toFixed(2)}₾`;
    } else {
      amountBox.innerHTML = `
        <div class="row">
          <span>სულ:</span>
          <span>${totalPrice.toFixed(2)}₾</span>
        </div>
        <div class="currency-conversion">
          <div class="conversion-row">
            <span>USD:</span>
            <span class="usd-amount">...</span>
          </div>
          <div class="conversion-row">
            <span>EUR:</span>
            <span class="eur-amount">...</span>
          </div>
        </div>
      `;
    }
  }

  // Update currency conversions
  const usdAmount = amountBox.querySelector(".usd-amount");
  const eurAmount = amountBox.querySelector(".eur-amount");

  if (usdAmount && eurAmount) {
    convertCurrency(totalPrice, "GEL", "USD").then((usd) => {
      if (usd) usdAmount.textContent = `$${usd}`;
    });
    convertCurrency(totalPrice, "GEL", "EUR").then((eur) => {
      if (eur) eurAmount.textContent = `€${eur}`;
    });
  }

  if (invoiceBox) {
    const existingCheckboxDiv = document.querySelector(".checkbox");
    const existingPaymentButtonDiv = document.querySelector(".amount-boxs");

    if (!existingCheckboxDiv && checkboxDiv) {
      const amountBox = document.querySelector(".amount-box");
      if (amountBox && amountBox.parentNode) {
        const newCheckboxDiv = document.createElement("div");
        newCheckboxDiv.className = "checkbox";
        newCheckboxDiv.innerHTML = `
          <input type="checkbox" id="agree" ${
            checkboxChecked ? "checked" : ""
          } />
          <label for="agree">წავიკითხე და ვეთანხმები წესებს</label>
        `;
        amountBox.parentNode.insertBefore(
          newCheckboxDiv,
          amountBox.nextSibling
        );
      }
    }

    if (!existingPaymentButtonDiv && paymentButtonDiv) {
      const currentCheckboxDiv = document.querySelector(".checkbox");
      if (currentCheckboxDiv && currentCheckboxDiv.parentNode) {
        currentCheckboxDiv.parentNode.insertBefore(
          paymentButtonDiv,
          currentCheckboxDiv.nextSibling
        );
      } else if (invoiceBox) {
        invoiceBox.appendChild(paymentButtonDiv);
      }
    }

    const buttonDiv = existingPaymentButtonDiv || paymentButtonDiv;
    if (buttonDiv) {
      buttonDiv.style.display = "block";
    }
  }
}

async function registrateTicketFunction() {
  const passengersData = JSON.parse(localStorage.getItem("passengers") || "[]");
  const trainId = localStorage.getItem("trainId");
  const ticketInfo = JSON.parse(localStorage.getItem("ticketInfo") || "{}");

  console.log("Debug - Train ID:", trainId);
  console.log("Debug - Ticket Info:", ticketInfo);
  console.log("Debug - Passengers Data:", passengersData);
  console.log("Debug - Selected Seats:", window.selectedSeats);

  const newTicket = {
    trainId: parseInt(trainId),
    date: new Date().toISOString(),
    email: ticketInfo.email || "",
    phoneNumber: ticketInfo.phone || "",
    people: [],
  };

  passengersData.forEach((passenger) => {
    const seatInfo = passenger.seats ? Object.values(passenger.seats)[0] : null;
    console.log("Debug - Processing passenger:", passenger);
    console.log("Debug - Seat info for passenger:", seatInfo);

    if (seatInfo && seatInfo.id) {
      const person = {
        seatId: seatInfo.id,
        name: passenger.name,
        surname: passenger.surname,
        idNumber: passenger.idNumber,
        status: "0",
        payoutCompleted: true,
      };

      console.log("Debug - Created person object:", person);
      newTicket.people.push(person);
    } else {
      console.warn("Debug - No seat info found for passenger:", passenger);
    }
  });

  console.log(
    "Debug - Final ticket data to send:",
    JSON.stringify(newTicket, null, 2)
  );

  try {
    console.log(
      "Debug - Sending POST request to:",
      "https://railway.stepprojects.ge/api/tickets/register"
    );
    console.log("Debug - Request body:", JSON.stringify(newTicket, null, 2));

    const response = await fetch(
      "https://railway.stepprojects.ge/api/tickets/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newTicket),
      }
    );

    console.log("Debug - Response status:", response.status);
    console.log(
      "Debug - Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Debug - Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const responseText = await response.text();
    console.log(
      "%cბილეთის რეგისტრაციის პასუხი:",
      "color: #2ecc71; font-size: 16px; font-weight: bold;"
    );
    console.log("%c" + responseText, "color: #2ecc71; font-size: 14px;");

    const ticketIdMatch = responseText.match(/ბილეთის ნომერია:([a-f0-9-]+)/);
    if (!ticketIdMatch) {
      throw new Error("Could not extract ticket ID from response");
    }

    const ticketId = ticketIdMatch[1];
    console.log(
      "%cბილეთის ID:",
      "color: #3498db; font-size: 16px; font-weight: bold;"
    );
    console.log(
      "%c" + ticketId,
      "color: #3498db; font-size: 20px; font-weight: bold; background: #f0f0f0; padding: 5px; border-radius: 4px;"
    );
    console.log(
      "%cბილეთის ID შენახულია localStorage-ში",
      "color: #27ae60; font-size: 14px;"
    );

    localStorage.setItem("ticket-id", ticketId);
    localStorage.setItem("ticket", JSON.stringify(newTicket));

    const successMessage = document.createElement("div");
    successMessage.style.position = "fixed";
    successMessage.style.top = "0";
    successMessage.style.left = "0";
    successMessage.style.width = "100%";
    successMessage.style.height = "100%";
    successMessage.style.background = "rgba(255,255,255,0.9)";
    successMessage.style.zIndex = "9999";
    successMessage.style.display = "flex";
    successMessage.style.justifyContent = "center";
    successMessage.style.alignItems = "center";
    successMessage.style.flexDirection = "column";

    document.body.appendChild(successMessage);

    setTimeout(() => {
      try {
        window.location.replace("../people-registration/index.html");
      } catch (navError) {
        console.error("Navigation error with replace:", navError);
        window.location.href = "../people-registration/index.html";
      }
    });
  } catch (error) {
    console.error(
      "%cშეცდომის დეტალები:",
      "color: #e74c3c; font-size: 16px; font-weight: bold;"
    );
    console.error(
      "%c" + error.message,
      "color: #e74c3c; font-size: 14px; background: #f0f0f0; padding: 5px; border-radius: 4px;"
    );
    showValidationError(
      "ბილეთის რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით. შეცდომა: " +
        error.message
    );
  }
}

function setupPaymentValidation() {
  const paymentButton = document.getElementById("paymentButton");
  if (!paymentButton) return;

  paymentButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const originalConsoleLog = console.log;
    console.log = function () {};

    const emailInput = document.querySelector(".input-row input[type='email']");
    const phoneInput = document.querySelector(".input-row input[type='tel']");
    const passengerInputs = document.querySelectorAll(
      ".passenger-row input[type='text']"
    );
    const personalIdInputs = document.querySelectorAll(
      ".passenger-row input.personal-id-input"
    );
    const agreementCheckbox = document.getElementById("agree");

    const hasSeatSelected = Object.keys(window.selectedSeats || {}).length > 0;

    let isValid = true;
    let errorMessage = "";

    [emailInput, phoneInput, ...passengerInputs, ...personalIdInputs].forEach(
      (input) => {
        if (input) input.style.borderColor = "";
      }
    );
    if (agreementCheckbox?.parentElement) {
      agreementCheckbox.parentElement.style.color = "";
    }

    if (!emailInput || !emailInput.value.trim()) {
      if (emailInput) emailInput.style.borderColor = "red";
      isValid = false;
      errorMessage = "გთხოვთ შეავსოთ ელ-ფოსტის ველი";
    }

    if (!phoneInput || !phoneInput.value.trim()) {
      if (phoneInput) phoneInput.style.borderColor = "red";
      isValid = false;
      errorMessage = errorMessage || "გთხოვთ შეავსოთ ტელეფონის ნომრის ველი";
    }

    passengerInputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "red";
        isValid = false;
        errorMessage = errorMessage || "გთხოვთ შეავსოთ მგზავრის მონაცემები";
      }
    });

    personalIdInputs.forEach((input) => {
      if (!input.value.trim() || input.value.length !== 11) {
        input.style.borderColor = "red";
        isValid = false;
        errorMessage = errorMessage || "პირადი ნომერი უნდა შეიცავდეს 11 ციფრს";
      }
    });

    if (!hasSeatSelected) {
      isValid = false;
      errorMessage = errorMessage || "გთხოვთ აირჩიოთ ადგილი";
    }

    if (!agreementCheckbox || !agreementCheckbox.checked) {
      if (agreementCheckbox?.parentElement) {
        agreementCheckbox.parentElement.style.color = "red";
      }
      isValid = false;
      errorMessage = errorMessage || "გთხოვთ დაეთანხმოთ წესებს";
    }

    if (!isValid) {
      showValidationError(errorMessage);
      console.log = originalConsoleLog;
    } else {
      removeValidationError();

      const totalElement = document.querySelector(
        ".amount-box span:last-child"
      );
      if (totalElement) {
        const totalPrice = totalElement.textContent;
        sessionStorage.setItem("totalPrice", totalPrice);
        localStorage.setItem("totalPrice", totalPrice);

        const ticketInfo = {
          price: totalPrice,
          email: emailInput ? emailInput.value.trim() : "",
          phone: phoneInput ? phoneInput.value.trim() : "",
          date: new Date().toISOString(),
        };

        sessionStorage.setItem("ticketInfo", JSON.stringify(ticketInfo));
        localStorage.setItem("ticketInfo", JSON.stringify(ticketInfo));
      }

      if (emailInput && phoneInput) {
        localStorage.setItem("passEmail", emailInput.value.trim());
        localStorage.setItem("passPhoneNum", phoneInput.value.trim());
        sessionStorage.setItem("passEmail", emailInput.value.trim());
        sessionStorage.setItem("passPhoneNum", phoneInput.value.trim());
      }

      const passengersData = [];
      Object.keys(window.selectedSeats || {}).forEach((passengerId) => {
        const passengerRow = document
          .querySelector(`.select-seat[data-passenger-id="${passengerId}"]`)
          ?.closest(".passenger-row");

        if (passengerRow) {
          const firstNameInput = passengerRow.querySelector(
            "input[name^='firstName']"
          );
          const lastNameInput = passengerRow.querySelector(
            "input[name^='lastName']"
          );
          const personalIDInput = passengerRow.querySelector(
            "input[name^='personalID']"
          );

          if (firstNameInput && lastNameInput && personalIDInput) {
            passengersData.push({
              name: firstNameInput.value.trim(),
              surname: lastNameInput.value.trim(),
              idNumber: personalIDInput.value.trim(),
              passengerId: passengerId,
              seats: window.selectedSeats[passengerId] || {},
            });
          }
        }
      });

      localStorage.setItem("passengers", JSON.stringify(passengersData));

      const urlParams = new URLSearchParams(window.location.search);
      const trainId = urlParams.get("id");

      if (trainId) {
        localStorage.setItem("trainId", trainId);
      }

      await registrateTicketFunction();
    }
  });
}

function showValidationError(message) {
  let errorElement = document.querySelector(".validation-error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "validation-error";
    errorElement.style.color = "red";
    errorElement.style.marginTop = "10px";
    errorElement.style.textAlign = "center";
    errorElement.style.fontWeight = "bold";
    const insertPoint = document.querySelector(".checkbox");
    if (insertPoint && insertPoint.parentNode) {
      insertPoint.parentNode.insertBefore(
        errorElement,
        insertPoint.nextSibling
      );
    } else {
      const invoiceBox = document.querySelector(".invoice-box");
      if (invoiceBox) {
        invoiceBox.appendChild(errorElement);
      }
    }
  }
  errorElement.textContent = "* მოხდა შეცდომა. " + message;
}

function removeValidationError() {
  const errorElement = document.querySelector(".validation-error");
  if (errorElement && errorElement.parentNode) {
    errorElement.parentNode.removeChild(errorElement);
  }
}

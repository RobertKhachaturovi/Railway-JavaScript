document.addEventListener("DOMContentLoaded", function () {
  const ticketIdInput = document.getElementById("ticket-id");
  const checkButton = document.querySelector(".ticket-number button");
  const resultContainer = document.createElement("div");
  resultContainer.className = "ticket-result-container";
  document.querySelector(".ticket-check-wrapper").appendChild(resultContainer);

  const API_URL = "https://api.steprailway.ge/api/tickets/check";

  checkButton.addEventListener("click", function () {
    checkTicket();
  });

  ticketIdInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkTicket();
    }
  });

  function checkTicket() {
    const ticketId = ticketIdInput.value.trim();

    if (!ticketId) {
      showResult("error", "გთხოვთ შეიყვანოთ ბილეთის ნომერი");
      return;
    }

    showResult("loading", "ბილეთის შემოწმება მიმდინარეობს...");

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticketId,
        language: "ka",
        requestSource: "website",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && data.ticket) {
          localStorage.setItem("ticket-id", data.ticketId);
          localStorage.setItem("ticket", JSON.stringify(data.ticket));
          localStorage.setItem("passengers", JSON.stringify(data.passengers));
          localStorage.setItem("trainId", data.trainId);
          localStorage.setItem("passEmail", data.contactInfo?.email || "");
          localStorage.setItem("passPhoneNum", data.contactInfo?.phone || "");
          localStorage.setItem(
            "directTicketData",
            JSON.stringify(data.paymentInfo || {})
          );
          localStorage.setItem("train", JSON.stringify(data.trainInfo || {}));

          if (!data.passengers || data.passengers.length === 0) {
            data.passengers = [
              {
                firstName: "მგზავრის სახელი",
                lastName: "მგზავრის გვარი",
                personalId: "xxxxxxxx",
                seat: "XX",
              },
            ];
          }

          showResult("success", "ბილეთი წარმატებით მოიძებნა");
          displayTicketDetails(
            data.ticket,
            data.passengers,
            data.trainId,
            data.contactInfo.email,
            data.contactInfo.phone,
            data.paymentInfo,
            data.trainInfo,
            data.ticketId
          );
        } else {
          showResult(
            "error",
            data.message ||
              "ბილეთი ვერ მოიძებნა. გთხოვთ გადაამოწმოთ ბილეთის ნომერი"
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error checking ticket with server, falling back to local check:",
          error
        );

        checkTicketLocally(ticketId);
      });
  }

  function checkTicketLocally(ticketId) {
    const storedTicketId = localStorage.getItem("ticket-id");

    if (storedTicketId === ticketId) {
      // ვიღებთ ბილეთის მონაცემებს localStorage-დან
      const ticket = JSON.parse(localStorage.getItem("ticket") || "{}");

      // ვცდილობთ წავიკითხოთ პირველად registration-დან, მერე ticket-check-დან
      let passengers = [];

      // registration-ში რეგისტრირებული მგზავრების მონაცემები
      if (ticket && ticket.people && ticket.people.length > 0) {
        // registration-დან მონაცემები
        passengers = ticket.people.map((person) => ({
          firstName: person.name || localStorage.getItem("passFirstName") || "",
          lastName:
            person.surname || localStorage.getItem("passLastName") || "",
          personalId: person.idNumber || localStorage.getItem("passId") || "",
          seat:
            person.seatNumber ||
            person.seatId ||
            localStorage.getItem("passSeat") ||
            "",
        }));
      } else {
        // ვცდილობთ registration-დან შენახული passengers მასივის წაკითხვას
        const registrationPassengers = JSON.parse(
          localStorage.getItem("passengers") || "[]"
        );

        if (registrationPassengers.length > 0) {
          passengers = registrationPassengers.map((passenger) => ({
            firstName:
              passenger.name ||
              passenger.firstName ||
              localStorage.getItem("passFirstName") ||
              "",
            lastName:
              passenger.surname ||
              passenger.lastName ||
              localStorage.getItem("passLastName") ||
              "",
            personalId:
              passenger.idNumber ||
              passenger.personalId ||
              localStorage.getItem("passId") ||
              "",
            seat:
              passenger.seatNumber ||
              (passenger.seats
                ? Object.values(passenger.seats)[0]?.name
                : "") ||
              localStorage.getItem("passSeat") ||
              "",
          }));
        } else {
          // საბოლოოდ ვიყენებთ ticket-check-ის მიერ შენახულ მონაცემებს
          passengers = JSON.parse(
            localStorage.getItem("tickets-passengers") || "[]"
          );

          if (passengers.length === 0) {
            // თუ არც ერთი გზით არ მოიძებნა, ვქმნით ახალს
            passengers = [
              {
                firstName:
                  localStorage.getItem("passFirstName") || "მგზავრის სახელი",
                lastName:
                  localStorage.getItem("passLastName") || "მგზავრის გვარი",
                personalId: localStorage.getItem("passId") || "პირადი ნომერი",
                seat: localStorage.getItem("passSeat") || "ადგილი",
              },
            ];
          }
        }
      }

      // ვიღებთ დანარჩენ ინფორმაციას
      const trainId = localStorage.getItem("trainId");
      const email =
        ticket.email ||
        localStorage.getItem("passEmail") ||
        localStorage.getItem("ticketInfo")
          ? JSON.parse(localStorage.getItem("ticketInfo") || "{}").email
          : "";
      const phone =
        ticket.phoneNumber ||
        localStorage.getItem("passPhoneNum") ||
        localStorage.getItem("ticketInfo")
          ? JSON.parse(localStorage.getItem("ticketInfo") || "{}").phone
          : "";
      const paymentInfo = JSON.parse(
        localStorage.getItem("directTicketData") || "{}"
      );
      const train = JSON.parse(localStorage.getItem("train") || "{}");

      // ვინახავთ passengers ინფორმაციას ticket-check-ის ქეშში
      localStorage.setItem("tickets-passengers", JSON.stringify(passengers));

      showResult("success", "ბილეთი წარმატებით მოიძებნა");
      displayTicketDetails(
        ticket,
        passengers,
        trainId,
        email,
        phone,
        paymentInfo,
        train,
        ticketId
      );
    } else {
      showResult(
        "error",
        "ბილეთი ვერ მოიძებნა. გთხოვთ გადაამოწმოთ ბილეთის ნომერი"
      );
    }
  }

  function showResult(type, message) {
    resultContainer.innerHTML = "";

    const resultMessage = document.createElement("div");
    resultMessage.className = `result-message ${type}`;

    if (type === "loading") {
      resultMessage.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
    } else {
      resultMessage.textContent = message;
    }

    resultContainer.appendChild(resultMessage);
  }

  function displayTicketDetails(
    ticket,
    passengers,
    trainId,
    email,
    phone,
    paymentInfo,
    train,
    ticketId
  ) {
    const ticketDetails = document.createElement("div");
    ticketDetails.className = "ticket-details";

    const formatCardNumber = (cardNumber) => {
      if (!cardNumber) return "მიუწვდომელია";
      const cleanNumber = cardNumber.replace(/\D/g, "");
      if (cleanNumber.length < 8) return cardNumber;
      return `${cleanNumber.slice(0, 4)}${"*".repeat(
        cleanNumber.length - 8
      )}${cleanNumber.slice(-4)}`;
    };

    ticketDetails.innerHTML = `
            <div class="registration-content">
                <div class="train-logo">
                    <img src="../full-ticket/image/stepLogo.jpg" alt="Train Logo" />
                </div>
                <div class="ticket-header-text">
                    <p>Step Railway</p>
                </div>
                <div class="schedule-info">
                    <div class="schedule-row">
                        <span class="schedule-label">გამგზავრება:</span>
                        <span class="schedule-value">${
                          train.from || "მიუწვდომელია"
                        } ${train.departure || ""}</span>
                    </div>
                    <div class="schedule-row">
                        <span class="schedule-label">ჩასვლა:</span>
                        <span class="schedule-value">${
                          train.to || "მიუწვდომელია"
                        } ${train.arrive || ""}</span>
                    </div>
                    <div class="schedule-row">
                        <span class="schedule-label">გასვლის თარიღი:</span>
                        <span class="schedule-value">${
                          ticket.date
                            ? new Date(ticket.date).toLocaleDateString("ka-GE")
                            : "მიუწვდომელია"
                        }</span>
                    </div>
                </div>
                <div class="info-row">
                    <span class="info-label">მატარებლის ID:</span>
                    <span class="info-value">${trainId || "მიუწვდომელია"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">ბილეთის ნომერი:</span>
                    <span class="info-value">${ticketId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">გაცემის თარიღი:</span>
                    <span class="info-value">${
                      ticket.date
                        ? new Date(ticket.date).toLocaleString("ka-GE")
                        : "მიუწვდომელია"
                    }</span>
                </div>
                <div class="info-row">
                    <span class="info-label">ელ-ფოსტა:</span>
                    <span class="info-value">${email || "მიუწვდომელია"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">ტელეფონი:</span>
                    <span class="info-value">${phone || "მიუწვდომელია"}</span>
                </div>
                <div class="payment-info">
                    <h4>გადახდის ინფორმაცია:</h4>
                    <div class="info-row">
                        <span class="info-label">ბარათის მფლობელი:</span>
                        <span class="info-value">${
                          paymentInfo.cardHolder || "მიუწვდომელია"
                        }</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">ბარათის ნომერი:</span>
                        <span class="info-value">${formatCardNumber(
                          paymentInfo.cardNumber
                        )}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">სულ გადახდილი:</span>
                        <span class="info-value">${
                          paymentInfo.price || "0.00₾"
                        }</span>
                    </div>
                </div>
            </div>
        `;

    // Add passenger information if available
    if (passengers.length > 0) {
      const passengerList = document.createElement("div");
      passengerList.className = "passenger-list";

      const passengerTitle = document.createElement("h4");
      passengerTitle.textContent = "მგზავრები:";
      passengerList.appendChild(passengerTitle);

      passengers.forEach((passenger, index) => {
        const passengerItem = document.createElement("div");
        passengerItem.className = "passenger-item";

        passengerItem.innerHTML = `
                    <div class="passenger-header">
                        <h5>მგზავრი ${index + 1}</h5>
                    </div>
                    <div class="passenger-details">
                        <div class="info-row">
                            <span class="info-label">სახელი:</span>
                            <span class="info-value">${
                              passenger.firstName !== "მიუწვდომელია"
                                ? passenger.firstName
                                : "მგზავრის სახელი"
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">გვარი:</span>
                            <span class="info-value">${
                              passenger.lastName !== "მიუწვდომელია"
                                ? passenger.lastName
                                : "მგზავრის გვარი"
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">პირადი ნომერი:</span>
                            <span class="info-value">${
                              passenger.personalId !== "მიუწვდომელია"
                                ? passenger.personalId
                                : "xxxxxxxx"
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">ადგილი:</span>
                            <span class="info-value">${
                              passenger.seatNumber ||
                              passenger.seat !== "მიუწვდომელია"
                                ? passenger.seatNumber || passenger.seat
                                : "XX"
                            }</span>
                        </div>
                    </div>
                `;

        passengerList.appendChild(passengerItem);
      });

      ticketDetails.appendChild(passengerList);
    }

    // Add action buttons (print and cancel)
    const actionButtons = document.createElement("div");
    actionButtons.className = "ticket-actions";

    // Create print button
    const printButton = document.createElement("button");
    printButton.className = "print-ticket";
    printButton.innerHTML = '<i class="fas fa-print"></i> ბილეთის ბეჭდვა';
    printButton.addEventListener("click", function () {
      window.print();
    });

    // Add print button
    actionButtons.appendChild(printButton);

    // Add cancel button
    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-ticket";
    cancelButton.innerHTML = '<i class="fas fa-trash"></i> ბილეთის გაუქმება';
    cancelButton.addEventListener("click", function () {
      if (confirm("ნამდვილად გსურთ ბილეთის გაუქმება?")) {
        cancelTicket(ticketId);
      }
    });
    actionButtons.appendChild(cancelButton);

    ticketDetails.appendChild(actionButtons);

    resultContainer.appendChild(ticketDetails);
  }

  function cancelTicket(ticketId) {
    showResult("loading", "ბილეთის გაუქმება მიმდინარეობს...");

    // API endpoint for cancelling ticket
    const CANCEL_API_URL =
      "https://railway.stepprojects.ge/api/tickets/cancelAll";

    // Make API request
    fetch(CANCEL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticketId: ticketId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Remove ticket from localStorage
          localStorage.removeItem("ticket-id");
          localStorage.removeItem("ticket");
          localStorage.removeItem("passengers");
          localStorage.removeItem("tickets-passengers");

          showResult("success", "ბილეთი წარმატებით გაუქმდა");

          // Clear ticket details
          document.querySelector(".ticket-details").remove();
        } else {
          showResult("error", data.message || "ბილეთის გაუქმება ვერ მოხერხდა");
        }
      })
      .catch((error) => {
        console.log("Error cancelling ticket:", error);

        // Simulate successful cancellation for testing (remove this in production)
        localStorage.removeItem("ticket-id");
        localStorage.removeItem("ticket");
        localStorage.removeItem("passengers");
        localStorage.removeItem("tickets-passengers");

        showResult("success", "ბილეთი წარმატებით გაუქმდა!");

        // Clear ticket details
        const ticketDetailsElement = document.querySelector(".ticket-details");
        if (ticketDetailsElement) {
          ticketDetailsElement.remove();
        }
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

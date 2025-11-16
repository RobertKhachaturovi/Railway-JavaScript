function showPageLoader() {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    loader.classList.add("active");
  }
}

function hidePageLoader() {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    loader.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showPageLoader();
  setTimeout(hidePageLoader, 1500);
});

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (link && !link.hasAttribute("data-no-loader")) {
    e.preventDefault();
    showPageLoader();
    setTimeout(() => {
      window.location.href = link.href;
    }, 1500);
  }
});

document.addEventListener("submit", (e) => {
  if (!e.target.hasAttribute("data-no-loader")) {
    e.preventDefault();
    showPageLoader();
    setTimeout(() => {
      e.target.submit();
    }, 1500);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const messageInput = document.getElementById("message-input");
  const chatMessages = document.getElementById("chat-messages");
  const customResponseInput = document.getElementById("custom-response");
  const useCustomResponseCheckbox = document.getElementById(
    "use-custom-response"
  );

  // მზა პასუხების სია
  const defaultResponses = [
    "ბოდიში, ამ კითხვაზე პასუხი ვერ მოვძებნე. გთხოვთ სცადოთ სხვა კითხვა.",
    "სამწუხაროდ, ამ თემაზე ინფორმაცია არ მაქვს. შეგიძლიათ სხვა კითხვა დამისვათ.",
    "ამ კითხვაზე პასუხი ვერ მოვძებნე ჩემს ბაზაში. გთხოვთ გადაამოწმოთ კითხვის ფორმულირება.",
    "ამ თემაზე ინფორმაცია არ მაქვს. შეგიძლიათ სხვა კითხვა დამისვათ ან დაწეროთ თქვენი პასუხი.",
  ];

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // მომხმარებლის შეტყობინების დამატება
    addMessage("user", message);
    messageInput.value = "";

    // პასუხის გენერაცია
    setTimeout(() => {
      if (
        useCustomResponseCheckbox.checked &&
        customResponseInput.value.trim()
      ) {
        // მომხმარებლის მიერ დაწერილი პასუხის გამოყენება
        addMessage("ai", customResponseInput.value.trim());
      } else {
        // შემთხვევითი მზა პასუხის არჩევა
        const randomResponse =
          defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        addMessage("ai", randomResponse);
      }
    }, 1000);
  });

  function addMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.textContent = text;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // ავტომატური სქროლინგი ბოლო შეტყობინებამდე
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // მზა პასუხის ჩექბოქსის ცვლილების მონიტორინგი
  useCustomResponseCheckbox.addEventListener("change", function () {
    customResponseInput.disabled = !this.checked;
    if (!this.checked) {
      customResponseInput.value = "";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.querySelector(".registration-form");

  if (registrationForm) {
    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // ფორმის მონაცემების მიღება
      const formData = new FormData(this);
      const userData = {
        id: Date.now(), // უნიკალური ID-ის გენერაცია
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        registrationDate: new Date().toLocaleDateString("ka-GE"),
      };

      // მონაცემების შენახვა localStorage-ში
      let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      users.push(userData);
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      // წარმატებული რეგისტრაციის შეტყობინება
      alert("რეგისტრაცია წარმატებით დასრულდა!");

      // ფორმის გასუფთავება
      this.reset();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (isAuthenticated()) {
    window.location.href = "../main/index.html";
    return;
  }

  const registerForm = document.getElementById("register-form");
  const messageBox = document.getElementById("message-box");

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const address = document.getElementById("address").value.trim();
    const zipcode = document.getElementById("zipcode").value.trim();

    if (!firstName || !lastName) {
      showMessage("error", "გთხოვთ შეიყვანოთ სახელი და გვარი");
      return;
    }

    if (!email || !email.includes("@")) {
      showMessage("error", "გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა");
      return;
    }

    if (!password || password.length < 6) {
      showMessage("error", "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს");
      return;
    }

    // ტელეფონის ნომრის ვალიდაცია - უნდა იწყებოდეს +995-ით და შემდეგ 9 ციფრი
    if (!phone || !/^\+995[0-9]{9}$/.test(phone)) {
      showMessage(
        "error",
        "ტელეფონის ნომერი უნდა იწყებოდეს +995-ით და შემდეგ 9 ციფრი"
      );
      return;
    }

    if (!age || age < 18 || age > 120) {
      showMessage("error", "ასაკი უნდა იყოს 18-დან 120-მდე");
      return;
    }

    if (!gender) {
      showMessage("error", "გთხოვთ აირჩიოთ სქესი");
      return;
    }

    if (!address) {
      showMessage("error", "გთხოვთ შეიყვანოთ მისამართი");
      return;
    }

    if (!zipcode || !/^[0-9]{4}$/.test(zipcode)) {
      showMessage("error", "გთხოვთ შეიყვანოთ სწორი საფოსტო კოდი");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      age,
      gender,
      address,
      zipcode,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName}`,
      requireEmailVerification: false,
    };

    showMessage("info", "მიმდინარეობს რეგისტრაცია...");

    try {
      // რეგისტრაცია
      const registerResponse = await fetch(
        "https://api.everrest.educata.dev/auth/sign_up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const registerData = await registerResponse.json();

      if (registerResponse.ok && registerData._id) {
        const userProfileData = {
          firstName,
          lastName,
          email,
          phone,
          age,
          gender,
          address,
          zipcode,
          avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName}`,
        };

        console.log("Storing user profile data:", userProfileData);
        localStorage.setItem(
          "userProfileData",
          JSON.stringify(userProfileData)
        );

        // შევინახოთ ემაილი და პაროლი
        localStorage.setItem("tempEmail", email);
        localStorage.setItem("tempPassword", password);

        showMessage(
          "success",
          "რეგისტრაცია წარმატებულია! გადახვევა შესვლის გვერდზე..."
        );

        // გადავიდეთ შესვლის გვერდზე
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 1500);
      } else {
        let errorMessage = "რეგისტრაცია ვერ მოხერხდა. ";

        if (registerData.message) {
          errorMessage += registerData.message;
        } else if (registerData.error) {
          if (typeof registerData.error === "string") {
            errorMessage += registerData.error;
          } else if (registerData.error.message) {
            errorMessage += registerData.error.message;
          } else {
            errorMessage += JSON.stringify(registerData.error);
          }
        } else {
          errorMessage += "შეამოწმეთ მონაცემები და სცადეთ თავიდან.";
        }

        showMessage("error", errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showMessage(
        "error",
        "სერვერთან დაკავშირების პრობლემა. გთხოვთ სცადოთ მოგვიანებით."
      );
    }
  });

  function showMessage(type, text) {
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = text;
    messageBox.style.display = "block";
  }
});

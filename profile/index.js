document.addEventListener("DOMContentLoaded", async function () {
  if (!isAuthenticated()) {
    window.location.href = "../auth/login.html";
    return;
  }

  try {
    const userData = await getCurrentUser();
    if (!userData) {
      console.error("Failed to load user data");
      return;
    }

    displayUserProfile(userData);
    setupAvatarSelection(userData);
    setupLogout();
  } catch (error) {
    console.error("Error loading profile:", error);
    window.location.href = "../auth/login.html";
  }
});

function displayUserProfile(userData) {
  document.getElementById("firstName").textContent =
    userData.firstName || "არ არის მითითებული";
  document.getElementById("lastName").textContent =
    userData.lastName || "არ არის მითითებული";
  document.getElementById("age").textContent =
    userData.age || "არ არის მითითებული";

  const genderDisplay = {
    MALE: "მამრობითი",
    FEMALE: "მდედრობითი",
    OTHER: "სხვა",
  };

  const genderElement = document.getElementById("gender");
  const genderValue =
    (userData.gender && genderDisplay[userData.gender]) || "არ არის მითითებული";
  genderElement.textContent = genderValue;

  if (userData.gender) {
    const genderClass = userData.gender.toLowerCase();
    genderElement.classList.add("gender-indicator", genderClass);
  }

  document.getElementById("email").textContent =
    userData.email || "არ არის მითითებული";
  document.getElementById("phone").textContent =
    userData.phone || "არ არის მითითებული";
  document.getElementById("address").textContent =
    userData.address || "არ არის მითითებული";
  document.getElementById("zipcode").textContent =
    userData.zipcode || "არ არის მითითებული";

  const avatarImg = document.getElementById("userAvatar");
  const savedAvatar =
    localStorage.getItem("userAvatar") ||
    userData.avatar ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${
      userData.firstName || "user"
    }`;
  avatarImg.src = savedAvatar;
}

function setupAvatarSelection(userData) {
  const avatarOptions = document.querySelectorAll(".photo-option");
  const currentAvatar = document.getElementById("userAvatar");

  const savedAvatar = localStorage.getItem("userAvatar");

  if (savedAvatar) {
    avatarOptions.forEach((option) => {
      if (option.querySelector("img").src === savedAvatar) {
        option.classList.add("selected");
      }
    });
  }

  avatarOptions.forEach((option) => {
    option.addEventListener("click", async function () {
      avatarOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      const newAvatarSrc = this.querySelector("img").src;
      currentAvatar.src = newAvatarSrc;
      localStorage.setItem("userAvatar", newAvatarSrc);

      if (userData && userData.id) {
        await updateUserAvatar(userData.id, newAvatarSrc);
      }
    });
  });
}

async function updateUserAvatar(userId, avatarUrl) {
  try {
    const updateData = {
      avatar: avatarUrl,
    };

    const result = await updateUserData(userId, updateData);
    if (result) {
      console.log("Avatar updated successfully on server");
    } else {
      console.error("Failed to update avatar on server");
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
  }
}

function setupLogout() {
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userAvatar");
    window.location.href = "../auth/login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentAvatar = document.getElementById("userAvatar");
  const avatarImages = document.querySelectorAll(".avatar-options img");

  const savedAvatar = localStorage.getItem("userAvatar");
  if (savedAvatar) {
    currentAvatar.src = savedAvatar;
    avatarImages.forEach((img) => {
      if (img.src === savedAvatar) {
        img.classList.add("selected");
      }
    });
  } else {
    const firstAvatar = avatarImages[0];
    currentAvatar.src = firstAvatar.src;
    firstAvatar.classList.add("selected");
    localStorage.setItem("userAvatar", firstAvatar.src);
  }

  avatarImages.forEach((img) => {
    img.addEventListener("click", () => {
      avatarImages.forEach((i) => i.classList.remove("selected"));

      img.classList.add("selected");
      const newSrc = img.src;

      currentAvatar.src = newSrc;

      localStorage.setItem("userAvatar", newSrc);
    });
  });
});

const showAvatarsBtn = document.getElementById("show-avatars-btn");
const avatarContainer = document.getElementById("avatar-container");

showAvatarsBtn.addEventListener("click", () => {
  avatarContainer.classList.toggle("hidden");
  showAvatarsBtn.textContent = avatarContainer.classList.contains("hidden")
    ? "აირჩიე ავატარი"
    : "დამალე ავატარები";
});

document.addEventListener("DOMContentLoaded", function () {
  const userProfileData = JSON.parse(localStorage.getItem("userProfileData"));
  console.log("Loaded user profile data:", userProfileData);

  if (userProfileData) {
    document.getElementById("firstName").textContent =
      userProfileData.firstName || "არ არის მითითებული";
    document.getElementById("lastName").textContent =
      userProfileData.lastName || "არ არის მითითებული";
    document.getElementById("email").textContent =
      userProfileData.email || "არ არის მითითებული";
    document.getElementById("phone").textContent =
      userProfileData.phone || "არ არის მითითებული";
    document.getElementById("age").textContent =
      userProfileData.age || "არ არის მითითებული";

    const genderText =
      userProfileData.gender === "MALE"
        ? "მამრობითი"
        : userProfileData.gender === "FEMALE"
        ? "მდედრობითი"
        : "სხვა";
    document.getElementById("gender").textContent = genderText;

    document.getElementById("address").textContent =
      userProfileData.address || "არ არის მითითებული";
    document.getElementById("zipcode").textContent =
      userProfileData.zipcode || "არ არის მითითებული";

    const currentAvatar = document.getElementById("current-avatar");
    if (currentAvatar) {
      currentAvatar.src = userProfileData.avatar;
    }
  } else {
    console.log("No user profile data found in localStorage");
    window.location.href = "../auth/register.html";
  }
});

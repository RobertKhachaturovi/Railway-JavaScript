const AUTH_API_URL = "https://api.everrest.educata.dev/auth";

function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

async function signIn(email, password) {
  try {
    const response = await fetch(`${AUTH_API_URL}/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      return { success: true };
    }

    return { success: false, message: "Authentication failed" };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, message: "Error during authentication" };
  }
}

async function signUp(userData) {
  try {
    const response = await fetch(`${AUTH_API_URL}/sign_up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return { success: !!data._id, data };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, message: "Error during registration" };
  }
}

async function getCurrentUser() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    // დავამატოთ დებაგის ინფორმაცია
    console.log(
      "ვაგზავნით მოთხოვნას მომხმარებლის მონაცემებისთვის ტოკენით:",
      token.substring(0, 10) + "..."
    );

    const response = await fetch(`${AUTH_API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("API პასუხის სტატუსი:", response.status);

    if (response.ok) {
      const userData = await response.json();
      console.log("მიღებული მომხმარებლის მონაცემები:", userData);
      return userData;
    }

    if (response.status === 401) {
      console.error("ავტორიზაციის შეცდომა: 401 Unauthorized");
      logout();
      return null;
    }

    console.error("API შეცდომა:", response.status);
    return null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
}

async function fetchWithAuth(url, options = {}) {
  try {
    let token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Not authenticated");
    }

    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    let response = await fetch(url, authOptions);

    if (response.status === 401) {
      logout();
      throw new Error("Authentication expired");
    }

    return response;
  } catch (error) {
    console.error("Fetch with auth error:", error);
    throw error;
  }
}

function saveCurrentPage() {
  localStorage.setItem("redirect_after_auth", window.location.href);
}

function getRedirectUrl() {
  const url = localStorage.getItem("redirect_after_auth");
  localStorage.removeItem("redirect_after_auth");
  return url || "../main/index.html";
}

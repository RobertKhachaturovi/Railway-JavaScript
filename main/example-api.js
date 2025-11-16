async function getUserProfile() {
  try {
    const response = await fetchWithAuth(
      "https://api.everrest.educata.dev/auth"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return null;
  }
}

async function createUserResource(data) {
  try {
    const response = await fetchWithAuth(
      "https://api.everrest.educata.dev/some-protected-endpoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create resource: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating resource:", error);
    return null;
  }
}

async function updateUserData(userId, data) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `https://api.everrest.educata.dev/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    console.error("Update failed:", await response.text());
    return null;
  }

  return await response.json();
}

async function deleteResource(resourceId) {
  try {
    const response = await fetchWithAuth(
      `https://api.everrest.educata.dev/resources/${resourceId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete resource: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting resource:", error);
    return false;
  }
}

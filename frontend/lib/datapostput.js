  "use server";

  import { fetchWithAuth } from "./session";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  export async function createUser({ username, password, role }) { 
    try {
      console.log(username,password,role)
      const response = await fetchWithAuth(`${API_URL}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error Creating User:", responseData);
        throw new Error(responseData.role || responseData.detail || "Failed to create a new user.");
      }

      return responseData;
    } catch (error) {
      console.error("Database Error:", error);
      return { error: error.message || "Failed to create a new user." };
    }
  }

  export async function updateUser(pk, data) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/users/edit/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Update Error:", error);
      throw new Error("Failed to update user information.");
    }
  }

  export async function putNewUser(data) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/users/edit`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch users data.");
    }
  }

  export async function postNewEntry(formData) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/post_new_entry`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to post new entry data.");
    }
  }

  export async function changeUserPassword(oldPassword, newPassword) {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/users/change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password.");
      }

      return await response.json();
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error("Password change request failed. ");
    }
  }
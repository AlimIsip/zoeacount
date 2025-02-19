"use server";

import { fetchWithAuth } from "./session";

export async function postNewUser(data) { 
  try {
    const response = await fetchWithAuth("http://127.0.0.1:8000/api/users/create", {
      method: "POST",
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
    console.error("Database Error:", error);
    throw new Error("Failed to create a new user.");
  }
}


export async function updateUser(pk, data) {
  try {
    const response = await fetchWithAuth(`http://127.0.0.1:8000/api/users/edit/${pk}/`, {
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
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await fetchWithAuth("http://127.0.0.1:8000/api/users/edit", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const usersData = await response.json();
    return usersData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users data.");
  }
}

export async function postNewEntry(formData) {
  try {
    const response = await fetchWithAuth("http://127.0.0.1:8000/api/post_new_entry", {
      method: "POST",
      body: formData, // Send FormData directly
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
    const response = await fetchWithAuth("http://127.0.0.1:8000/api/users/change_password", {
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


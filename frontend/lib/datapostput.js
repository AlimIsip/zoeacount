"use server";

import { fetchWithAuth } from "./session";

export async function postNewUser(data) {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await fetchWithAuth("http://127.0.0.1:8000/api/users/create", {
      method: "POST",
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


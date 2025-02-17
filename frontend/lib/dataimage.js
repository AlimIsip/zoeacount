"use server";
import { fetchWithAuth } from "./session";

export async function handleUpload(image) {
  console.log("handleUploaded:", image);
  if (!image) return false;

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetchWithAuth(
      "http://127.0.0.1:8000/api/upload_raw_img",
      {
        method: "POST",
        body: formData,
      }
    );

    console.log(response);

    if (!response.ok) {
      console.error("Upload failed:", response.status);
      return false;
    }
    const data = await response.json();
    console.log(data.status);
    console.log(data.filename, "Upload successful:", data.message);

    return true;
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
}

export async function handleInference(filename) {
  try {
    console.log("handleInference:", filename);

    // Step 1: Send filename for inference
    const response = await fetchWithAuth(
      "http://127.0.0.1:8000/api/img_inference",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Inference Error Response:", errorData);
      return { error: errorData.error || "Failed to fetch inference" };
    }

    const data = await response.json();
    console.log("Count Data:", data.count_data);

    // Step 2: Fetch processed image separately
    const imageResponse = await fetchWithAuth(
      "http://127.0.0.1:8000/api/get_processed_image",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const now = new Date();
    // Format the date to 'YYYY-MM-DD'
    const captureDate = now.toLocaleDateString("en-CA"); // 'en-CA' locale gives YYYY-MM-DD format

    // Format the time to 'HH:mm:ss'
    const captureTime = now.toLocaleTimeString("en-GB", { hour12: false }); // 'en-GB' locale and hour12: false for 24-hour time format
    console.log(captureDate, captureTime);
    //captureDate: '2025-02-17', captureTime: '17:45:16'
    if (!imageResponse.ok) {
      return {
        countData: data.count_data,
        error: "Failed to fetch processed image",
        captureDate,
        captureTime,
      };
    }

    const imageData = await imageResponse.json();
    console.log("Fetched Image URL:", imageData.imageUrl);

    return {
      countData: data.count_data,
      imageUrl: imageData.imageUrl,
      batchData: imageData.latestBatch,
      captureDate: captureDate,
      captureTime: captureTime,
    };
  } catch (error) {
    console.error("Error fetching inference:", error);
    return {
      error: "Unexpected error occurred. Please try again.",
      captureDate,
      captureTime,
    };
  }
}

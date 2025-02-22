"use server";
import { fetchWithAuth } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function handleUpload(image) {
  console.log("handleUpload:", image);
  if (!image) return false;

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetchWithAuth(
      `${API_URL}/api/upload_raw_img`,
      { 
        method: "POST",
        body: formData,
      }
    );

    console.log("Upload:",response)

    if (!response.ok) {
      console.error("Upload failed:", response.status);
      return false;
    }

    const data = await response.json();
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

    const response = await fetchWithAuth(`${API_URL}/api/img_inference`, {
      method: "POST",
      body: JSON.stringify({ filename }),
      credentials: "include",
    });

    if (!response.ok) {
      return { error: "Failed to start inference", logs: [] };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let logs = [];
    let jsonResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      console.log("Inference Log:", chunk);

      logs.push(chunk); // ✅ Collect logs

      // ✅ Check if the chunk contains JSON-like structure
      const jsonMatch = chunk.match(/\{.*\}/s); // Match JSON inside logs
      if (jsonMatch) {
        jsonResponse = jsonMatch[0]; // Extract JSON part
      }
    }

    if (!jsonResponse) {
      return { error: "Inference completed but no response received.", logs };
    }

    try {
      const result = JSON.parse(jsonResponse);

      return {
        logs, // ✅ Send logs back to client
        processedImageUrl: result.processed_image_url,
        countData: result.count_data,
        error: null,
      };
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      return { error: "Error parsing inference result.", logs };
    }
  } catch (error) {
    console.error("Error during inference:", error);
    return { error: "Inference failed.", logs: [] };
  }
}

export async function fetchProcessedImage(filename) {
  try {
    const imageResponse = await fetchWithAuth(`${API_URL}/api/get_imagedata`, {
      method: "POST",
      body: JSON.stringify({ filename }),
      credentials: "include"
    });

    if (!imageResponse.ok) {
      throw new Error("Failed to fetch processed image");
    }

    const imageData = await imageResponse.json();
    console.log("Fetched Image URL:", imageData.imageUrl);

    const now = new Date();
    const captureDate = now.toLocaleDateString("en-CA");
    const captureTime = now.toLocaleTimeString("en-GB", { hour12: false });

    return {
      countData: imageData.countData,
      imageUrl: imageData.imageUrl,
      batchData: imageData.latestBatch,
      captureDate,
      captureTime,
    };
  } catch (error) {
    console.error("Error fetching processed image:", error);
    return { error: "Failed to fetch processed image." };
  }
}

export async function fetchCaptureImage() {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/capture`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed response. Failed to capture image.");
    }

    const data = await response.json(); // Parse JSON response
    return data;
  } catch (error) {
    console.error("Capture Image Error:", error);
    throw new Error(error.message || "Failed to capture image.");
  }
}
"use client";

import React, { useState } from "react";

export default function UploadImagePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const fileInput = event.target;
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      setImage(file);
      setPreview(URL.createObjectURL(file));

      fileInput.value = "";
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Upload successful: " + data.message);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="grid-cols-2 grid h-64">
        <div className="flex bg-slate-500 border-3 items-center place-content-center">
          <div className="bg-blue-500 border-3">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex bg-slate-500 border-3 items-center place-content-center">
        <input type="file" accept="image/*" onChange={handleImageChange} />
          <div className="bg-blue-500 border-3 align-middle">
            <button
              onClick={handleUpload}
              disabled={!image || uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

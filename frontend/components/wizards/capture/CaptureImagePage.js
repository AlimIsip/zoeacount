"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@heroui/react";
import CaptureIcon from "@/components/icons/CaptureIcon";
import UploadIcon from "@/components/icons/UploadIcon";

export default function CaptureImagePage({setCurrentPage}) {
  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: "user",
  };

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(async () => {
    let imageSrc = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    // // Convert the base64 string to a Blob in JPEG format
    // const base64Data = imageSrc.split(",")[1]; // Remove the data URL prefix
    // const byteCharacters = atob(base64Data); // Decode base64 to binary
    // const byteNumbers = new Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: "image/jpeg" });

    // const formData = new FormData();
    // formData.append("img_blob", blob, "larvae_image.jpg"); // Send binary data directly

    // await fetch("http://127.0.0.1:8000/api/detect_larva", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error(`HTTP error! status: ${res.status}`);
    //     }
    //     return res.blob(); // Parse the blob response here
    //   })
    //   .then((blob) => {
    //     const imageUrl = URL.createObjectURL(blob);
    //     imageSrc = imageUrl;

    //     console.log("successful");
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
    setImgSrc(imageSrc);
  }, [setImgSrc]);

  return (
    <div className="flex flex-col">
      <h1 className="flex flex-grow text-3xl font-bold">
        Select capture method
      </h1>
      <div className="flex flex-wrap">
        <div className="flex flex-grow m-3 bg-slate-500 border-3 items-center place-content-center">
          <div className="flex h-96 bg-blue-500 border-3">
            {console.log("image is", imgSrc)}
            {imgSrc ? (
              <img src={imgSrc} alt="Screenshot" />
            ) : (
              <Webcam
                className="shrink"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                screenshotQuality={1}
              />
            )}
          </div>
        </div>

        <div className="flex flex-grow m-3 bg-slate-500 border-3 items-center place-content-center">
          {imgSrc ? (
            <div>
              <Button
                onPress={() => {
                  setCurrentPage(3);
                }}
              >
                Submit
              </Button>
              <Button
                onPress={() => {
                  setImgSrc(null)
                }}
              >
                Recapture
              </Button>
            </div>
          ) : (
            <Button
              onPress={() => {
                capture();
              }}
            >
              Capture photo
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}

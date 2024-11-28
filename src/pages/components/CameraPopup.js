import React, {useState, useRef, useCallback} from "react";
import Webcam from "react-webcam";

export default function CameraPopup({onClose}) {
    const videoConstraints = {
        width: 1920,
        height: 1080,
        facingMode: "user"
    };

    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);

    const capture = useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot({width: 1920, height: 1080});

            // Convert the base64 string to a Blob in JPEG format
            const base64Data = imageSrc.split(',')[1];  // Remove the data URL prefix
            const byteCharacters = atob(base64Data);  // Decode base64 to binary
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append("id", 10);
            formData.append("img_blob", blob, "screenshot.jpg"); // Send binary data directly
            formData.append("count_data", 1);
            formData.append("mortality_rate", 1);
            formData.append("cumulative_mortality_rate", 1);


            await fetch('http://127.0.0.1:8000/api/table/create', {
                method: 'POST',
                body: formData,
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json(); // Parse the JSON response here
            })
                .then(data => {
                    console.log('Response data:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            setImgSrc(imageSrc);
        },
        [webcamRef, setImgSrc]);

    return (
        <div className="bg-amber-100 p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1980}
                height={1080}
                videoConstraints={videoConstraints}
                screenshotQuality={1}

            />
            <button onClick={capture}>Capture photo</button>
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={"captured image"}
                />
            )}
            <button onClick={onClose}> Close</button>
        </div>

    );
}
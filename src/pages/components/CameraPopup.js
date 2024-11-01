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
            const blob = await fetch(imageSrc).then((res) => res.blob());

            const formData = new FormData();
            formData.append('file', blob, 'my-file.jpg');

            await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
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
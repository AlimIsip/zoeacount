import {useState, useRef, useCallback, Suspense} from "react";
import Webcam from "react-webcam";
import Header from "@/pages/components/Header";
import Body from "@/pages/components/Body";

export default function capture() {
    const videoConstraints = {
        width: 1920,
        height: 1080,
        facingMode: "user"
    };

    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [compSrc, setCompSrc] = useState(null);
    const [state, setState] = useState("capture");

    const capture = useCallback(
        async () => {
            let imageSrc = webcamRef.current.getScreenshot({width: 1920, height: 1080});
            let compareSrc;
            // Convert the base64 string to a Blob in JPEG format
            const base64Data = imageSrc.split(',')[1];  // Remove the data URL prefix
            const byteCharacters = atob(base64Data);  // Decode base64 to binary
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            //
            const formData = new FormData();
            // formData.append("id", 10);
            formData.append("img_blob", blob, "larvae_image.jpg"); // Send binary data directly
            // formData.append("count_data", 1);
            // formData.append("mortality_rate", 1);
            // formData.append("cumulative_mortality_rate", 1);


            await fetch('http://127.0.0.1:8000/api/detect_larva', {
                method: 'POST',
                body: formData,
            }).then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.blob(); // Parse the blob response here
            })
                .then(blob => {
                    const imageUrl = URL.createObjectURL(blob);
                    imageSrc = imageUrl;
                    compareSrc = imageUrl;
                    console.log("successful");
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            setCompSrc(compareSrc);
            setImgSrc(imageSrc);
        },
        [setImgSrc, setCompSrc]);

    return (
        <>
        <Header/>
            <Body>
                <div>
                    {state === "capture" && (
                        <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={1980}
                            height={1080}
                            videoConstraints={videoConstraints}
                            screenshotQuality={1}
                        />
                        <button onClick={()=> {setState("load"); capture()}}> Capture photo </button>
                        </>
                )
                    }
                    {state === "load" &&(
                        <>
                            <Suspense fallback={<h1>LOADING</h1>}>

                        <div className="flex">
                            <div className="flex-initial">
                                <h1> ALREADY LOADED </h1>
                                <img
                                    src={compSrc}
                                    alt={"captured image"}
                                />
                            </div>
                            <div className="flex-initial">

                            </div>
                        </div>
                    </Suspense>
                        </>
                        )
                    }
                </div>

            </Body>
        </>
    );
}

let savedPowers = null;
const fetchPowers = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            savedPowers = ['first', 'second']
            resolve();
        }, 3000)
    });
}

const RoutesPowers = () => {
    const [powers, setPowers] = useState(savedPowers);
    if (!powers) {
        throw fetchPowers();
    }

    return powers.map(value => <div key={value}>{value}</div>);
}




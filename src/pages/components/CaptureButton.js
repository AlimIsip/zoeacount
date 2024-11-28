import Image from "next/image";
import React, {useState} from "react";
import {createPortal} from "react-dom";
import CameraPopup from "@/pages/components/CameraPopup";



export default function CaptureButton(){
    const [showModal, setShowModal] = useState(false);

    return(
        <>
            <button>
                <Image
                    onClick={() => setShowModal(true)}
                    className="p-1 clipping-container"
                    src={'/camera.png'}
                    width={64}
                    height={64}
                    alt={"aa"}/>
            </button>
            {showModal && createPortal(
                <CameraPopup onClose={() => setShowModal(false)} />,
                document.body
            )}
        </>
    )
}
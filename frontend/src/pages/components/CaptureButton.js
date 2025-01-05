import Image from "next/image";
import React, {useState} from "react";
import {createPortal} from "react-dom";
import Link from "next/link";



export default function CaptureButton(){
    const [showModal, setShowModal] = useState(false);

    return(
        <>
            <button>
                <Link href={`/capture/`}>
                    <Image
                        onClick={() => setShowModal(true)}
                        className="p-1 clipping-container"
                        src={'/camera.png'}
                        width={64}
                        height={64}
                        alt={"aa"}/>

                </Link>
               </button>
        </>
    )
}
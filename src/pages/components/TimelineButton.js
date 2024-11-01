import Image from "next/image";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import TimelineTable from './timelinetable.js';



export default function TimelineButton({timelinedata}){
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        <button>
            <Image
                onClick={() => setShowModal(true)}
                className="p-1 clipping-container"
                src={'/cells.png'}
                width={64}
                height={64}
                alt={"aa"}/>
        </button>
    {showModal && createPortal(
        <TimelineTable timelinedata={timelinedata} onClose={() => setShowModal(false)} />,
        document.body
    )}
    </>



    )
}
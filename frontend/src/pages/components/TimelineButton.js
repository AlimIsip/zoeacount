import Image from "next/image";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from "next/link";



export default function TimelineButton(){
    const [showModal, setShowModal] = useState(false);

    return (
    <Link href={`/timeline/`}>
        <Image
            onClick={() => setShowModal(true)}
            className="p-1 clipping-container"
            src={'/cells.png'}
            width={64}
            height={64}
            alt={"aa"}/>
    </Link>



    )
}
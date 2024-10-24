import Image from "next/image";
import Link from "next/link";
import React from "react";




export default function Capture(){

    return(
            <Image
                className="p-1"
                src={'/camera.png'}
                width={64}
                height={64}
                alt={"aa"}/>

    )
}
'use client'
import { useEffect, useState } from "react";

export default function VideoStream (){
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 
  const [src, setSrc] = useState(`${API_URL}/api/video_feed`);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL; // Make sure to set this
    setSrc(`${API_URL}/api/video_feed`);
  }, []);

  return (
    <div>
      <img src={src} alt="Live Feed" style={{ width: "100%", height: "auto" }} />
    </div>
  );
};



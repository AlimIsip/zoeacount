"use client";

import CaptureIcon from "@/components/icons/CaptureIcon";
import UploadIcon from "@/components/icons/UploadIcon";


export default function OptionsPage({setCaptureOption, setCurrentPage}) {
  return (
    <div className="flex flex-col">
      <h1 className="flex flex-grow text-3xl font-bold">Select capture method</h1>
      <div className="flex flex-wrap h-96">
        <div className="flex flex-grow m-3 bg-slate-500 border-3 items-center place-content-center">
          <div className="bg-blue-500 border-3 cursor-pointer" 
          onClick={() => {setCaptureOption("Capture"); setCurrentPage(2)}} >
            <CaptureIcon />
            <p>Capture Image</p>
          </div>
        </div>

        <div className="flex flex-grow m-3 bg-slate-500 border-3 items-center place-content-center">
          <div className="bg-blue-500 border-3 flex place-content-center cursor-pointer" 
          onClick={() => {setCaptureOption("Upload"); setCurrentPage(2)}}>
            <UploadIcon />
            <div className="flex">
            <p>Upload Image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

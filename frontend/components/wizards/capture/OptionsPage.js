"use client";

import CaptureIcon from "@/components/icons/CaptureIcon";
import UploadIcon from "@/components/icons/UploadIcon";

export default function OptionsPage({ setCaptureOption, setCurrentPage }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Capture Method</h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        {/* Capture Image Option */}
        <div
          className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md p-6 cursor-pointer transition-all w-full sm:w-1/2"
          onClick={() => {
            setCaptureOption("Capture");
            setCurrentPage(2);
          }}
        >
          <CaptureIcon className="w-12 h-12 mb-3" />
          <p className="text-lg font-semibold">Capture Image</p>
        </div>

        {/* Upload Image Option */}
        <div
          className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md p-6 cursor-pointer transition-all w-full sm:w-1/2"
          onClick={() => {
            setCaptureOption("Upload");
            setCurrentPage(2);
          }}
        >
          <UploadIcon className="w-12 h-12 mb-3" />
          <p className="text-lg font-semibold">Upload Image</p>
        </div>
      </div>
    </div>
  );
}

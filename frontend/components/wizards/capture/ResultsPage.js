"use client";

import CaptureIcon from "@/components/icons/CaptureIcon";
import UploadIcon from "@/components/icons/UploadIcon";

export default function () {
  return (
    <div className="flex flex-col">
    <h1 className="flex flex-grow text-3xl font-bold">New Count Entry</h1>
      <div className="flex flex-wrap">
        <div className="flex flex-grow  m-3 items-center place-content-center bg-slate-500">
          <div className="bg-blue-500">
            <CaptureIcon />
            <p>pokemon</p>
          </div>
        </div>
        <div className="p-10 m-3 bg-slate-500">

            <p className="text-xl font-thin">Captured: 9/12/2024</p>
            <h1 className="text-3xl font-bold ">Larvae Count:</h1>
            <p className="text-xl font-thin">361</p>
            <h1 className="text-3xl font-bold ">Mortality Rate:</h1>
            <p className="text-xl font-thin">361</p>
            <h1 className="text-3xl font-bold ">Cumulative Mortality:</h1>
            <p className="text-xl font-thin">361</p>
            <h1 className="text-3xl font-bold ">Phase:</h1>
            <p className="text-xl font-thin">1</p>
            <h1 className="text-3xl font-bold ">Age:</h1>
            <p className="text-xl font-thin">12</p>

            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Submit Results</button>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Recapture and Recount</button>
        </div>
      </div>
    </div>
  );
}

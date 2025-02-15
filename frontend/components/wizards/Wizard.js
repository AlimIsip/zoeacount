"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import OptionsPage from "@/components/wizards/capture/OptionsPage";
import UploadImagePage from "@/components/wizards/capture/UploadImagePage";
import CaptureImagePage from "@/components/wizards/capture/CaptureImagePage";
import ResultsPage from "@/components/wizards/capture/ResultsPage";

export default function Wizard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [captureOption, setCaptureOption] = useState();

  const next = () => setCurrentPage((prev) => prev + 1);
  const prev = () => setCurrentPage((prev) => prev - 1);

  return (
    <div className="p-10 flex flex-wrap flex-col">
    <div className="flex flex-col">
      {currentPage === 1 && <OptionsPage setCaptureOption={setCaptureOption} setCurrentPage={setCurrentPage}/>}
      {currentPage === 2 && captureOption === "Capture" && <CaptureImagePage setCurrentPage={setCurrentPage}/>}
      {currentPage === 2 && captureOption === "Upload" && <UploadImagePage/>}
      {currentPage === 3 && <ResultsPage/>}
    </div>
    <div className="flex flex-col">
      {currentPage != 1 && (
        <div className="flex flex-auto">
        <Button color="primary" onPress={prev}>Previous</Button>
      </div>
    )}
    </div>
    </div>
  );
}

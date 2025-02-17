"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import OptionsPage from "@/components/wizards/capture/OptionsPage";
import UploadImagePage from "@/components/wizards/capture/UploadImagePage";
import CaptureImagePage from "@/components/wizards/capture/CaptureImagePage";
import ResultsPage from "@/components/wizards/capture/ResultsPage";
import { handleUpload, handleInference } from "@/lib/dataimage";

export default function Wizard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [captureOption, setCaptureOption] = useState();

  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [countData, setCountData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [batchData, setBatchData] = useState();
  const [captureDate, setCaptureDate ] = useState();
  const [captureTime, setCaptureTime] = useState();

  const [error, setError] = useState();
  

  const onUploadClick = async (file) => {
    setError(null);

    if (!file) {
        console.error("No file selected for upload");
        return;
    }

    console.log("Uploading...");
    setUploading(true);
    
    const success = await handleUpload(file);
    console.log("Upload success:", success);
    
    setUploading(false);
    setUploaded(success);

    if (!success) {
        setError("Image upload failed.");
        return;
    }

    const inferenceResults = await handleInference(file.name);  // Pass file.name instead of fileName
    console.log("Inference results:", inferenceResults);

    if (!inferenceResults || inferenceResults.error) {
        setError(inferenceResults?.error || "Inference failed");
        return;
    }
    // imageUrl: imageData.imageUrl,
    //         batchData: imageData.latestBatch,
    //         captureDate: captureDate, 
    //         captureTime: captureTime,

    setCountData(inferenceResults.countData);
    setImageUrl(inferenceResults.imageUrl);
    setBatchData(inferenceResults.batchData);
    setCaptureDate(inferenceResults.captureDate);
    setCaptureTime(inferenceResults.captureTime);
};


  const next = () => setCurrentPage((prev) => prev + 1);
  const prev = () => setCurrentPage((prev) => prev - 1);

  return (
    <div className="p-10 flex flex-wrap flex-col">
    <div className="flex flex-col">
      {currentPage === 1 && <OptionsPage setCaptureOption={setCaptureOption} setCurrentPage={setCurrentPage}/>}
      {currentPage === 2 && captureOption === "Capture" && <CaptureImagePage setCurrentPage={setCurrentPage}/>}
      {currentPage === 2 && captureOption === "Upload" && <UploadImagePage  
      setCurrentPage={setCurrentPage} 
      setFileName={setFileName}
      onUploadClick={onUploadClick}
      fileName={fileName}
      uploaded={uploaded}
      uploading={uploading}
      countData={countData}
      imageUrl={imageUrl}
      error={error}
      />}
      {currentPage === 3 && <ResultsPage countData={countData} imageUrl={imageUrl} batchData={batchData} captureDate={captureDate} captureTime={captureTime} />}
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

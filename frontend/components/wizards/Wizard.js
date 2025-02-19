"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import OptionsPage from "@/components/wizards/capture/OptionsPage";
import UploadImagePage from "@/components/wizards/capture/UploadImagePage";
import CaptureImagePage from "@/components/wizards/capture/CaptureImagePage";
import ResultsPage from "@/components/wizards/capture/ResultsPage";
import { handleUpload, handleInference, fetchProcessedImage } from "@/lib/dataimage";

export default function Wizard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [captureOption, setCaptureOption] = useState();
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [countData, setCountData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [batchData, setBatchData] = useState();
  const [captureDate, setCaptureDate] = useState();
  const [captureTime, setCaptureTime] = useState();
  const [inferenceLogs, setInferenceLogs] = useState([]);
  const [error, setError] = useState();
  const [processingComplete, setProcessingComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onUploadClick = async (file) => {
    setError(null);
    if (!file) return;

    setUploading(true);
    const success = await handleUpload(file);
    setUploading(false);
    setUploaded(success);

    if (!success) {
      setError("Image upload failed.");
      return;
    }

    setLogs([]);
    setInferenceLogs([]);
    setProcessingComplete(false);
    setIsProcessing(true);

    const inferenceResult = await handleInference(file.name);
    setLogs(inferenceResult.logs);
    setInferenceLogs((prevLogs) => [...prevLogs, ...inferenceResult.logs]);
    setIsProcessing(false);

    if (inferenceResult.error) {
      setError(inferenceResult.error);
      return;
    }

    const processedData = await fetchProcessedImage(file.name);
    if (processedData.error) {
      setError(processedData.error);
    } else {
      setCountData(inferenceResult.countData);
      setImageUrl(processedData.imageUrl);
      setBatchData(processedData.batchData);
      setCaptureDate(processedData.captureDate);
      setCaptureTime(processedData.captureTime);
    }

    setProcessingComplete(true);
  };

  useEffect(() => {
    console.log("Updated logs:", logs);
  }, [logs]);

  const next = () => setCurrentPage((prev) => prev + 1);
  const prev = () => setCurrentPage((prev) => prev - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 lg:p-8">
      <div className="w-full max-w-10xl bg-white shadow-lg rounded-lg p-6 lg:p-8">
        {/* Page Content */}
        <div className="mb-6">
          {currentPage === 1 && <OptionsPage setCaptureOption={setCaptureOption} setCurrentPage={setCurrentPage} />}
          {currentPage === 2 && captureOption === "Capture" && <CaptureImagePage setCurrentPage={setCurrentPage} />}
          {currentPage === 2 && captureOption === "Upload" && (
            <UploadImagePage
              setCurrentPage={setCurrentPage}
              setFileName={setFileName}
              onUploadClick={onUploadClick}
              fileName={fileName}
              uploaded={uploaded}
              uploading={uploading}
              countData={countData}
              imageUrl={imageUrl}
              inferenceLogs={logs}
              error={error}
              processingComplete={processingComplete}
            />
          )}
          {currentPage === 3 && (
            <ResultsPage countData={countData} imageUrl={imageUrl} batchData={batchData} captureDate={captureDate} captureTime={captureTime} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentPage !== 1 && (
            <Button
              color="primary"
              onPress={prev}
              disabled={uploading || isProcessing}
              className="w-full sm:w-auto px-4 py-2"
            >
              Previous
            </Button>
          )}
          {currentPage !== 3 && (
            <Button
              color="primary"
              onPress={next}
              disabled={uploading || isProcessing}
              className="w-full sm:w-auto px-4 py-2"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import VideoStream from "@/components/videofeed";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { fetchCaptureImage } from "@/lib/dataimage";

export default function CaptureImagePage({
  setCurrentPage,
  setFileName,
  fileName,
  capturing,
  captured,
  countData,
  imageUrl,
  inferenceLogs = [],
  handleCapturedSubmit,
  error,
}) {
  const [preview, setPreview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [logs, setLogs] = useState([]);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [captureError, setCaptureError] = useState(null);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    setLogs(inferenceLogs);
  }, [inferenceLogs]);

  useEffect(() => {
    if (captured && logs.length > 0) {
      onOpen();
    }
  }, [captured, logs, onOpen]);


  useEffect(() => {
    if (countData && imageUrl) {
      setProcessingComplete(true);
      setTimeout(() => {
        setCurrentPage(3);
        onClose();
      }, 1000);
    }
  }, [countData, imageUrl, onClose, setCurrentPage]);

  const handleCapture = async () => {
    setCaptureError(null);
    try {
      const imageUrl = await fetchCaptureImage(); // Fetch image URL instead of Blob
      setPreview(imageUrl.imageUrl); // Use URL for preview
      setFileName(imageUrl.filename); // Keep filename for consistency

    } catch (err) {
      console.error("Error capturing image:", err);
      setCaptureError(err.message || "Failed to capture image. Please try again.");
    }
  };

  const handleRecapture = () => {
    setPreview(null);
    setCaptureError(null);
  };

  

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Capture Image</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* Display Preview, Loading, or Video Stream */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 shadow-inner aspect-[4/3]">
          {capturing ? (
            <p className="text-gray-500">Capturing...</p>
          ) : preview ? (
            <img src={preview} alt="Preview" className="object-contain rounded-md" />
          ) : (
            <VideoStream />
          )}
        </div>

        {/* Capture Controls */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg bg-gray-50 shadow">
          {captureError && <p className="text-red-500">{captureError}</p>}
          {preview ? (
            <>
              <Button onPress={handleRecapture} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Recapture Image
              </Button>
              <Button onPress={()=> {
                handleCapturedSubmit(fileName, preview, setModalError);
                onOpen();
                }} 
                className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Submit
              </Button>
            </>
          ) : (
            <Button
              onPress={handleCapture}
              disabled={capturing}
              className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {capturing ? "Capturing..." : "Capture Image"}
            </Button>
          )}
        </div>
      </div>

      {/* Modal for Processing */}
      <Modal key={logs.length} backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Processing Image...</ModalHeader>
              <ModalBody>
                {modalError ? (
                  <p className="text-red-500">{modalError}</p>
                ) : processingComplete ? (
                  <p className="text-green-600">Inference successful! Proceeding...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : (
                  <>
                    <p className="text-green-600 font-medium">Capture successful!</p>
                    <div className="bg-gray-900 text-white p-3 h-40 overflow-y-auto text-sm rounded-lg">
                      {logs.length > 0 ? logs.map((log, index) => <p key={index}>{log}</p>) : <p>Waiting for inference logs...</p>}
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

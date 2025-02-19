"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function UploadImagePage({
  setCurrentPage,
  setFileName,
  fileName,
  onUploadClick,
  uploading,
  uploaded,
  countData,
  imageUrl,
  inferenceLogs = [],
  error,
}) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [logs, setLogs] = useState([]);
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    setLogs(inferenceLogs);
  }, [inferenceLogs]);

  useEffect(() => {
    if (uploaded && logs.length > 0) {
      onOpen();
    }
  }, [uploaded, logs]);

  useEffect(() => {
    if (countData && imageUrl) {
      setProcessingComplete(true);
      setTimeout(() => {
        setCurrentPage(3);
        onClose();
      }, 1000);
    }
  }, [countData, imageUrl, onClose, setCurrentPage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Upload Image</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* Image Preview */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 shadow-inner aspect-[4/3]">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-72 object-contain rounded-md" />
          ) : (
            <p className="text-gray-500">No image selected</p>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg bg-gray-50 shadow">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white p-2 focus:outline-none"
          />

          {fileName && <p className="text-gray-700">{fileName}</p>}

          <Button
            onPress={() => {
              onUploadClick(image);
              onOpen();
            }}
            disabled={!image || uploading}
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>

      {/* Modal for Processing */}
      <Modal key={logs.length} backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Processing Image...</ModalHeader>
              <ModalBody>
                {uploading ? (
                  <p>Uploading...</p>
                ) : uploaded ? (
                  <>
                    <p className="text-green-600 font-medium">Upload successful!</p>
                    <div className="bg-gray-900 text-white p-3 h-40 overflow-y-auto text-sm rounded-lg">
                      {logs.length > 0 ? logs.map((log, index) => <p key={index}>{log}</p>) : <p>Waiting for inference logs...</p>}
                    </div>

                    {processingComplete ? (
                      <p className="text-green-600">Inference successful! Proceeding...</p>
                    ) : error ? (
                      <>
                        <p className="text-red-500">Error: {error}</p>
                        <Button color="danger" variant="light" onPress={onClose}>
                          Close
                        </Button>
                      </>
                    ) : (
                      <p>Waiting for inference results...</p>
                    )}
                  </>
                ) : (
                  <div>
                    <p className="text-red-500">Upload failed.</p>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

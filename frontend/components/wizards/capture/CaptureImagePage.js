import { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

// Utility function to compare arrays deeply
const arraysAreEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);

export default function CaptureImagePage({
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
  const videoConstraints = {
    width: 1920,
    height: 1080,
    facingMode: "user",
  };

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const { isOpen: isLogOpen, onOpen: onLogOpen, onClose: onLogClose } = useDisclosure();
  const [logs, setLogs] = useState([]);
  const [processingComplete, setProcessingComplete] = useState(false);

  // Capture Image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    setImgSrc(imageSrc);
    setLogs(["Image captured successfully."]);
    setProcessingComplete(false);
  }, []);

  // Update logs only when inferenceLogs change
  useEffect(() => {
    if (!arraysAreEqual(logs, inferenceLogs)) {
      setLogs(inferenceLogs);
    }
  }, [inferenceLogs]);

  

  // Handle image submission
  const handleSubmit = async () => {
    if (!imgSrc) return;

    setLogs(["Submitting image for inference..."]);
    setProcessingComplete(false);
    onLogOpen(); // Show modal only after submit

    try {
      await onUploadClick(imgSrc);
      setLogs((prevLogs) => [...prevLogs, "Image submitted successfully."]);
    } catch (e) {
      setLogs((prevLogs) => [...prevLogs, "Error submitting image."]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Capture Image</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* Webcam / Image Preview */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 shadow-inner aspect-[4/3]">
          {imgSrc ? (
            <img src={imgSrc} alt="Captured" className="max-h-72 object-contain rounded-md" />
          ) : (
            <Webcam
              className="rounded-lg shadow-lg"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              screenshotQuality={1}
            />
          )}
        </div>

        {/* Capture Controls */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
          {imgSrc ? (
            <>
              <Button
                onPress={handleSubmit}
                className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Submit
              </Button>
              <Button
                onPress={() => {
                  setImgSrc(null);
                  setLogs([]);
                  setProcessingComplete(false);
                }}
                className="px-5 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
              >
                Recapture
              </Button>
            </>
          ) : (
            <Button
              onPress={capture}
              className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Capture Photo
            </Button>
          )}
        </div>
      </div>

      {/* Inference Logs Modal (Only Opens After Submit) */}
      <Modal key={logs.length} backdrop={"blur"} isOpen={isLogOpen} onClose={onLogClose}>
        <ModalContent>
          {(onLogClose) => (
            <>
              <ModalHeader>Inference Logs</ModalHeader>
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
                        <Button color="danger" variant="light" onPress={onLogClose}>
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
                    <Button color="danger" variant="light" onPress={onLogClose}>
                      Close
                    </Button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onLogClose}>
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

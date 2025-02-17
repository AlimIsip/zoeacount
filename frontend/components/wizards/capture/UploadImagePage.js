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

  error
}) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };


  return (
    <div>
      <div className="grid grid-cols-2 h-64">
        <div className="flex bg-slate-500 border-3 items-center justify-center">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="max-h-80 object-cover"
            />
          )}
        </div>
        <div className="flex flex-col bg-slate-500 border-3 items-center justify-center gap-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {fileName && <p className="text-white">{fileName}</p>}
          <Button
            onPress={() => {
              onUploadClick(image);
              onOpen();
            }}
            disabled={!image || uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            "Upload Image"
          </Button>

          <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Modal Title
                  </ModalHeader>
                  <ModalBody>
                    {uploading ? (
                      <p> Uploading ...</p>
                    ) : uploaded ? (
                      <>
                        <p> Upload successful! </p>
                        {countData && imageUrl ? ( 
                          <>
                            <p> Inference successful! </p>
                            <Button
                              color="primary"
                              onPress={() => {
                                setCurrentPage(3);
                                onClose();
                              }}
                            >
                              Proceed
                            </Button>
                          </>
                        ) : (
                          <>
                            <p style={{ color: "red" }}>Error: {error}</p>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={onClose}
                            >
                              Close
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <div>
                        <p> Upload failed </p>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
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
      </div>
    </div>
  );
}

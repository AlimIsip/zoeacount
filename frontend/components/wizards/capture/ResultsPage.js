"use client";
import {
  Input,
  Form,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { postNewEntry } from "@/lib/datapostput";
import { getUser } from "@/lib/sessiondetails";
import { useRouter } from "next/navigation"; // Next.js 15 router for redirection

export default function ResultsPage({
  countData,
  imageUrl,
  batchData,
  captureDate,
  captureTime,
}) {
  const [value, setValue] = useState(""); // Age value
  const [expectedMegalopaDate, setExpectedMegalopaDate] = useState(""); // Expected Megalopa date
  const [captureDateValue, setCaptureDateValue] = useState(captureDate); // Capture date value
  const [captureTimeValue, setCaptureTimeValue] = useState(captureTime); // Capture time value
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const capturedBy = await getUser();
      formData.append("captured_by", capturedBy);

      // Fetch image blob
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      const blob = await response.blob();
      formData.append("img_blob", blob, "a.jpg");

      await postNewEntry(formData);
      setErrors({});
      setIsOpen(true); // Open success modal
    } catch (error) {
      console.error("Submission Error:", error);
      setErrors({ general: error.message });
    }
  };

  const calculateMegalopaDate = (age) => {
    if (!age || isNaN(age)) return;

    const captureDateObj = new Date(captureDateValue);
    if (age > 0) captureDateObj.setDate(captureDateObj.getDate() - age);

    const minMegalopaDate = new Date(captureDateObj);
    minMegalopaDate.setDate(minMegalopaDate.getDate() + 15);
    const maxMegalopaDate = new Date(captureDateObj);
    maxMegalopaDate.setDate(maxMegalopaDate.getDate() + 18);

    setExpectedMegalopaDate(
      `${minMegalopaDate.toLocaleDateString()} - ${maxMegalopaDate.toLocaleDateString()}`
    );
  };

  useEffect(() => {
    if (value !== "") calculateMegalopaDate(parseInt(value, 10));
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-2">
      <h1 className="text-3xl font-bold mb-6">New Count Entry</h1>

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {/* Processed Image */}
        <div className="flex justify-center col-span-2 p-4 bg-gray-800 rounded-lg">
          <img
            src={imageUrl}
            alt="Processed"
            className="object-contain w-full h-full rounded-lg shadow-lg"
          />
        </div>

        {/* Form Section */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <Form className="space-y-4" validationErrors={errors} onSubmit={onSubmit}>
            <Input
              name="datestamp"
              label="Capture Date"
              value={captureDateValue}
              onChange={(e) => setCaptureDateValue(e.target.value)}
              type="date"
              variant="flat"
            />

            <Input
              
              name="timestamp"
              label="Capture Time"
              value={captureTimeValue}
              onChange={(e) => setCaptureTimeValue(e.target.value)}
              type="time"
              variant="flat"
            />

            <Input
              isRequired
              name="count_data"
              label="Count Data"
              defaultValue={countData}
              placeholder="Total count"
              type="text"
              variant="flat"
            />

            <Input
              name="batch"
              label="Batch"
              defaultValue={batchData}
              placeholder="Batch ID"
              isReadOnly
              type="text"
              variant="flat"
            />

            <Input
              name="age"
              isRequired
              label="Age"
              placeholder="Larval age in days"
              type="text"
              variant="flat"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <Input
              isRequired
              name="megalopa_datestamp"
              label="Expected Megalopa Date"
              value={expectedMegalopaDate}
              placeholder="Auto-calculated Megalopa date"
              isReadOnly
              type="text"
              variant="flat"
            />

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-5 m-2 rounded-md"
              >
                Submit Results
              </Button>
              <Button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 m-2 rounded-md"
                onClick={() => router.push("/capture")} // Refresh and recapture
              >
                Recapture & Recount
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Submission Success Modal */}
      <Modal isOpen={isOpen} backdrop={"blur"} onClose={() => router.push("/")}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Submission Successful</ModalHeader>
              <ModalBody>
                <p>Your count entry has been successfully submitted!</p>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onPress={() => router.push("/")}>
                  Go to Home
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

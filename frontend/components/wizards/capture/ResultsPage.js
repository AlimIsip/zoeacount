"use client";
import {
  Input,
  Form,
  Select,
  SelectItem,
  Checkbox,
  Button,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { postNewEntry } from "@/lib/datapostput";
import { getUser} from "@/lib/sessiondetails"


export default function ResultsPage({
  countData,
  imageUrl,
  batchData,
  captureDate,
  captureTime,
  user,
  imgBlob
}) {
  const [value, setValue] = useState(""); // Age value
  const [expectedMegalopaDate, setExpectedMegalopaDate] = useState(""); // Expected Megalopa date
  const [captureDateValue, setCaptureDateValue] = useState(captureDate); // Capture date value
  const [captureTimeValue, setCaptureTimeValue] = useState(captureTime); // Capture time value
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});
 
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    try {
      // Append the 'captured_by' field asynchronously
      const capturedBy = await getUser();
      formData.append("captured_by", capturedBy);
  
      // Fetch the image as a blob and append it to formData
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      formData.append("img_blob", blob, "a.jpg"); // Append the image with filename
  
      // Send FormData to the API
      const result = await postNewEntry(formData);
      
      // Clear errors and update the state with the response
      setErrors({});
      setSubmitted(result);
  
      console.log("Successfully posted:", result);
    } catch (error) {
      console.error("Submission Error:", error);
      setErrors({ general: error.message });
    }
  };
  


  // Function to calculate the expected Megalopa date
  const calculateMegalopaDate = (age) => {
    if (age === "" || isNaN(age)) return; // Avoid processing if no age is provided or if it's invalid

    // Convert capture date to Date object
    const captureDateObj = new Date(captureDateValue);

    // If age is not zero, calculate the day 0 by subtracting the age in days
    if (age > 0) {
      captureDateObj.setDate(captureDateObj.getDate() - age);
    }

    // Calculate the expected Megalopa date by adding 15-18 days range
    const minMegalopaDate = new Date(captureDateObj);
    minMegalopaDate.setDate(minMegalopaDate.getDate() + 15);

    const maxMegalopaDate = new Date(captureDateObj);
    maxMegalopaDate.setDate(maxMegalopaDate.getDate() + 18);

    // Format the expected Megalopa date as a string (e.g., "MM/DD/YYYY")
    const minDateString = `${
      minMegalopaDate.getMonth() + 1
    }/${minMegalopaDate.getDate()}/${minMegalopaDate.getFullYear()}`;
    const maxDateString = `${
      maxMegalopaDate.getMonth() + 1
    }/${maxMegalopaDate.getDate()}/${maxMegalopaDate.getFullYear()}`;

    // Set the expected Megalopa date range
    setExpectedMegalopaDate(`${minDateString} - ${maxDateString}`);
  };

  // Run the calculation whenever the age value changes
  useEffect(() => {
    if (value !== "") {
      calculateMegalopaDate(parseInt(value, 10));
    }
  }, [value]);

  return (
    <div className="flex flex-col">
      <h1 className="flex flex-grow text-3xl font-bold">New Count Entry</h1>
      <div className="flex flex-wrap">
        <div className="flex flex-grow m-3 items-center place-content-center bg-slate-500">
          <div className="bg-blue-500">
            <img
              src={imageUrl}
              alt="Processed"
              className="max-w-5xl h-auto rounded-lg"
            />
          </div>
        </div>
        <div className="p-10 m-3 bg-slate-500">
          <Form
            className=""
            validationBehavior="native"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
          >
            {/* Capture Date Input */}
            <Input
              name={"datestamp"}
              className={"p-2 font-bold"}
              label="Capture Date"
              labelPlacement={"outside"}
              value={captureDateValue}
              onChange={(e) => setCaptureDateValue(e.target.value)} // Handle date change
              type="date"
              variant="faded"
            />

            {/* Capture Time Input */}
            <Input
              name={"timestamp"}
              className={"p-2 font-bold"}
              label="Capture Time"
              labelPlacement={"outside"}
              value={captureTimeValue}
              onChange={(e) => setCaptureTimeValue(e.target.value)} // Handle time change
              type="time"
              variant="faded"
            />

            {/* Count Data Input */}
            <Input
              isRequired
              name={"count_data"}
              className={"p-2 font-bold"}
              label="Count Data:"
              labelPlacement={"outside"}
              defaultValue={countData}
              placeholder="Insert your total count"
              type="text"
              variant="faded"
            />
            <Input
              name={"batch"}
              className={"p-2 font-bold"}
              isReadOnly
              label="Batch:"
              labelPlacement={"outside"}
              defaultValue={batchData}
              placeholder="Insert your batch data"
              type="text"
              variant="faded"
            />

            {/* Age Input */}
            <Input
            
              name={"age"}
              isRequired
              className={"p-2 font-bold"}
              label="Age:"
              labelPlacement={"outside"}
              placeholder="Insert your current larva day age since hatch"
              type="text"
              variant="faded"
              value={value}
              onChange={(e) => setValue(e.target.value)} // Handle age input change
            />

            {/* Expected Megalopa Date */}
            <Input
              isRequired
              name={"megalopa_datestamp"}
              isReadOnly
              className={"p-2 font-bold"}
              label="Expected Megalopa Date"
              labelPlacement={"outside"}
              value={expectedMegalopaDate}
              placeholder="Calculated expected Megalopa date"
              type="text"
              variant="faded"
            />

            <Button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Submit Results
            </Button>
            <Button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Recapture and Recount
            </Button>
 </Form>
        </div>
      </div>
    </div>
  );
}

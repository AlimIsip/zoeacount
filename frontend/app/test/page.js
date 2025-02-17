import ResultsPage from "@/components/wizards/capture/ResultsPage";

export default async function Test() {
  return (
    <div>
      <ResultsPage
        countData={13}
        imageUrl={"http://localhost:8000/results/a.jpg"}
        batchData={1}
        captureDate={"11-22-31"}
        captureTime={"11:12:12"}
      />
      
    </div>
  );
}

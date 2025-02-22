import Body from "../components/layout/Body";
import Card from "../components/containers/Card";
import { fetchDashboardData, fetchChartData } from "@/lib/data";
import { phaseTimelineChart, megalopaTimelineChart } from "@/components/containers/CardContent";

export default async function Home() {
  const dashboard_data = await fetchDashboardData();
  const chart_data = await fetchChartData();
  console.log(chart_data)
  function formatDate() {
    const date = new Date(dashboard_data.datestamp);
    // date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  }
  function formatDateRange(dateRange) {
    const [start, end] = dateRange.split(" - ").map((date) => new Date(date));

    return `${start.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    })} - ${end.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    })}`;
  }

  const dateRange = "3/6/2025 - 3/9/2025";
  console.log(formatDateRange(dateRange)); // Output: "6 Mar 25 - 9 Mar 25"

  function computeCurrentAge(datestamp, age) {
    const captureDate = new Date(datestamp);
    const hatchDate = new Date(captureDate);
    hatchDate.setDate(captureDate.getDate() - age); // hatch date = capture date - initial age

    const today = new Date();
    const timeDiff = today - hatchDate; // difference in milliseconds
    const currentAge = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // convert to days

    return currentAge;
  }

  function getCurrentPhase(currentAge) {
    const phaseDuration = 3; 
    const totalPhases = 5; 
    const phase = Math.min(Math.floor(currentAge / phaseDuration) + 1, totalPhases);
    return phase;
  }

  function getDaysUntilNextPhase(currentAge) {
    const phaseDuration = 3;
    const remainingDays = phaseDuration - (currentAge % phaseDuration);
  
    return remainingDays === phaseDuration ? 0 : remainingDays; 
  }

  const currAge = computeCurrentAge(dashboard_data.datestamp, dashboard_data.age)
  const currentPhase = getCurrentPhase(currAge)
  const daysLeftUntilNextPhase = getDaysUntilNextPhase(currAge)

  return (
    <div className="bg-sky-800 p-3 flex justify-center items-center">
      <Body>
        <div className="grid grid-cols-4 gap-2 px-8 py-4">
          <h1 className="text-4xl font-semibold col-span-4 text-darkblue">
            Dashboard
          </h1>

          {/* Latest Capture */}
          <div className="col-span-2">
            <Card
              imgSrc={dashboard_data.img_blob}
              description={"Latest capture"}
            />
            <div className="flex">
              <div className="flex-col flex-grow">
                <Card description={"Current Phase Timeline"}>
                  {phaseTimelineChart(5, currentPhase)}
                </Card>
              </div>
              <div className="flex-col flex-grow">
                <Card description={"Days until next phase"}>
                  {phaseTimelineChart(3,daysLeftUntilNextPhase)}
                </Card>
              </div>
            </div>
            <Card description={"Days until megalopa phase"}>
              {megalopaTimelineChart(computeCurrentAge(dashboard_data.datestamp, dashboard_data.age))}
            </Card>
          </div>

          {/* Batch, Day, Count Data, Latest Count Date, Expected Megalopa Date */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card
                title={`Batch ${dashboard_data.batch}`}
                className="text-lg font-medium"
              />
              <Card
                title={`Day ${computeCurrentAge(
                  dashboard_data.datestamp,
                  dashboard_data.age
                )}`}
                className="text-lg font-medium"
              />
            </div>
            <div className="flex">
              <div className="flex-col flex-grow">
                <Card
                  title={dashboard_data.count_data}
                  description={"Latest Count"}
                />
              </div>
              <div className="flex-col flex-grow">
                <Card
                  title={formatDate(dashboard_data.datestamp)}
                  description={"Latest Count Date"}
                />
              </div>
              <div className="flex-col flex-grow">
                <Card
                  title={formatDateRange(dashboard_data.megalopa_datestamp)}
                  description={"Expected Megalopa Date"}
                />
              </div>
            </div>

            <Card
              chartData={chart_data}
              dataColumn={"count data"}
              description={"Count Data"}
            />
          </div>

          {/* Phase Timeline */}
          <div className="col-span-4 space-y-4"></div>
        </div>
      </Body>
    </div>
  );
}

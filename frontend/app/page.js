import Body from "../components/layout/Body";
import Card from "../components/containers/Card";
import { fetchDashboardData, fetchChartData } from "@/lib/data";
import { phaseTimelineChart } from "@/components/containers/CardContent";

export default async function Home() {
  const dashboard_data = await fetchDashboardData();
  const chart_data = await fetchChartData();
  console.log("charttttt", chart_data);
  function nextPhaseDays() {
    return dashboard_data.phase * 4 - dashboard_data.age;
  }

  function nextPhaseDate() {
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    const entry_date = new Date(dashboard_data.timestamp);
    const next_phase_date = entry_date.addDays(nextPhaseDays());
    const options = { month: "short", day: "numeric" };
    return next_phase_date.toLocaleDateString("en-GB", options);
  }

  function nextMegalopaDays() {
    return 20 - dashboard_data.age;
  }

  function nextMegalopaDate() {
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    const entry_date = new Date(dashboard_data.timestamp);
    const next_phase_date = entry_date.addDays(nextMegalopaDays());
    const options = { month: "short", day: "numeric" };
    return next_phase_date.toLocaleDateString("en-GB", options);
  }

  return (
    <div>
      <Body>
        <div className="grid grid-cols-5 grid-flow gap-2 px-14 py-3">
          <div className="col-span-5 flex">
            <h1 className="text-4xl flex-auto">Dashboard</h1>
          </div>
          <div className="col-span-3 row-span-2">
            <Card
              imgSrc={dashboard_data.img_blob}
              description={"Latest capture"}
            />
          </div>
          
          <div className="flex flex-col grow">
          <Card
              title={"Batch 3"}
            />
          </div>
          <div className="flex flex-col grow">
             <Card
              title={"Day 3"}
            />
          </div>

          <div className="flex flex-col col-span-2 grow ">
                      <Card
              title={dashboard_data.count_data}
              description={"Latest Count"}
            />
             <Card
              chartData={chart_data}
              dataColumn={"count data"}
              description={"Count Data"}
            />
            <Card
              title={"January 1, 2025"}
              description={"Latest Count Date"}
            />
             
            
          </div>
  
          <div className="col-span-3">
            <Card description={"Current Phase Timeline"}>
              {phaseTimelineChart(5, 3)}
            </Card>
            <Card description={"Days passed before the next phase"}>
              {phaseTimelineChart(4, 3)}
            </Card>
            <Card description={"Days passed before megalopa phase"}>
              {phaseTimelineChart(20, 3)}
            </Card>
          </div>
          <div className="col-span-2">
            <Card title={"February 1, 2024"} description={"Expected Megalopa Date"}/>
          </div>
          
        </div>
      </Body>
    </div>
  );
}

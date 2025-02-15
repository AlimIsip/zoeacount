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
            <div className="flex-none flex-col">
              <h1 className="text-3xl flex-auto text-right">Day 3</h1>
              <h1 className="text-2xl flex-auto text-right">Batch 1</h1>
            </div>
          </div>
          <div className="flex flex-col grow">
            <Card
              title={dashboard_data.count_data}
              description={"Latest Count"}
            />
          </div>
          <div className="col-span-2">
            <Card
              chartData={chart_data}
              dataColumn={"count data"}
              description={"Count Data"}
            />
          </div>
          <div className="col-span-2">
            <Card
              imgSrc={dashboard_data.img_blob}
              description={"Latest capture"}
            />
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col grow">
              <Card
                title={dashboard_data.mortality_rate}
                description={"Mortality Rate"}
              />
              <Card
                title={dashboard_data.mortality_rate}
                description={"Cumulative Mortality Rate"}
              />
            </div>
          </div>
          <div className="col-span-2">
            <Card
              chartData={chart_data}
              dataColumn={"mortality rate"}
              description={"Mortality Rate"}
            />
          </div>
          <div className="col-span-2">
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
        </div>
      </Body>
    </div>
  );
}

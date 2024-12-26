import Header from "./components/Header";
import Body from "./components/Body";
import CardNumber from "./components/CardNumber";
import CardChart from "./components/CardChart";
import CardAgeTimeline from "./components/CardAgeTimeline";
import Capture from "./components/CaptureButton";
import TimelineButton from "./components/TimelineButton";
import {useEffect, useState} from "react";

export default function Home() {

  const [data, setData] = useState([])
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/table/dashboard')
        .then((res) => res.json())
        .then((data) => {
          setData(data)
        })
  }, [])


  const [chart_data, setChart_data] = useState([])
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/charts/')
        .then((res) => res.json())
        .then((chart_data) => {
          setChart_data(chart_data)
        })
  }, [])

  function nextPhaseDays(){
    return (data.phase * 4) - data.age;
  }

  function nextPhaseDate(){
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    const entry_date = new Date(data.timestamp);
    const next_phase_date = entry_date.addDays(nextPhaseDays());
    const options = {month: 'short', day:'numeric'}
    return next_phase_date.toLocaleDateString('en-GB', options);
  }

  function nextMegalopaDays(){
    return 20 - data.age;
  }

  function nextMegalopaDate(){
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    const entry_date = new Date(data.timestamp);
    const next_phase_date = entry_date.addDays(nextMegalopaDays());
    const options = {month: 'short', day:'numeric'}
    return next_phase_date.toLocaleDateString('en-GB', options);
  }



  return (
      <div>
        <Header/>
        <Body>
          <div className="flex flex-row">
            <div className="flex flex-col w-1/3">
              <h3 className="text-5xl">Batch 1</h3>
              <h1 className="text-3xl">Day 3  </h1>
            </div>
            <div className="flex flex-col w-2/3">
              <div className="flex flex-row">
                <Capture/>
                <TimelineButton/>
              </div>
            </div>
          </div>
          <div className="flex flex-row ">
            <div className="flex flex-col w-1/3">
              <CardNumber number={data.count_data} title={"Latest Count"}/>
              <CardNumber number={data.mortality_rate} title={"Mortality Rate"}/>
            </div>

            <div className="flex flex-col w-1/3">
              <CardChart chart_data={chart_data} label={"Count Data"} data_column={"count data"}/>
            </div>

            <div className="flex flex-col w-1/3">
              <CardChart chart_data={chart_data} label={"Mortality Rate"} data_column={"mortality rate"}/>
            </div>

          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-1/3">
              <CardNumber src={data.img_blob}/>
            </div>

            <div className="flex flex-col w-1/3">
              <CardAgeTimeline phase={data.phase}/>
            </div>

            <div className="flex flex-col w-1/3">
              <h3 className=""> Next Phase is Zoea {data.phase + 1} </h3>
              <div className="flex flex-row">
                <CardNumber number={nextPhaseDays()} title={"days until Next Phase"}/>
                <CardNumber number={nextPhaseDate()} title={"Next Phase date"}/>
              </div>

              <div className="flex flex-row">
                <CardNumber number={nextMegalopaDays()} title={"days until Megalopa"}/>
                <CardNumber number={nextMegalopaDate()} title={"Megalopa date"}/>
              </div>
            </div>

          </div>
        </Body>
      </div>
  )
}


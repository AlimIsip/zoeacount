import Header from "./components/Header";
import Body from "./components/Body";
import CardNumber from "./components/CardNumber";
import CardChart from "./components/CardChart";
import Capture from "./components/CaptureButton";
import TimelineButton from "./components/TimelineButton";
import {useEffect, useState} from "react";





export default function About() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/table/dashboard')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }, [])
    console.log(data)


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
                        <CardChart/>
                    </div>

                    <div className="flex flex-col w-1/3">
                        <CardChart/>
                    </div>

                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col w-1/3">
                        <CardNumber src={data.img_blob}/>
                    </div>

                    <div className="flex flex-col w-1/3">
                        <CardNumber title={"Current Age"}/>
                    </div>

                    <div className="flex flex-col w-1/3">
                        <div className="flex flex-row">
                            <CardNumber number={"5"} title={"days"}/>
                            <CardNumber number={"9/12"} title={""}/>
                        </div>

                        <div className="flex flex-row">
                            <CardNumber number={"5"} title={"days"}/>
                            <CardNumber number={"9/21"}/>
                        </div>
                    </div>

                </div>
            </Body>
        </div>
    )
}
import Header from "./components/Header";
import Body from "./components/Body";
import CardNumber from "./components/CardNumber";
import CardChart from "./components/CardChart";
import Capture from "./components/Capture";
import Timeline from "./components/Timeline";



export default function About() {
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
                            <Timeline/>

                        </div>
                    </div>
                </div>
                <div className="flex flex-row ">
                    <div className="flex flex-col w-1/3">
                        <CardNumber number={"574"} title={"Latest Count"}/>
                        <CardNumber number={"12.09%"} title={"Mortality Rate"}/>
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
                        <CardNumber/>
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
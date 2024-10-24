import {LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from 'recharts';

export default function CardChart(props) {

    return (<div
        className="block
           m-3
           flex-wrap
           flex-inital
           p-5
           bg-white
           border
           border-gray-200
           rounded-lg shadow
           hover:bg-gray-100
           dark:bg-gray-800
           dark:border-gray-700
           dark:hover:bg-gray-700">

            <ChartLine />
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
          aaa
        </p>
    </div>

    )
}

export function ChartLine(){
    const data = [
        {name: 'Page A', uv: 400, pv: 2400, amt: 2400},
        {name: 'Page B', uv: 500, pv: 2400, amt: 2400},
        {name: 'Page C', uv: 100, pv: 2400, amt: 2400},
        {name: 'Page D', uv: 200, pv: 2400, amt: 2400},
        {name: 'Page E', uv: 300, pv: 2400, amt: 2400},
        {name: 'Page F', uv: 200, pv: 2400, amt: 2400}];

    const renderLineChart = (
        <ResponsiveContainer aspect={1.75}  minHeight={"30%"}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
            </LineChart>
        </ResponsiveContainer>

    );
    return(renderLineChart)

}
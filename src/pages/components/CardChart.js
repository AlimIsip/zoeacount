import {LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend} from 'recharts';

export function ChartLine({chart_data, data_column}){

    let data;
    data = [];

    if (data_column === "count data"){
        chart_data.map((item)=>(
                data.push(
                    {   name: item.age,
                        uv: item.count_data,
                        amt: 2000
                    }
                )
            )
        )
    }
    else if (data_column === "mortality rate"){
        chart_data.map((item)=>(
                data.push(
                    {   name: item.age,
                        uv: item.mortality_rate,
                        amt: 2000
                    }
                )
            )
        )
    }





    console.log("chart data is now:" , data)




    const renderLineChart = (
        <ResponsiveContainer aspect={1.75}  minHeight={"30%"}>
            <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
        </ResponsiveContainer>

    );
    return(renderLineChart)

}


export default function CardChart({chart_data, label, data_column}) {
    console.log("chart data in card chart is:", chart_data);

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

        <ChartLine chart_data={chart_data} data_column={data_column}/>
        <p className="font-normal text-center text-gray-700 dark:text-gray-400">
            {label}
        </p>
    </div>

    )
}


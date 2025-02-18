"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function Card({
  title,
  description,
  imgSrc,
  chartData,
  dataColumn,
  children,
}) {
  return (
    <div
      className="block
        flex-grow
        px-2
        py-3
        m-2
        rounded-lg 
        shadow-sm
        bg-slate-300
        "
    >
      {children}
      {/* Image */}
      {imgSrc && <img src={imgSrc} />}
      {/* Description */}
      {chartData && dataColumn && (
        <ChartLine chartData={chartData} dataColumn={dataColumn} />
      )}

      {/* Title */}
      {title && (
        <h5
          className=" 
            text-5xl 
            text-center 
            font-bold 
            tracking-tight
            text-gray-900
           "
        >
          {title}
        </h5>
      )}

      {/* Description */}
      {description && (
        <p
          className="font-normal 
            text-center 
            text-gray-900 
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function ChartLine({ chartData, dataColumn }) {
  let data;
  data = [];

  if (dataColumn === "count data") {
    chartData.map((item) =>
      data.push({ name: item.age, uv: item.count_data, amt: 2000 })
    );
  } else if (dataColumn === "mortality rate") {
    chartData.map((item) =>
      data.push({ name: item.age, uv: item.mortality_rate, amt: 2000 })
    );
  }

  const renderLineChart = (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} width={40} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
  return renderLineChart;
}

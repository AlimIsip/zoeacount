"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
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
    <div className="flex flex-col items-center bg-sky-950 text-amber-400 rounded-lg shadow-md p-3 m-2 transition-shadow hover:shadow-xl border border-sky-900">
      {children}

      {/* Image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Card Image"
          className="w-full h-auto rounded-md mb-4 border border-amber-400"
        />
      )}

      {/* Chart */}
      {chartData && dataColumn && (
        <div className="w-full bg-sky-900 rounded-md p-2">
          <ChartLine chartData={chartData} dataColumn={dataColumn} />
        </div>
      )}

      {/* Title */}
      {title && (
        <h5 className="text-3xl font-semibold text-amber-400 text-center mt-2">
          {title}
        </h5>
      )}

      {/* Description */}
      {description && (
        <p className="text-amber-300 text-center mt-2">{description}</p>
      )}
    </div>
  );
}

export function ChartLine({ chartData, dataColumn }) {
  const data = chartData.map((item) => ({
    name: item.age,
    uv: dataColumn === "count data" ? item.count_data : item.mortality_rate,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <Line type="monotone" dataKey="uv" stroke="#fbbf24" strokeWidth={2} />
        <CartesianGrid stroke="#64748b" strokeDasharray="4 4" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#fbbf24" }} />
        <YAxis tick={{ fontSize: 12, fill: "#fbbf24" }} width={50} />
        <Tooltip contentStyle={{ backgroundColor: "#1e3a8a", color: "#fbbf24" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

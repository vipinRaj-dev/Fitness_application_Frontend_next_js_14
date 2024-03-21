"use client";

import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface LineChartData {
  month: string;
  usercount: number;
}

const LIneChartPlot = (userData: { data: LineChartData[] }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={userData.data}
          margin={{
            top: 5,
            right: 3,
            left: 2,
            bottom: 1,
          }}
        >
          <XAxis dataKey="month" tick={{ fill: "#CACFD2" }} />
          <YAxis tick={{ fill: "#CACFD2" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "#C0C2C9",
              color: "#333",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="usercount"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LIneChartPlot;

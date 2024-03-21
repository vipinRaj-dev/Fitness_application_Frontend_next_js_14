import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type BarChartData = {
  name?: string;
  clientCount?: number;
  NoOfDays?: number;
  day?: string;
};
const BarChartPlot = (barData: { data: BarChartData[] }) => {
  const dataKey = barData.data[0]?.name ? "name" : "day";
  const dataValue = barData.data[0]?.clientCount ? "clientCount" : "NoOfDays";
  return (
    <>
      <ResponsiveContainer
        style={
          dataKey === "day"
            ? {
                backgroundColor: "#34495E",
                borderRadius: "15px",
                padding: "15px",
              }
            : {}
        }
        width="100%"
        height="100%"
      >
        <BarChart width={730} height={250} data={barData.data}>
          <XAxis dataKey={dataKey} tick={{ fill: "#CACFD2" }} />
          <YAxis
            tick={{ fill: "#CACFD2" }}
            domain={[0, 'dataMax']}
            interval={1}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "#C0C2C9",
              color: "#333",
            }}
          />
          <Legend />

          <Bar
            dataKey={dataValue}
            fill="#2980B9"
            barSize={30}
            minPointSize={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default BarChartPlot;

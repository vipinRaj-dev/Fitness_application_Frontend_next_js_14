import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type BarChartDataUser = {
  name?: string;
  FoodCount?: number;
  ConsumedFood?: number;
};
const BarChartUser = (barData: { data: BarChartDataUser[] }) => {
  return (
    <>
      <ResponsiveContainer
        style={{
          backgroundColor: "#34495E",
          borderRadius: "15px",
          padding: "15px",
        }}
        width="100%"
        height="100%"
      >
        <BarChart width={730} height={250} data={barData.data}>
          <XAxis dataKey="name" tick={{ fill: "#CACFD2" }} />
          <YAxis tick={{ fill: "#CACFD2" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="FoodCount" fill="#3498DB" barSize={30} minPointSize={1} />
          <Bar dataKey="ConsumedFood" fill="#AED6F1" barSize={30} minPointSize={3} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default BarChartUser;

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export interface pieChartData {
  type: string;
  count: number;
}
const PieChartPlot = (pieData: { data: pieChartData[] }) => {
  const colors = [
    "#8884d8",
    "#FA8072",
    "#AF69EE",
    "#3DED97",
    "#3AC7EB",
    "#F9A603",
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={730} height={250}>
          <Pie
            data={pieData.data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            fill="#8884d8"
            label
            labelLine={false}
          >
            {pieData.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "#C0C2C9",
              color: "#333",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default PieChartPlot;

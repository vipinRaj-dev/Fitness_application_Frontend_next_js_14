import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface AreaChartData {
  month: string;
  totalAmount: number;
}
const AreaChartPlot = (paymentData: { data: AreaChartData[] }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={730}
          height={250}
          data={paymentData.data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fill: "#CACFD2" }} />
          <YAxis tick={{ fill: "#CACFD2" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "#C0C2C9",
              color: "#333",
            }}
          />
          <Area
            type="monotone"
            dataKey="totalAmount"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          {/* <Area type="monotone" dataKey="Samsung" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" /> */}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default AreaChartPlot;

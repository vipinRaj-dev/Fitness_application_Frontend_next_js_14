import { RadarChart, Radar, PolarAngleAxis, PolarGrid, Legend, Tooltip, ResponsiveContainer } from "recharts";


const RadarChartPlot = () => {
    const data = [
        {
          "day": "Monday",
          "NoOfDays": 4
        },
        {
          "day": "Tuesday",
          "NoOfDays": 3
        },
        {
          "day": "Wednesday",
          "NoOfDays": 2
        },
        {
          "day": "Thursday",
          "NoOfDays": 2
        },
        {
          "day": "Friday",
          "NoOfDays": 1
        },
        {
          "day": "Saturday",
          "NoOfDays": 3
        }
      ];
  return (
    <>
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="day" />
        <Radar name="Orders" dataKey="NoOfDays" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
        <Tooltip/>
      </RadarChart>
    </ResponsiveContainer>
  </>
  )
}

export default RadarChartPlot
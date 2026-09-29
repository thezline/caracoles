import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SNAIL_WINS } from "../config/constants";

export const SnailWinsChart = () => (
  <div className="bar-chart">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={SNAIL_WINS}
        margin={{ top: 8, right: 4, left: -28, bottom: 0 }}
      >
        <CartesianGrid stroke="#ebe8e0" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#777b72", fontSize: 12 }}
        />
        <YAxis
          domain={[0, 3]}
          ticks={[0, 1, 2, 3]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9a9d95", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ fill: "#f2f0ea" }}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e1ddd3",
            boxShadow: "0 8px 20px rgba(30, 35, 30, .08)",
          }}
        />
        <Bar
          dataKey="wins"
          name="Victorias"
          fill="#bf6b3f"
          radius={[5, 5, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

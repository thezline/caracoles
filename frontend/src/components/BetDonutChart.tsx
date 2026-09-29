import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { BET_RESULTS } from "../config/constants";

const colors = ["#315c47", "#d5d0c5"];

export const BetDonutChart = () => {
  const total = BET_RESULTS.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="donut-layout">
      <div className="donut-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={BET_RESULTS}
              dataKey="value"
              innerRadius="69%"
              outerRadius="96%"
              paddingAngle={3}
              stroke="none"
            >
              {BET_RESULTS.map((item, index) => (
                <Cell key={item.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e1ddd3",
                boxShadow: "0 8px 20px rgba(30, 35, 30, .08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-chart__label">
          <strong>{total}</strong>
          <span>Apuestas</span>
        </div>
      </div>
      <div className="chart-legend">
        {BET_RESULTS.map((item, index) => (
          <div className="chart-legend__item" key={item.name}>
            <span
              className="chart-legend__dot"
              style={{ backgroundColor: colors[index] }}
            />
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

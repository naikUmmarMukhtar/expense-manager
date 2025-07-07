import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineChartCard = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Income" stroke="#4CAF50" />
        <Line type="monotone" dataKey="Expense" stroke="#F44336" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartCard;

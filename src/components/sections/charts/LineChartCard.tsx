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
import dayjs from "dayjs";
import type { IncomeExpenseType } from "../../../types";

type Props = {
  data: IncomeExpenseType[];
};

const LineChartCard = ({ data }: Props) => {
  // Group data by date
  const grouped = data.reduce<
    Record<string, { date: string; income: number; expense: number }>
  >((acc, t) => {
    const date = dayjs(Number(t.date)).format("DD-MMM");

    if (!acc[date]) {
      acc[date] = { date, income: 0, expense: 0 };
    }

    if (t.selectedCategory?.type === "incomes") {
      acc[date].income += Number(t.amount);
    } else if (t.selectedCategory?.type === "expenses") {
      acc[date].expense += Number(t.amount);
    }

    return acc;
  }, {});

  const chartData = Object.values(grouped).sort(
    (a, b) =>
      dayjs(a.date, "DD-MMM").valueOf() - dayjs(b.date, "DD-MMM").valueOf()
  );

  return (
    <div className="mt-8 w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#82ca9d"
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#8884d8"
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;

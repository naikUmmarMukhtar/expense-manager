import { NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  ChartNoAxesGanttIcon,
  Home,
  LayoutGrid,
  List,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getLinkClasses } from "../../utils/getLinkClasses";

const Sidebar = () => {
  return (
    <aside className="w-60 min-h-screen bg-gray-50 border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Expense Manager
        </h1>
        <p className="text-sm text-gray-500">Track your finances</p>
      </div>
      <nav className="space-y-1 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) => getLinkClasses({ isActive })}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* <NavLink
          to="/incomes"
          className={({ isActive }) => getLinkClasses({ isActive })}
        >
          <TrendingUp size={18} />
          <span>Income List</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) => getLinkClasses({ isActive })}
        >
          <TrendingDown size={18} />
          <span>Expense List</span>
        </NavLink> */}

        <NavLink
          to="/transactions"
          className={({ isActive }) => getLinkClasses({ isActive })}
        >
          <ArrowLeftRight size={18} />
          <span>Transactions</span>
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) => getLinkClasses({ isActive })}
        >
          <LayoutGrid size={18} />
          <span>Categories</span>
        </NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
